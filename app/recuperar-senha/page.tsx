
import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Recuperar senha",
  robots: { index: false, follow: false },
};

export default function RecuperarSenhaPage() {
  return <AuthForm mode="forgot" />;
}
