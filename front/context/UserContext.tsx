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
        setUserState(parsedUser);
        
        // Si los datos del usuario son muy antiguos (más de 30 segundos), marcar para refrescar
        const now = Date.now();
        if (!userTimestamp || now - parseInt(userTimestamp) > 30000) {
          console.log("Datos de usuario antiguos, se refrescarán automáticamente");
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

        // Reducir el tiempo de caché para datos más frescos, especialmente para profesores
        const cacheTime = user.role === "teacher" ? 10000 : 15000; // 10 segundos para teachers, 15 para otros
        
        if (userTimestamp && now - parseInt(userTimestamp) < cacheTime) {
          console.log("Usuario recién guardado, saltando refresco");
          return;
        }

        try {
          console.log("🔄 Refrescando datos del usuario desde el backend...");
          const freshUserData = await getCurrentUserService(token, user.id);
          console.log("✅ Datos frescos obtenidos:", freshUserData);
          
          // IMPORTANTE: Preservar datos importantes si el backend responde con undefined
          const mergedUserData = {
            ...freshUserData,
            // Si el backend responde con professorProfile undefined pero el usuario actual lo tiene, preservarlo
            professorProfile: freshUserData.professorProfile || user.professorProfile,
            // Preservar otros campos importantes
            hasCompletedProfile: freshUserData.hasCompletedProfile ?? user.hasCompletedProfile,
          };
          
          console.log("🔄 Usuario fusionado (preservando datos importantes):", mergedUserData);
          setUserState(mergedUserData);
          sessionStorage.setItem("user", JSON.stringify(mergedUserData));
          sessionStorage.setItem("userTimestamp", now.toString());
        } catch (error) {
          console.error("Error al refrescar usuario:", error);
          // Solo hacer logout si es un error 401/403 (no autorizado)
          if (error instanceof Error && (error.message.includes("401") || error.message.includes("403"))) {
            console.log("Token inválido, haciendo logout");
            logout();
          } else {
            // Para otros errores, simplemente logueamos y mantenemos el usuario actual
            console.log("Error temporal, manteniendo usuario actual");
          }
        }
      }
    };

    if (token && user?.id) {
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
      sessionStorage.setItem("user", JSON.stringify(newUser));
      sessionStorage.setItem("userTimestamp", Date.now().toString()); 
    } else {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("userTimestamp");
    }
    setUserState(newUser);
  };
  const refreshUser = async () => {
    if (!token || !user?.id) {
      console.warn("No hay token o user para refrescar");
      return;
    }

    try {
      const freshUserData = await getCurrentUserService(token, user.id);
      setUser(freshUserData);
    } catch (error) {
      console.error("Error al refrescar usuario:", error);
      throw error;
    }
  };
  const logout = () => {
    clearSession();
    setTokenState(null);
    setUserState(null);
    window.location.href = "/";
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
