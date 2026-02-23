import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPharmaciesByProvince } from "@/lib/api";
import { findProvince, getDistrictsForProvince } from "@/lib/cities";
import MainLayout from "@/components/MainLayout";
import PharmacyCard from "@/components/PharmacyCard";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Clock, AlertCircle, MapPin } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function CityPage() {
  const { citySlug, districtSlug } = useParams();
  const province = findProvince(citySlug || "");
  const districts = getDistrictsForProvince(citySlug || "");
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(districtSlug || null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["pharmacies", citySlug],
    queryFn: () => getPharmaciesByProvince(citySlug || ""),
    enabled: !!citySlug,
  });

  const pharmacies = data?.pharmacies.filter(
    (p) => !selectedDistrict || p.district.toLowerCase() === selectedDistrict.toLowerCase()
  ) || [];

  const today = new Date().toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <MainLayout>
      <div className="container py-8 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-primary">Türkiye</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">{province?.name || citySlug}</span>
          {selectedDistrict && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-medium text-foreground">{selectedDistrict}</span>
            </>
          )}
        </nav>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">
              {province?.name || citySlug} Nöbetçi Eczaneler
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {today} tarihli nöbetçi eczane listesi
            </p>
          </div>
          {data && (
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="gap-1.5 rounded-lg">
                <Clock className="h-3 w-3" />
                Son güncelleme: {new Date(data.lastUpdated).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
              </Badge>
              <Badge variant="outline" className="rounded-lg">
                {pharmacies.length} eczane
              </Badge>
            </div>
          )}
        </div>

        {/* District filter */}
        {districts.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDistrict(null)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                !selectedDistrict
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-surface text-muted-foreground hover:border-primary/30 hover:text-foreground"
              }`}
            >
              Tümü
            </button>
            {districts.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDistrict(d)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  selectedDistrict === d
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-surface text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse-soft rounded-2xl border border-border bg-card p-5">
                <div className="mb-3 h-5 w-3/4 rounded-md bg-muted" />
                <div className="mb-2 h-4 w-full rounded-md bg-muted" />
                <div className="h-4 w-1/2 rounded-md bg-muted" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h3 className="text-lg font-semibold text-foreground">Veriler yüklenemedi</h3>
            <p className="text-sm text-muted-foreground">Lütfen daha sonra tekrar deneyin.</p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && pharmacies.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4 py-16 text-center"
          >
            <MapPin className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">
              Bu tarih için nöbetçi eczane bilgisi bulunamadı
            </h3>
            <p className="text-sm text-muted-foreground">Başka bir tarih veya il deneyin.</p>
            <Link to="/" className="text-sm font-medium text-primary hover:underline">
              Ana sayfaya dön
            </Link>
          </motion.div>
        )}

        {/* Pharmacy grid */}
        {!isLoading && pharmacies.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pharmacies.map((p, i) => (
              <PharmacyCard
                key={`${p.name}-${i}`}
                pharmacy={p}
                province={province?.name}
                index={i}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
