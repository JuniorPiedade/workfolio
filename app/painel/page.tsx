
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Dashboard from "@/components/painel/Dashboard";

export const metadata: Metadata = {
  title: "Meu espaço",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function PainelPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/entrar");
  }

  const [profileResult, projectsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, username, display_name, profession, bio, avatar_url, banner_url, preferred_layout"
      )
      .eq("id", user.id)
      .maybeSingle(),

    supabase
      .from("projects")
      .select(
        "id, title, description, category, cover_url, status, published_at, created_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  if (profileResult.error) {
    console.error("Erro ao carregar perfil:", profileResult.error.message);
  }

  if (projectsResult.error) {
    console.error("Erro ao carregar projetos:", projectsResult.error.message);
  }

  return (
    <Dashboard
      userId={user.id}
      email={user.email ?? ""}
      profile={profileResult.data}
      projects={projectsResult.data ?? []}
    />
  );
}
