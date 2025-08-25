import { cookies } from "next/headers";
import { getSupabaseClient } from "@/src/lib/supabase-server";
import { AdminDashboard } from "@/src/components/AdminDashboard";
import { AdminLogin } from "@/src/components/AdminLogin";

async function getAdminData() {
  const supabase = getSupabaseClient();

  const [giftsResult, photosResult, rsvpsResult, settingsResult] =
    await Promise.all([
      supabase
        .from("gifts")
        .select("*")
        .order("created_at", { ascending: true }),
      supabase
        .from("photos")
        .select("*")
        .order("sort_order", { ascending: true }),
      supabase
        .from("rsvps")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("site_settings").select("*").single(),
    ]);

  return {
    gifts: giftsResult.data || [],
    photos: photosResult.data || [],
    rsvps: rsvpsResult.data || [],
    settings: settingsResult.data || null,
  };
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("admin");
  const isAuthenticated = adminCookie?.value === "1";

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const data = await getAdminData();

  return <AdminDashboard initialData={data} />;
}
