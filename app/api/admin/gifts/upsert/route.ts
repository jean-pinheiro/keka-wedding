import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/src/lib/supabase-admin"
import { revalidatePath } from "next/cache"

export async function POST(req: Request) {
  const isAdmin = cookies().get("admin")?.value === "1"
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { id } = body
  const payload = {
    name: body.name ?? null,
    description: body.description ?? null,
    image_url: body.image_url ?? null,
    status: body.status ?? "available",
    pix_qr_url: body.pix_qr_url ?? null,
    pix_link_url: body.pix_link_url ?? null,
  }

  const op = id
    ? supabaseAdmin.from("gifts").update(payload).eq("id", id).select("*").single()
    : supabaseAdmin.from("gifts").insert(payload).select("*").single()

  const { data, error } = await op
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidatePath("/gifts")
  revalidatePath("/")
  return NextResponse.json({ ok: true, gift: data })
}
