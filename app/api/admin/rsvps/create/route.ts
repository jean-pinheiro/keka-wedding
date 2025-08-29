import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const { name, guests_count } = await req.json();
    if (!name || !guests_count) {
      return NextResponse.json({ error: "Nome e quantidade são obrigatórios" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("rsvps")
      .insert({ name: String(name).trim(), guests_count: Number(guests_count), attending: false })
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    revalidatePath("/");
    revalidatePath("/admin");
    return NextResponse.json({ ok: true, rsvp: data });
  } catch (e: any) {
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}
