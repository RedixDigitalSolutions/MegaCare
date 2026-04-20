import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation } from "react-router-dom";
import { LabDashboardSidebar } from "@/components/LabDashboardSidebar";
import { Clock, Sparkles } from "lucide-react";
const LABEL_MAP = {
    "/lab-dashboard/imaging": "Imagerie",
    "/lab-dashboard/patients": "Patients",
    "/lab-dashboard/appointments": "Rendez-vous",
    "/lab-dashboard/billing": "Facturation",
    "/lab-dashboard/messaging": "Messagerie",
    "/lab-dashboard/analytics": "Statistiques",
    "/lab-dashboard/settings": "Paramètres",
};
export default function LabComingSoonPage() {
    const { pathname } = useLocation();
    const featureName = LABEL_MAP[pathname] ?? "cette fonctionnalité";
    return (_jsxs("div", { className: "min-h-screen bg-background flex", children: [_jsx(LabDashboardSidebar, {}), _jsx("main", { className: "flex-1 flex items-center justify-center p-8", children: _jsxs("div", { className: "text-center max-w-md space-y-6", children: [_jsx("div", { className: "w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto", children: _jsx(Clock, { size: 36, className: "text-primary" }) }), _jsxs("div", { children: [_jsxs("div", { className: "inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4", children: [_jsx(Sparkles, { size: 12 }), "Bient\u00F4t disponible"] }), _jsx("h1", { className: "text-2xl font-bold text-foreground mb-2", children: featureName }), _jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: "Cette fonctionnalit\u00E9 est en cours de d\u00E9veloppement et sera disponible tr\u00E8s prochainement. Revenez bient\u00F4t !" })] })] }) })] }));
}
