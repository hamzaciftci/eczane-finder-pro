import { Pharmacy, PharmacyResponse } from "./types";

const today = new Date();
const dateStr = today.toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" });
const lastUpdated = new Date(today.getTime() - 3 * 60 * 60 * 1000).toISOString();

const mockPharmacies: Record<string, Pharmacy[]> = {
  istanbul: [
    { name: "Hayat Eczanesi", address: "Bağdat Cad. No:123 Kadıköy", phone: "0216 345 67 89", district: "Kadıköy", lat: 40.9862, lng: 29.0258 },
    { name: "Sağlık Eczanesi", address: "İstiklal Cad. No:45 Beyoğlu", phone: "0212 243 56 78", district: "Beyoğlu", lat: 41.0336, lng: 28.9784 },
    { name: "Güven Eczanesi", address: "Atatürk Bulvarı No:89 Fatih", phone: "0212 523 45 67", district: "Fatih", lat: 41.0082, lng: 28.9392 },
    { name: "Merkez Eczanesi", address: "Cumhuriyet Cad. No:200 Şişli", phone: "0212 232 45 67", district: "Şişli", lat: 41.0602, lng: 28.9877 },
    { name: "Yıldız Eczanesi", address: "Bağlarbaşı Cad. No:56 Üsküdar", phone: "0216 334 56 78", district: "Üsküdar", lat: 41.0263, lng: 29.0153 },
    { name: "Anadolu Eczanesi", address: "Ankara Cad. No:78 Kartal", phone: "0216 453 67 89", district: "Kartal", lat: 40.8917, lng: 29.1875 },
  ],
  ankara: [
    { name: "Başkent Eczanesi", address: "Kızılay Meydanı No:12 Çankaya", phone: "0312 425 67 89", district: "Çankaya" },
    { name: "Ulus Eczanesi", address: "Anafartalar Cad. No:34 Altındağ", phone: "0312 311 45 67", district: "Altındağ" },
    { name: "Yeni Eczane", address: "Çetin Emeç Bulvarı No:56 Yenimahalle", phone: "0312 385 12 34", district: "Yenimahalle" },
  ],
  izmir: [
    { name: "Ege Eczanesi", address: "Kordon Boyu No:90 Konak", phone: "0232 445 67 89", district: "Konak" },
    { name: "Karşıyaka Eczanesi", address: "Cemal Gürsel Cad. No:25 Karşıyaka", phone: "0232 381 23 45", district: "Karşıyaka" },
  ],
};

export async function getPharmaciesByProvince(slug: string): Promise<PharmacyResponse> {
  await new Promise((r) => setTimeout(r, 600));
  const pharmacies = mockPharmacies[slug] || [];
  return {
    province: slug,
    date: dateStr,
    lastUpdated,
    pharmacies,
  };
}

export async function getPharmaciesByDistrict(
  provinceSlug: string,
  districtName: string
): Promise<PharmacyResponse> {
  const data = await getPharmaciesByProvince(provinceSlug);
  return {
    ...data,
    district: districtName,
    pharmacies: data.pharmacies.filter(
      (p) => p.district.toLowerCase() === districtName.toLowerCase()
    ),
  };
}

export async function getNearestPharmacies(
  lat: number,
  lng: number
): Promise<Pharmacy[]> {
  await new Promise((r) => setTimeout(r, 800));
  const all = mockPharmacies.istanbul.filter((p) => p.lat && p.lng);
  return all
    .map((p) => ({
      ...p,
      distance: getDistance(lat, lng, p.lat!, p.lng!),
    }))
    .sort((a, b) => a.distance! - b.distance!)
    .slice(0, 3);
}

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
