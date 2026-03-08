import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { kindergartens, type Kindergarten, type Activity, type Facility, type PriceItem, type KindergartenGallery } from '@/data/kindergartens';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

/**
 * Resolve an image path to a full public URL.
 * Handles:
 * - Full URLs (https://...) → returned as-is
 * - Supabase storage paths (bucket/path or /storage/v1/...) → converted to public URL
 * - Just filenames (image.jpg) → assumed to be in 'kindergarten-images' bucket
 */
const resolveImageUrl = (imagePath: string): string => {
  if (!imagePath || imagePath.trim() === '') return '/placeholder.svg';
  
  const trimmed = imagePath.trim();
  
  // Already a full URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  // Already a relative path starting with /storage/
  if (trimmed.startsWith('/storage/')) {
    return `${SUPABASE_URL}${trimmed}`;
  }

  // Path like "kindergarten-images/filename.jpg" (bucket/path format)
  // or just "filename.jpg" (assume kindergarten-images bucket)
  const hasSlash = trimmed.includes('/');
  const storagePath = hasSlash ? trimmed : `kindergarten-images/${trimmed}`;
  
  return `${SUPABASE_URL}/storage/v1/object/public/${storagePath}`;
};

const normalizeMunicipality = (val: string): string => {
  if (!val) return '';
  const lower = val.toLowerCase().trim();
  // Direct match if already an ID
  const validIds = ['mascara', 'sig', 'tighennif', 'mohammadia', 'ghriss'];
  if (validIds.includes(lower)) return lower;
  // Map Arabic names to IDs
  if (val.includes('معسكر')) return 'mascara';
  if (val.includes('سيق')) return 'sig';
  if (val.includes('تيغنيف')) return 'tighennif';
  if (val.includes('المحمدية') || val.includes('محمدية')) return 'mohammadia';
  if (val.includes('غريس')) return 'ghriss';
  // Map French names to IDs
  if (lower.includes('mascara')) return 'mascara';
  if (lower.includes('sig')) return 'sig';
  if (lower.includes('tighennif')) return 'tighennif';
  if (lower.includes('mohammadia')) return 'mohammadia';
  if (lower.includes('ghriss')) return 'ghriss';
  return val;
};

const normalizeServiceName = (serviceId: string): string => {
  if (!serviceId) return '';
  const lower = serviceId.toLowerCase().trim();
  
  // Map IDs to Arabic names
  if (lower === 'bus' || serviceId.includes('نقل') || lower.includes('transport')) return 'نقل مدرسي';
  if (lower === 'meals' || serviceId.includes('وجبات') || lower.includes('repas')) return 'وجبات غذائية';
  if (lower === 'mental-math' || serviceId.includes('حساب') || lower.includes('calcul')) return 'الحساب الذهني';
  if (lower === 'languages' || serviceId.includes('لغات') || lower.includes('langue')) return 'لغات أجنبية';
  if (lower === 'quran' || serviceId.includes('قرآن') || lower.includes('coran')) return 'تحفيظ القرآن';
  if (lower === 'sports' || serviceId.includes('رياضي') || lower.includes('sport')) return 'أنشطة رياضية';
  
  // If already Arabic name, return as-is
  return serviceId;
};

const mapRowToKindergarten = (row: any): Kindergarten => {
  const parsePostgresArray = (val: any): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val.filter(Boolean);
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (!trimmed) return [];
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        return trimmed.substring(1, trimmed.length - 1).split(',').map(s => s.trim().replace(/^"|"$/g, '')).filter(Boolean);
      }
      return trimmed.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  const images = (parsePostgresArray(row?.images) || []).map(img => {
    if (!img || typeof img !== 'string') return null;
    return resolveImageUrl(img);
  }).filter(Boolean);
  
  if (!images || images.length === 0) {
    console.warn(`⚠️ No valid images for kindergarten ${row?.id}, will use placeholder`);
  }
  
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
    municipality: normalizeMunicipality(row?.municipality || row?.municipality_ar || ''),
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
    images: (images?.length > 0 ? images : ['/placeholder.svg']),
    facilities: facilities,
    services: parsePostgresArray(row?.services).map(normalizeServiceName),
    activities: activities,
    hasAutismWing: row?.has_autism_wing ?? false,
    instagram: row?.instagram,
    videos: row?.videos || [],
    programs: row?.programs || [],
    partners: {
      doctors: parsePostgresArray(row?.doctors || row?.doctor_info),
      stores: []
    },
    description: row?.description_ar || '',
    descriptionAr: row?.description_ar || '',
    descriptionFr: row?.description_fr || '',
    coordinates: coords,
    priceBreakdown,
    isPremium: row?.is_premium || false,
    paymentInfo: row?.payment_info || null,
    kindergartenGallery: (() => {
      try {
        const gallery = row?.kindergarten_gallery;
        if (!gallery) return [];
        
        // Handle array of URLs (simple case)
        if (Array.isArray(gallery)) {
          return gallery.map((item: any, index: number) => {
            // If it's a string (URL), create a basic object
            if (typeof item === 'string') {
              return {
                id: `gallery-${row.id}-${index}`,
                titleAr: `صورة ${index + 1}`,
                titleFr: `Image ${index + 1}`,
                descriptionAr: '',
                descriptionFr: '',
                image: item.startsWith('http') ? item : resolveImageUrl(item),
                category: 'activity' as const
              };
            }
            // If it's already an object, use it as-is
            return {
              id: item.id || `gallery-${row.id}-${index}`,
              titleAr: item.titleAr || `صورة ${index + 1}`,
              titleFr: item.titleFr || `Image ${index + 1}`,
              descriptionAr: item.descriptionAr || '',
              descriptionFr: item.descriptionFr || '',
              image: item.image || '/placeholder.svg',
              category: item.category || 'activity'
            };
          }) as KindergartenGallery[];
        }
        
        // Handle string that might be JSON array
        if (typeof gallery === 'string') {
          const parsed = JSON.parse(gallery);
          if (Array.isArray(parsed)) {
            return parsed.map((item: any, index: number) => {
              // If it's a string (URL), create a basic object
              if (typeof item === 'string') {
                return {
                  id: `gallery-${row.id}-${index}`,
                  titleAr: `صورة ${index + 1}`,
                  titleFr: `Image ${index + 1}`,
                  descriptionAr: '',
                  descriptionFr: '',
                  image: item.startsWith('http') ? item : resolveImageUrl(item),
                  category: 'activity' as const
                };
              }
              // If it's already an object, use it as-is
              return {
                id: item.id || `gallery-${row.id}-${index}`,
                titleAr: item.titleAr || `صورة ${index + 1}`,
                titleFr: item.titleFr || `Image ${index + 1}`,
                descriptionAr: item.descriptionAr || '',
                descriptionFr: item.descriptionFr || '',
                image: item.image || '/placeholder.svg',
                category: item.category || 'activity'
              };
            }) as KindergartenGallery[];
          }
        }
        
        return [];
      } catch (e) {
        console.error("Error parsing kindergartenGallery for", row?.name_ar, ":", e);
        return [];
      }
    })(),
  };
};

export function useKindergartens() {
  const query = useQuery({
    queryKey: ['kindergartens'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('kindergartens')
          .select('*')
          .eq('status', 'approved')
          .order('rating', { ascending: false });

        if (error) {
          console.error("Error fetching kindergartens from Supabase:", error?.message);
          console.log("Using local kindergartens as fallback");
          return kindergartens;
        }

        if (!data) {
          console.warn("No data returned from Supabase");
          return kindergartens;
        }

        console.log(`Fetched ${data?.length || 0} kindergartens from Supabase`);

        if (!data || data.length === 0) {
          console.log("No data from Supabase, using local kindergartens");
          return kindergartens;
        }

        const mappedData = (data ?? []).map((row: any) => {
          if (!row?.id) {
            console.warn("Skipping row without ID:", row);
            return null;
          }
          try {
            const mapped = mapRowToKindergarten(row);
            if (!mapped?.nameAr) {
              console.warn(`Skipped kindergarten with no name:`, row?.id);
              return null;
            }
            console.log(`✓ Mapped: ${mapped?.nameAr} (ID: ${mapped?.id})`);
            return mapped;
          } catch (e) {
            console.error(`Error mapping kindergarten ${row?.id}:`, e);
            return null;
          }
        }).filter(Boolean) as Kindergarten[];

        console.log(`✓ Loaded ${mappedData.length} kindergartens successfully`);
        return mappedData;
      } catch (e) {
        console.error("Error in useKindergartens:", e);
        // Return local data as fallback
        console.log("Using local kindergartens as fallback due to error");
        return kindergartens;
      }
    },
    staleTime: 60 * 1000,
    retry: 1,
  });

  return query;
}
