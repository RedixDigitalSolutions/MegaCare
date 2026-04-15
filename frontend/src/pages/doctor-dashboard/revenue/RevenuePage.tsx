import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Video,
  MapPin,
  CheckCircle,
  Clock,
} from "lucide-react";

type Period = "Ce mois" | "3 mois" | "6 mois" | "Cette année";

interface AppointmentData {
  id: string;
  patientId: string;
  patientName?: string;
  date: string;
  time: string;
  status: string;
  fee?: number;
}

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function getPeriodRange(p: Period, today: Date): { start: Date; end: Date } {
  const start = new Date(today);
  const end = new Date(today);
  if (p === "Ce mois") {
    start.setDate(1);
    end.setMonth(end.getMonth() + 1, 0);
  } else if (p === "3 mois") {
    start.setMonth(start.getMonth() - 2, 1);
    end.setMonth(end.getMonth() + 1, 0);
  } else if (p === "6 mois") {
    start.setMonth(start.getMonth() - 5, 1);
    end.setMonth(end.getMonth() + 1, 0);
  } else {
    start.setMonth(0, 1);
    end.setMonth(11, 31);
  }
  return { start, end };
}

function getPrevPeriodRange(p: Period, today: Date): { start: Date; end: Date } {
  const months = p === "Ce mois" ? 1 : p === "3 mois" ? 3 : p === "6 mois" ? 6 : 12;
  const end = new Date(today.getFullYear(), today.getMonth() - (p === "Cette année" ? 12 : 0), 0);
  const start = new Date(end.getFullYear(), end.getMonth() - months + 1, 1);
  return { start, end };
}

function inRange(dateStr: string, range: { start: Date; end: Date }): boolean {
  const d = new Date(dateStr);
  return d >= range.start && d <= range.end;
}

export default function DoctorRevenuePage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>("Ce mois");
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);
  const [patientNames, setPatientNames] = useState<Record<string, string>>({});
  const [dataLoading, setDataLoading] = useState(true);

  const fetchAppointments = useCallback(async () => {
    const token = localStorage.getItem("megacare_token");
    if (!token) { setDataLoading(false); return; }
    setDataLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        const data = Array.isArray(json) ? json : (json.data ?? []);
        const active = data.filter(
          (a: AppointmentData) =>
            a.status !== "rejected" && a.status !== "cancelled",
        );
        setAppointments(active);
        // Resolve patient names
        const uniqueIds = [
          ...new Set(active.map((a: AppointmentData) => a.patientId)),
        ] as string[];
        const names: Record<string, string> = {};
        await Promise.all(
          uniqueIds.map((id) =>
            fetch(`/api/users/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
              .then((r) => (r.ok ? r.json() : null))
              .then((u) => {
                if (u)
                  names[id] =
                    `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
                    u.email;
              })
              .catch(() => { }),
          ),
        );
        setPatientNames(names);
      }
    } catch {
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

    const revenue = periodAppts.reduce((sum, a) => sum + (a.fee ?? 80), 0);
    const prevRevenue = prevAppts.reduce((sum, a) => sum + (a.fee ?? 80), 0);
    const consultations = periodAppts.length;
    const avgRevenue = consultations > 0 ? Math.round(revenue / consultations) : 0;
    const growth =
      prevRevenue > 0
        ? Math.round(((revenue - prevRevenue) / prevRevenue) * 100)
        : consultations > 0
          ? 100
          : 0;

    // All consultations are video (telemedicine platform)
    const video = consultations;
    const cabinet = 0;

    // Chart bars
    const chartBars: { label: string; value: number }[] = [];
    if (period === "Ce mois") {
      const dayMap: Record<string, number> = {};
      for (const a of periodAppts) {
        const d = new Date(a.date);
        const idx = (d.getDay() + 6) % 7;
        const label = WEEKDAYS[idx];
        dayMap[label] = (dayMap[label] || 0) + (a.fee ?? 80);
      }
      WEEKDAYS.forEach((label) =>
        chartBars.push({ label, value: dayMap[label] || 0 }),
      );
    } else {
      const numMonths =
        period === "3 mois" ? 3 : period === "6 mois" ? 6 : 12;
      for (let i = numMonths - 1; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const key = d.toISOString().slice(0, 7);
        const label = d.toLocaleDateString("fr-FR", { month: "short" });
        const value = appointments
          .filter(
            (a) =>
              a.date.startsWith(key) &&
              a.status !== "rejected" &&
              a.status !== "cancelled",
          )
          .reduce((sum, a) => sum + (a.fee ?? 80), 0);
        chartBars.push({ label, value });
      }
      // Pad to 7 bars
      while (chartBars.length < 7) chartBars.push({ label: "", value: 0 });
      if (chartBars.length > 7) chartBars.splice(7);
    }

    // Transactions
    const transactions = periodAppts.slice(0, 10).map((a) => ({
      id: String(a.id),
      patient:
        patientNames[a.patientId] || a.patientName || "Patient",
      date: a.date,
      amount: a.fee ?? 80,
      type: "Vidéo" as const,
      status:
        a.status === "completed"
          ? ("Payée" as const)
          : ("En attente" as const),
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



  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar
          doctorName={user.firstName || "Amira Mansouri"}
        />

        <main className="flex-1 overflow-auto">
          {/* Sticky Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <h1 className="text-3xl font-bold text-foreground">Revenus</h1>
            <p className="text-muted-foreground mt-1">
              Suivi financier de votre activité
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Period Selector */}
            <div className="flex gap-2 flex-wrap">
              {(["Ce mois", "3 mois", "6 mois", "Cette année"] as Period[]).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${period === p
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                      }`}
                  >
                    {p}
                  </button>
                ),
              )}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">
                    Revenus ({period})
                  </p>
                  <DollarSign size={18} className="text-primary/60" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {d.revenue.toLocaleString()} DT
                </p>
                <p className="text-xs text-green-600 flex items-center gap-0.5 mt-1">
                  <TrendingUp size={11} /> +{d.growth}% vs période préc.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Consultations</p>
                  <CheckCircle size={18} className="text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {d.consultations}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {d.video} vidéo · {d.cabinet} cabinet
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">
                    Moy. / consultation
                  </p>
                  <TrendingUp size={18} className="text-green-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {d.avgRevenue} DT
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Tarif moyen pondéré
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Croissance</p>
                  {d.growth >= 0 ? (
                    <TrendingUp size={18} className="text-green-500" />
                  ) : (
                    <TrendingDown size={18} className="text-red-500" />
                  )}
                </div>
                <p
                  className={`text-2xl font-bold ${d.growth >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {d.growth >= 0 ? "+" : ""}
                  {d.growth}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Vs période précédente
                </p>
              </div>
            </div>

            {/* Chart + Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Bar Chart */}
              <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-4">
                  Évolution des revenus (DT)
                </h3>
                <div className="flex items-end gap-2 h-36">
                  {d.chartBars.map((bar, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      {bar.value > 0 ? (
                        <span className="text-xs text-muted-foreground">
                          {bar.value}
                        </span>
                      ) : (
                        <span className="text-xs text-transparent">0</span>
                      )}
                      <div
                        className={`w-full rounded-t-md transition-all ${bar.value > 0 ? "bg-primary/80" : "bg-muted/30"
                          }`}
                        style={{
                          height: `${Math.round((bar.value / maxBar) * 96)}px`,
                          minHeight: bar.value > 0 ? "4px" : "0",
                        }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {bar.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
                <h3 className="font-semibold text-foreground mb-4">
                  Répartition
                </h3>
                <div className="space-y-4">
                  {/* Video */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center gap-1.5 text-foreground">
                        <Video size={14} className="text-blue-500" />
                        Vidéo
                      </span>
                      <span className="font-medium text-foreground">
                        {d.video} ({videoPct}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${videoPct}%` }}
                      />
                    </div>
                  </div>
                  {/* Cabinet */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center gap-1.5 text-foreground">
                        <MapPin size={14} className="text-green-500" />
                        Cabinet
                      </span>
                      <span className="font-medium text-foreground">
                        {d.cabinet} ({cabinetPct}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${cabinetPct}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-muted/30 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">
                    Revenu Vidéo estimé
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    {Math.round(d.video * 80)} DT
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Revenu Cabinet estimé
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {Math.round(d.cabinet * 100)} DT
                  </p>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-5 border-b border-border">
                <h3 className="font-semibold text-foreground">
                  Transactions récentes
                </h3>
              </div>
              <div className="divide-y divide-border">
                {d.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${tx.type === "Vidéo"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-green-50 text-green-600"
                          }`}
                      >
                        {tx.type === "Vidéo" ? (
                          <Video size={16} />
                        ) : (
                          <MapPin size={16} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {tx.patient}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.type} · {tx.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tx.status === "Payée"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                          }`}
                      >
                        {tx.status === "Payée" ? (
                          <CheckCircle size={11} />
                        ) : (
                          <Clock size={11} />
                        )}
                        {tx.status}
                      </span>
                      <span className="font-bold text-foreground text-sm min-w-[60px] text-right">
                        {tx.amount} DT
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
