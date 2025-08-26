import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { supabaseAdmin } from "@/src/lib/supabase-admin"

export async function POST(req: Request) {
  try {
    // Check admin authentication
    const adminCookie = req.headers.get("cookie")?.includes("admin=")
    if (!adminCookie) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const body = await req.json()

    // Force the singleton row (id=1)
    const payload = {
      id: "a0a019d1-db44-4dc2-8c7d-c5956156b0a9",
      cover_title: body.cover_title ?? null,
      cover_subtitle: body.cover_subtitle ?? null,
      location_address: body.location_address ?? null,
      maps_embed_url: body.maps_embed_url ?? null,
      pix_qr_url: body.pix_qr_url ?? null,
      pix_link_url: body.pix_link_url ?? null,
      pix_instructions: body.pix_instructions ?? null,
      amazon_list_url: body.amazon_list_url ?? null,
      cover_image_url: body.cover_image_url ?? null, // Added cover image URL field
      about_text: body.about_text ?? null,           // Added about text field
    }

    // Upsert row with id=1
    const { data, error } = await supabaseAdmin
      .from("site_settings")
      .upsert(payload, { onConflict: "id" }) // conflict target is the PK
      .select("*")
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    revalidatePath("/")
    revalidatePath("/admin") // refresh admin view too
    return NextResponse.json({ ok: true, settings: data })
  } catch (e: any) {
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 })
  }
}
