
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function getSafeRedirect(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/painel";
  }

  return value;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;

  const code = searchParams.get("code");
  const next = getSafeRedirect(searchParams.get("next"));

  if (!code) {
    return NextResponse.redirect(
      new URL("/entrar?erro=confirmacao", origin)
    );
  }

  try {
    const supabase = await createClient();

    const { error } =
      await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Workfolio Auth Callback:", error.message);

      return NextResponse.redirect(
        new URL("/entrar?erro=confirmacao", origin)
      );
    }

    return NextResponse.redirect(new URL(next, origin));
  } catch (error) {
    console.error("Workfolio Auth Callback:", error);

    return NextResponse.redirect(
      new URL("/entrar?erro=autenticacao", origin)
    );
  }
}
