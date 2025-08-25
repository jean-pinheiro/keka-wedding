import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export async function POST(req: Request) {
  const isAdmin = cookies().get("admin")?.value === "1";
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await req.json();
  const { id, image_url, caption, sort_order = 0 } = payload;

  if (!image_url) {
    return NextResponse.json({ error: "image_url required" }, { status: 400 });
  }

  const op = id
    ? supabaseAdmin
        .from("photos")
        .update({ image_url, caption, sort_order })
        .eq("id", id)
        .select("*")
        .single()
    : supabaseAdmin
        .from("photos")
        .insert({ image_url, caption, sort_order })
        .select("*")
        .single();

  const { data, error } = await op;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // make home carousel refresh
  revalidatePath("/");
  return NextResponse.json({ ok: true, photo: data });
}
