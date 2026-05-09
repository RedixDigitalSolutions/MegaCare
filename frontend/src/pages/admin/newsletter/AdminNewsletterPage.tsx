import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AdminDashboardSidebar } from "@/components/AdminDashboardSidebar";
import { Mail, Search, Trash2, RefreshCw, Download } from "lucide-react";
import { useAdminTheme } from "@/hooks/useAdminTheme";

interface Subscriber {
  _id: string;
  email: string;
  createdAt: string;
}

export default function AdminNewsletterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isDark } = useAdminTheme();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role !== "admin") navigate("/login");
  }, [user, navigate]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("megacare_token");
      const params = new URLSearchParams({ limit: "100" });
      if (debouncedSearch) params.set("search", debouncedSearch);
      const res = await fetch(`/api/admin/newsletter?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSubscribers(data.subscribers);
      setTotal(data.total);
    } catch {
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => { fetchSubscribers(); }, [fetchSubscribers]);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet abonné ?")) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem("megacare_token");
      await fetch(`/api/admin/newsletter/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubscribers((prev) => prev.filter((s) => s._id !== id));
      setTotal((prev) => prev - 1);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = () => {
    const csv = ["Email,Date d'inscription", ...subscribers.map((s) =>
      `${s.email},${new Date(s.createdAt).toLocaleDateString("fr-FR")}`
    )].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`flex h-screen bg-background overflow-hidden${isDark ? " dark" : ""}`}>
      <AdminDashboardSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Mail size={20} className="text-primary" />
                </div>
                Newsletter
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                {total} abonné{total !== 1 ? "s" : ""} au total
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchSubscribers}
                className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors"
                title="Actualiser"
              >
                <RefreshCw size={16} className={loading ? "animate-spin text-primary" : "text-muted-foreground"} />
              </button>
              <button
                onClick={handleExport}
                disabled={subscribers.length === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={14} />
                Exporter CSV
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par email..."
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Table */}
          <div className="border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">#</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Email</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground">Date d'inscription</th>
                  <th className="px-5 py-3.5" />
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-16 text-muted-foreground">
                      <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-primary" />
                      Chargement...
                    </td>
                  </tr>
                ) : subscribers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-16 text-muted-foreground">
                      <Mail size={32} className="mx-auto mb-3 opacity-30" />
                      {debouncedSearch ? "Aucun résultat pour cette recherche." : "Aucun abonné pour l'instant."}
                    </td>
                  </tr>
                ) : (
                  subscribers.map((s, idx) => (
                    <tr
                      key={s._id}
                      className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-muted-foreground">{idx + 1}</td>
                      <td className="px-5 py-3.5 font-medium text-foreground">
                        <a href={`mailto:${s.email}`} className="hover:text-primary transition-colors">
                          {s.email}
                        </a>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">
                        {new Date(s.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleDelete(s._id)}
                          disabled={deletingId === s._id}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
