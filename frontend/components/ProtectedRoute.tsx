import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    if (requiredRole) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!roles.includes(user.role)) {
        // Rediriger vers le dashboard approprié
        const dashboards: Partial<Record<UserRole, string>> = {
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
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

  return <>{children}</>;
};
