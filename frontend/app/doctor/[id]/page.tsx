"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
  Star,
  MapPin,
  Clock,
  CheckCircle,
  Award,
  Users,
  Calendar,
  Video,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface DoctorSchedule {
  monday?: string[];
  tuesday?: string[];
  wednesday?: string[];
  thursday?: string[];
  friday?: string[];
  saturday?: string[];
  sunday?: string[];
}

interface Doctor {
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  distance: number;
  price: number;
  certified: boolean;
  experience: number;
  patients: number;
  bio: string;
  education: { degree: string; university: string; year: number }[];
  languages: string[];
  schedule: DoctorSchedule;
}

export default function DoctorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<"about" | "schedule" | "reviews">(
    "about",
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showLoginWarning, setShowLoginWarning] = useState(false);
  const [consultationType, setConsultationType] = useState<
    "video" | "phone" | null
  >(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isDoctorLoading, setIsDoctorLoading] = useState(true);
  const [doctorNotFound, setDoctorNotFound] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`/api/doctors/${id}`);
        if (res.status === 404) {
          setDoctorNotFound(true);
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch doctor");
        const data: Doctor = await res.json();
        setDoctor(data);
      } catch {
        setDoctorNotFound(true);
      } finally {
        setIsDoctorLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getDayName = (day: number) => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return days[day];
  };

  const getAvailableSlotsForDate = (date: Date) => {
    if (!doctor) return [];
    const dayName = getDayName(date.getDay());
    const slots = doctor.schedule[dayName as keyof typeof doctor.schedule];
    return slots || [];
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
    setSelectedDate(null);
  };

  const handleDateClick = (day: number) => {
    const date = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelection = (slot: string) => {
    setSelectedSlot(slot);
  };

  const handleBooking = () => {
    if (!isAuthenticated || !user) {
      setShowLoginWarning(true);
      return;
    }

    if (selectedDate && selectedSlot) {
      setShowConfirmation(true);
    }
  };

  const handleConsultationType = (type: "video" | "phone") => {
    setConsultationType(type);
    setActiveTab("schedule");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const reviews = [
    {
      author: "Fatima B.",
      rating: 5,
      date: "Il y a 2 semaines",
      text: "Excellente docteure. Très à l'écoute et professionnelle. Je la recommande vivement!",
    },
    {
      author: "Mohamed K.",
      rating: 4,
      date: "Il y a 1 mois",
      text: "Consultation très informative. Un peu d'attente mais en vaut la peine.",
    },
    {
      author: "Aisha H.",
      rating: 5,
      date: "Il y a 6 semaines",
      text: "Service impeccable et résultats excellents. Merci Dr. Mansouri!",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {isDoctorLoading && (
        <main className="flex-1 pt-24 flex items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">
              Chargement du profil médecin...
            </p>
          </div>
        </main>
      )}

      {!isDoctorLoading && (doctorNotFound || !doctor) && (
        <main className="flex-1 pt-24 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-2xl font-bold text-foreground">
              Médecin non trouvé
            </p>
            <p className="text-muted-foreground">
              Ce profil n'existe pas ou a été supprimé.
            </p>
            <Link
              href="/doctors"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Retour à la liste des médecins
            </Link>
          </div>
        </main>
      )}

      {!isDoctorLoading && doctor && (
        <main className="flex-1 pt-24">
          {/* Breadcrumb */}
          <div className="border-b border-border bg-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm">
              <Link href="/doctors" className="text-primary hover:underline">
                Médecins
              </Link>
              <span className="text-muted-foreground mx-2">/</span>
              <span className="text-foreground">{doctor.name}</span>
            </div>
          </div>

          {/* Doctor Header */}
          <section className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Doctor Image */}
                <div className="flex-shrink-0">
                  <div className="w-40 h-40 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/20">
                    <div className="text-8xl">👨‍⚕️</div>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                        Dr. {doctor.name}
                      </h1>
                      {doctor.certified && (
                        <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <CheckCircle size={16} />
                          Certifié
                        </div>
                      )}
                    </div>
                    <p className="text-xl text-primary font-medium">
                      {doctor.specialty}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-6 py-4 border-y border-border">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-accent text-accent" />
                      <div>
                        <p className="font-semibold text-foreground">
                          {doctor.rating}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ({doctor.reviews} avis)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">
                          {doctor.experience} ans
                        </p>
                        <p className="text-xs text-muted-foreground">
                          d'expérience
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">
                          {doctor.patients}+
                        </p>
                        <p className="text-xs text-muted-foreground">
                          patients
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">
                          {doctor.distance}km
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {doctor.location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={() => handleConsultationType("video")}
                      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition font-semibold ${consultationType === "video"
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                    >
                      <Video size={20} />
                      Consultation vidéo
                    </button>
                    <button
                      onClick={() => handleConsultationType("phone")}
                      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition font-semibold ${consultationType === "phone"
                          ? "bg-accent text-accent-foreground"
                          : "border-2 border-primary text-primary hover:bg-primary/5"
                        }`}
                    >
                      <Phone size={20} />
                      Appel téléphonique
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tabs */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-b border-border flex gap-8 sticky top-16 bg-background z-10">
              {["about", "schedule", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() =>
                    setActiveTab(tab as "about" | "schedule" | "reviews")
                  }
                  className={`py-4 font-medium capitalize transition border-b-2 ${activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {tab === "about"
                    ? "À propos"
                    : tab === "schedule"
                      ? "Disponibilités"
                      : "Avis"}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="py-8">
              {/* About Tab */}
              {activeTab === "about" && (
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-8">
                    {/* Bio */}
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-4">
                        À propos
                      </h3>
                      <p className="text-foreground leading-relaxed">
                        {doctor.bio}
                      </p>
                    </div>

                    {/* Education */}
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-4">
                        Formation
                      </h3>
                      <div className="space-y-4">
                        {doctor.education.map((edu, idx) => (
                          <div key={idx} className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Award className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">
                                {edu.degree}
                              </p>
                              <p className="text-muted-foreground">
                                {edu.university}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {edu.year}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-4">
                    {/* Price Card */}
                    <div className="bg-card rounded-xl border border-border p-6 space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Tarif consultation
                      </p>
                      <p className="text-3xl font-bold text-primary">
                        {doctor.price} DT
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Durée: 30 minutes
                      </p>
                    </div>

                    {/* Languages */}
                    <div className="bg-card rounded-xl border border-border p-6 space-y-3">
                      <h4 className="font-semibold text-foreground">Langues</h4>
                      <div className="space-y-2">
                        {doctor.languages.map((lang) => (
                          <div key={lang} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <span className="text-foreground">{lang}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Schedule Tab */}
              {activeTab === "schedule" && (
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Calendar */}
                  <div className="md:col-span-1">
                    <div className="bg-card rounded-xl border border-border p-6 sticky top-32">
                      {/* Month Navigation */}
                      <div className="flex items-center justify-between mb-6">
                        <button
                          onClick={handlePrevMonth}
                          className="p-2 hover:bg-secondary rounded-lg transition"
                        >
                          <ChevronLeft size={20} className="text-primary" />
                        </button>
                        <h3 className="font-bold text-foreground">
                          {currentMonth.toLocaleDateString("fr-FR", {
                            month: "long",
                            year: "numeric",
                          })}
                        </h3>
                        <button
                          onClick={handleNextMonth}
                          className="p-2 hover:bg-secondary rounded-lg transition"
                        >
                          <ChevronRight size={20} className="text-primary" />
                        </button>
                      </div>

                      {/* Day Headers */}
                      <div className="grid grid-cols-7 gap-2 mb-2">
                        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                          (day, index) => (
                            <div
                              key={`day-${index}`}
                              className="text-center text-xs font-semibold text-muted-foreground py-2"
                            >
                              {day}
                            </div>
                          ),
                        )}
                      </div>

                      {/* Calendar Days */}
                      <div className="grid grid-cols-7 gap-2">
                        {Array.from({
                          length: getFirstDayOfMonth(currentMonth),
                        }).map((_, i) => (
                          <div
                            key={`empty-${i}`}
                            className="aspect-square"
                          ></div>
                        ))}
                        {Array.from({
                          length: getDaysInMonth(currentMonth),
                        }).map((_, i) => {
                          const day = i + 1;
                          const date = new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth(),
                            day,
                          );
                          const isSelected =
                            selectedDate &&
                            selectedDate.getDate() === day &&
                            selectedDate.getMonth() ===
                            currentMonth.getMonth() &&
                            selectedDate.getFullYear() ===
                            currentMonth.getFullYear();
                          const hasSlots =
                            getAvailableSlotsForDate(date).length > 0;
                          const isPast =
                            date < new Date() &&
                            date.getDate() !== new Date().getDate();

                          return (
                            <button
                              key={day}
                              onClick={() => !isPast && handleDateClick(day)}
                              disabled={isPast}
                              className={`aspect-square rounded-lg font-medium text-sm transition flex items-center justify-center ${isSelected
                                  ? "bg-primary text-primary-foreground border-2 border-primary"
                                  : hasSlots && !isPast
                                    ? "bg-secondary hover:bg-primary/20 border border-primary text-foreground"
                                    : isPast
                                      ? "text-muted-foreground opacity-40 cursor-not-allowed"
                                      : "bg-muted text-muted-foreground"
                                }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="md:col-span-2">
                    {selectedDate ? (
                      <div className="space-y-6">
                        {/* Selected Date Info */}
                        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Date sélectionnée
                          </p>
                          <h3 className="text-2xl font-bold text-primary">
                            {selectedDate.toLocaleDateString("fr-FR", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </h3>
                        </div>

                        {/* Available Slots */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-foreground flex items-center gap-2">
                            <Clock size={20} className="text-primary" />
                            Créneaux disponibles
                          </h4>
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {getAvailableSlotsForDate(selectedDate).length >
                              0 ? (
                              getAvailableSlotsForDate(selectedDate).map(
                                (slot) => (
                                  <button
                                    key={slot}
                                    onClick={() => handleSlotSelection(slot)}
                                    className={`p-3 rounded-lg font-medium text-sm transition border-2 ${selectedSlot === slot
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "bg-card border-border hover:border-primary text-foreground"
                                      }`}
                                  >
                                    {slot}
                                  </button>
                                ),
                              )
                            ) : (
                              <div className="col-span-full text-center py-8 text-muted-foreground">
                                Aucun créneau disponible ce jour
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Booking Button */}
                        {selectedSlot && (
                          <button
                            onClick={handleBooking}
                            className="w-full py-4 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition"
                          >
                            Confirmer la réservation
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="bg-card rounded-xl border border-border p-12 text-center space-y-4">
                        <Calendar
                          size={48}
                          className="text-muted-foreground mx-auto opacity-50"
                        />
                        <p className="text-muted-foreground">
                          Sélectionnez une date pour voir les créneaux
                          disponibles
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Login Warning Modal */}
              {showLoginWarning && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-card rounded-xl border border-border p-8 space-y-6 max-w-md w-full">
                    <div className="space-y-2 text-center">
                      <div className="text-5xl mb-4">🔐</div>
                      <h3 className="text-2xl font-bold text-foreground">
                        Authentification requise
                      </h3>
                      <p className="text-muted-foreground">
                        Vous devez être connecté pour réserver une consultation
                      </p>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-2">
                      <p className="text-sm text-orange-900">
                        Pour confirmer votre rendez-vous et assurer la sécurité
                        de votre compte, veuillez vous connecter ou créer un
                        compte.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          setShowLoginWarning(false);
                          router.push("/login");
                        }}
                        className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition"
                      >
                        Se connecter
                      </button>
                      <button
                        onClick={() => {
                          setShowLoginWarning(false);
                          router.push("/register");
                        }}
                        className="w-full py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition"
                      >
                        Créer un compte
                      </button>
                      <button
                        onClick={() => setShowLoginWarning(false)}
                        className="w-full py-2 text-muted-foreground hover:text-foreground transition text-sm"
                      >
                        Continuer plus tard
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Booking Confirmation Modal */}
              {showConfirmation && selectedDate && selectedSlot && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-card rounded-xl border border-border p-8 space-y-6 max-w-md w-full">
                    <div className="space-y-2 text-center">
                      <div className="text-4xl mb-2">✓</div>
                      <h3 className="text-2xl font-bold text-foreground">
                        Rendez-vous confirmé!
                      </h3>
                      <p className="text-muted-foreground">
                        Votre consultation est réservée
                      </p>
                    </div>

                    <div className="bg-primary/10 rounded-lg p-4 space-y-4">
                      {/* Doctor Info */}
                      <div className="flex items-center gap-3 pb-4 border-b border-primary/20">
                        <div className="text-3xl">👨‍⚕️</div>
                        <div>
                          <p className="font-semibold text-foreground">
                            Dr. {doctor.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {doctor.specialty}
                          </p>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar size={20} className="text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Date
                            </p>
                            <p className="font-semibold text-foreground">
                              {selectedDate.toLocaleDateString("fr-FR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock size={20} className="text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Heure
                            </p>
                            <p className="font-semibold text-foreground">
                              {selectedSlot}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {consultationType === "video" ? (
                            <Video size={20} className="text-primary" />
                          ) : (
                            <Phone size={20} className="text-primary" />
                          )}
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Type
                            </p>
                            <p className="font-semibold text-foreground">
                              {consultationType === "video"
                                ? "Consultation vidéo"
                                : "Appel téléphonique"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Price Info */}
                    <div className="bg-accent/10 rounded-lg p-3 text-center">
                      <p className="text-sm text-muted-foreground">Tarif</p>
                      <p className="text-xl font-bold text-accent">
                        {doctor.price} DT
                      </p>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => setShowConfirmation(false)}
                        className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition"
                      >
                        Fermer
                      </button>
                      <p className="text-xs text-center text-muted-foreground">
                        Un email de confirmation a été envoyé à votre adresse.
                        Lien de consultation vidéo envoyé 15 minutes avant
                        l'heure prévue.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {reviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="bg-card rounded-xl border border-border p-6 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-foreground">
                            {review.author}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {review.date}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              className={
                                i < review.rating
                                  ? "fill-accent text-accent"
                                  : "text-border"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-foreground leading-relaxed">
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      )}

      <Footer />
    </div>
  );
}
