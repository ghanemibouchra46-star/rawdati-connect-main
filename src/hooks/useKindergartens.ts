import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { kindergartens, type Kindergarten, type Activity, type Facility, type PriceItem } from '@/data/kindergartens';

const mapRowToKindergarten = (row: any): Kindergarten => {
  const parsePostgresArray = (val: any): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      if (val.startsWith('{') && val.endsWith('}')) {
        return val.substring(1, val.length - 1).split(',').map(s => s.trim().replace(/^"|"$/g, ''));
      }
      return val.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  const images = parsePostgresArray(row?.images);
  const rawActivities = parsePostgresArray(row?.activities);

  const getActivityIcon = (name: string): string => {
    if (!name) return '📚';
    const lowerName = name.toLowerCase();
    if (lowerName.includes('قرآن') || lowerName.includes('تجويد') || lowerName.includes('quran')) return '📖';
    if (lowerName.includes('رياضيات') || lowerName.includes('حساب') || lowerName.includes('سوروبان') || lowerName.includes('math')) return '🧮';
    if (lowerName.includes('رسم') || lowerName.includes('فنون') || lowerName.includes('أشغال') || lowerName.includes('dessin') || lowerName.includes('art')) return '🎨';
    if (lowerName.includes('لغة') || lowerName.includes('عربية') || lowerName.includes('فرنسية') || lowerName.includes('إنجليزية') || lowerName.includes('langue')) return '🌍';
    if (lowerName.includes('رياضة') || lowerName.includes('سباحة') || lowerName.includes('بدنية') || lowerName.includes('sport')) return '⚽';
    if (lowerName.includes('لعب') || lowerName.includes('ألعاب') || lowerName.includes('jeu')) return '🎯';
    if (lowerName.includes('موسيقى') || lowerName.includes('أناشيد') || lowerName.includes('music')) return '🎵';
    if (lowerName.includes('روبوتيك') || lowerName.includes('برمجة') || lowerName.includes('robot')) return '🤖';
    if (lowerName.includes('مسرح') || lowerName.includes('تمثيل')) return '🎭';
    return '✨'; // default fallback icon
  };

  const activities = rawActivities.map((act: any, i: number) => {
    if (typeof act === 'string') {
      return {
        id: `act-${row.id}-${i}`,
        nameAr: act,
        nameFr: act,
        description: '',
        schedule: '',
        icon: getActivityIcon(act)
      };
    }

    // Also assign icon if act is an object but has no icon
    if (act && typeof act === 'object' && !act.icon) {
      act.icon = getActivityIcon(act.nameAr || act.nameFr || '');
    }

    return act;
  }) as Activity[];
  const facilities = (Array.isArray(row?.facilities) ? row.facilities : []) as Facility[];
  const priceBreakdown = (Array.isArray(row?.price_breakdown) ? row.price_breakdown : []) as PriceItem[];

  let rawCoords = row?.coordinates;
  if (typeof rawCoords === 'string') {
    try {
      // Sometimes it might come as a string like '{"lat": 35.4, "lng": 0.1}'
      rawCoords = JSON.parse(rawCoords);
    } catch (e) {
      // Or maybe '35.4, 0.1'
      const parts = rawCoords.split(',').map(s => parseFloat(s.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        rawCoords = { lat: parts[0], lng: parts[1] };
      }
    }
  }

  let coords = rawCoords && typeof rawCoords === 'object' && 'lat' in rawCoords && 'lng' in rawCoords
    ? rawCoords as { lat: number; lng: number }
    : null;

  // Fallback to static mock data if coordinates are missing in DB
  if (!coords) {
    if (row?.name_ar?.includes('الفيانس')) {
      coords = { lat: 35.3950, lng: 0.1450 }; // المنطقة 8
    } else if (row?.name_ar?.includes('براعم الوفاء')) {
      coords = { lat: 35.3880, lng: 0.1500 }; // القسم 77
    } else if (row?.name_ar?.includes('اليسر اكاديمي')) {
      coords = { lat: 35.4050, lng: 0.1300 }; // القسم 94
    } else {
      const mockK = kindergartens.find(k => k.nameAr === row?.name_ar || k.nameFr === row?.name_fr);
      coords = mockK ? mockK.coordinates : { lat: 35.3975, lng: 0.1397 }; // Default to Mascara
    }
  }

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
    services: parsePostgresArray(row?.services),
    activities,
    hasAutismWing: row.has_autism_wing ?? false,
    instagram: row.instagram,
    videos: (row.videos as any) || [],
    programs: (row.programs as any) || [],
    partners: {
      doctors: parsePostgresArray(row.doctors || row.doctor_info),
      stores: []
    },
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

      console.log("Raw Supabase data:", data);

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
