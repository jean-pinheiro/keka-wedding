import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/src/lib/supabase-admin"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const cookieStore = cookies()
  const isAdmin = cookieStore.get("admin")?.value === "1"
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const bucket = (formData.get("bucket") as string) || "photos"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const bytes = Buffer.from(await file.arrayBuffer())
    const fileExtension = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`

    const { error: uploadError } = await supabaseAdmin.storage.from(bucket).upload(fileName, bytes, {
      upsert: true,
      contentType: file.type || `image/${fileExtension}`,
    })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(fileName)

    return NextResponse.json({
      url: data.publicUrl,
      path: fileName,
    })
  } catch (error) {
    console.error("Upload API error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
