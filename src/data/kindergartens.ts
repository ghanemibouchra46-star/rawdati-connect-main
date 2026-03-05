export interface Activity {
  id: string;
  nameAr: string;
  nameFr: string;
  description: string;
  schedule: string;
  icon: string;
}

export interface PriceItem {
  id: string;
  nameAr: string;
  nameFr: string;
  price: number;
  type: 'monthly' | 'annual' | 'one-time';
  optional: boolean;
}

export interface Facility {
  nameAr: string;
  nameFr: string;
  image: string;
}

export interface Kindergarten {
  id: string;
  name: string;
  nameAr: string;
  nameFr: string;
  municipality: string;
  municipalityAr: string;
  municipalityFr: string;
  address: string;
  addressAr: string;
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
  videos?: { id: string; url: string; titleAr: string; titleFr: string }[];
  programs?: { id: string; nameAr: string; nameFr: string; descriptionAr: string; descriptionFr: string; icon: string }[];
  partners?: {
    doctors: string[];
    stores: string[];
  };
  description: string;
  descriptionAr: string;
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
  { id: 'bus', nameAr: 'نقل مدرسي', nameFr: 'Transport scolaire', icon: '🚌' },
  { id: 'meals', nameAr: 'وجبات غذائية', nameFr: 'Repas', icon: '🍽️' },
  { id: 'mental-math', nameAr: 'الحساب الذهني', nameFr: 'Calcul mental', icon: '🧮' },
  { id: 'languages', nameAr: 'لغات أجنبية', nameFr: 'Langues étrangères', icon: '🌍' },
  { id: 'quran', nameAr: 'تحفيظ القرآن', nameFr: 'Mémorisation du Coran', icon: '📖' },
  { id: 'sports', nameAr: 'أنشطة رياضية', nameFr: 'Activités sportives', icon: '⚽' },
];

export const filterableActivities = [
  { id: 'drawing', nameAr: 'الرسم والتلوين', nameFr: 'Dessin', icon: '🎨' },
  { id: 'music', nameAr: 'الأناشيد', nameFr: 'Chants', icon: '🎵' },
  { id: 'robotics', nameAr: 'الروبوتيك', nameFr: 'Robotique', icon: '🤖' },
  { id: 'swimming', nameAr: 'السباحة', nameFr: 'Natation', icon: '🏊' },
  { id: 'games', nameAr: 'ألعاب تعليمية', nameFr: 'Jeux éducatifs', icon: '🧩' },
  { id: 'quran', nameAr: 'تحفيظ القرآن', nameFr: 'Coran', icon: '📖' },
];

/** قائمة الروضات من قاعدة البيانات فقط - لا توجد بيانات وهمية */
export const kindergartens: Kindergarten[] = [];
