import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Workfolio — Your work. Your identity. Your network.",
    template: "%s — Workfolio"
  },
  description:
    "Um espaço para profissionais criativos apresentarem seu trabalho, construírem sua identidade e encontrarem novas conexões.",
  applicationName: "Workfolio",
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    title: "Workfolio",
    description:
      "Seu trabalho, sua identidade e sua rede profissional em um só lugar.",
    type: "website"
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
