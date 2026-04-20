import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole =
  | "patient"
  | "doctor"
  | "pharmacy"
  | "medical_service"
  | "lab_radiology"
  | "paramedical"
  | "medical_transport"
  | "admin";

export interface User {
  id: string;
  email: string;
  name?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone: string;
  status?: "pending" | "approved" | "rejected";
  specialization?: string;
  doctorId?: string;
  pharmacyId?: string;
  serviceId?: string;
  labId?: string;
  paramedicalId?: string;
  companyName?: string;
  avatar?: string;
  governorate?: string;
  delegation?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  register: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger l'utilisateur depuis localStorage, puis valider le token auprès du serveur
  useEffect(() => {
    const token = localStorage.getItem("megacare_token");
    const storedUser = localStorage.getItem("megacare_user");

    if (!token) {
      if (storedUser) localStorage.removeItem("megacare_user");
      setIsLoading(false);
      return;
    }

    fetch("/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          // Token invalide ou expiré — déconnexion silencieuse
          localStorage.removeItem("megacare_token");
          localStorage.removeItem("megacare_user");
          setUser(null);
          setIsLoading(false);
          return null;
        }
        if (!res.ok) {
          // Erreur serveur — fallback sur les données stockées
          if (storedUser) {
            try { setUser(JSON.parse(storedUser)); } catch { localStorage.removeItem("megacare_user"); }
          }
          setIsLoading(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        const freshUser: User = { ...data.user, id: data.user._id ?? data.user.id };
        setUser(freshUser);
        try {
          localStorage.setItem("megacare_user", JSON.stringify(safeForStorage(freshUser)));
        } catch { /* quota */ }
        setIsLoading(false);
      })
      .catch(() => {
        // Erreur réseau — fallback sur les données stockées
        if (storedUser) {
          try { setUser(JSON.parse(storedUser)); } catch { localStorage.removeItem("megacare_user"); }
        }
        setIsLoading(false);
      });
  }, []);

  // Strip large data-URL avatars before persisting to localStorage
  const safeForStorage = (u: User): User => {
    if (u.avatar && u.avatar.length > 2048) {
      const { avatar: _, ...rest } = u;
      return rest as User;
    }
    return u;
  };

  const login = (newUser: User) => {
    setUser(newUser);
    try {
      localStorage.setItem(
        "megacare_user",
        JSON.stringify(safeForStorage(newUser)),
      );
    } catch {
      /* quota */
    }
  };

  const register = (newUser: User) => {
    setUser(newUser);
    try {
      localStorage.setItem(
        "megacare_user",
        JSON.stringify(safeForStorage(newUser)),
      );
    } catch {
      /* quota */
    }
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem(
          "megacare_user",
          JSON.stringify(safeForStorage(updated)),
        );
      } catch {
        /* quota */
      }
      return updated;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("megacare_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
