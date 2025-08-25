import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/src/lib/supabase-admin"
import { revalidatePath } from "next/cache"

export async function POST(req: Request) {
  const isAdmin = cookies().get("admin")?.value === "1"
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 })

  const { error } = await supabaseAdmin.from("gifts").delete().eq("id", id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidatePath("/gifts")
  revalidatePath("/")
  return NextResponse.json({ ok: true })
}
