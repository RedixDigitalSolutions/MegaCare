import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
export const ProtectedRoute = ({ children, requiredRole, }) => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    useEffect(() => {
        if (isLoading)
            return;
        if (!user) {
            navigate("/login");
            return;
        }
        if (requiredRole) {
            const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
            if (!roles.includes(user.role)) {
                // Rediriger vers le dashboard approprié
                const dashboards = {
                    patient: "/dashboard",
                    doctor: "/doctor-dashboard",
                    pharmacy: "/pharmacy-dashboard",
                    medical_service: "/medical-service-dashboard",
                    lab_radiology: "/lab-dashboard",
                    paramedical: "/paramedical-dashboard",
                    admin: "/admin",
                };
                navigate(dashboards[user.role] ?? "/");
                return;
            }
        }
        // Redirect non-approved users to account-review
        if (user.role !== "admin" && user.role !== "patient" && user.status && user.status !== "approved" && pathname !== "/account-review") {
            navigate("/account-review");
            return;
        }
    }, [user, isLoading, requiredRole, navigate, pathname]);
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs("div", { className: "space-y-4 text-center", children: [_jsx("div", { className: "w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" }), _jsx("p", { className: "text-muted-foreground", children: "Chargement..." })] }) }));
    }
    if (!user) {
        return null; // Le useEffect va rediriger
    }
    if (requiredRole) {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!roles.includes(user.role)) {
            return null; // Le useEffect va rediriger
        }
    }
    // Block non-approved users from rendering dashboard content
    if (user.role !== "admin" && user.role !== "patient" && user.status && user.status !== "approved") {
        return null;
    }
    return _jsx(_Fragment, { children: children });
};
