import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/src/lib/supabase-server"
import { notifyOwner } from "@/src/lib/email"

interface RSVPRequest {
  name: string
  email?: string
  attending: boolean
  message?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: RSVPRequest = await request.json()
    const { name, email, attending, message } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const supabase = getSupabaseClient()

    // Insert RSVP
    const { data: rsvp, error: insertError } = await supabase
      .from("rsvps")
      .insert({
        name: name.trim(),
        email: email?.trim() || null,
        attending,
        message: message?.trim() || null,
      })
      .select("*")
      .single()

    if (insertError) {
      console.error("Error inserting RSVP:", insertError)
      return NextResponse.json({ error: "Failed to save RSVP" }, { status: 500 })
    }

    // Send notification to owners
    try {
      const attendingText = attending ? "CONFIRMOU presença" : "NÃO PODERÁ comparecer"
      const emailText = email ? ` (${email})` : ""
      const messageText = message ? `<p><strong>Mensagem:</strong> ${message}</p>` : ""

      await notifyOwner(
        `RSVP: ${name} ${attendingText}`,
        `
          <div style="font-family: Arial, sans-serif;">
            <h3>Nova Confirmação de Presença</h3>
            <p><strong>${name}</strong>${emailText} ${attendingText.toLowerCase()} ao casamento.</p>
            ${messageText}
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              Recebido em: ${new Date().toLocaleString("pt-BR")}
            </p>
          </div>
        `,
      )
    } catch (emailError) {
      console.error("Error sending RSVP notification:", emailError)
      // Don't fail the RSVP if email fails
    }

    return NextResponse.json({
      success: true,
      rsvp: {
        id: rsvp.id,
        name: rsvp.name,
        attending: rsvp.attending,
      },
    })
  } catch (error) {
    console.error("Error processing RSVP:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
