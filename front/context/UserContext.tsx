"use client";
import { clearSession } from "@/helpers/session.helpers";
import { getCurrentUserService } from "@/services/user.service";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  email: string;
  hasCompletedProfile: boolean;
  id: number;
  name: string;
  role: "student" | "teacher" | "admin" | null;
  isEmailVerified: false;
  resetPasswordToken: null;
  resetPasswordExpires: null;
  checkBoxTerms: boolean;
  emailVerificationToken: string;
  googleId: null;
  image: null;
  isActive: boolean;
  isGoogleAccount: false;
}

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
    if (userToken) {
      setTokenState(userToken);
    }
    if (userData) {
      try {
        setUserState(JSON.parse(userData));
      } catch (error) {
        console.error("Error al parsear usuario:", error);
        sessionStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  //REFRESCA EL USER DELSDE EL BACK
  useEffect(() => {
    const fetchUser = async () => {
      if (token && user?.id) {
        // Solo refresca si han pasado más de 5 segundos desde que se guardó el usuario
        const userTimestamp = sessionStorage.getItem("userTimestamp");
        const now = Date.now();

        if (userTimestamp && now - parseInt(userTimestamp) < 5000) {
          console.log("Usuario recién guardado, saltando refresco");
          return;
        }

        try {
          const freshUserData = await getCurrentUserService(token, user.id);
          setUserState(freshUserData);
          sessionStorage.setItem("user", JSON.stringify(freshUserData));
          sessionStorage.setItem("userTimestamp", now.toString());
        } catch (error) {
          console.error("Error al refrescar usuario:", error);
          if (error instanceof Error && error.message.includes("401")) {
            logout();
          }
        }
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
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
      sessionStorage.setItem("userTimestamp", Date.now().toString()); // Guardar timestamp
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
