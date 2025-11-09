"use client";
import { clearSession } from "@/helpers/session.helpers";
import { getCurrentUserService } from "@/services/user.service";
import { User } from "@/types/auth.types";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isLoading: boolean;
  logout: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isLoggingOut = useRef(false);
  useEffect(() => {
    const userToken = sessionStorage.getItem("token");
    const userData = sessionStorage.getItem("user");
    const userTimestamp = sessionStorage.getItem("userTimestamp");

    if (userToken) {
      setTokenState(userToken);
    }
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);

        const parsedUserWithImage = parsedUser as User & { image?: string };
        const normalizedUser = {
          ...parsedUser,
          profileImage: parsedUser.profileImage || parsedUserWithImage.image,
        };

        setUserState(normalizedUser);

        const now = Date.now();
        if (!userTimestamp || now - parseInt(userTimestamp) > 30000) {
          console.log(
            "Datos de usuario antiguos, se refrescarán automáticamente"
          );
        }
      } catch (error) {
        console.error("Error al parsear usuario:", error);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("userTimestamp");
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (token && user?.id) {
        const userTimestamp = sessionStorage.getItem("userTimestamp");
        const now = Date.now();

        const cacheTime = user.role === "teacher" ? 10000 : 15000;

        if (userTimestamp && now - parseInt(userTimestamp) < cacheTime) {
          return;
        }

        try {
          const freshUserData = await getCurrentUserService(token, user.id);

          const freshUserWithImage = freshUserData as User & { image?: string };
          const normalizedUserData = {
            ...freshUserData,
            hasCompletedProfile:
              freshUserData.hasCompletedProfile ?? user.hasCompletedProfile,

            profileImage:
              freshUserData.profileImage ||
              freshUserWithImage.image ||
              user.profileImage,
          };

          setUserState(normalizedUserData);
          sessionStorage.setItem("user", JSON.stringify(normalizedUserData));
          sessionStorage.setItem("userTimestamp", now.toString());
        } catch (error) {
          if (isLoggingOut.current) {
            return;
          }
          if (error instanceof Error) {
            const errorMessage = error.message.toLowerCase();
            if (
              errorMessage.includes("401") ||
              errorMessage.includes("403") ||
              errorMessage.includes("404") ||
              errorMessage.includes("unauthorized") ||
              errorMessage.includes("not found") ||
              errorMessage.includes("error obteniendo usuario")
            ) {
              console.log(
                "🚨 Usuario no válido o eliminado. Cerrando sesión..."
              );
              logout();
              return;
            }
            console.log("Token inválido, haciendo logout");
            logout();
          } else {
            console.log("Error temporal, manteniendo usuario actual");
          }
        }
      }
    };

    if (token && user?.id && !isLoggingOut.current) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user?.id]);

  const setToken = (newToken: string | null) => {
    if (newToken) {
      sessionStorage.setItem("token", newToken);
    } else {
      sessionStorage.removeItem("token");
    }
    setTokenState(newToken);
  };

  const setUser = (newUser: User | null) => {
    if (newUser) {
      const userWithImage = newUser as User & { image?: string };
      const normalizedUser = {
        ...newUser,
        profileImage: newUser.profileImage || userWithImage.image,
      };

      sessionStorage.setItem("user", JSON.stringify(normalizedUser));
      sessionStorage.setItem("userTimestamp", Date.now().toString());
      setUserState(normalizedUser);
    } else {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("userTimestamp");
      setUserState(null);
    }
  };

  const refreshUser = async () => {
    if (!token || !user?.id) {
      console.warn("No hay token o user para refrescar");
      return;
    }

    try {
      console.log("🔄 Refrescando datos del usuario...");
      const freshUserData = await getCurrentUserService(token, user.id);
      console.log("✅ Datos frescos obtenidos:", freshUserData);

      const freshUserWithImage = freshUserData as User & {
        image?: string;
        profileImageUrl?: string;
      };
      const normalizedUserData = {
        ...freshUserData,
        hasCompletedProfile:
          freshUserData.hasCompletedProfile ?? user.hasCompletedProfile,
        profileImage:
          freshUserData.profileImage ||
          freshUserWithImage.image ||
          user.profileImage,
      };

      setUser(normalizedUserData);
      console.log("✅ Usuario actualizado en contexto y sessionStorage");
    } catch (error) {
      console.error("Error al refrescar usuario:", error);
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (
          errorMessage.includes("401") ||
          errorMessage.includes("403") ||
          errorMessage.includes("404") ||
          errorMessage.includes("not found") ||
          errorMessage.includes("error obteniendo usuario")
        ) {
          console.log("🚨 Usuario no encontrado. Cerrando sesión...");
          logout();
          return;
        }
      }
      throw error;
    }
  };

  const logout = () => {
    // Prevenir múltiples ejecuciones simultáneas
    if (isLoggingOut.current) {
      console.log("⏳ Logout ya en progreso, ignorando llamada duplicada");
      return;
    }
    //ACA HACE EL LOGOUT
    isLoggingOut.current = true;

    try {
      clearSession();
      setTokenState(null);
      setUserState(null);

      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    } catch (error) {
      console.error("Error durante logout:", error);
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isLoading,
        logout,
        user,
        setUser,

        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
