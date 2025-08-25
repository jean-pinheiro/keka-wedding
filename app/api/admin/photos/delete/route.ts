import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/src/lib/supabase-admin";

export async function POST(req: Request) {
  const isAdmin = cookies().get("admin")?.value === "1";
  if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  // 1) Look up the row to get the image_url
  const { data: row, error: fetchErr } = await supabaseAdmin
    .from("photos")
    .select("image_url")
    .eq("id", id)
    .single();

  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  }

  // 2) Best-effort: if image_url points to your Supabase public bucket, remove the object
  if (row?.image_url) {
    try {
      const u = new URL(row.image_url);
      // Expect path like: /storage/v1/object/public/<bucket>/<objectPath...>
      const m = u.pathname.match(/^\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
      if (m) {
        const [, bucket, objectPath] = m;
        const { error: rmErr } = await supabaseAdmin.storage.from(bucket).remove([objectPath]);
        if (rmErr) {
          // Don't hard-fail row deletion if storage removal fails; just log
          console.warn("Storage remove failed:", rmErr.message);
        }
      }
    } catch (e) {
      console.warn("Could not parse image_url for storage removal:", e);
    }
  }

  // 3) Delete the DB row
  const { error: delErr } = await supabaseAdmin.from("photos").delete().eq("id", id);
  if (delErr) return NextResponse.json({ error: delErr.message }, { status: 500 });

  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
