import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { X, Mail, Phone, Calendar, Stethoscope, Building2, FileText, MapPin, } from "lucide-react";
import { FaCheckCircle, FaTimesCircle, FaBan } from "react-icons/fa";
import { roleConfig, StatusBadge, getDisplayName, getRegDate, } from "./adminConfig";
export function UserDetailSlideOver({ user, onClose, onAction, actionLoading, }) {
    const cfg = roleConfig[user.role] ?? roleConfig.patient;
    const { Icon: RoleIcon, gradient, label } = cfg;
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm", onClick: onClose }), _jsxs("aside", { className: "fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border shrink-0", children: [_jsx("h2", { className: "font-bold text-foreground text-base", children: "Profil utilisateur" }), _jsx("button", { onClick: onClose, className: "p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-5 space-y-5", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`, children: _jsx(RoleIcon, { className: "text-white", size: 22 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-base font-bold text-foreground", children: getDisplayName(user) }), _jsx("p", { className: "text-xs text-muted-foreground", children: label }), _jsx("div", { className: "mt-1", children: _jsx(StatusBadge, { status: user.status }) })] })] }), _jsx("div", { className: "bg-muted/30 rounded-xl divide-y divide-border overflow-hidden", children: [
                                    { icon: _jsx(Mail, { size: 13 }), label: "Email", value: user.email },
                                    {
                                        icon: _jsx(Phone, { size: 13 }),
                                        label: "Téléphone",
                                        value: user.phone,
                                    },
                                    {
                                        icon: _jsx(Stethoscope, { size: 13 }),
                                        label: "Spécialisation",
                                        value: user.specialization,
                                    },
                                    {
                                        icon: _jsx(FileText, { size: 13 }),
                                        label: "N° de licence",
                                        value: user.doctorId,
                                    },
                                    {
                                        icon: _jsx(Building2, { size: 13 }),
                                        label: "Agrément pharmacie",
                                        value: user.pharmacyId,
                                    },
                                    {
                                        icon: _jsx(Building2, { size: 13 }),
                                        label: "Établissement",
                                        value: user.companyName,
                                    },
                                    {
                                        icon: _jsx(MapPin, { size: 13 }),
                                        label: "Adresse",
                                        value: user.address,
                                    },
                                    {
                                        icon: _jsx(Calendar, { size: 13 }),
                                        label: "Inscrit le",
                                        value: getRegDate(user),
                                    },
                                ]
                                    .filter((f) => f.value)
                                    .map((f) => (_jsxs("div", { className: "flex items-start gap-3 px-4 py-3", children: [_jsx("span", { className: "text-muted-foreground mt-0.5 shrink-0", children: f.icon }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-muted-foreground", children: f.label }), _jsx("p", { className: "text-sm text-foreground font-medium", children: f.value })] })] }, f.label))) }), user.role === "doctor" && (_jsxs("div", { className: "bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800", children: [_jsx("p", { className: "font-semibold mb-1", children: "Informations m\u00E9dicales" }), _jsxs("p", { children: ["Licence : ", user.doctorId ?? "Non renseignée"] }), user.specialization && _jsxs("p", { children: ["Sp\u00E9cialit\u00E9 : ", user.specialization] })] })), user.role === "pharmacy" && (_jsxs("div", { className: "bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800", children: [_jsx("p", { className: "font-semibold mb-1", children: "Informations pharmacie" }), _jsxs("p", { children: ["Agr\u00E9ment : ", user.pharmacyId ?? "Non renseigné"] }), user.address && _jsxs("p", { children: ["Adresse : ", user.address] })] })), (user.role === "medical_service" ||
                                user.role === "lab_radiology") && (_jsxs("div", { className: "bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-purple-800", children: [_jsx("p", { className: "font-semibold mb-1", children: "Informations \u00E9tablissement" }), user.companyName && _jsxs("p", { children: ["\u00C9tablissement : ", user.companyName] }), user.address && _jsxs("p", { children: ["Adresse : ", user.address] })] }))] }), _jsxs("div", { className: "px-5 py-4 border-t border-border shrink-0 flex flex-wrap gap-2", children: [user.status === "pending" && (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => onAction(user.id, "approve"), disabled: actionLoading === user.id + "approve", className: "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition disabled:opacity-50", children: [actionLoading === user.id + "approve" ? (_jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin block" })) : (_jsx(FaCheckCircle, { size: 13 })), "Approuver"] }), _jsxs("button", { onClick: () => onAction(user.id, "reject"), disabled: actionLoading === user.id + "reject", className: "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-destructive hover:opacity-90 text-white text-sm font-semibold transition disabled:opacity-50", children: [actionLoading === user.id + "reject" ? (_jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin block" })) : (_jsx(FaTimesCircle, { size: 13 })), "Refuser"] })] })), user.status === "approved" && (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => onAction(user.id, "suspend"), disabled: actionLoading === user.id + "suspend", className: "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition disabled:opacity-50", children: [_jsx(FaBan, { size: 13 }), "Suspendre"] }), _jsxs("button", { onClick: () => onAction(user.id, "reject"), disabled: actionLoading === user.id + "reject", className: "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/5 text-sm font-semibold transition disabled:opacity-50", children: [_jsx(FaTimesCircle, { size: 13 }), "R\u00E9voquer"] })] })), user.status === "suspended" && (_jsxs("button", { onClick: () => onAction(user.id, "reactivate"), disabled: actionLoading === user.id + "reactivate", className: "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-emerald-300 text-emerald-600 hover:bg-emerald-50 text-sm font-semibold transition disabled:opacity-50", children: [_jsx(FaCheckCircle, { size: 13 }), "R\u00E9activer"] })), user.status === "rejected" && (_jsxs("button", { onClick: () => onAction(user.id, "approve"), disabled: actionLoading === user.id + "approve", className: "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-emerald-300 text-emerald-600 hover:bg-emerald-50 text-sm font-semibold transition disabled:opacity-50", children: [_jsx(FaCheckCircle, { size: 13 }), "R\u00E9-approuver"] }))] })] })] }));
}
