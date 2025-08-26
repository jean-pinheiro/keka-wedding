import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export async function POST(req: Request) {
  const isAdmin = cookies().get("admin")?.value === "1";
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await req.json();
  const row = {
    singleton: true,
    cover_title: payload.cover_title ?? null,
    cover_subtitle: payload.cover_subtitle ?? null,
    location_address: payload.location_address ?? null,
    maps_embed_url: payload.maps_embed_url ?? null,
    pix_qr_url: payload.pix_qr_url ?? null,
    pix_link_url: payload.pix_link_url ?? null,
    pix_instructions: payload.pix_instructions ?? null,
    amazon_list_url: payload.amazon_list_url ?? null, // 👈 new
  };

  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .upsert(row, { onConflict: "singleton" })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidatePath("/");
  revalidatePath("/admin");
  return NextResponse.json({ ok: true, settings: data });
}
