export interface Activity {
  id: string;
  name_ar: string;
  nameFr: string;
  description: string;
  schedule: string;
  icon: string;
}

export interface PriceItem {
  id: string;
  name_ar: string;
  nameFr: string;
  price: number;
  type: 'monthly' | 'annual' | 'one-time';
  optional: boolean;
}

export interface Facility {
  name_ar: string;
  nameFr: string;
  image: string;
}

export interface KindergartenGallery {
  id: string;
  title_ar: string;
  titleFr: string;
  description_ar?: string;
  descriptionFr?: string;
  image: string;
  category: 'activity' | 'program';
}

export interface Kindergarten {
  id: string;
  name: string;
  name_ar: string;
  nameFr: string;
  municipality: string;
  municipality_ar: string;
  municipalityFr: string;
  address: string;
  address_ar: string;
  addressFr: string;
  phone: string;
  pricePerMonth: number;
  priceBreakdown: PriceItem[];
  ageRange: { min: number; max: number };
  workingHours: { open: string; close: string };
  rating: number;
  reviewCount: number;
  images: string[];
  facilities: Facility[];
  services: string[];
  activities: Activity[];
  hasAutismWing: boolean;
  instagram?: string;
  videos?: { id: string; url: string; title_ar: string; titleFr: string }[];
  programs?: { id: string; name_ar: string; nameFr: string; description_ar: string; descriptionFr: string; icon: string }[];
  kindergartenGallery?: KindergartenGallery[];
  isPremium?: boolean;
  paymentInfo?: string | null;
  partners?: {
    doctors: string[];
    stores: string[];
  };
  description: string;
  description_ar: string;
  descriptionFr: string;
  coordinates: { lat: number; lng: number };
}

export const municipalities = [
  { id: 'mascara', nameAr: 'معسكر', nameFr: 'Mascara' },
  { id: 'sig', nameAr: 'سيق', nameFr: 'Sig' },
  { id: 'tighennif', nameAr: 'تيغنيف', nameFr: 'Tighennif' },
  { id: 'mohammadia', nameAr: 'المحمدية', nameFr: 'Mohammadia' },
  { id: 'ghriss', nameAr: 'غريس', nameFr: 'Ghriss' },
];

export const services = [
  { id: 'bus', name_ar: 'نقل مدرسي', nameFr: 'Transport scolaire', icon: '🚌' },
  { id: 'meals', name_ar: 'وجبات غذائية', nameFr: 'Repas', icon: '🍽️' },
  { id: 'mental-math', name_ar: 'الحساب الذهني', nameFr: 'Calcul mental', icon: '🧮' },
  { id: 'languages', name_ar: 'لغات أجنبية', nameFr: 'Langues étrangères', icon: '🌍' },
  { id: 'quran', name_ar: 'تحفيظ القرآن', nameFr: 'Mémorisation du Coran', icon: '📖' },
  { id: 'sports', name_ar: 'أنشطة رياضية', nameFr: 'Activités sportives', icon: '⚽' },
];

export const filterableActivities = [
  { id: 'drawing', name_ar: 'الرسم والتلوين', nameFr: 'Dessin', icon: '🎨' },
  { id: 'music', name_ar: 'الأناشيد', nameFr: 'Chants', icon: '🎵' },
  { id: 'robotics', name_ar: 'الروبوتيك', nameFr: 'Robotique', icon: '🤖' },
  { id: 'swimming', name_ar: 'السباحة', nameFr: 'Natation', icon: '🏊' },
  { id: 'games', name_ar: 'ألعاب تعليمية', nameFr: 'Jeux éducatifs', icon: '🧩' },
  { id: 'quran', name_ar: 'تحفيظ القرآن', nameFr: 'Coran', icon: '📖' },
];

/** قائمة الروضات من قاعدة البيانات فقط - لا توجد بيانات وهمية */
export const kindergartens: Kindergarten[] = [];
