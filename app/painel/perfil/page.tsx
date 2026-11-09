
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileEditor from "@/components/painel/ProfileEditor";

export const metadata: Metadata = {
  title: "Editar perfil",
  robots: { index: false, follow: false },
};

export default async function EditarPerfilPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/entrar");
  }

  const [profileResult, skillsResult, socialsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, username, display_name, profession, bio, avatar_url, banner_url, location, website, is_available_for_work"
      )
      .eq("id", user.id)
      .maybeSingle(),

    supabase
      .from("profile_skills")
      .select("name, proficiency, position")
      .eq("user_id", user.id)
      .order("position", { ascending: true }),

    supabase
      .from("social_links")
      .select("platform, url, position")
      .eq("user_id", user.id)
      .order("position", { ascending: true }),
  ]);

  if (profileResult.error) {
    console.error("Erro ao carregar perfil:", profileResult.error.message);
  }

  if (skillsResult.error) {
    console.error("Erro ao carregar habilidades:", skillsResult.error.message);
  }

  if (socialsResult.error) {
    console.error("Erro ao carregar redes sociais:", socialsResult.error.message);
  }

  return (
    <ProfileEditor
      userId={user.id}
      email={user.email ?? ""}
      profile={profileResult.data}
      initialSkills={skillsResult.data ?? []}
      initialSocials={socialsResult.data ?? []}
    />
  );
}
