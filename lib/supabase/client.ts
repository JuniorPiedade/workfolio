
import { createBrowserClient } from "@supabase/ssr";

let supabaseClient: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Configuração pública do Supabase não encontrada.");
  }

  if (!supabaseClient) {
    supabaseClient = createBrowserClient(url, key);
  }

  return supabaseClient;
}
