import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/src/lib/supabase-admin";
import { notifyRsvpAdmin } from "@/src/lib/email";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID ausente" }, { status: 400 });
    }

    // Confirm only if not already confirmed
    const { data: row, error: findErr } = await supabaseAdmin
      .from("rsvps")
      .select("id,name,attending,email,guests_count")
      .eq("id", id)
      .maybeSingle();

    if (findErr) {
      return NextResponse.json({ error: findErr.message }, { status: 500 });
    }
    if (!row) {
      return NextResponse.json({ error: "Convidado não encontrado" }, { status: 404 });
    }
    if (row.attending) {
      return NextResponse.json({ ok: true, alreadyConfirmed: true });
    }

    const { error: updErr } = await supabaseAdmin
      .from("rsvps")
      .update({ attending: true })
      .eq("id", id);

    if (updErr) {
      return NextResponse.json({ error: updErr.message }, { status: 500 });
    }
        // 3) Send email (best-effort; don't fail the request if mailing fails)
        try {
          await Promise.all([
            notifyRsvpAdmin(row.name, row.guests_count),
          ])
        } catch (e) {
          console.warn("RSVP email failure:", e)
        }

    // keep your admin page fresh
    revalidatePath("/admin");
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}
