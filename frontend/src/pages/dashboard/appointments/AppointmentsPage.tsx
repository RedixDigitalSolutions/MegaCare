import { useState, useEffect, useCallback } from "react";
import React from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useNavigate, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Timer,
  ShoppingCart,
  FileText,
  X,
  ChevronRight,
} from "lucide-react";

interface Appointment {
  id: string;
  doctorId: string;
  doctorName?: string;
  date: string;
  time: string;
  reason: string;
  status: string;
}

interface Prescription {
  id: string;
  doctorId: string;
  patientId: string;
  medicines: { name: string; dosage?: string; duration?: string }[];
  secretCode: string;
  purchaseStatus: "pending" | "purchased";
  createdAt: string;
  notes?: string;
}

function useCountdown(targetDate: string, targetTime: string) {
  const [diff, setDiff] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      const target = new Date(`${targetDate}T${targetTime || "00:00"}`);
      const now = new Date();
      setDiff(target.getTime() - now.getTime());
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate, targetTime]);

  if (diff === null || diff <= 0) return null;

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

function CountdownBadge({ date, time }: { date: string; time: string }) {
  const countdown = useCountdown(date, time);

  if (!countdown) {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
        <Timer size={12} />
        Imminent
      </span>
    );
  }

  const parts: string[] = [];
  if (countdown.days > 0) parts.push(`${countdown.days}j`);
  if (countdown.hours > 0) parts.push(`${countdown.hours}h`);
  if (countdown.minutes > 0 || countdown.days === 0) parts.push(`${countdown.minutes}m`);
  if (countdown.days === 0 && countdown.hours === 0) parts.push(`${countdown.seconds}s`);

  return (
    <span className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
      <Timer size={12} />
      {parts.join(" ")}
    </span>
  );
}

function statusBadge(status: string) {
  const map: Record<string, { label: string; classes: string; icon: React.ReactElement }> = {
    confirmed: { label: "Confirmé", classes: "bg-green-50 text-green-700 border-green-200", icon: <CheckCircle2 size={13} /> },
    pending:   { label: "En attente", classes: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: <AlertCircle size={13} /> },
    completed: { label: "Terminé", classes: "bg-blue-50 text-blue-700 border-blue-200", icon: <CheckCircle2 size={13} /> },
    cancelled: { label: "Annulé", classes: "bg-red-50 text-red-700 border-red-200", icon: <XCircle size={13} /> },
    rejected:  { label: "Refusé", classes: "bg-red-50 text-red-700 border-red-200", icon: <XCircle size={13} /> },
  };
  const s = map[status] ?? { label: status, classes: "bg-secondary/50 text-foreground border-border", icon: <AlertCircle size={13} /> };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${s.classes}`}>
      {s.icon} {s.label}
    </span>
  );
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");
  const [qrPrescription, setQrPrescription] = useState<Prescription | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("megacare_token");

  const fetchData = useCallback(async () => {
    try {
      const [aptRes, rxRes] = await Promise.all([
        fetch("/api/appointments", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/prescriptions", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const aptData = await aptRes.json();
      const rxData = await rxRes.json();
      setAppointments(Array.isArray(aptData) ? aptData : aptData.data ?? []);
      const rxArray = Array.isArray(rxData) ? rxData : rxData.data ?? [];
      setPrescriptions(rxArray);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCancel = async (id: string) => {
    if (!confirm("Annuler ce rendez-vous ?")) return;
    await fetch(`/api/appointments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Safely parse a date string whether it's "YYYY-MM-DD" or a full ISO string.
  // Always parse as LOCAL midnight so the day is correct in every timezone.
  const parseApptDate = (d: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(d + "T00:00:00") : new Date(new Date(d).toLocaleDateString("fr-CA") + "T00:00:00");

  const upcoming = appointments.filter((a) => {
    if (["cancelled", "rejected", "completed"].includes(a.status)) return false;
    return parseApptDate(a.date) >= today;
  }).sort((a, b) => parseApptDate(a.date).getTime() - parseApptDate(b.date).getTime());

  const history = appointments.filter((a) => {
    if (["cancelled", "rejected"].includes(a.status)) return true;
    if (a.status === "completed") return true;
    return parseApptDate(a.date) < today;
  }).sort((a, b) => parseApptDate(b.date).getTime() - parseApptDate(a.date).getTime());

  const fmtDate = (d: string) =>
    parseApptDate(d).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  // Match prescriptions issued around the same day as a completed appointment
  const getPrescriptionsForApt = (apt: Appointment): Prescription[] => {
    const aptDate = parseApptDate(apt.date);
    return prescriptions.filter((rx) => {
      const rxDate = new Date(rx.createdAt);
      const diffDays = Math.abs(aptDate.getTime() - rxDate.getTime()) / (1000 * 3600 * 24);
      return rx.doctorId === apt.doctorId && diffDays <= 1;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col md:flex-row">
          <DashboardSidebar />
          <main className="flex-1 flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Mes Rendez-vous</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {upcoming.length} à venir · {history.length} passés
                </p>
              </div>
              <Link
                to="/doctors"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium"
              >
                <Calendar size={16} />
                Réserver en ligne
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border bg-card">
            <div className="flex px-6">
              <button
                onClick={() => setTab("upcoming")}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition ${
                  tab === "upcoming"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Prochains RDV
                {upcoming.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs font-bold bg-primary/10 text-primary rounded-full">
                    {upcoming.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setTab("history")}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition ${
                  tab === "history"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Historique
                {history.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs font-bold bg-secondary text-muted-foreground rounded-full">
                    {history.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="p-6 max-w-3xl mx-auto space-y-4">
            {/* ── Upcoming Tab ── */}
            {tab === "upcoming" && (
              <>
                {upcoming.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">Aucun rendez-vous à venir</p>
                    <p className="text-sm mt-1">Prenez rendez-vous avec un médecin</p>
                    <Link
                      to="/doctors"
                      className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition"
                    >
                      Trouver un médecin <ChevronRight size={16} />
                    </Link>
                  </div>
                ) : (
                  upcoming.map((apt) => (
                    <div key={apt.id} className="bg-card border border-border rounded-xl p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                            🩺
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">
                              {apt.doctorName || "Médecin"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{apt.reason}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          {statusBadge(apt.status)}
                          <CountdownBadge date={apt.date} time={apt.time} />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground bg-secondary/30 rounded-lg px-3 py-2">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} />
                          {fmtDate(apt.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} />
                          {apt.time}
                        </span>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleCancel(apt.id)}
                          className="px-3 py-1.5 text-xs font-medium text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/5 transition"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* ── History Tab ── */}
            {tab === "history" && (
              <>
                {history.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">Aucun historique</p>
                    <p className="text-sm mt-1">Vos consultations passées apparaîtront ici</p>
                  </div>
                ) : (
                  history.map((apt) => {
                    const aptPrescriptions = getPrescriptionsForApt(apt);
                    return (
                      <div key={apt.id} className="bg-card border border-border rounded-xl p-5 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center text-2xl flex-shrink-0">
                              🩺
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                {apt.doctorName || "Médecin"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">{apt.reason}</p>
                            </div>
                          </div>
                          {statusBadge(apt.status)}
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground bg-secondary/30 rounded-lg px-3 py-2">
                          <span className="flex items-center gap-1">
                            <Calendar size={13} />
                            {fmtDate(apt.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={13} />
                            {apt.time}
                          </span>
                        </div>

                        {/* Prescriptions issued for this appointment */}
                        {aptPrescriptions.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              Ordonnances associées
                            </p>
                            {aptPrescriptions.map((rx) => {
                              const created = new Date(rx.createdAt);
                              const expiry = new Date(created.getTime() + 7 * 24 * 3600000);
                              const isExpired = new Date() > expiry;
                              const isPurchased = rx.purchaseStatus === "purchased";
                              return (
                                <div key={rx.id} className="border border-border rounded-lg p-3 bg-secondary/10 flex items-center gap-3">
                                  <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                      <FileText size={14} className="text-primary" />
                                      <span className="text-xs font-medium text-foreground">
                                        {rx.medicines.map((m) => m.name).join(", ")}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                        isPurchased
                                          ? "bg-green-50 text-green-700"
                                          : isExpired
                                            ? "bg-red-50 text-red-700"
                                            : "bg-yellow-50 text-yellow-700"
                                      }`}>
                                        {isPurchased ? "✓ Achetée" : isExpired ? "Expirée" : "En attente"}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        Expire le {expiry.toLocaleDateString("fr-FR")}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setQrPrescription(rx)}
                                      className="px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition"
                                    >
                                      QR Code
                                    </button>
                                    {!isPurchased && !isExpired && (
                                      <Link
                                        to="/pharmacy"
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                                      >
                                        <ShoppingCart size={12} />
                                        Réserver
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* QR Modal */}
      {qrPrescription && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">QR Code Ordonnance</h3>
              <button
                onClick={() => setQrPrescription(null)}
                className="p-1.5 rounded-lg hover:bg-secondary/50 transition text-muted-foreground"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex justify-center p-4 bg-white rounded-xl">
              <QRCodeSVG
                value={JSON.stringify({
                  code: qrPrescription.secretCode,
                  id: qrPrescription.id,
                })}
                size={200}
              />
            </div>
            <div className="text-center space-y-1">
              <p className="font-mono text-sm font-bold text-foreground tracking-widest">
                {qrPrescription.secretCode}
              </p>
              <p className="text-xs text-muted-foreground">
                Présentez ce code en pharmacie
              </p>
            </div>
            <div className="space-y-1">
              {qrPrescription.medicines.map((m, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-foreground bg-secondary/30 rounded px-2 py-1">
                  <span className="font-medium">{m.name}</span>
                  {m.dosage && <span className="text-muted-foreground">— {m.dosage}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
