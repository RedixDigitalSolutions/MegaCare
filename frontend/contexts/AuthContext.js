import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children, }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // Charger l'utilisateur depuis localStorage, puis valider le token auprès du serveur
    useEffect(() => {
        const token = localStorage.getItem("megacare_token");
        const storedUser = localStorage.getItem("megacare_user");
        if (!token) {
            if (storedUser)
                localStorage.removeItem("megacare_user");
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
                    try {
                        setUser(JSON.parse(storedUser));
                    }
                    catch {
                        localStorage.removeItem("megacare_user");
                    }
                }
                setIsLoading(false);
                return null;
            }
            return res.json();
        })
            .then((data) => {
            if (!data)
                return;
            const freshUser = { ...data.user, id: data.user._id ?? data.user.id };
            setUser(freshUser);
            try {
                localStorage.setItem("megacare_user", JSON.stringify(safeForStorage(freshUser)));
            }
            catch { /* quota */ }
            setIsLoading(false);
        })
            .catch(() => {
            // Erreur réseau — fallback sur les données stockées
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                }
                catch {
                    localStorage.removeItem("megacare_user");
                }
            }
            setIsLoading(false);
        });
    }, []);
    // Strip large data-URL avatars before persisting to localStorage
    const safeForStorage = (u) => {
        if (u.avatar && u.avatar.length > 2048) {
            const { avatar: _, ...rest } = u;
            return rest;
        }
        return u;
    };
    const login = (newUser) => {
        setUser(newUser);
        try {
            localStorage.setItem("megacare_user", JSON.stringify(safeForStorage(newUser)));
        }
        catch {
            /* quota */
        }
    };
    const register = (newUser) => {
        setUser(newUser);
        try {
            localStorage.setItem("megacare_user", JSON.stringify(safeForStorage(newUser)));
        }
        catch {
            /* quota */
        }
    };
    const updateUser = (updates) => {
        setUser((prev) => {
            if (!prev)
                return prev;
            const updated = { ...prev, ...updates };
            try {
                localStorage.setItem("megacare_user", JSON.stringify(safeForStorage(updated)));
            }
            catch {
                /* quota */
            }
            return updated;
        });
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem("megacare_user");
    };
    return (_jsx(AuthContext.Provider, { value: {
            user,
            isLoading,
            isAuthenticated: !!user,
            login,
            logout,
            register,
            updateUser,
        }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
