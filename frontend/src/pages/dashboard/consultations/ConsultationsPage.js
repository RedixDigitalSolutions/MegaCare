import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { MessageSquare, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
export default function ConsultationsPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/login");
        }
    }, [isLoading, isAuthenticated, navigate]);
    useEffect(() => {
        if (!isAuthenticated || !user)
            return;
        const token = localStorage.getItem("megacare_token");
        if (!token)
            return;
        const headers = { Authorization: `Bearer ${token}` };
        fetch("/api/appointments", { headers })
            .then((r) => (r.ok ? r.json() : []))
            .then(async (appts) => {
            // Show completed appointments as past consultations
            const completed = appts.filter((a) => a.status === "completed");
            // Also include confirmed past appointments
            const now = new Date();
            const pastConfirmed = appts.filter((a) => {
                if (a.status === "completed")
                    return false;
                const d = new Date(`${a.date}T${a.time}`);
                return d < now && a.status === "confirmed";
            });
            const all = [...completed, ...pastConfirmed];
            // Resolve doctor names
            const doctorIds = [...new Set(all.map((a) => a.doctorId))];
            const names = {};
            await Promise.all(doctorIds.map((id) => fetch(`/api/users/${id}`, { headers })
                .then((r) => (r.ok ? r.json() : null))
                .then((u) => {
                if (u)
                    names[id] = {
                        name: `Dr. ${u.firstName} ${u.lastName}`,
                        specialty: u.specialization || "Médecine générale",
                    };
            })
                .catch(() => { })));
            setConsultations(all
                .sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() -
                new Date(`${a.date}T${a.time}`).getTime())
                .map((a) => ({
                id: a.id,
                doctor: names[a.doctorId]?.name || "Médecin",
                specialty: names[a.doctorId]?.specialty || "",
                date: new Date(a.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }),
                reason: a.reason || "Consultation",
                status: a.status,
            })));
        })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [isAuthenticated, user]);
    if (isLoading || !isAuthenticated || !user) {
        return null;
    }
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(DashboardSidebar, { userName: user.firstName }), _jsx("main", { className: "flex-1 overflow-auto", children: _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Mes consultations" }), _jsx("p", { className: "text-muted-foreground mt-2", children: "Historique de vos consultations m\u00E9dicales" })] }), _jsx("div", { className: "space-y-4", children: loading ? (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx(Loader2, { className: "w-8 h-8 animate-spin text-primary" }) })) : consultations.length === 0 ? (_jsxs("div", { className: "text-center py-12 text-muted-foreground", children: [_jsx("p", { className: "text-lg font-medium", children: "Aucune consultation pass\u00E9e" }), _jsx("p", { className: "text-sm mt-1", children: "Vos consultations compl\u00E9t\u00E9es appara\u00EEtront ici" })] })) : (consultations.map((cons) => (_jsx("div", { className: "bg-card border border-border rounded-lg p-6", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-foreground", children: cons.doctor }), _jsx("p", { className: "text-sm text-muted-foreground", children: cons.specialty })] }), _jsx("span", { className: "px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium", children: cons.date })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-muted-foreground mb-1", children: "Motif" }), _jsx("p", { className: "text-foreground", children: cons.reason })] }), _jsx("div", { className: "flex gap-2 flex-wrap", children: _jsxs("button", { className: "px-4 py-2 border border-border hover:bg-muted rounded-lg transition flex items-center gap-2", children: [_jsx(MessageSquare, { size: 18 }), "Contacter le m\u00E9decin"] }) })] }) }, cons.id)))) })] }) })] }) }));
}
