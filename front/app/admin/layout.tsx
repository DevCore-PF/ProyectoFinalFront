import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "../../context/UserContext";
import { CartProvider } from "@/context/CartContext";
import { AdminProvider } from "@/context/AdminContext";

export const metadata: Metadata = {
  title: "DevCore - Admin",
  description: "Panel de administración de DevCore",
};
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AuthProvider>
        <CartProvider>
          <AdminProvider>
            <Navbar />
            {children}
            <Footer />
          </AdminProvider>
        </CartProvider>
      </AuthProvider>
    </div>
  );
}
