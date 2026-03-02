import kindergarten1 from '@/assets/kindergarten-1.jpg';
import kindergarten2 from '@/assets/kindergarten-2.jpg';
import kindergarten3 from '@/assets/kindergarten-3.jpg';
import kindergarten4 from '@/assets/kindergarten-4.jpg';
import kindergarten5 from '@/assets/kindergarten-5.jpg';
import kindergarten6 from '@/assets/kindergarten-6.jpg';
import kindergartenNour1 from '@/assets/kindergarten-nour-1.jpg';
import kindergartenIman1 from '@/assets/kindergarten-iman-1.jpg';

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
  { id: 'mascara', nameAr: 'Rawdati', nameFr: 'Rawdati' },
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

// Default activities for kindergartens
const defaultActivities: Activity[] = [
  { id: 'drawing', nameAr: 'الرسم والتلوين', nameFr: 'Dessin et coloriage', description: 'تنمية المهارات الفنية والإبداعية', schedule: 'يومياً 09:00-10:00', icon: '🎨' },
  { id: 'music', nameAr: 'الأناشيد', nameFr: 'Chants', description: 'تعلم الأناشيد الإسلامية والوطنية', schedule: 'الإثنين والأربعاء', icon: '🎵' },
  { id: 'games', nameAr: 'الألعاب التعليمية', nameFr: 'Jeux éducatifs', description: 'ألعاب تنمية الذكاء والتفكير', schedule: 'يومياً 11:00-12:00', icon: '🧩' },
  { id: 'quran-class', nameAr: 'حلقة القرآن', nameFr: 'Cercle du Coran', description: 'حفظ السور القصيرة والأدعية', schedule: 'يومياً بعد الصلاة', icon: '📖' },
  { id: 'sports-activity', nameAr: 'النشاط الرياضي', nameFr: 'Activité sportive', description: 'رياضة وحركة في الهواء الطلق', schedule: 'الخميس 14:00-15:00', icon: '⚽' },
];

export const kindergartens: Kindergarten[] = [
  {
    id: '1',
    name: 'Rawdat Al-Amal',
    nameAr: 'روضة الأمل',
    nameFr: 'Jardin Al-Amal',
    municipality: 'mascara',
    municipalityAr: 'Rawdati',
    municipalityFr: 'Rawdati',
    address: 'Rue de la République, Mascara',
    addressAr: 'شارع الجمهورية، Rawdati',
    addressFr: 'Rue de la République, Rawdati',
    phone: '045 80 12 34',
    pricePerMonth: 8000,
    ageRange: { min: 3, max: 6 },
    workingHours: { open: '07:30', close: '17:00' },
    rating: 4.8,
    reviewCount: 124,
    images: [kindergarten1, kindergarten4, kindergarten5],
    services: ['bus', 'meals', 'mental-math', 'quran'],
    activities: [
      { id: 'drawing', nameAr: 'الرسم والتلوين', nameFr: 'Dessin', description: 'تنمية المهارات الفنية', schedule: 'يومياً 09:00-10:00', icon: '🎨' },
      { id: 'quran-class', nameAr: 'حلقة القرآن', nameFr: 'Coran', description: 'حفظ جزء عمّ', schedule: 'يومياً 08:00-09:00', icon: '📖' },
      { id: 'mental-math', nameAr: 'الحساب الذهني', nameFr: 'Calcul mental', description: 'تعلم الأرقام والعمليات', schedule: 'الأحد والثلاثاء', icon: '🧮' },
      { id: 'games', nameAr: 'ألعاب تعليمية', nameFr: 'Jeux', description: 'تنمية الذكاء', schedule: 'يومياً 11:00-12:00', icon: '🧩' },
    ],
    description: 'A leading kindergarten with modern facilities and experienced staff.',
    descriptionAr: 'روضة رائدة مع مرافق حديثة وطاقم ذو خبرة عالية. نوفر بيئة آمنة ومحفزة لأطفالكم.',
    descriptionFr: 'Un jardin d\'enfants de premier plan avec des installations modernes et un personnel expérimenté.',
    coordinates: { lat: 35.3975, lng: 0.1397 },
    priceBreakdown: [
      { id: 'registration', nameAr: 'رسوم التسجيل', nameFr: 'Frais d\'inscription', price: 2000, type: 'annual', optional: false },
      { id: 'insurance', nameAr: 'التأمين', nameFr: 'Assurance', price: 1000, type: 'annual', optional: false },
      { id: 'tuition', nameAr: 'المصاريف الشهرية', nameFr: 'Frais mensuels', price: 8000, type: 'monthly', optional: false },
      { id: 'transport', nameAr: 'النقل', nameFr: 'Transport', price: 2500, type: 'monthly', optional: true },
      { id: 'meals', nameAr: 'الإطعام', nameFr: 'Restauration', price: 3000, type: 'monthly', optional: true },
    ],
    facilities: [
      { nameAr: 'قسم التحضيري', nameFr: 'Classe Préparatoire', image: kindergarten1 },
      { nameAr: 'ساحة اللعب', nameFr: 'Aire de Jeux', image: kindergarten4 },
      { nameAr: 'المطعم', nameFr: 'Cantine', image: kindergarten5 },
    ],
    hasAutismWing: true,
    partners: {
      doctors: ['Dr. Ahmed Benali (Pédiatre)', 'Dr. Sarah Bouzid (Orthophoniste)'],
      stores: ['Kids World (Vêtements)', 'Baby Shop (Jouets)'],
    },
  },
  {
    id: '2',
    name: 'Rawdat Al-Zahra',
    nameAr: 'روضة الزهراء',
    nameFr: 'Jardin Al-Zahra',
    municipality: 'sig',
    municipalityAr: 'سيق',
    municipalityFr: 'Sig',
    address: 'Avenue de l\'Indépendance, Sig',
    addressAr: 'شارع الاستقلال، سيق',
    addressFr: 'Avenue de l\'Indépendance, Sig',
    phone: '045 78 56 78',
    pricePerMonth: 6500,
    ageRange: { min: 2, max: 5 },
    workingHours: { open: '08:00', close: '16:30' },
    rating: 4.5,
    reviewCount: 89,
    images: [kindergarten2, kindergarten3],
    services: ['meals', 'languages', 'sports'],
    activities: [
      { id: 'english', nameAr: 'اللغة الإنجليزية', nameFr: 'Anglais', description: 'تعلم أساسيات اللغة', schedule: 'الأحد والثلاثاء', icon: '🌍' },
      { id: 'french', nameAr: 'اللغة الفرنسية', nameFr: 'Français', description: 'تعلم الحروف والكلمات', schedule: 'الإثنين والأربعاء', icon: '🇫🇷' },
      { id: 'sports', nameAr: 'الرياضة', nameFr: 'Sport', description: 'أنشطة بدنية متنوعة', schedule: 'يومياً 15:00-16:00', icon: '⚽' },
    ],
    description: 'A warm and welcoming kindergarten in Sig.',
    descriptionAr: 'روضة دافئة ومرحبة في سيق. نركز على تنمية المهارات الاجتماعية والإبداعية للأطفال.',
    descriptionFr: 'Un jardin d\'enfants chaleureux et accueillant à Sig.',
    coordinates: { lat: 35.5279, lng: -0.1931 },
    priceBreakdown: [
      { id: 'registration', nameAr: 'رسوم التسجيل', nameFr: 'Frais d\'inscription', price: 1500, type: 'annual', optional: false },
      { id: 'insurance', nameAr: 'التأمين', nameFr: 'Assurance', price: 800, type: 'annual', optional: false },
      { id: 'tuition', nameAr: 'المصاريف الشهرية', nameFr: 'Frais mensuels', price: 6500, type: 'monthly', optional: false },
      { id: 'meals', nameAr: 'الإطعام', nameFr: 'Restauration', price: 2500, type: 'monthly', optional: true },
    ],
    facilities: [
      { nameAr: 'غرفة النوم', nameFr: 'Dortoir', image: kindergarten2 },
      { nameAr: 'قاعة الأنشطة', nameFr: 'Salle d\'activités', image: kindergarten3 },
    ],
    hasAutismWing: false,
  },
  {
    id: '3',
    name: 'Rawdat Al-Nour',
    nameAr: 'روضة النور',
    nameFr: 'Jardin Al-Nour',
    municipality: 'tighennif',
    municipalityAr: 'تيغنيف',
    municipalityFr: 'Tighennif',
    address: 'Centre Ville, Tighennif',
    addressAr: 'وسط المدينة، تيغنيف',
    addressFr: 'Centre Ville, Tighennif',
    phone: '045 65 43 21',
    pricePerMonth: 5500,
    ageRange: { min: 3, max: 6 },
    workingHours: { open: '07:00', close: '17:30' },
    rating: 4.7,
    reviewCount: 67,
    images: [kindergartenNour1, kindergarten1, kindergarten6],
    services: ['bus', 'quran', 'mental-math'],
    activities: [
      { id: 'quran-intensive', nameAr: 'تحفيظ مكثف', nameFr: 'Mémorisation intensive', description: 'حفظ القرآن مع التجويد', schedule: 'يومياً 08:00-10:00', icon: '📖' },
      { id: 'mental-math', nameAr: 'الحساب الذهني', nameFr: 'Calcul mental', description: 'برنامج سوروبان', schedule: 'الأحد والثلاثاء والخميس', icon: '🧮' },
      { id: 'arabic', nameAr: 'اللغة العربية', nameFr: 'Arabe', description: 'القراءة والكتابة', schedule: 'يومياً 10:30-11:30', icon: '✏️' },
      { id: 'drawing', nameAr: 'الفنون', nameFr: 'Arts', description: 'الرسم والأشغال اليدوية', schedule: 'الأربعاء 14:00-15:00', icon: '🎨' },
    ],
    description: 'Educational excellence in Tighennif.',
    descriptionAr: 'تميز تعليمي في تيغنيف. برامج تعليمية متكاملة تجمع بين التعليم الحديث والقيم الإسلامية.',
    descriptionFr: 'Excellence éducative à Tighennif.',
    coordinates: { lat: 35.4164, lng: 0.3272 },
    priceBreakdown: [
      { id: 'registration', nameAr: 'رسوم التسجيل', nameFr: 'Frais d\'inscription', price: 1000, type: 'annual', optional: false },
      { id: 'insurance', nameAr: 'التأمين', nameFr: 'Assurance', price: 1000, type: 'annual', optional: false },
      { id: 'tuition', nameAr: 'المصاريف الشهرية', nameFr: 'Frais mensuels', price: 5500, type: 'monthly', optional: false },
      { id: 'transport', nameAr: 'النقل', nameFr: 'Transport', price: 2000, type: 'monthly', optional: true },
    ],
    facilities: [
      { nameAr: 'المصلى', nameFr: 'Salle de prière', image: kindergartenNour1 },
      { nameAr: 'الحديقة', nameFr: 'Jardin', image: kindergarten6 },
    ],
    hasAutismWing: false,
  },
  {
    id: '4',
    name: 'Rawdat Al-Firdaws',
    nameAr: 'روضة الفردوس',
    nameFr: 'Jardin Al-Firdaws',
    municipality: 'mohammadia',
    municipalityAr: 'المحمدية',
    municipalityFr: 'Mohammadia',
    address: 'Cité des 200 Logements, Mohammadia',
    addressAr: 'حي 200 مسكن، المحمدية',
    addressFr: 'Cité des 200 Logements, Mohammadia',
    phone: '045 92 11 22',
    pricePerMonth: 7000,
    ageRange: { min: 2, max: 6 },
    workingHours: { open: '07:30', close: '16:00' },
    rating: 4.9,
    reviewCount: 156,
    images: [kindergarten3, kindergarten5],
    services: ['bus', 'meals', 'languages', 'sports', 'quran'],
    activities: [
      ...defaultActivities,
      { id: 'swimming', nameAr: 'السباحة', nameFr: 'Natation', description: 'دروس سباحة للأطفال', schedule: 'السبت 10:00-11:00', icon: '🏊' },
    ],
    description: 'Premium kindergarten services in Mohammadia.',
    descriptionAr: 'خدمات روضة متميزة في المحمدية. بيئة تعليمية شاملة مع أحدث الوسائل التعليمية.',
    descriptionFr: 'Services de jardin d\'enfants de qualité à Mohammadia.',
    coordinates: { lat: 35.5747, lng: -0.0831 },
    priceBreakdown: [
      { id: 'registration', nameAr: 'رسوم التسجيل', nameFr: 'Frais d\'inscription', price: 2500, type: 'annual', optional: false },
      { id: 'insurance', nameAr: 'التأمين', nameFr: 'Assurance', price: 1200, type: 'annual', optional: false },
      { id: 'tuition', nameAr: 'المصاريف الشهرية', nameFr: 'Frais mensuels', price: 7000, type: 'monthly', optional: false },
      { id: 'transport', nameAr: 'النقل', nameFr: 'Transport', price: 3000, type: 'monthly', optional: true },
      { id: 'meals', nameAr: 'الإطعام', nameFr: 'Restauration', price: 4000, type: 'monthly', optional: true },
    ],
    facilities: [
      { nameAr: 'المسبح', nameFr: 'Piscine', image: kindergarten3 },
      { nameAr: 'القاعة الرياضية', nameFr: 'Salle de sport', image: kindergarten5 },
    ],
    hasAutismWing: true,
    partners: {
      doctors: ['Dr. Farid Khelil (Psychologue)'],
      stores: [],
    },
  },
  {
    id: '5',
    name: 'Rawdat Al-Majd',
    nameAr: 'روضة المجد',
    nameFr: 'Jardin Al-Majd',
    municipality: 'ghriss',
    municipalityAr: 'غريس',
    municipalityFr: 'Ghriss',
    address: 'Quartier El-Majd, Ghriss',
    addressAr: 'حي المجد، غريس',
    addressFr: 'Quartier El-Majd, Ghriss',
    phone: '045 88 99 00',
    pricePerMonth: 6000,
    ageRange: { min: 3, max: 5 },
    workingHours: { open: '08:00', close: '17:00' },
    rating: 4.6,
    reviewCount: 78,
    images: [kindergarten4, kindergarten2],
    services: ['meals', 'mental-math', 'sports'],
    activities: [
      { id: 'mental-math', nameAr: 'الحساب الذهني', nameFr: 'Calcul mental', description: 'برنامج متقدم', schedule: 'يومياً 09:00-10:00', icon: '🧮' },
      { id: 'sports', nameAr: 'الرياضة', nameFr: 'Sport', description: 'كرة القدم والجمباز', schedule: 'يومياً 15:00-16:00', icon: '⚽' },
      { id: 'games', nameAr: 'الألعاب الذكية', nameFr: 'Jeux intelligents', description: 'شطرنج وألغاز', schedule: 'الإثنين والأربعاء', icon: '♟️' },
    ],
    description: 'Quality education in Ghriss.',
    descriptionAr: 'تعليم عالي الجودة في غريس. نهتم بتطوير قدرات الطفل العقلية والبدنية.',
    descriptionFr: 'Éducation de qualité à Ghriss.',
    coordinates: { lat: 35.2622, lng: 0.0089 },
    priceBreakdown: [
      { id: 'registration', nameAr: 'رسوم التسجيل', nameFr: 'Frais d\'inscription', price: 1500, type: 'annual', optional: false },
      { id: 'tuition', nameAr: 'المصاريف الشهرية', nameFr: 'Frais mensuels', price: 6000, type: 'monthly', optional: false },
      { id: 'meals', nameAr: 'الإطعام', nameFr: 'Restauration', price: 2500, type: 'monthly', optional: true },
    ],
    facilities: [
      { nameAr: 'القسم', nameFr: 'Classe', image: kindergarten4 },
      { nameAr: 'الملعب', nameFr: 'Stade', image: kindergarten2 },
    ],
    hasAutismWing: false,
  },
  {
    id: '6',
    name: 'Rawdat Al-Salam',
    nameAr: 'روضة السلام',
    nameFr: 'Jardin Al-Salam',
    municipality: 'mascara',
    municipalityAr: 'Rawdati',
    municipalityFr: 'Rawdati',
    address: 'Cité El-Amir, Mascara',
    addressAr: 'حي الأمير، Rawdati',
    addressFr: 'Cité El-Amir, Rawdati',
    phone: '045 80 45 67',
    pricePerMonth: 7500,
    ageRange: { min: 2, max: 5 },
    workingHours: { open: '07:00', close: '16:30' },
    rating: 4.4,
    reviewCount: 92,
    images: [kindergarten5, kindergarten1],
    services: ['bus', 'meals', 'quran', 'languages'],
    activities: [
      { id: 'quran', nameAr: 'القرآن الكريم', nameFr: 'Coran', description: 'حفظ وتلاوة', schedule: 'يومياً 08:00-09:00', icon: '📖' },
      { id: 'french', nameAr: 'الفرنسية', nameFr: 'Français', description: 'محادثة وقراءة', schedule: 'الأحد والثلاثاء', icon: '🇫🇷' },
      { id: 'english', nameAr: 'الإنجليزية', nameFr: 'Anglais', description: 'أساسيات اللغة', schedule: 'الإثنين والأربعاء', icon: '🇬🇧' },
      { id: 'music', nameAr: 'الأناشيد', nameFr: 'Chants', description: 'أناشيد إسلامية', schedule: 'الخميس', icon: '🎵' },
    ],
    description: 'A peaceful learning environment.',
    descriptionAr: 'بيئة تعليمية هادئة. نوفر رعاية شاملة وبرامج تعليمية متنوعة.',
    descriptionFr: 'Un environnement d\'apprentissage paisible.',
    coordinates: { lat: 35.4012, lng: 0.1425 },
    priceBreakdown: [
      { id: 'registration', nameAr: 'رسوم التسجيل', nameFr: 'Frais d\'inscription', price: 1800, type: 'annual', optional: false },
      { id: 'insurance', nameAr: 'التأمين', nameFr: 'Assurance', price: 900, type: 'annual', optional: false },
      { id: 'tuition', nameAr: 'المصاريف الشهرية', nameFr: 'Frais mensuels', price: 7500, type: 'monthly', optional: false },
      { id: 'transport', nameAr: 'النقل', nameFr: 'Transport', price: 2800, type: 'monthly', optional: true },
      { id: 'meals', nameAr: 'الإطعام', nameFr: 'Restauration', price: 3200, type: 'monthly', optional: true },
    ],
    facilities: [
      { nameAr: 'المكتبة', nameFr: 'Bibliothèque', image: kindergarten1 },
      { nameAr: 'الحديقة', nameFr: 'Jardin', image: kindergarten5 },
    ],
    hasAutismWing: false,
  },
  {
    id: '7',
    name: 'Rawdat Al-Iman',
    nameAr: 'روضة الإيمان',
    nameFr: 'Jardin Al-Iman',
    municipality: 'sig',
    municipalityAr: 'سيق',
    municipalityFr: 'Sig',
    address: 'Rue des Martyrs, Sig',
    addressAr: 'شارع الشهداء، سيق',
    addressFr: 'Rue des Martyrs, Sig',
    phone: '045 78 12 34',
    pricePerMonth: 5000,
    ageRange: { min: 3, max: 6 },
    workingHours: { open: '08:00', close: '17:00' },
    rating: 4.3,
    reviewCount: 65,
    images: [kindergartenIman1, kindergarten6, kindergarten4],
    services: ['quran', 'mental-math', 'meals'],
    activities: [
      { id: 'quran-tahfidh', nameAr: 'تحفيظ القرآن', nameFr: 'Mémorisation du Coran', description: 'حفظ جزء عمّ كاملاً', schedule: 'يومياً 08:00-10:00', icon: '📖' },
      { id: 'tajweed', nameAr: 'التجويد', nameFr: 'Tajweed', description: 'أحكام التلاوة', schedule: 'الأحد والثلاثاء', icon: '🕌' },
      { id: 'islamic-education', nameAr: 'التربية الإسلامية', nameFr: 'Éducation islamique', description: 'الآداب والأخلاق', schedule: 'يومياً', icon: '🌙' },
      { id: 'arabic', nameAr: 'العربية', nameFr: 'Arabe', description: 'القراءة والكتابة', schedule: 'يومياً 11:00-12:00', icon: '✏️' },
      { id: 'mental-math', nameAr: 'الحساب الذهني', nameFr: 'Calcul mental', description: 'الأرقام والعمليات', schedule: 'الإثنين والأربعاء', icon: '🧮' },
    ],
    description: 'Faith-based education in Sig.',
    descriptionAr: 'تعليم قائم على القيم الإسلامية في سيق. نركز على تحفيظ القرآن والتربية الصالحة.',
    descriptionFr: 'Éducation basée sur la foi à Sig.',
    coordinates: { lat: 35.5295, lng: -0.1915 },
    priceBreakdown: [
      { id: 'registration', nameAr: 'رسوم التسجيل', nameFr: 'Frais d\'inscription', price: 1200, type: 'annual', optional: false },
      { id: 'tuition', nameAr: 'المصاريف الشهرية', nameFr: 'Frais mensuels', price: 5000, type: 'monthly', optional: false },
      { id: 'meals', nameAr: 'الإطعام', nameFr: 'Restauration', price: 2000, type: 'monthly', optional: true },
    ],
    facilities: [
      { nameAr: 'قاعة التحفيظ', nameFr: 'Salle Coranique', image: kindergartenIman1 },
    ],
    hasAutismWing: false,
  },
  {
    id: '8',
    name: 'Rawdat Al-Badr',
    nameAr: 'روضة البدر',
    nameFr: 'Jardin Al-Badr',
    municipality: 'mascara',
    municipalityAr: 'Rawdati',
    municipalityFr: 'Rawdati',
    address: 'Boulevard Boudiaf, Mascara',
    addressAr: 'شارع بوضياف، Rawdati',
    addressFr: 'Boulevard Boudiaf, Rawdati',
    phone: '045 81 23 45',
    pricePerMonth: 9000,
    ageRange: { min: 2, max: 6 },
    workingHours: { open: '07:00', close: '18:00' },
    rating: 4.9,
    reviewCount: 178,
    images: [kindergarten2, kindergarten3, kindergarten1],
    services: ['bus', 'meals', 'mental-math', 'languages', 'sports', 'quran'],
    activities: [
      ...defaultActivities,
      { id: 'robotics', nameAr: 'الروبوتيك', nameFr: 'Robotique', description: 'تعلم البرمجة للأطفال', schedule: 'السبت 09:00-10:00', icon: '🤖' },
      { id: 'art', nameAr: 'الفنون التشكيلية', nameFr: 'Arts plastiques', description: 'نحت ورسم', schedule: 'الخميس 14:00-15:00', icon: '🎭' },
    ],
    description: 'Premium kindergarten with all services.',
    descriptionAr: 'روضة متميزة بجميع الخدمات. أفضل المرافق والبرامج التعليمية الشاملة.',
    descriptionFr: 'Jardin d\'enfants haut de gamme.',
    coordinates: { lat: 35.3998, lng: 0.1380 },
    priceBreakdown: [
      { id: 'registration', nameAr: 'رسوم التسجيل', nameFr: 'Frais d\'inscription', price: 3000, type: 'annual', optional: false },
      { id: 'insurance', nameAr: 'التأمين', nameFr: 'Assurance', price: 1500, type: 'annual', optional: false },
      { id: 'tuition', nameAr: 'المصاريف الشهرية', nameFr: 'Frais mensuels', price: 9000, type: 'monthly', optional: false },
      { id: 'transport', nameAr: 'النقل', nameFr: 'Transport', price: 3500, type: 'monthly', optional: true },
      { id: 'meals', nameAr: 'الإطعام', nameFr: 'Restauration', price: 4500, type: 'monthly', optional: true },
    ],
    facilities: [
      { nameAr: 'مخبر الروبوتيك', nameFr: 'Labo Robotique', image: kindergarten2 },
      { nameAr: 'المسرح', nameFr: 'Théâtre', image: kindergarten3 },
      { nameAr: 'المطعم', nameFr: 'Cantine', image: kindergarten1 },
    ],
    hasAutismWing: true,
    partners: {
      doctors: ['Dr. Amine Tazi (Orthophoniste)'],
      stores: ['Rawdati Kids'],
    },
  },
  {
    id: '9',
    name: 'Rawdat Al-Warda',
    nameAr: 'روضة الوردة',
    nameFr: 'Jardin Al-Warda',
    municipality: 'tighennif',
    municipalityAr: 'تيغنيف',
    municipalityFr: 'Tighennif',
    address: 'Cité 100 Logements, Tighennif',
    addressAr: 'حي 100 مسكن، تيغنيف',
    addressFr: 'Cité 100 Logements, Tighennif',
    phone: '045 65 78 90',
    pricePerMonth: 4500,
    ageRange: { min: 3, max: 5 },
    workingHours: { open: '08:00', close: '16:00' },
    rating: 4.2,
    reviewCount: 45,
    images: [kindergarten4, kindergarten6],
    services: ['meals', 'sports'],
    activities: [
      { id: 'sports', nameAr: 'الرياضة', nameFr: 'Sport', description: 'ألعاب حركية', schedule: 'يومياً 15:00-16:00', icon: '⚽' },
      { id: 'drawing', nameAr: 'الرسم', nameFr: 'Dessin', description: 'تلوين ورسم حر', schedule: 'يومياً 09:00-10:00', icon: '🎨' },
      { id: 'games', nameAr: 'الألعاب', nameFr: 'Jeux', description: 'ألعاب جماعية', schedule: 'يومياً 11:00-12:00', icon: '🎲' },
    ],
    description: 'Affordable kindergarten in Tighennif.',
    descriptionAr: 'روضة بأسعار مناسبة في تيغنيف. نقدم خدمات جيدة بتكلفة معقولة للجميع.',
    descriptionFr: 'Jardin d\'enfants abordable à Tighennif.',
    coordinates: { lat: 35.4180, lng: 0.3250 },
    priceBreakdown: [
      { id: 'registration', nameAr: 'رسوم التسجيل', nameFr: 'Frais d\'inscription', price: 1000, type: 'annual', optional: false },
      { id: 'tuition', nameAr: 'المصاريف الشهرية', nameFr: 'Frais mensuels', price: 4500, type: 'monthly', optional: false },
      { id: 'meals', nameAr: 'الإطعام', nameFr: 'Restauration', price: 2000, type: 'monthly', optional: true },
    ],
    facilities: [
      { nameAr: 'الساحة', nameFr: 'Cour', image: kindergarten4 },
    ],
    hasAutismWing: false,
  },
  {
    id: '10',
    name: 'Rawdat Al-Yasmin',
    nameAr: 'روضة الياسمين',
    nameFr: 'Jardin Al-Yasmin',
    municipality: 'mohammadia',
    municipalityAr: 'المحمدية',
    municipalityFr: 'Mohammadia',
    address: 'Rue Didouche Mourad, Mohammadia',
    addressAr: 'شارع ديدوش مراد، المحمدية',
    addressFr: 'Rue Didouche Mourad, Mohammadia',
    phone: '045 92 34 56',
    pricePerMonth: 6500,
    ageRange: { min: 2, max: 6 },
    workingHours: { open: '07:30', close: '17:00' },
    rating: 4.7,
    reviewCount: 112,
    images: [kindergarten5, kindergarten3],
    services: ['bus', 'meals', 'languages', 'quran'],
    activities: [
      { id: 'quran', nameAr: 'القرآن', nameFr: 'Coran', description: 'حفظ وتلاوة', schedule: 'يومياً 08:00-09:00', icon: '📖' },
      { id: 'languages', nameAr: 'اللغات', nameFr: 'Langues', description: 'فرنسية وإنجليزية', schedule: 'يومياً 10:00-11:00', icon: '🌍' },
      { id: 'music', nameAr: 'الأناشيد', nameFr: 'Chants', description: 'أناشيد للأطفال', schedule: 'الخميس', icon: '🎵' },
      { id: 'crafts', nameAr: 'الأشغال اليدوية', nameFr: 'Bricolage', description: 'صناعة وإبداع', schedule: 'الأربعاء 14:00-15:00', icon: '✂️' },
    ],
    description: 'Quality education in Mohammadia.',
    descriptionAr: 'تعليم عالي الجودة في المحمدية. نوفر بيئة محفزة لنمو الطفل.',
    descriptionFr: 'Éducation de qualité à Mohammadia.',
    coordinates: { lat: 35.5760, lng: -0.0810 },
    priceBreakdown: [
      { id: 'registration', nameAr: 'رسوم التسجيل', nameFr: 'Frais d\'inscription', price: 1800, type: 'annual', optional: false },
      { id: 'tuition', nameAr: 'المصاريف الشهرية', nameFr: 'Frais mensuels', price: 6500, type: 'monthly', optional: false },
      { id: 'transport', nameAr: 'النقل', nameFr: 'Transport', price: 2500, type: 'monthly', optional: true },
      { id: 'meals', nameAr: 'الإطعام', nameFr: 'Restauration', price: 3000, type: 'monthly', optional: true },
    ],
    facilities: [
      { nameAr: 'قاعة المطالعة', nameFr: 'Salle de lecture', image: kindergarten5 },
      { nameAr: 'القسم', nameFr: 'Classe', image: kindergarten3 },
    ],
    hasAutismWing: false,
  },
];
