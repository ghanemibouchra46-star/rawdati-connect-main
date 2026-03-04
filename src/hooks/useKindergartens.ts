import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Kindergarten, Activity, Facility, PriceItem } from '@/data/kindergartens';

const mapRowToKindergarten = (row: any): Kindergarten => {
  const images = Array.isArray(row?.images) ? row.images as string[] : [];
  const activities = (Array.isArray(row?.activities) ? row.activities : []) as Activity[];
  const facilities = (Array.isArray(row?.facilities) ? row.facilities : []) as Facility[];
  const priceBreakdown = (Array.isArray(row?.price_breakdown) ? row.price_breakdown : []) as PriceItem[];

  const rawCoords = row?.coordinates;
  const coords = rawCoords && typeof rawCoords === 'object' && 'lat' in rawCoords && 'lng' in rawCoords
    ? rawCoords as { lat: number; lng: number }
    : { lat: 0, lng: 0 };

  return {
    id: row?.id || '',
    name: row?.name_ar || '',
    nameAr: row?.name_ar || '',
    nameFr: row?.name_fr || '',
    municipality: row?.municipality || '',
    municipalityAr: row?.municipality_ar || '',
    municipalityFr: row?.municipality_fr || '',
    address: row?.address_ar || '',
    addressAr: row?.address_ar || '',
    addressFr: row?.address_fr || '',
    phone: row?.phone || '',
    pricePerMonth: row?.price_per_month || 0,
    ageRange: { min: row?.age_min || 3, max: row?.age_max || 6 },
    workingHours: { open: row?.working_hours_open || '07:30', close: row?.working_hours_close || '17:00' },
    rating: Number(row?.rating) || 0,
    reviewCount: row?.review_count ?? 0,
    images: images.length ? images : ['/placeholder.svg'],
    facilities,
    services: Array.isArray(row?.services) ? row.services : [],
    activities,
    hasAutismWing: row.has_autism_wing ?? false,
    instagram: row.instagram,
    videos: (row.videos as any) || [],
    programs: (row.programs as any) || [],
    description: row?.description_ar || '',
    descriptionAr: row?.description_ar || '',
    descriptionFr: row?.description_fr || '',
    coordinates: coords,
    priceBreakdown,
  };
};

export function useKindergartens() {
  const query = useQuery({
    queryKey: ['kindergartens'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kindergartens')
        .select('*')
        .eq('status', 'approved')
        .order('rating', { ascending: false });

      if (error) {
        console.error("Error fetching kindergartens:", error);
        return [];
      }

      try {
        return (data ?? []).map((row: any) => {
          try {
            return mapRowToKindergarten(row);
          } catch (e) {
            console.error("Error mapping single row:", e, row);
            return null;
          }
        }).filter(Boolean) as Kindergarten[];
      } catch (e) {
        console.error("Error mapping kindergartens:", e);
        return [];
      }
    },
    staleTime: 60 * 1000,
    retry: 1,
  });

  return query;
}
