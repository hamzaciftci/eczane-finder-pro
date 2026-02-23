import { Phone, Navigation, MapPin, Clock, ShieldCheck } from "lucide-react";
import { Pharmacy } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
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
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-border p-5 pb-4">
        <h3 className="text-[15px] font-bold text-card-foreground leading-tight">
          {pharmacy.name}
        </h3>
        <Badge variant="secondary" className="shrink-0 rounded-md px-2.5 py-1 text-[11px] font-semibold">
          {pharmacy.district}
        </Badge>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start gap-2.5 text-sm text-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div className="flex flex-col gap-0.5">
            <span className="font-medium leading-snug">{pharmacy.address}</span>
            {pharmacy.addressDetail && (
              <span className="text-xs text-muted-foreground leading-relaxed">
                {pharmacy.addressDetail}
              </span>
            )}
          </div>
        </div>

        {pharmacy.phone && (
          <div className="flex items-center gap-2.5 text-sm">
            <Phone className="h-4 w-4 shrink-0 text-primary" />
            <a
              href={`tel:${pharmacy.phone}`}
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              TEL: {pharmacy.phone}
            </a>
          </div>
        )}

        {pharmacy.distance !== undefined && (
          <Badge variant="outline" className="w-fit rounded-full border-accent/40 bg-accent/5 text-xs font-semibold text-accent">
            {pharmacy.distance.toFixed(1)} km
          </Badge>
        )}
      </div>

      {/* Source & Verification */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border bg-muted/30 px-5 py-3">
        {pharmacy.source && (
          <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            Kaynak: {pharmacy.source}
            {pharmacy.lastUpdated && <> · Son güncelleme: {pharmacy.lastUpdated}</>}
          </span>
        )}
        {pharmacy.verificationCount !== undefined && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-accent">
            <ShieldCheck className="h-3 w-3" />
            Doğrulama: {pharmacy.verificationCount} kaynak
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex border-t border-border">
        <a
          href={`tel:${pharmacy.phone}`}
          className="flex flex-1 items-center justify-center gap-2 border-r border-border py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <Phone className="h-4 w-4" />
          Ara
        </a>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
        >
          <Navigation className="h-4 w-4" />
          Yol Tarifi
        </a>
      </div>
    </motion.div>
  );
}
