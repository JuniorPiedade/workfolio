
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isProtectedRoute =
    pathname === "/painel" || pathname.startsWith("/painel/");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (isProtectedRoute) {
      return NextResponse.redirect(
        new URL("/entrar?erro=configuracao", request.url)
      );
    }

    return NextResponse.next();
  }

  let response = NextResponse.next({
    request,
  });

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(
            cookiesToSet: {
              name: string;
              value: string;
              options?: CookieOptions;
            }[]
          ) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });

            response = NextResponse.next({
              request,
            });

            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (isProtectedRoute && (error || !user)) {
      const redirectUrl = new URL("/entrar", request.url);
      redirectUrl.searchParams.set("redirect", pathname);

      const redirectResponse = NextResponse.redirect(redirectUrl);

      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie);
      });

      return redirectResponse;
    }

    return response;
  } catch (error) {
    console.error("Workfolio Middleware:", error);

    if (isProtectedRoute) {
      return NextResponse.redirect(
        new URL("/entrar?erro=autenticacao", request.url)
      );
    }

    return response;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
