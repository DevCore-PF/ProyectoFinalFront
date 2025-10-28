// interface User {
//   id: number;
//   name: string;
//   email: string;
//   address?: string;
//   phone?: string;
//   role: string;
//   credentials: {
//     id: number;
//     password: string;
//   };
//   token: string;
// }

// interface UserProviderProps {
//   children: React.ReactElement;
// }

"use client";
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
  id: string;
  name: string;
  role: "student" | "teacher" | "admin" | null;
  // image:string
}

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isLoading: boolean;
  logout: () => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userToken = sessionStorage.getItem("token");
    const userData = sessionStorage.getItem("user");

    setTokenState(userToken);

    if (userData) {
      setUserState(JSON.parse(userData));
    }

    setIsLoading(false);
  }, []);

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
    } else {
      sessionStorage.removeItem("user");
    }
    setUserState(newUser);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setTokenState(null);
    setUserState(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken, isLoading, logout, user, setUser }}
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
