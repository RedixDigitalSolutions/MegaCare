import { MapPin, Clock, ArrowRight, Stethoscope } from "lucide-react";

interface DoctorCardProps {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  distance: number;
  availability: string;
  imageUrl?: string;
  certified?: boolean;
  videoConsultation?: boolean;
  onClick?: () => void;
}

export function DoctorCard({
  name,
  specialty,
  location,
  distance,
  availability,
  imageUrl,
  onClick,
}: DoctorCardProps) {
  return (
    <div
      onClick={onClick}
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Image area */}
      <div className="relative">
        <div className="aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`Dr. ${name}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Stethoscope size={36} className="text-primary/50" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Name + specialty */}
        <div>
          <h3 className="font-bold text-foreground text-base leading-tight group-hover:text-primary transition-colors duration-200">
            Dr. {name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <Stethoscope size={13} className="text-primary/70 shrink-0" />
            <p className="text-sm text-primary/80 font-medium">{specialty}</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin size={13} className="text-primary/60 shrink-0" />
          <span className="truncate">{location}</span>
          {distance > 0 && (
            <>
              <span className="text-foreground/30">·</span>
              <span className="shrink-0 font-medium text-foreground/70">
                {distance} km
              </span>
            </>
          )}
        </div>

        {/* Availability */}
        {availability && (
          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <span className="text-emerald-600 dark:text-emerald-400 font-medium truncate">
              {availability}
            </span>
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto pt-3 border-t border-border">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground rounded-xl font-semibold text-sm transition-all duration-300 group/btn">
            Prendre rendez-vous
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover/btn:translate-x-1"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

