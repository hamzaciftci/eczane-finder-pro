import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight, Clock, AlertCircle, MapPin, Shield, ShieldCheck,
  Printer, Monitor, Navigation, Loader2, MapPinned, Info
} from "lucide-react";
import { getPharmaciesByProvince } from "@/lib/api";
import { findProvince, getDistrictsForProvince } from "@/lib/cities";
import MainLayout from "@/components/MainLayout";
import PharmacyCard from "@/components/PharmacyCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CityPage() {
  const { citySlug, districtSlug } = useParams();
  const province = findProvince(citySlug || "");
  const districts = getDistrictsForProvince(citySlug || "");
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(districtSlug || null);

  // Nearest pharmacy state
  const [nearestCoords, setNearestCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoRequesting, setGeoRequesting] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["pharmacies", citySlug],
    queryFn: () => getPharmaciesByProvince(citySlug || ""),
    enabled: !!citySlug,
  });

  const pharmacies = data?.pharmacies.filter(
    (p) => !selectedDistrict || p.district.toLowerCase() === selectedDistrict.toLowerCase()
  ) || [];

  const today = new Date();
  const dateFormatted = today.toLocaleDateString("tr-TR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
  const dayName = today.toLocaleDateString("tr-TR", { weekday: "short" });
  const dateLong = today.toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
  });

  const requestLocation = () => {
    setGeoRequesting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setNearestCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoRequesting(false);
      },
      () => setGeoRequesting(false)
    );
  };

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

        {/* Main header card */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="p-6 md:p-8">
            {/* Top badge */}
            <div className="mb-4 flex justify-center">
              <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                İl geneli nöbetçi eczane listesi
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-center text-2xl font-extrabold uppercase tracking-tight text-foreground md:text-3xl">
              {province?.name || citySlug} NÖBETÇİ ECZANELER
            </h1>

            {/* Date & update info */}
            <p className="mt-3 text-center text-sm text-muted-foreground">
              Tarih: {dateFormatted}
              {data && (
                <> | Son güncelleme: {new Date(data.lastUpdated).toLocaleDateString("tr-TR")} {new Date(data.lastUpdated).toLocaleTimeString("tr-TR")}</>
              )}
            </p>

            {/* Status badges */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              {data?.verified && (
                <Badge variant="secondary" className="gap-1.5 rounded-lg">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                  Durum: Doğrulandı
                </Badge>
              )}
              <Badge variant="secondary" className="rounded-lg">
                Kayıt: {data?.pharmacies.length || 0}
              </Badge>
            </div>
          </div>
        </div>

        {/* Date tabs */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-card">
          <h2 className="mb-3 text-base font-bold text-foreground">Tarih Sekmeleri</h2>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border-2 border-primary bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary">
              {dateFormatted} {dayName}
            </span>
          </div>
        </div>

        {/* Display modes */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-card">
          <h2 className="mb-2 text-base font-bold text-foreground">Eczane Gösterim Modları</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Eczane camına asmak için A4 çıktı alın veya bu ilin canlı panosunu tam ekranda açın.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="default" className="gap-2 rounded-xl">
              <Printer className="h-4 w-4" />
              A4 Çıktı Sayfası
            </Button>
            <Button variant="outline" size="default" className="gap-2 rounded-xl">
              <Monitor className="h-4 w-4" />
              Tam Ekran Pano
            </Button>
          </div>
        </div>

        {/* District shortcuts */}
        {districts.length > 0 && (
          <div className="mb-6 rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="mb-3 text-base font-bold text-foreground">İlçe Kısayolları</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDistrict(null)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  !selectedDistrict
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "border border-border bg-surface text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                Tümü
              </button>
              {districts.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDistrict(selectedDistrict === d ? null : d)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                    selectedDistrict === d
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "border border-border bg-surface text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Map placeholder */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <h2 className="border-b border-border p-5 text-base font-bold text-foreground">
            İl Geneli Harita
          </h2>
          <div className="flex h-56 items-center justify-center bg-muted/20">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <MapPinned className="h-10 w-10" />
              <span className="text-sm">OpenStreetMap + Leaflet</span>
              <span className="text-xs">Harita bileşeni buraya eklenecek</span>
            </div>
          </div>
        </div>

        {/* Nearest pharmacy section */}
        <div className="mb-8 rounded-2xl border border-border bg-card p-5 shadow-card">
          <h2 className="mb-2 text-base font-bold text-foreground">En Yakın Nöbetçi (Client-Side)</h2>
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-border bg-muted/30 p-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              <strong>KVKK:</strong> Konum sunucuya gitmez. Mesafe hesabı sadece tarayıcıda yapılır.
            </p>
          </div>
          <Button onClick={requestLocation} disabled={geoRequesting} className="gap-2 rounded-xl">
            {geoRequesting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4" />
            )}
            En Yakın Eczaneyi Bul
          </Button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse-soft rounded-2xl border border-border bg-card p-5">
                <div className="mb-3 h-5 w-3/4 rounded-md bg-muted" />
                <div className="mb-2 h-4 w-full rounded-md bg-muted" />
                <div className="mb-2 h-4 w-2/3 rounded-md bg-muted" />
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
            className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card py-16 text-center shadow-card"
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
          <div className="grid gap-5 md:grid-cols-2">
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
