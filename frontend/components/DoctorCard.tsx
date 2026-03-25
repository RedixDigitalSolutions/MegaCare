import { Star, MapPin, Clock, Video, CheckCircle, ArrowRight } from "lucide-react";

interface DoctorCardProps {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  distance: number;
  price: number;
  availability: string;
  imageUrl?: string;
  certified?: boolean;
  videoConsultation?: boolean;
  onClick?: () => void;
}

export function DoctorCard({
  name,
  specialty,
  rating,
  reviews,
  location,
  distance,
  price,
  availability,
  imageUrl,
  certified,
  videoConsultation,
  onClick,
}: DoctorCardProps) {
  const ratingFull = Math.floor(rating);
  const ratingHalf = rating - ratingFull >= 0.5;

  return (
    <div
      onClick={onClick}
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Top: image + badges */}
      <div className="relative">
        {/* 1:1 Square image */}
        <div className="aspect-square w-full overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`Dr. ${name}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl">
              👨‍⚕️
            </div>
          )}
        </div>

        {/* Certified badge */}
        {certified && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
            <CheckCircle size={11} strokeWidth={2.5} />
            Certifié
          </div>
        )}

        {/* Video badge */}
        {videoConsultation && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
            <Video size={11} strokeWidth={2.5} />
            Vidéo
          </div>
        )}

        {/* Price pill overlapping bottom */}
        <div className="absolute bottom-3 right-3 bg-background/95 backdrop-blur-sm border border-border rounded-xl px-3 py-1.5 shadow-lg">
          <p className="text-[10px] text-muted-foreground leading-none mb-0.5">à partir de</p>
          <p className="text-base font-bold text-primary leading-none">{price} <span className="text-xs font-semibold">DT</span></p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Name + specialty */}
        <div>
          <h3 className="font-bold text-foreground text-base leading-tight group-hover:text-primary transition-colors duration-200">
            Dr. {name}
          </h3>
          <p className="text-sm text-primary/80 font-medium mt-0.5">{specialty}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} viewBox="0 0 20 20" className="w-3.5 h-3.5">
                {i <= ratingFull ? (
                  <path
                    fill="#f59e0b"
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                ) : i === ratingFull + 1 && ratingHalf ? (
                  <>
                    <defs>
                      <linearGradient id={`half-${i}`}>
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="50%" stopColor="#e5e7eb" />
                      </linearGradient>
                    </defs>
                    <path
                      fill={`url(#half-${i})`}
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </>
                ) : (
                  <path
                    fill="#e5e7eb"
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                )}
              </svg>
            ))}
          </div>
          <span className="text-sm font-semibold text-foreground">{rating}</span>
          <span className="text-xs text-muted-foreground">({reviews} avis)</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin size={13} className="text-primary shrink-0" />
          <span className="truncate">{location}</span>
          <span className="shrink-0 text-foreground/50">·</span>
          <span className="shrink-0 font-medium text-foreground">{distance} km</span>
        </div>

        {/* Availability */}
        <div className="flex items-center gap-1.5 text-xs">
          <Clock size={13} className="text-emerald-500 shrink-0" />
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            Disponible : {availability}
          </span>
        </div>

        {/* CTA */}
        <div className="mt-auto pt-3 border-t border-border">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 group-hover:shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
            Prendre rendez-vous
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
