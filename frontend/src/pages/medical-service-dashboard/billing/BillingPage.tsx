import { useState, useEffect } from "react";

const tok = () => localStorage.getItem("megacare_token") ?? "";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import { Plus, X, CheckCircle2, Clock, AlertCircle, CreditCard, TrendingUp, FileText, Banknote } from "lucide-react";

type InvStatus = "Payée" | "En attente" | "En retard";
type PayMethod = "Virement" | "Espèces" | "Carte" | "Assurance";

interface Invoice {
  id: string;
  ref: string;
  patient: string;
  amount: number;
  date: string;
  dueDate: string;
  status: InvStatus;
  services: string;
}

interface Payment {
  id: string;
  ref: string;
  patient: string;
  amount: number;
  date: string;
  method: PayMethod;
  invoice: string;
}



const invStatusConfig: Record<InvStatus, { color: string; bg: string; icon: typeof CheckCircle2 }> = {
  Payée: { color: "text-green-600", bg: "bg-green-100", icon: CheckCircle2 },
  "En attente": { color: "text-amber-600", bg: "bg-amber-100", icon: Clock },
  "En retard": { color: "text-red-600", bg: "bg-red-100", icon: AlertCircle },
};

const emptyForm = { patient: "", amount: "", date: "", dueDate: "", services: "", status: "En attente" as InvStatus };

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<"invoices" | "payments">("invoices");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);

  useEffect(() => {
    fetch("/api/medical-service/billing/invoices", { headers: { Authorization: `Bearer ${tok()}` } })
      .then(r => r.json()).then(d => setInvoices(Array.isArray(d) ? d : [])).catch(() => { });
    fetch("/api/medical-service/billing/payments", { headers: { Authorization: `Bearer ${tok()}` } })
      .then(r => r.json()).then(d => setPayments(Array.isArray(d) ? d : [])).catch(() => { });
  }, []);

  const totalRevenue = invoices.filter((i) => i.status === "Payée").reduce((s, i) => s + i.amount, 0);
  const pending = invoices.filter((i) => i.status === "En attente").reduce((s, i) => s + i.amount, 0);
  const overdue = invoices.filter((i) => i.status === "En retard").reduce((s, i) => s + i.amount, 0);

  const kpis = [
    { label: "Revenus encaissés", value: `${totalRevenue} DT`, icon: Banknote, color: "text-green-500", bg: "bg-green-50" },
    { label: "En attente", value: `${pending} DT`, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "En retard", value: `${overdue} DT`, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
    { label: "Total factures", value: invoices.length, icon: FileText, color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  async function saveInvoice() {
    if (!form.patient.trim() || !form.amount) return;
    const r = await fetch("/api/medical-service/billing/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    });
    const data = await r.json();
    setInvoices(prev => [...prev, data]);
    setShowModal(false);
    setForm(emptyForm);
  }

  return (
    <div className="flex min-h-screen bg-background">
      <MedicalServiceDashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Facturation</h1>
            <p className="text-xs text-muted-foreground">Gestion des factures et paiements</p>
          </div>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium">
            <Plus size={16} /> Créer une facture
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k) => {
              const Icon = k.icon; return (
                <div key={k.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${k.bg}`}><Icon size={20} className={k.color} /></div>
                  <div><p className="text-2xl font-bold text-foreground">{k.value}</p><p className="text-xs text-muted-foreground">{k.label}</p></div>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-muted/40 p-1 rounded-xl w-fit">
            {[{ key: "invoices" as const, label: "Factures", icon: FileText }, { key: "payments" as const, label: "Paiements", icon: CreditCard }].map((t) => {
              const Icon = t.icon;
              return (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === t.key ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  <Icon size={15} />{t.label}
                </button>
              );
            })}
          </div>

          {/* Invoices table */}
          {activeTab === "invoices" && (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Réf.", "Patient", "Montant", "Date", "Échéance", "Services", "Statut", "Actions"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-muted-foreground font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => {
                      const cfg = invStatusConfig[inv.status]; const StatusIcon = cfg.icon;
                      return (
                        <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition">
                          <td className="px-4 py-3 font-mono text-xs text-foreground">{inv.ref}</td>
                          <td className="px-4 py-3 font-medium text-foreground">{inv.patient}</td>
                          <td className="px-4 py-3 font-semibold text-foreground">{inv.amount} DT</td>
                          <td className="px-4 py-3 text-muted-foreground">{inv.date}</td>
                          <td className="px-4 py-3 text-muted-foreground">{inv.dueDate}</td>
                          <td className="px-4 py-3 text-muted-foreground max-w-[180px] truncate">{inv.services}</td>
                          <td className="px-4 py-3">
                            <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full w-fit ${cfg.bg} ${cfg.color}`}>
                              <StatusIcon size={11} />{inv.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => setDeleteTarget(inv)} className="p-1.5 rounded-lg hover:bg-red-50 transition text-muted-foreground hover:text-red-500">
                              <X size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payments table */}
          {activeTab === "payments" && (
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["Réf.", "Patient", "Montant", "Date", "Mode de paiement", "Facture liée"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-muted-foreground font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition">
                        <td className="px-4 py-3 font-mono text-xs text-foreground">{p.ref}</td>
                        <td className="px-4 py-3 font-medium text-foreground">{p.patient}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">{p.amount} DT</td>
                        <td className="px-4 py-3 text-muted-foreground">{p.date}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{p.method}</span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.invoice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Create invoice modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Nouvelle facture</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-muted transition"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Patient", key: "patient", type: "text", placeholder: "Nom du patient" },
                { label: "Montant (DT)", key: "amount", type: "number", placeholder: "Ex: 450" },
                { label: "Date de facturation", key: "date", type: "date", placeholder: "" },
                { label: "Date d'échéance", key: "dueDate", type: "date", placeholder: "" },
                { label: "Services rendus", key: "services", type: "text", placeholder: "Ex: Soins infirmiers x3" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={(form as Record<string, string>)[f.key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Statut</label>
                <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as InvStatus }))}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  {["Payée", "En attente", "En retard"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition">Annuler</button>
                <button onClick={saveInvoice} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition font-medium">Créer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border w-full max-w-sm shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><AlertCircle size={20} className="text-red-500" /></div>
              <div><p className="font-semibold text-foreground">Supprimer la facture</p><p className="text-xs text-muted-foreground">{deleteTarget.ref}</p></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition">Annuler</button>
              <button onClick={async () => { await fetch(`/api/medical-service/billing/invoices/${deleteTarget.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${tok()}` } }); setInvoices((p) => p.filter((i) => i.id !== deleteTarget.id)); setDeleteTarget(null); }} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition font-medium">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
