export interface Activity {
  id: string;
  name_ar: string;
  nameFr: string;
  nameEn: string;
  description: string;
  schedule: string;
  icon: string;
}

export interface PriceItem {
  id: string;
  name_ar: string;
  nameFr: string;
  nameEn: string;
  price: number;
  type: 'monthly' | 'annual' | 'one-time';
  optional: boolean;
}

export interface Facility {
  name_ar: string;
  nameFr: string;
  nameEn: string;
  image: string;
}

export interface KindergartenGallery {
  id: string;
  title_ar: string;
  titleFr: string;
  titleEn: string;
  description_ar?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  image: string;
  category: 'activity' | 'program';
}

export interface Kindergarten {
  id: string;
  name: string;
  name_ar: string;
  nameFr: string;
  nameEn: string;
  municipality: string;
  municipality_ar: string;
  municipalityFr: string;
  municipalityEn: string;
  address: string;
  address_ar: string;
  addressFr: string;
  addressEn: string;
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
  videos?: { id: string; url: string; title_ar: string; titleFr: string; titleEn: string }[];
  programs?: { id: string; name_ar: string; nameFr: string; nameEn: string; description_ar: string; descriptionFr: string; descriptionEn: string; icon: string }[];
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
  descriptionEn: string;
  coordinates: { lat: number; lng: number };
}

export const municipalities = [
  { id: 'mascara', nameAr: 'معسكر', nameFr: 'Mascara', nameEn: 'Mascara' },
  { id: 'sig', nameAr: 'سيق', nameFr: 'Sig', nameEn: 'Sig' },
  { id: 'tighennif', nameAr: 'تيغنيف', nameFr: 'Tighennif', nameEn: 'Tighennif' },
  { id: 'mohammadia', nameAr: 'المحمدية', nameFr: 'Mohammadia', nameEn: 'Mohammadia' },
  { id: 'ghriss', nameAr: 'غريس', nameFr: 'Ghriss', nameEn: 'Ghriss' },
];

export const services = [
  { id: 'bus', name_ar: 'نقل مدرسي', nameFr: 'Transport scolaire', nameEn: 'School Bus', icon: '🚌' },
  { id: 'meals', name_ar: 'وجبات غذائية', nameFr: 'Repas', nameEn: 'Meals', icon: '🍽️' },
  { id: 'mental-math', name_ar: 'الحساب الذهني', nameFr: 'Calcul mental', nameEn: 'Mental Math', icon: '🧮' },
  { id: 'languages', name_ar: 'لغات أجنبية', nameFr: 'Langues étrangères', nameEn: 'Foreign Languages', icon: '🌍' },
  { id: 'quran', name_ar: 'تحفيظ القرآن', nameFr: 'Mémorisation du Coran', nameEn: 'Quran Memorization', icon: '📖' },
  { id: 'sports', name_ar: 'أنشطة رياضية', nameFr: 'Activités sportives', nameEn: 'Sports Activities', icon: '⚽' },
];

export const filterableActivities = [
  { id: 'drawing', name_ar: 'الرسم والتلوين', nameFr: 'Dessin', nameEn: 'Drawing', icon: '🎨' },
  { id: 'music', name_ar: 'الأناشيد', nameFr: 'Chants', nameEn: 'Songs', icon: '🎵' },
  { id: 'robotics', name_ar: 'الروبوتيك', nameFr: 'Robotique', nameEn: 'Robotics', icon: '🤖' },
  { id: 'swimming', name_ar: 'السباحة', nameFr: 'Natation', nameEn: 'Swimming', icon: '🏊' },
  { id: 'games', name_ar: 'ألعاب تعليمية', nameFr: 'Jeux éducatifs', nameEn: 'Educational Games', icon: '🧩' },
  { id: 'quran', name_ar: 'تحفيظ القرآن', nameFr: 'Coran', nameEn: 'Quran', icon: '📖' },
];

/** قائمة الروضات من قاعدة البيانات فقط - لا توجد بيانات وهمية */
export const kindergartens: Kindergarten[] = [];
