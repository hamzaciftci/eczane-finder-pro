import { Phone, Navigation, MapPin } from "lucide-react";
import { Pharmacy } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Props {
  pharmacy: Pharmacy;
  province?: string;
  index?: number;
}

export default function PharmacyCard({ pharmacy, province, index = 0 }: Props) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${pharmacy.name} ${pharmacy.address} ${province || ""}`
  )}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-card-foreground leading-tight">
            {pharmacy.name}
          </h3>
          <Badge variant="destructive" className="shrink-0 rounded-md bg-primary px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
            Nöbetçi
          </Badge>
        </div>

        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary/60" />
          <span className="line-clamp-2">{pharmacy.address}</span>
        </div>

        {pharmacy.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 shrink-0 text-primary/60" />
            <span>{pharmacy.phone}</span>
          </div>
        )}

        {pharmacy.distance !== undefined && (
          <Badge variant="secondary" className="w-fit rounded-md text-xs">
            {pharmacy.distance.toFixed(1)} km
          </Badge>
        )}
      </div>

      <div className="flex border-t border-border">
        <a
          href={`tel:${pharmacy.phone}`}
          className="flex flex-1 items-center justify-center gap-2 border-r border-border py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Phone className="h-4 w-4" />
          Ara
        </a>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
        >
          <Navigation className="h-4 w-4" />
          Yol Tarifi
        </a>
      </div>
    </motion.div>
  );
}
