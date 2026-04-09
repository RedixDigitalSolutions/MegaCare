import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import { Star, ThumbsUp, Video, MapPin } from "lucide-react";

interface Review {
  id: number;
  patient: string;
  rating: number;
  text: string;
  date: string;
  type: "Vidéo" | "Cabinet";
  helpful: number;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    patient: "Fatima B.",
    rating: 5,
    text: "Très bon médecin, très attentif et professionnel. Explications claires et rassurantes. Je recommande vivement.",
    date: "2026-04-01",
    type: "Vidéo",
    helpful: 4,
  },
  {
    id: 2,
    patient: "Mohamed K.",
    rating: 5,
    text: "Consultation excellente, le docteur prend vraiment le temps d'écouter. Diagnostic précis et suivi sérieux.",
    date: "2026-03-28",
    type: "Cabinet",
    helpful: 7,
  },
  {
    id: 3,
    patient: "Aisha H.",
    rating: 4,
    text: "Bon diagnostic, à recommander. Légèrement pressée lors de la consultation mais très compétente.",
    date: "2026-03-20",
    type: "Vidéo",
    helpful: 2,
  },
  {
    id: 4,
    patient: "Salim D.",
    rating: 5,
    text: "Médecin compétent, très courtois et disponible pour répondre aux questions après la séance.",
    date: "2026-03-15",
    type: "Cabinet",
    helpful: 5,
  },
  {
    id: 5,
    patient: "Layla M.",
    rating: 4,
    text: "Bonne expérience globale, prise en charge rapide et professionnelle.",
    date: "2026-03-10",
    type: "Cabinet",
    helpful: 3,
  },
  {
    id: 6,
    patient: "Youssef T.",
    rating: 3,
    text: "Consultation correcte mais temps d'attente en cabinet un peu long. Médecin sympathique.",
    date: "2026-02-28",
    type: "Cabinet",
    helpful: 1,
  },
  {
    id: 7,
    patient: "Nadia B.",
    rating: 5,
    text: "Excellente séance de téléconsultation, lien vidéo parfaitement stable. Aucun problème.",
    date: "2026-02-22",
    type: "Vidéo",
    helpful: 6,
  },
];

function StarRow({
  rating,
  max = 5,
  size = 16,
}: {
  rating: number;
  max?: number;
  size?: number;
}) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted-foreground/30"
          }
        />
      ))}
    </span>
  );
}

export default function DoctorReviewsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [helpfulCounts, setHelpfulCounts] = useState<Record<number, number>>(
    () => Object.fromEntries(REVIEWS.map((r) => [r.id, r.helpful])),
  );
  const [voted, setVoted] = useState<Set<number>>(new Set());
  const [filterRating, setFilterRating] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "doctor")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading || !isAuthenticated || !user || user.role !== "doctor")
    return null;

  const avgRating = (
    REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length
  ).toFixed(1);

  const countByRating = (n: number) => REVIEWS.filter((r) => r.rating === n).length;

  const filtered = filterRating
    ? REVIEWS.filter((r) => r.rating === filterRating)
    : REVIEWS;

  const handleHelpful = (id: number) => {
    if (voted.has(id)) return;
    setHelpfulCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    setVoted((prev) => new Set(prev).add(id));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar
          doctorName={user.firstName || "Amira Mansouri"}
        />

        <main className="flex-1 overflow-auto">
          {/* Sticky Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Avis Patients
                </h1>
                <p className="text-muted-foreground mt-1">
                  {REVIEWS.length} avis reçus
                </p>
              </div>
              {/* Average rating badge */}
              <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-3">
                <span className="text-3xl font-bold text-yellow-600">
                  {avgRating}
                </span>
                <div>
                  <StarRow rating={Math.round(Number(avgRating))} size={18} />
                  <p className="text-xs text-yellow-700 mt-0.5">
                    Note moyenne
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Rating Distribution */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4">
                Répartition des notes
              </h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((n) => {
                  const count = countByRating(n);
                  const pct = Math.round((count / REVIEWS.length) * 100);
                  const isActive = filterRating === n;
                  return (
                    <button
                      key={n}
                      onClick={() =>
                        setFilterRating(isActive ? null : n)
                      }
                      className={`w-full flex items-center gap-3 group rounded-lg px-2 py-1 transition ${
                        isActive ? "bg-yellow-50" : "hover:bg-muted/40"
                      }`}
                    >
                      <span className="flex items-center gap-1 text-sm text-muted-foreground w-12 shrink-0">
                        {n}
                        <Star
                          size={12}
                          className="fill-yellow-400 text-yellow-400"
                        />
                      </span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-6 text-right">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
              {filterRating && (
                <button
                  onClick={() => setFilterRating(null)}
                  className="mt-3 text-xs text-primary hover:underline"
                >
                  Voir tous les avis
                </button>
              )}
            </div>

            {/* Review Cards */}
            <div className="space-y-4">
              {filtered.map((review) => {
                const hasVoted = voted.has(review.id);
                return (
                  <div
                    key={review.id}
                    className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold text-primary text-sm shrink-0">
                          {review.patient
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground leading-tight">
                            {review.patient}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {review.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <StarRow rating={review.rating} size={15} />
                        <span
                          className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                            review.type === "Vidéo"
                              ? "bg-blue-50 text-blue-600"
                              : "bg-green-50 text-green-600"
                          }`}
                        >
                          {review.type === "Vidéo" ? (
                            <Video size={10} />
                          ) : (
                            <MapPin size={10} />
                          )}
                          {review.type}
                        </span>
                      </div>
                    </div>

                    {/* Review text */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {review.text}
                    </p>

                    {/* Helpful action */}
                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <button
                        onClick={() => handleHelpful(review.id)}
                        disabled={hasVoted}
                        className={`flex items-center gap-1.5 text-sm font-medium transition rounded-lg px-3 py-1.5 ${
                          hasVoted
                            ? "text-primary bg-primary/10 cursor-default"
                            : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                        }`}
                      >
                        <ThumbsUp
                          size={14}
                          className={hasVoted ? "fill-primary text-primary" : ""}
                        />
                        Utile
                        <span
                          className={`text-xs rounded-full px-1.5 py-0.5 ${
                            hasVoted
                              ? "bg-primary/20 text-primary font-bold"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {helpfulCounts[review.id]}
                        </span>
                      </button>
                      {hasVoted && (
                        <span className="text-xs text-primary">
                          Marqué utile ✓
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p className="text-center py-12 text-muted-foreground">
                  Aucun avis pour cette note.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
