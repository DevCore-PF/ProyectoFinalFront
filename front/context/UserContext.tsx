"use client";
import { clearSession } from "@/helpers/session.helpers";
import { getCurrentUserService, logoutService } from "@/services/user.service";
import { User } from "@/types/user.types";
import { decodeToken } from "@/lib/jwt";
import Cookies from "js-cookie";

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";

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
  
  // Efecto inicial: cargar token y usuario
  useEffect(() => {
    const initializeAuth = async () => {
      const userToken = Cookies.get("auth-token");
      const userData = sessionStorage.getItem("user");
      const userTimestamp = sessionStorage.getItem("userTimestamp");

      if (userToken) {
        setTokenState(userToken);

        // Si hay usuario en sessionStorage, usarlo
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
              console.log("Datos de usuario antiguos, se refrescarán automáticamente");
            }
          } catch (error) {
            console.error("Error al parsear usuario:", error);
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("userTimestamp");
          }
        } else {
          // Si NO hay usuario en sessionStorage pero SÍ hay token,
          // decodificar el token y obtener el usuario
          try {
            const decodedToken = decodeToken(userToken);
            if (decodedToken && decodedToken.sub) {
              const userId = decodedToken.sub;
              const freshUserData = await getCurrentUserService(userToken, userId);
              const freshUserWithImage = freshUserData as User & { image?: string };
              const normalizedUserData = {
                ...freshUserData,
                profileImage: freshUserData.profileImage || freshUserWithImage.image,
              };

              setUserState(normalizedUserData);
              sessionStorage.setItem("user", JSON.stringify(normalizedUserData));
              sessionStorage.setItem("userTimestamp", Date.now().toString());
            } else {
              // Token inválido o expirado, limpiar
              Cookies.remove("auth-token", { path: "/" });
              setTokenState(null);
            }
          } catch (error) {
            console.error("Error al recuperar usuario desde token:", error);
            // Si falla, limpiar el token
            Cookies.remove("auth-token", { path: "/" });
            setTokenState(null);
          }
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
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
            hasCompletedProfile: freshUserData.hasCompletedProfile ?? user.hasCompletedProfile,
            profileImage: freshUserData.profileImage || freshUserWithImage.image || user.profileImage,
          };

          setUserState(normalizedUserData);
          sessionStorage.setItem("user", JSON.stringify(normalizedUserData));
          sessionStorage.setItem("userTimestamp", now.toString());
        } catch (error) {
          if (isLoggingOut.current) {
            return;
          }
        }
      }
    };

    if (token && user?.id && !isLoggingOut.current) {
      fetchUser();
    }
  }, [token, user?.id]);

  const setToken = (newToken: string | null) => {
    if (newToken) {
      Cookies.set("auth-token", newToken, {
        expires: 7, // 7 días
        secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      });
    } else {
      Cookies.remove("auth-token", { path: "/" });
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
      return;
    }

    try {
      const freshUserData = await getCurrentUserService(token, user.id);

      const freshUserWithImage = freshUserData as User & {
        image?: string;
        profileImageUrl?: string;
      };
      const normalizedUserData = {
        ...freshUserData,
        hasCompletedProfile: freshUserData.hasCompletedProfile ?? user.hasCompletedProfile,
        profileImage: freshUserData.profileImage || freshUserWithImage.image || user.profileImage,
      };

      setUser(normalizedUserData);
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
          logout();
          return;
        }
      }
      throw error;
    }
  };
  const logout = async () => {
    if (isLoggingOut.current) {
      return;
    }

    isLoggingOut.current = true;

    try {
      // 1. Llamar al backend para limpiar tokens sociales
      if (token) {
        await logoutService(token);
      }

      // 2. Limpiar el estado local
      clearSession();
      Cookies.remove("auth-token", { path: "/" });
      localStorage.clear();
      sessionStorage.clear();
      setTokenState(null);
      setUserState(null);

      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    } catch (error) {
      console.error("Error durante logout:", error);
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/";
    } finally {
      isLoggingOut.current = false;
    }
  };
  // const logout = async () => {
  //   if (isLoggingOut.current) {
  //     return;
  //   }
  //   isLoggingOut.current = true;

  //   try {
  //     if (token) {
  //       await logoutService(token);
  //     }

  //     clearSession();
  //     Cookies.remove("auth-token", { path: "/" });
  //     setTokenState(null);
  //     setUserState(null);

  //     if (user?.isGoogleAccount) {
  //       // Revocar el token de Google
  //       window.location.href = "https://accounts.google.com/o/oauth2/revoke?token=" + token;
  //     } else if (user?.isGitHubAccount) {
  //       window.location.href = "/";
  //     } else {
  //       // Usuario con credenciales normales
  //       window.location.href = "/";
  //     }
  //   } catch (error) {
  //     console.error("Error durante logout:", error);
  //     window.location.href = "/";
  //   } finally {
  //     isLoggingOut.current = false;
  //   }
  // };

  // const logout = () => {
  //   if (isLoggingOut.current) {
  //     return;
  //   }

  //   isLoggingOut.current = true;

  //   try {
  //     clearSession();
  //     // Eliminar la cookie con las mismas opciones con las que se creó
  //     Cookies.remove("auth-token", { path: "/" });
  //     setTokenState(null);
  //     setUserState(null);

  //     setTimeout(() => {
  //       window.location.href = "/";
  //     }, 100);
  //   } catch (error) {
  //     console.error("Error durante logout:", error);
  //     window.location.href = "/";
  //   }
  // };

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
