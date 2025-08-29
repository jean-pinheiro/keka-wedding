import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const { id, name, guests_count, attending } = await req.json();
    if (!id) return NextResponse.json({ error: "ID ausente" }, { status: 400 });

    const patch: Record<string, any> = {};
    if (typeof name === "string") patch.name = name.trim();
    if (typeof guests_count === "number") patch.guests_count = guests_count;
    if (typeof attending === "boolean") patch.attending = attending;

    const { data, error } = await supabaseAdmin
      .from("rsvps")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    revalidatePath("/");
    revalidatePath("/admin");
    return NextResponse.json({ ok: true, rsvp: data });
  } catch {
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}
