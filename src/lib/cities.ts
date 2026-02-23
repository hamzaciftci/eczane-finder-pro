import { Province } from "./types";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i")
    .replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    .replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

const provinceNames = [
  "Adana","Adıyaman","Afyonkarahisar","Ağrı","Aksaray","Amasya","Ankara","Antalya",
  "Ardahan","Artvin","Aydın","Balıkesir","Bartın","Batman","Bayburt","Bilecik",
  "Bingöl","Bitlis","Bolu","Burdur","Bursa","Çanakkale","Çankırı","Çorum",
  "Denizli","Diyarbakır","Düzce","Edirne","Elazığ","Erzincan","Erzurum","Eskişehir",
  "Gaziantep","Giresun","Gümüşhane","Hakkari","Hatay","Iğdır","Isparta","İstanbul",
  "İzmir","Kahramanmaraş","Karabük","Karaman","Kars","Kastamonu","Kayseri","Kilis",
  "Kırıkkale","Kırklareli","Kırşehir","Kocaeli","Konya","Kütahya","Malatya","Manisa",
  "Mardin","Mersin","Muğla","Muş","Nevşehir","Niğde","Ordu","Osmaniye",
  "Rize","Sakarya","Samsun","Siirt","Sinop","Sivas","Şanlıurfa","Şırnak",
  "Tekirdağ","Tokat","Trabzon","Tunceli","Uşak","Van","Yalova","Yozgat","Zonguldak",
];

export const provinces: Province[] = provinceNames.map((name) => ({
  name,
  slug: toSlug(name),
}));

const istanbulDistricts = [
  "Adalar","Arnavutköy","Ataşehir","Avcılar","Bağcılar","Bahçelievler","Bakırköy",
  "Başakşehir","Bayrampaşa","Beşiktaş","Beykoz","Beylikdüzü","Beyoğlu","Büyükçekmece",
  "Çatalca","Çekmeköy","Esenler","Esenyurt","Eyüpsultan","Fatih","Gaziosmanpaşa",
  "Güngören","Kadıköy","Kağıthane","Kartal","Küçükçekmece","Maltepe","Pendik",
  "Sancaktepe","Sarıyer","Silivri","Sultanbeyli","Sultangazi","Şile","Şişli",
  "Tuzla","Ümraniye","Üsküdar","Zeytinburnu",
];

export const districtsByProvince: Record<string, string[]> = {
  istanbul: istanbulDistricts,
  ankara: ["Altındağ","Çankaya","Etimesgut","Keçiören","Mamak","Pursaklar","Sincan","Yenimahalle"],
  izmir: ["Balçova","Bayraklı","Bornova","Buca","Çiğli","Gaziemir","Karşıyaka","Konak","Narlıdere"],
  antalya: ["Aksu","Döşemealtı","Kepez","Konyaaltı","Muratpaşa"],
  bursa: ["Nilüfer","Osmangazi","Yıldırım","Gemlik","Mudanya"],
};

export function getDistrictsForProvince(slug: string): string[] {
  return districtsByProvince[slug] || [];
}

export function findProvince(slug: string): Province | undefined {
  return provinces.find((p) => p.slug === slug);
}

export { toSlug };
