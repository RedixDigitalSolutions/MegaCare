import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import { TrendingUp, TrendingDown, DollarSign, Video, MapPin, CheckCircle, Clock, } from "lucide-react";
const CONSULTATION_FEE = 80;
const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
function getPeriodRange(p, today) {
    const start = new Date(today);
    const end = new Date(today);
    if (p === "Ce mois") {
        start.setDate(1);
        end.setMonth(end.getMonth() + 1, 0);
    }
    else if (p === "3 mois") {
        start.setMonth(start.getMonth() - 2, 1);
        end.setMonth(end.getMonth() + 1, 0);
    }
    else if (p === "6 mois") {
        start.setMonth(start.getMonth() - 5, 1);
        end.setMonth(end.getMonth() + 1, 0);
    }
    else {
        start.setMonth(0, 1);
        end.setMonth(11, 31);
    }
    return { start, end };
}
function getPrevPeriodRange(p, today) {
    const months = p === "Ce mois" ? 1 : p === "3 mois" ? 3 : p === "6 mois" ? 6 : 12;
    const end = new Date(today.getFullYear(), today.getMonth() - (p === "Cette année" ? 12 : 0), 0);
    const start = new Date(end.getFullYear(), end.getMonth() - months + 1, 1);
    return { start, end };
}
function inRange(dateStr, range) {
    const d = new Date(dateStr);
    return d >= range.start && d <= range.end;
}
export default function DoctorRevenuePage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [period, setPeriod] = useState("Ce mois");
    const [appointments, setAppointments] = useState([]);
    const [patientNames, setPatientNames] = useState({});
    const [dataLoading, setDataLoading] = useState(true);
    const fetchAppointments = useCallback(async () => {
        const token = localStorage.getItem("megacare_token");
        if (!token) {
            setDataLoading(false);
            return;
        }
        setDataLoading(true);
        try {
            const res = await fetch("/api/appointments", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                const active = data.filter((a) => a.status !== "rejected" && a.status !== "cancelled");
                setAppointments(active);
                // Resolve patient names
                const uniqueIds = [
                    ...new Set(active.map((a) => a.patientId)),
                ];
                const names = {};
                await Promise.all(uniqueIds.map((id) => fetch(`/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                    .then((r) => (r.ok ? r.json() : null))
                    .then((u) => {
                    if (u)
                        names[id] =
                            `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
                                u.email;
                })
                    .catch(() => { })));
                setPatientNames(names);
            }
        }
        catch {
            /* ignore */
        }
        setDataLoading(false);
    }, []);
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !user || user.role !== "doctor")) {
            navigate("/login");
        }
    }, [isLoading, isAuthenticated, user, navigate]);
    useEffect(() => {
        if (!isLoading && isAuthenticated && user?.role === "doctor") {
            fetchAppointments();
        }
    }, [isLoading, isAuthenticated, user, fetchAppointments]);
    const d = useMemo(() => {
        const today = new Date();
        const range = getPeriodRange(period, today);
        const prevRange = getPrevPeriodRange(period, today);
        const periodAppts = appointments.filter((a) => inRange(a.date, range));
        const prevAppts = appointments.filter((a) => inRange(a.date, prevRange));
        const revenue = periodAppts.length * CONSULTATION_FEE;
        const prevRevenue = prevAppts.length * CONSULTATION_FEE;
        const consultations = periodAppts.length;
        const avgRevenue = consultations > 0 ? CONSULTATION_FEE : 0;
        const growth = prevRevenue > 0
            ? Math.round(((revenue - prevRevenue) / prevRevenue) * 100)
            : consultations > 0
                ? 100
                : 0;
        // All consultations are video (telemedicine platform)
        const video = consultations;
        const cabinet = 0;
        // Chart bars
        const chartBars = [];
        if (period === "Ce mois") {
            const dayMap = {};
            for (const a of periodAppts) {
                const d = new Date(a.date);
                const idx = (d.getDay() + 6) % 7;
                const label = WEEKDAYS[idx];
                dayMap[label] = (dayMap[label] || 0) + CONSULTATION_FEE;
            }
            WEEKDAYS.forEach((label) => chartBars.push({ label, value: dayMap[label] || 0 }));
        }
        else {
            const numMonths = period === "3 mois" ? 3 : period === "6 mois" ? 6 : 12;
            for (let i = numMonths - 1; i >= 0; i--) {
                const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const key = d.toISOString().slice(0, 7);
                const label = d.toLocaleDateString("fr-FR", { month: "short" });
                const value = appointments.filter((a) => a.date.startsWith(key) &&
                    a.status !== "rejected" &&
                    a.status !== "cancelled").length * CONSULTATION_FEE;
                chartBars.push({ label, value });
            }
            // Pad to 7 bars
            while (chartBars.length < 7)
                chartBars.push({ label: "", value: 0 });
            if (chartBars.length > 7)
                chartBars.splice(7);
        }
        // Transactions
        const transactions = periodAppts.slice(0, 10).map((a) => ({
            id: String(a.id),
            patient: patientNames[a.patientId] || a.patientName || "Patient",
            date: a.date,
            amount: CONSULTATION_FEE,
            type: "Vidéo",
            status: a.status === "completed"
                ? "Payée"
                : "En attente",
        }));
        return {
            revenue,
            consultations,
            avgRevenue,
            growth,
            video,
            cabinet,
            chartBars,
            transactions,
        };
    }, [appointments, patientNames, period]);
    if (isLoading || !isAuthenticated || !user || user.role !== "doctor")
        return null;
    const videoPct = Math.round((d.video / Math.max(d.consultations, 1)) * 100);
    const cabinetPct = 100 - videoPct;
    const maxBar = Math.max(...d.chartBars.map((b) => b.value), 1);
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(DoctorDashboardSidebar, { doctorName: user.firstName || "Amira Mansouri" }), _jsxs("main", { className: "flex-1 overflow-auto", children: [_jsxs("div", { className: "bg-card border-b border-border p-6 sticky top-0 z-10", children: [_jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Revenus" }), _jsx("p", { className: "text-muted-foreground mt-1", children: "Suivi financier de votre activit\u00E9" })] }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsx("div", { className: "flex gap-2 flex-wrap", children: ["Ce mois", "3 mois", "6 mois", "Cette année"].map((p) => (_jsx("button", { onClick: () => setPeriod(p), className: `px-4 py-1.5 rounded-full text-sm font-medium transition ${period === p
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground hover:bg-muted/70"}`, children: p }, p))) }), _jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("p", { className: "text-sm text-muted-foreground", children: ["Revenus (", period, ")"] }), _jsx(DollarSign, { size: 18, className: "text-primary/60" })] }), _jsxs("p", { className: "text-2xl font-bold text-foreground", children: [d.revenue.toLocaleString(), " DT"] }), _jsxs("p", { className: "text-xs text-green-600 flex items-center gap-0.5 mt-1", children: [_jsx(TrendingUp, { size: 11 }), " +", d.growth, "% vs p\u00E9riode pr\u00E9c."] })] }), _jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Consultations" }), _jsx(CheckCircle, { size: 18, className: "text-blue-400" })] }), _jsx("p", { className: "text-2xl font-bold text-foreground", children: d.consultations }), _jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [d.video, " vid\u00E9o \u00B7 ", d.cabinet, " cabinet"] })] }), _jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Moy. / consultation" }), _jsx(TrendingUp, { size: 18, className: "text-green-500" })] }), _jsxs("p", { className: "text-2xl font-bold text-foreground", children: [d.avgRevenue, " DT"] }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Tarif moyen pond\u00E9r\u00E9" })] }), _jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Croissance" }), d.growth >= 0 ? (_jsx(TrendingUp, { size: 18, className: "text-green-500" })) : (_jsx(TrendingDown, { size: 18, className: "text-red-500" }))] }), _jsxs("p", { className: `text-2xl font-bold ${d.growth >= 0 ? "text-green-600" : "text-red-600"}`, children: [d.growth >= 0 ? "+" : "", d.growth, "%"] }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Vs p\u00E9riode pr\u00E9c\u00E9dente" })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [_jsxs("div", { className: "lg:col-span-2 bg-card border border-border rounded-xl p-5", children: [_jsx("h3", { className: "font-semibold text-foreground mb-4", children: "\u00C9volution des revenus (DT)" }), _jsx("div", { className: "flex items-end gap-2 h-36", children: d.chartBars.map((bar, i) => (_jsxs("div", { className: "flex-1 flex flex-col items-center gap-1", children: [bar.value > 0 ? (_jsx("span", { className: "text-xs text-muted-foreground", children: bar.value })) : (_jsx("span", { className: "text-xs text-transparent", children: "0" })), _jsx("div", { className: `w-full rounded-t-md transition-all ${bar.value > 0 ? "bg-primary/80" : "bg-muted/30"}`, style: {
                                                                    height: `${Math.round((bar.value / maxBar) * 96)}px`,
                                                                    minHeight: bar.value > 0 ? "4px" : "0",
                                                                } }), _jsx("span", { className: "text-xs text-muted-foreground", children: bar.label })] }, i))) })] }), _jsxs("div", { className: "bg-card border border-border rounded-xl p-5 flex flex-col justify-between", children: [_jsx("h3", { className: "font-semibold text-foreground mb-4", children: "R\u00E9partition" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-sm mb-1", children: [_jsxs("span", { className: "flex items-center gap-1.5 text-foreground", children: [_jsx(Video, { size: 14, className: "text-blue-500" }), "Vid\u00E9o"] }), _jsxs("span", { className: "font-medium text-foreground", children: [d.video, " (", videoPct, "%)"] })] }), _jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-blue-500 rounded-full", style: { width: `${videoPct}%` } }) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex justify-between text-sm mb-1", children: [_jsxs("span", { className: "flex items-center gap-1.5 text-foreground", children: [_jsx(MapPin, { size: 14, className: "text-green-500" }), "Cabinet"] }), _jsxs("span", { className: "font-medium text-foreground", children: [d.cabinet, " (", cabinetPct, "%)"] })] }), _jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-green-500 rounded-full", style: { width: `${cabinetPct}%` } }) })] })] }), _jsxs("div", { className: "mt-4 bg-muted/30 rounded-xl p-3", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Revenu Vid\u00E9o estim\u00E9" }), _jsxs("p", { className: "text-lg font-bold text-blue-600", children: [Math.round(d.video * 80), " DT"] }), _jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Revenu Cabinet estim\u00E9" }), _jsxs("p", { className: "text-lg font-bold text-green-600", children: [Math.round(d.cabinet * 100), " DT"] })] })] })] }), _jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden", children: [_jsx("div", { className: "p-5 border-b border-border", children: _jsx("h3", { className: "font-semibold text-foreground", children: "Transactions r\u00E9centes" }) }), _jsx("div", { className: "divide-y divide-border", children: d.transactions.map((tx) => (_jsxs("div", { className: "flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: `p-2 rounded-xl ${tx.type === "Vidéo"
                                                                    ? "bg-blue-50 text-blue-600"
                                                                    : "bg-green-50 text-green-600"}`, children: tx.type === "Vidéo" ? (_jsx(Video, { size: 16 })) : (_jsx(MapPin, { size: 16 })) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-foreground text-sm", children: tx.patient }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [tx.type, " \u00B7 ", tx.date] })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { className: `flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tx.status === "Payée"
                                                                    ? "bg-green-100 text-green-700"
                                                                    : "bg-amber-100 text-amber-700"}`, children: [tx.status === "Payée" ? (_jsx(CheckCircle, { size: 11 })) : (_jsx(Clock, { size: 11 })), tx.status] }), _jsxs("span", { className: "font-bold text-foreground text-sm min-w-[60px] text-right", children: [tx.amount, " DT"] })] })] }, tx.id))) })] })] })] })] }) }));
}
