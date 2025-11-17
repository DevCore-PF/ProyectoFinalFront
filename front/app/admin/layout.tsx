import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AdminProvider } from "@/context/AdminContext";

export const metadata: Metadata = {
  title: "DevCore - Admin",
  description: "Panel de administración de DevCore",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminProvider>
      <Navbar />
      {children}
      <Footer />
    </AdminProvider>
  );
}
