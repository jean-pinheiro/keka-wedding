import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/src/lib/supabase-admin"
import { sendRsvpGuestEmail, notifyRsvpAdmin } from "@/src/lib/email"

export async function POST(req: Request) {
  try {
    const { first_name, last_name, email } = await req.json()

    if (!first_name || !last_name || !email) {
      return NextResponse.json({ error: "Campos obrigatórios ausentes" }, { status: 400 })
    }

    // Save in DB
    const { data, error } = await supabaseAdmin
      .from("rsvps")
      .insert({
        first_name,
        last_name,
        email,
        attending: true,
        // keep legacy name populated for old UI if present
        name: `${first_name} ${last_name}`.trim(),
      })
      .select("*")
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Emails (best-effort; do not fail the request if email fails)
    try {
      await Promise.all([
        sendRsvpGuestEmail(email, first_name, last_name),
        notifyRsvpAdmin(first_name, last_name, email),
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