import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Kindergarten, Activity, Facility, PriceItem } from '@/data/kindergartens';

function mapRowToKindergarten(row: {
  id: string;
  name_ar: string;
  name_fr: string;
  municipality: string;
  municipality_ar: string;
  municipality_fr: string;
  address: string;
  address_ar: string;
  address_fr: string;
  phone: string;
  price_per_month: number;
  age_min: number;
  age_max: number;
  working_hours_open: string;
  working_hours_close: string;
  rating: number;
  review_count: number;
  images: unknown;
  services: string[];
  activities: unknown;
  facilities: unknown;
  price_breakdown: unknown;
  has_autism_wing: boolean;
  description_ar: string | null;
  description_fr: string | null;
  coordinates: unknown;
}): Kindergarten {
  const images = Array.isArray(row.images) ? row.images as string[] : [];
  const activities = (Array.isArray(row.activities) ? row.activities : []) as Activity[];
  const facilities = (Array.isArray(row.facilities) ? row.facilities : []) as Facility[];
  const priceBreakdown = (Array.isArray(row.price_breakdown) ? row.price_breakdown : []) as PriceItem[];
  const coords = row.coordinates && typeof row.coordinates === 'object' && 'lat' in row.coordinates && 'lng' in row.coordinates
    ? row.coordinates as { lat: number; lng: number }
    : { lat: 0, lng: 0 };

  return {
    id: row.id,
    name: row.name_ar,
    nameAr: row.name_ar,
    nameFr: row.name_fr,
    municipality: row.municipality,
    municipalityAr: row.municipality_ar,
    municipalityFr: row.municipality_fr,
    address: row.address_ar,
    addressAr: row.address_ar,
    addressFr: row.address_fr,
    phone: row.phone,
    pricePerMonth: row.price_per_month,
    ageRange: { min: row.age_min, max: row.age_max },
    workingHours: { open: row.working_hours_open, close: row.working_hours_close },
    rating: Number(row.rating),
    reviewCount: row.review_count ?? 0,
    images: images.length ? images : ['/placeholder.svg'],
    facilities,
    services: row.services ?? [],
    activities,
    hasAutismWing: row.has_autism_wing ?? false,
    description: row.description_ar ?? '',
    descriptionAr: row.description_ar ?? '',
    descriptionFr: row.description_fr ?? '',
    coordinates: coords,
    priceBreakdown,
  };
}

export function useKindergartens() {
  const query = useQuery({
    queryKey: ['kindergartens'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kindergartens')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      return (data ?? []).map(mapRowToKindergarten);
    },
    staleTime: 60 * 1000,
    retry: 1,
  });

  return query;
}
