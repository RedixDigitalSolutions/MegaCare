import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import { Star, ThumbsUp, Video, MapPin } from "lucide-react";
function StarRow({ rating, max = 5, size = 16, }) {
    return (_jsx("span", { className: "flex items-center gap-0.5", children: Array.from({ length: max }).map((_, i) => (_jsx(Star, { size: size, className: i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted-foreground/30" }, i))) }));
}
export default function DoctorReviewsPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [helpfulCounts, setHelpfulCounts] = useState({});
    const [voted, setVoted] = useState(new Set());
    const [filterRating, setFilterRating] = useState(null);
    const fetchReviews = useCallback(async () => {
        const token = localStorage.getItem("megacare_token");
        if (!token) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/reviews", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                const mapped = data.map((r) => ({
                    id: String(r.id || r._id),
                    patientId: r.patientId || "",
                    patientName: r.patientName || "Patient",
                    rating: r.rating,
                    text: r.text,
                    type: r.type === "Cabinet" ? "Cabinet" : "Vidéo",
                    helpful: r.helpful ?? 0,
                    createdAt: r.createdAt || new Date().toISOString(),
                }));
                setReviews(mapped);
                setHelpfulCounts(Object.fromEntries(mapped.map((r) => [r.id, r.helpful])));
            }
        }
        catch { /* ignore */ }
        setLoading(false);
    }, []);
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !user || user.role !== "doctor")) {
            navigate("/login");
        }
    }, [isLoading, isAuthenticated, user, navigate]);
    useEffect(() => {
        if (!isLoading && isAuthenticated && user?.role === "doctor") {
            fetchReviews();
        }
    }, [isLoading, isAuthenticated, user, fetchReviews]);
    if (isLoading || !isAuthenticated || !user || user.role !== "doctor")
        return null;
    const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";
    const countByRating = (n) => reviews.filter((r) => r.rating === n).length;
    const filtered = filterRating
        ? reviews.filter((r) => r.rating === filterRating)
        : reviews;
    const handleHelpful = async (id) => {
        if (voted.has(id))
            return;
        setHelpfulCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
        setVoted((prev) => new Set(prev).add(id));
        const token = localStorage.getItem("megacare_token");
        try {
            await fetch(`/api/reviews/${id}/helpful`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });
        }
        catch { /* ignore */ }
    };
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(DoctorDashboardSidebar, { doctorName: user.firstName || "Amira Mansouri" }), _jsxs("main", { className: "flex-1 overflow-auto", children: [_jsx("div", { className: "bg-card border-b border-border p-6 sticky top-0 z-10", children: _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Avis Patients" }), _jsx("p", { className: "text-muted-foreground mt-1", children: loading ? "Chargement…" : `${reviews.length} avis reçus` })] }), _jsxs("div", { className: "flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-3", children: [_jsx("span", { className: "text-3xl font-bold text-yellow-600", children: avgRating }), _jsxs("div", { children: [_jsx(StarRow, { rating: Math.round(Number(avgRating)), size: 18 }), _jsx("p", { className: "text-xs text-yellow-700 mt-0.5", children: "Note moyenne" })] })] })] }) }), _jsxs("div", { className: "p-6 space-y-5", children: [_jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [_jsx("h3", { className: "font-semibold text-foreground mb-4", children: "R\u00E9partition des notes" }), _jsx("div", { className: "space-y-2", children: [5, 4, 3, 2, 1].map((n) => {
                                                const count = countByRating(n);
                                                const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                                                const isActive = filterRating === n;
                                                return (_jsxs("button", { onClick: () => setFilterRating(isActive ? null : n), className: `w-full flex items-center gap-3 group rounded-lg px-2 py-1 transition ${isActive ? "bg-yellow-50" : "hover:bg-muted/40"}`, children: [_jsxs("span", { className: "flex items-center gap-1 text-sm text-muted-foreground w-12 shrink-0", children: [n, _jsx(Star, { size: 12, className: "fill-yellow-400 text-yellow-400" })] }), _jsx("div", { className: "flex-1 h-2 bg-muted rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-yellow-400 rounded-full transition-all", style: { width: `${pct}%` } }) }), _jsx("span", { className: "text-xs text-muted-foreground w-6 text-right", children: count })] }, n));
                                            }) }), filterRating && (_jsx("button", { onClick: () => setFilterRating(null), className: "mt-3 text-xs text-primary hover:underline", children: "Voir tous les avis" }))] }), _jsx("div", { className: "space-y-4", children: loading ? ([0, 1, 2].map((i) => (_jsx("div", { className: "bg-card border border-border rounded-xl p-5 animate-pulse h-32" }, i)))) : filtered.length === 0 ? (_jsx("p", { className: "text-center py-12 text-muted-foreground", children: "Aucun avis pour cette note." })) : (filtered.map((review) => {
                                        const hasVoted = voted.has(review.id);
                                        return (_jsxs("div", { className: "bg-card border border-border rounded-xl p-5 hover:shadow-md transition", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold text-primary text-sm shrink-0", children: review.patientName
                                                                        .split(" ")
                                                                        .map((w) => w[0])
                                                                        .join("")
                                                                        .toUpperCase() }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground leading-tight", children: review.patientName }), _jsx("p", { className: "text-xs text-muted-foreground", children: new Date(review.createdAt).toLocaleDateString("fr-FR") })] })] }), _jsxs("div", { className: "flex flex-col items-end gap-1.5", children: [_jsx(StarRow, { rating: review.rating, size: 15 }), _jsxs("span", { className: `flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${review.type === "Vidéo"
                                                                        ? "bg-blue-50 text-blue-600"
                                                                        : "bg-green-50 text-green-600"}`, children: [review.type === "Vidéo" ? (_jsx(Video, { size: 10 })) : (_jsx(MapPin, { size: 10 })), review.type] })] })] }), _jsx("p", { className: "text-sm text-muted-foreground leading-relaxed mb-4", children: review.text }), _jsxs("div", { className: "flex items-center justify-between border-t border-border pt-3", children: [_jsxs("button", { onClick: () => handleHelpful(review.id), disabled: hasVoted, className: `flex items-center gap-1.5 text-sm font-medium transition rounded-lg px-3 py-1.5 ${hasVoted
                                                                ? "text-primary bg-primary/10 cursor-default"
                                                                : "text-muted-foreground hover:text-primary hover:bg-primary/5"}`, children: [_jsx(ThumbsUp, { size: 14, className: hasVoted ? "fill-primary text-primary" : "" }), "Utile", _jsx("span", { className: `text-xs rounded-full px-1.5 py-0.5 ${hasVoted
                                                                        ? "bg-primary/20 text-primary font-bold"
                                                                        : "bg-muted text-muted-foreground"}`, children: helpfulCounts[review.id] })] }), hasVoted && (_jsx("span", { className: "text-xs text-primary", children: "Marqu\u00E9 utile \u2713" }))] })] }, review.id));
                                    })) })] })] })] }) }));
}
