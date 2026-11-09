
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import styles from "./auth.module.css";

type AuthMode = "login" | "signup" | "forgot" | "reset";

type AuthFormProps = {
  mode: AuthMode;
};

const content = {
  login: {
    eyebrow: "BEM-VINDO DE VOLTA",
    title: "Seu próximo capítulo começa aqui.",
    description: "Entre na sua conta e continue construindo sua presença profissional.",
    button: "Entrar na minha conta",
  },
  signup: {
    eyebrow: "COMECE POR AQUI",
    title: "Seu trabalho merece ser visto.",
    description: "Crie sua identidade profissional e compartilhe o que você sabe fazer.",
    button: "Criar minha conta",
  },
  forgot: {
    eyebrow: "RECUPERAÇÃO DE ACESSO",
    title: "Vamos recuperar seu acesso.",
    description: "Informe seu e-mail e enviaremos as instruções para redefinir sua senha.",
    button: "Enviar instruções",
  },
  reset: {
    eyebrow: "NOVA SENHA",
    title: "Escolha uma nova senha.",
    description: "Crie uma senha segura para voltar à sua conta.",
    button: "Salvar nova senha",
  },
};

function getFriendlyError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "E-mail ou senha incorretos.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar.";
  }

  if (normalized.includes("user already registered")) {
    return "Este e-mail já possui uma conta. Tente entrar.";
  }

  if (normalized.includes("password")) {
    return "A senha não atende aos requisitos. Use pelo menos 8 caracteres.";
  }

  if (normalized.includes("rate limit")) {
    return "Muitas tentativas. Aguarde alguns minutos e tente novamente.";
  }

  return "Não foi possível concluir a solicitação. Verifique os dados e tente novamente.";
}

function getSafeDestination() {
  const params = new URLSearchParams(window.location.search);
  const destination = params.get("redirect");

  if (
    destination &&
    destination.startsWith("/") &&
    !destination.startsWith("//")
  ) {
    return destination;
  }

  return "/painel";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const current = content[mode];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const supabase = createClient();

      if (mode === "signup") {
        if (name.trim().length < 2) {
          setError("Informe seu nome completo.");
          return;
        }

        const { data, error: signupError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              display_name: name.trim(),
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (signupError) {
  console.error("Erro no cadastro Workfolio:", signupError.message);
  setError(signupError.message);
  return;
}

        if (data.session) {
          router.replace("/painel");
          router.refresh();
          return;
        }

        setSuccess(
          "Cadastro iniciado! Enviamos um link de confirmação para seu e-mail. Confira também a caixa de spam."
        );
        return;
      }

      if (mode === "login") {
        const { error: loginError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
          });

        if (loginError) {
          setError(getFriendlyError(loginError.message));
          return;
        }

        router.replace(getSafeDestination());
        router.refresh();
        return;
      }

      if (mode === "forgot") {
        const { error: recoveryError } =
          await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: `${window.location.origin}/auth/callback?next=/redefinir-senha`,
          });

        if (recoveryError) {
          setError(getFriendlyError(recoveryError.message));
          return;
        }

        setSuccess(
          "Se existir uma conta associada a esse e-mail, enviaremos as instruções de recuperação."
        );
        return;
      }

      if (mode === "reset") {
        if (password.length < 8) {
          setError("Sua nova senha precisa ter pelo menos 8 caracteres.");
          return;
        }

        const { error: updateError } =
          await supabase.auth.updateUser({ password });

        if (updateError) {
          setError(getFriendlyError(updateError.message));
          return;
        }

        setSuccess("Senha alterada com sucesso. Você já pode entrar.");
        setPassword("");
        return;
      }
   } catch (error) {
  console.error("Erro inesperado no Workfolio:", error);

  setError(
    error instanceof Error
      ? error.message
      : "Erro inesperado. Consulte o console do navegador."
  );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.topbar}>
        <Link href="/" className={styles.brand}>
          workfolio<span>.</span>
        </Link>

        <Link href="/" className={styles.backLink}>
          Voltar ao início
        </Link>
      </div>

      <section className={styles.layout}>
        <div className={styles.intro}>
          <span className={styles.eyebrow}>WORKFOLIO / {current.eyebrow}</span>

          <h1>{current.title}</h1>

          <p>{current.description}</p>

          <div className={styles.signature}>
            <span className={styles.signatureLine} />
            <span>Seu trabalho. Sua identidade. Suas conexões.</span>
          </div>
        </div>

        <div className={styles.formPanel}>
          <div className={styles.formHeading}>
            <span className={styles.formLabel}>
              {mode === "signup"
                ? "NOVA CONTA"
                : mode === "login"
                  ? "ACESSO À PLATAFORMA"
                  : mode === "forgot"
                    ? "RECUPERAR CONTA"
                    : "ATUALIZAR ACESSO"}
            </span>

            <h2>
              {mode === "signup"
                ? "Criar conta"
                : mode === "login"
                  ? "Entrar"
                  : mode === "forgot"
                    ? "Recuperar senha"
                    : "Nova senha"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {mode === "signup" && (
              <label className={styles.field}>
                <span>Nome completo</span>
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Como podemos chamar você?"
                  autoComplete="name"
                  minLength={2}
                  maxLength={100}
                  required
                />
              </label>
            )}

            {mode !== "reset" && (
              <label className={styles.field}>
                <span>E-mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@exemplo.com"
                  autoComplete="email"
                  maxLength={254}
                  required
                />
              </label>
            )}

            {(mode === "login" ||
              mode === "signup" ||
              mode === "reset") && (
              <label className={styles.field}>
                <span>{mode === "reset" ? "Nova senha" : "Senha"}</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Mínimo de 8 caracteres"
                  autoComplete={
                    mode === "login"
                      ? "current-password"
                      : "new-password"
                  }
                  minLength={8}
                  maxLength={72}
                  required
                />
              </label>
            )}

            {mode === "login" && (
              <div className={styles.forgotRow}>
                <Link href="/recuperar-senha">Esqueceu sua senha?</Link>
              </div>
            )}

            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            {success && (
              <p className={styles.success} role="status">
                {success}
              </p>
            )}

            <button
              type="submit"
              className={styles.submit}
              disabled={loading}
            >
              {loading ? "Aguarde..." : current.button}
              <span aria-hidden="true">↗</span>
            </button>
          </form>

          <div className={styles.formFooter}>
            {mode === "login" && (
              <p>
                Ainda não tem uma conta?{" "}
                <Link href="/cadastro">Criar conta</Link>
              </p>
            )}

            {mode === "signup" && (
              <p>
                Já possui uma conta? <Link href="/entrar">Entrar</Link>
              </p>
            )}

            {mode === "forgot" && (
              <p>
                Lembrou sua senha? <Link href="/entrar">Voltar ao login</Link>
              </p>
            )}

            {mode === "reset" && success && (
              <p>
                <Link href="/entrar">Ir para o login</Link>
              </p>
            )}

            {mode === "reset" && !success && (
              <p>
                <Link href="/entrar">Voltar ao login</Link>
              </p>
            )}
          </div>

          <p className={styles.privacy}>
            Ao continuar, você concorda em utilizar a plataforma de forma
            responsável e respeitar as diretrizes da comunidade.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Workfolio</span>
        <span>Feito para quem cria.</span>
      </footer>
    </main>
  );
}
