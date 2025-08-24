import { type NextRequest, NextResponse } from "next/server"
import { getSupabaseClient } from "@/src/lib/supabase-server"
import { sendGiftReservedEmail, notifyOwner } from "@/src/lib/email"

interface ReserveGiftRequest {
  giftId: string
  name: string
  email: string
  viaPix?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body: ReserveGiftRequest = await request.json()
    const { giftId, name, email, viaPix = false } = body

    if (!giftId || !name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = getSupabaseClient()

    // Atomically reserve the gift
    const { data: updatedGift, error: updateError } = await supabase
      .from("gifts")
      .update({
        status: "reserved",
        reserved_by_name: name,
        reserved_by_email: email,
        updated_at: new Date().toISOString(),
      })
      .eq("id", giftId)
      .eq("status", "available") // Only update if still available
      .select("*")
      .single()

    if (updateError || !updatedGift) {
      return NextResponse.json({ error: "Gift not available or not found" }, { status: 409 })
    }

    // Get global Pix settings if needed
    let pixInfo = null
    if (viaPix) {
      // Check if gift has specific Pix data
      if (updatedGift.pix_qr_url || updatedGift.pix_link_url) {
        pixInfo = {
          qrUrl: updatedGift.pix_qr_url,
          linkUrl: updatedGift.pix_link_url,
          instructions: "Use os dados abaixo para fazer o pagamento via Pix",
        }
      } else {
        // Fall back to global settings
        const { data: settings } = await supabase
          .from("site_settings")
          .select("pix_qr_url, pix_link_url, pix_instructions")
          .single()

        if (settings) {
          pixInfo = {
            qrUrl: settings.pix_qr_url,
            linkUrl: settings.pix_link_url,
            instructions: settings.pix_instructions || "Use os dados abaixo para fazer o pagamento via Pix",
          }
        }
      }
    }

    // Send emails
    try {
      await sendGiftReservedEmail(email, updatedGift.name, name, viaPix ? { pixInfo } : undefined)

      await notifyOwner(
        `Presente Reservado: ${updatedGift.name}`,
        `<p>${name} (${email}) reservou o presente: <strong>${updatedGift.name}</strong>${viaPix ? " (via Pix)" : ""}</p>`,
      )
    } catch (emailError) {
      console.error("Error sending emails:", emailError)
      // Don't fail the reservation if email fails
    }

    return NextResponse.json({
      ok: true,
      state: "reserved",
      gift: {
        id: updatedGift.id,
        name: updatedGift.name,
        status: updatedGift.status,
        reserved_by_name: updatedGift.reserved_by_name,
        reserved_by_email: updatedGift.reserved_by_email,
      },
      pix: pixInfo,
    })
  } catch (error) {
    console.error("Error reserving gift:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
