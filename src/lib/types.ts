export interface Province {
  name: string;
  slug: string;
  districts?: District[];
}

export interface District {
  name: string;
  slug: string;
}

export interface Pharmacy {
  name: string;
  address: string;
  phone: string;
  district: string;
  lat?: number;
  lng?: number;
  distance?: number;
}

export interface PharmacyResponse {
  province: string;
  district?: string;
  date: string;
  lastUpdated: string;
  pharmacies: Pharmacy[];
}
