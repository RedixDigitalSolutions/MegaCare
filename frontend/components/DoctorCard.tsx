import { Star, MapPin, Calendar, Video } from "lucide-react";

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
  return (
    <div
      onClick={onClick}
      className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-xl hover:border-primary/30 transition duration-300 cursor-pointer"
    >
      {/* Doctor Image Section */}
      <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-6xl">👨‍⚕️</div>
        )}
        {certified && (
          <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <span>✓</span> Certifié
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Name and Specialty */}
        <div>
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition">
            Dr. {name}
          </h3>
          <p className="text-sm text-primary font-medium">{specialty}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(rating)
                    ? "fill-accent text-accent"
                    : "text-border"
                }
              />
            ))}
          </div>
          <span className="text-sm font-medium text-foreground">{rating}</span>
          <span className="text-xs text-muted-foreground">
            ({reviews} avis)
          </span>
        </div>

        {/* Location and Distance */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={16} className="text-primary" />
          <span>{location}</span>
          <span className="font-medium text-foreground">• {distance}km</span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {videoConsultation && (
            <div className="flex items-center gap-1 bg-secondary text-foreground text-xs px-2 py-1 rounded">
              <Video size={12} />
              Vidéo
            </div>
          )}
          <div className="flex items-center gap-1 bg-secondary text-foreground text-xs px-2 py-1 rounded">
            <Calendar size={12} />
            {availability}
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="text-sm">
            <p className="text-muted-foreground">à partir de</p>
            <p className="font-bold text-lg text-primary">{price} DT</p>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium text-sm">
            Prendre RDV
          </button>
        </div>
      </div>
    </div>
  );
}
