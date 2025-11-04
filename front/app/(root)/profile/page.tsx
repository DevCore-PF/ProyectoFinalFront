"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/UserContext";

const ProfilePage = () => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Redirigir automáticamente a settings si el usuario está logueado
    if (user?.id) {
      router.replace(`/profile/${user.id}/settings`);
    } else {
      router.replace("/login");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1b3e] to-[#0f1020] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7e4bde] mx-auto mb-4"></div>
        <p className="text-slate-300">Redirigiendo al perfil...</p>
      </div>
    </div>
  );
};

export default ProfilePage;