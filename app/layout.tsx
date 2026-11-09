import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Workfolio — Seu trabalho. Sua identidade. Suas conexões.",
    template: "%s | Workfolio"
  },
  description:
    "Apresente seus projetos, construa sua identidade profissional e conecte-se com outros talentos criativos. Conheça o Workfolio.",
  applicationName: "Workfolio",
  category: "technology",
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: "Workfolio — Seu espaço profissional e criativo",
    description:
      "Um espaço para apresentar seu trabalho, fortalecer sua presença profissional e encontrar novas conexões.",
    locale: "pt_BR",
    type: "website",
    siteName: "Workfolio"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8f8f6"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
