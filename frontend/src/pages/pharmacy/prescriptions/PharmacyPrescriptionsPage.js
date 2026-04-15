import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Upload, FileText, Check, Clock, AlertCircle, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
export default function PrescriptionsPage() {
    const { isAuthenticated } = useAuth();
    const token = localStorage.getItem('megacare_token');
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        fetch('/api/prescriptions', { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.ok ? r.json() : [])
            .then(async (data) => {
            const t = localStorage.getItem('megacare_token');
            const resolved = await Promise.all(data.map(async (rx) => {
                let doctorName = 'Médecin inconnu';
                let specialty = '';
                try {
                    const u = await fetch(`/api/users/${rx.doctorId}`, {
                        headers: { Authorization: `Bearer ${t}` },
                    });
                    if (u.ok) {
                        const ud = await u.json();
                        doctorName = `Dr. ${ud.firstName ?? ''} ${ud.lastName ?? ''}`.trim();
                        specialty = ud.specialization ?? ud.specialty ?? '';
                    }
                }
                catch { /* ignore */ }
                const issued = new Date(rx.createdAt);
                const expiry = new Date(issued);
                expiry.setMonth(expiry.getMonth() + 3);
                return {
                    id: rx._id,
                    date: issued.toISOString(),
                    doctor: doctorName,
                    specialty,
                    medicines: (rx.medicines ?? []).map((m) => m.name ?? String(m)),
                    status: 'validée',
                    issuedDate: issued.toISOString(),
                    expiryDate: expiry.toISOString(),
                    scanned: false,
                };
            }));
            setPrescriptions(resolved);
        })
            .catch(() => { })
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);
    const getStatusBadge = (status) => {
        switch (status) {
            case 'validée':
                return _jsxs("div", { className: "flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm", children: [_jsx(Check, { size: 14 }), " Valid\u00E9e"] });
            case 'en_attente':
                return _jsxs("div", { className: "flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm", children: [_jsx(Clock, { size: 14 }), " En attente"] });
            case 'rejetée':
                return _jsxs("div", { className: "flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm", children: [_jsx(AlertCircle, { size: 14 }), " Rejet\u00E9e"] });
            default:
                return null;
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsx("main", { className: "min-h-screen bg-background pt-24", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-12", children: [_jsxs("div", { className: "space-y-6 mb-12", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-4xl font-bold text-foreground", children: "Mes Ordonnances" }), _jsx("p", { className: "text-muted-foreground mt-2", children: "G\u00E9rez vos ordonnances m\u00E9dicales et validez-les aupr\u00E8s d'une pharmacie" })] }), _jsxs("div", { className: "bg-gradient-to-r from-primary/10 to-blue-500/10 border-2 border-dashed border-primary rounded-lg p-8 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Upload, { className: "text-primary", size: 24 }), _jsxs("div", { children: [_jsx("h2", { className: "font-bold text-foreground", children: "Ajouter une ordonnance" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "T\u00E9l\u00E9chargez une photo ou un PDF de votre ordonnance" })] })] }), _jsx("button", { onClick: () => setShowUploadModal(true), className: "bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition", children: "T\u00E9l\u00E9charger une ordonnance" })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-bold text-foreground", children: "Historique" }), !isAuthenticated ? (_jsxs("div", { className: "bg-card border border-border rounded-lg p-12 text-center space-y-4", children: [_jsx(AlertCircle, { size: 48, className: "mx-auto text-muted-foreground opacity-50" }), _jsx("p", { className: "text-muted-foreground", children: "Connectez-vous pour voir vos ordonnances" })] })) : loading ? (_jsx("div", { className: "space-y-4", children: [1, 2].map((i) => (_jsx("div", { className: "bg-card border border-border rounded-lg p-6 animate-pulse h-40" }, i))) })) : prescriptions.length === 0 ? (_jsxs("div", { className: "bg-card border border-border rounded-lg p-12 text-center space-y-4", children: [_jsx(FileText, { size: 48, className: "mx-auto text-muted-foreground opacity-50" }), _jsx("p", { className: "text-muted-foreground", children: "Aucune ordonnance pour le moment" })] })) : (_jsx("div", { className: "space-y-4", children: prescriptions.map((rx) => (_jsxs("div", { className: "bg-card border border-border rounded-lg p-6 space-y-4 hover:shadow-lg transition", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("h3", { className: "font-bold text-foreground", children: rx.doctor }), _jsx("p", { className: "text-sm text-muted-foreground", children: rx.specialty })] }), getStatusBadge(rx.status)] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "\u00C9mise le" }), _jsx("p", { className: "font-semibold text-foreground", children: new Date(rx.issuedDate).toLocaleDateString('fr-FR') })] }), _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Valide jusqu'au" }), _jsx("p", { className: "font-semibold text-foreground", children: new Date(rx.expiryDate).toLocaleDateString('fr-FR') })] }), _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "M\u00E9dicaments" }), _jsx("p", { className: "font-semibold text-foreground", children: rx.medicines.length })] }), _jsxs("div", { children: [_jsx("p", { className: "text-muted-foreground", children: "Statut scan" }), _jsx("p", { className: "font-semibold text-foreground", children: rx.scanned ? '✓ Scanné' : 'Non scanné' })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: "M\u00E9dicaments:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: rx.medicines.map((med, idx) => (_jsx("span", { className: "bg-secondary text-foreground text-xs px-3 py-1 rounded-full", children: med }, idx))) })] }), _jsxs("div", { className: "flex gap-3 pt-4 border-t border-border", children: [rx.status === 'validée' && (_jsxs(_Fragment, { children: [_jsx("button", { className: "flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition", children: "Commander ces m\u00E9dicaments" }), _jsx("button", { className: "p-2 bg-secondary rounded-lg hover:bg-secondary/80 transition", children: _jsx(Download, { size: 18, className: "text-foreground" }) })] })), rx.status === 'en_attente' && (_jsx("button", { className: "flex-1 bg-secondary text-foreground py-2 rounded-lg font-semibold hover:bg-secondary/80 transition", children: "En attente de validation" }))] })] }, rx.id))) }))] })] }) }), showUploadModal && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50", children: _jsxs("div", { className: "bg-background rounded-lg p-6 space-y-4 max-w-md w-full", children: [_jsx("h2", { className: "text-2xl font-bold text-foreground", children: "T\u00E9l\u00E9charger une ordonnance" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("button", { className: "w-full border-2 border-dashed border-primary rounded-lg p-8 space-y-2 hover:bg-primary/5 transition", children: [_jsx(Upload, { className: "mx-auto text-primary", size: 32 }), _jsx("p", { className: "font-semibold text-foreground", children: "Cliquez ou glissez une image/PDF" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "JPG, PNG, PDF jusqu'\u00E0 10 MB" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold text-foreground", children: "Ou scanner avec IA" }), _jsx("button", { className: "w-full bg-secondary text-foreground py-2 rounded-lg hover:bg-secondary/80 transition font-semibold", children: "Scanner l'ordonnance" })] })] }), _jsx("button", { onClick: () => setShowUploadModal(false), className: "w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition", children: "Fermer" })] }) })), _jsx(Footer, {})] }));
}
