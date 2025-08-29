import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/src/lib/supabase-admin"
import { sendRsvpGuestEmail, notifyRsvpAdmin } from "@/src/lib/email"

export async function POST(req: Request) {
  try {
    const { first_name, last_name, email, guests_count } = await req.json()

    if (!first_name || !last_name || !email) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 })
    }

    // normalize email to lowercase
    const normEmail = String(email).trim().toLowerCase();
    const total = guests_count ?? 1

    // 1) Check if this email already confirmed
    const { data: existing, error: findErr } = await supabaseAdmin
      .from("rsvps")
      .select("*")
      .eq("email", normEmail)
      .maybeSingle()

    if (findErr) {
      return NextResponse.json({ error: findErr.message }, { status: 500 })
    }

    if (existing) {
      // Already confirmed -> do NOT send emails again
      return NextResponse.json({
        ok: true,
        alreadyConfirmed: true,
        rsvp: existing,
        message: `Este e-mail já tem presença confirmada em nome de ${existing.first_name} ${existing.last_name}, com ${existing.guests_count} convidado(s).`,
      })
    }

    // 2) Insert new RSVP (email is unique now)
    const { data, error } = await supabaseAdmin
      .from("rsvps")
      .insert({
        first_name,
        last_name,
        email: normEmail,
        attending: true,
        name: `${first_name} ${last_name}`.trim(), // legacy field support
        guests_count: total,
      })
      .select("*")
      .single()

    if (error) {
      // if a race happened and unique index fired, treat as alreadyConfirmed
      if (error.code === "23505") {
        const { data: justCreated } = await supabaseAdmin
          .from("rsvps")
          .select("*")
          .eq("email", normEmail)
          .maybeSingle()

        return NextResponse.json({
          ok: true,
          alreadyConfirmed: true,
          rsvp: justCreated ?? null,
          message: "Este e-mail já confirmou presença.",
        })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 3) Send emails (best-effort; don't fail the request if mailing fails)
    try {
      await Promise.all([
        sendRsvpGuestEmail(normEmail, first_name, last_name, total),
        //notifyRsvpAdmin(first_name, last_name, normEmail, total),
      ])
    } catch (e) {
      console.warn("RSVP email failure:", e)
    }

    revalidatePath("/admin")
    return NextResponse.json({ ok: true, rsvp: data })
  } catch (e: any) {
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 })
  }
}
