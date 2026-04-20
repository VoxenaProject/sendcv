import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();

  // Supprimer toutes les données (cascade via foreign keys)
  await admin.from("applications").delete().eq("user_id", user.id);
  await admin.from("credit_transactions").delete().eq("user_id", user.id);
  await admin.from("profiles").delete().eq("id", user.id);

  // Supprimer le user auth
  await admin.auth.admin.deleteUser(user.id);

  return Response.json({ success: true });
}
