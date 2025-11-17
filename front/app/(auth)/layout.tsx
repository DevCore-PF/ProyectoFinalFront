import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevCore - Autenticación",
  description: "Página de autenticación de DevCore",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
