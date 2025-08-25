import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/src/lib/supabase-admin"
import { revalidatePath } from "next/cache"

export async function POST(req: Request) {
  const isAdmin = cookies().get("admin")?.value === "1"
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id, image_url, caption, sort_order = 0 } = await req.json()
  if (!image_url) return NextResponse.json({ error: "image_url required" }, { status: 400 })

  const op = id
    ? supabaseAdmin.from("photos").update({ image_url, caption, sort_order }).eq("id", id).select("*").single()
    : supabaseAdmin.from("photos").insert({ image_url, caption, sort_order }).select("*").single()

  const { data, error } = await op
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidatePath("/")
  return NextResponse.json({ ok: true, photo: data })
}
