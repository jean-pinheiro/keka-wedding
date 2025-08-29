import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();

    if (!q) {
      return NextResponse.json({ results: [] });
    }

    // Basic case-insensitive match, only NOT confirmed
    const { data, error } = await supabaseAdmin
      .from("rsvps")
      .select("id,name,guests_count,attending")
      .ilike("name", `%${q}%`)
      .eq("attending", false)
      .order("name", { ascending: true })
      .limit(15);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ results: data ?? [] });
  } catch (e: any) {
    return NextResponse.json({ error: "Erro inesperado" }, { status: 500 });
  }
}
