
import type { Metadata } from "next";
import AuthForm from "@/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Criar conta",
  robots: { index: false, follow: false },
};

export default function CadastroPage() {
  return <AuthForm mode="signup" />;
}
