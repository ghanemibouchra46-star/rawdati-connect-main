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
  description: string;
  schedule: string;
  icon: string;
}

export interface Kindergarten {
  id: string;
  name: string;
  nameAr: string;
  municipality: string;
  municipalityAr: string;
  address: string;
  addressAr: string;
  phone: string;
  pricePerMonth: number;
  ageRange: { min: number; max: number };
  workingHours: { open: string; close: string };
  rating: number;
  reviewCount: number;
  images: string[];
  services: string[];
  activities: Activity[];
  description: string;
  descriptionAr: string;
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
  { id: 'bus', nameAr: 'نقل مدرسي', icon: '🚌' },
  { id: 'meals', nameAr: 'وجبات غذائية', icon: '🍽️' },
  { id: 'mental-math', nameAr: 'الحساب الذهني', icon: '🧮' },
  { id: 'languages', nameAr: 'لغات أجنبية', icon: '🌍' },
  { id: 'quran', nameAr: 'تحفيظ القرآن', icon: '📖' },
  { id: 'sports', nameAr: 'أنشطة رياضية', icon: '⚽' },
];

// Default activities for kindergartens
const defaultActivities: Activity[] = [
  { id: 'drawing', nameAr: 'الرسم والتلوين', description: 'تنمية المهارات الفنية والإبداعية', schedule: 'يومياً 09:00-10:00', icon: '🎨' },
  { id: 'music', nameAr: 'الأناشيد', description: 'تعلم الأناشيد الإسلامية والوطنية', schedule: 'الإثنين والأربعاء', icon: '🎵' },
  { id: 'games', nameAr: 'الألعاب التعليمية', description: 'ألعاب تنمية الذكاء والتفكير', schedule: 'يومياً 11:00-12:00', icon: '🧩' },
  { id: 'quran-class', nameAr: 'حلقة القرآن', description: 'حفظ السور القصيرة والأدعية', schedule: 'يومياً بعد الصلاة', icon: '📖' },
  { id: 'sports-activity', nameAr: 'النشاط الرياضي', description: 'رياضة وحركة في الهواء الطلق', schedule: 'الخميس 14:00-15:00', icon: '⚽' },
];

export const kindergartens: Kindergarten[] = [
  {
    id: '1',
    name: 'Rawdat Al-Amal',
    nameAr: 'روضة الأمل',
    municipality: 'mascara',
    municipalityAr: 'معسكر',
    address: 'Rue de la République, Mascara',
    addressAr: 'شارع الجمهورية، معسكر',
    phone: '045 80 12 34',
    pricePerMonth: 8000,
    ageRange: { min: 3, max: 6 },
    workingHours: { open: '07:30', close: '17:00' },
    rating: 4.8,
    reviewCount: 124,
    images: [kindergarten1, kindergarten4, kindergarten5],
    services: ['bus', 'meals', 'mental-math', 'quran'],
    activities: [
      { id: 'drawing', nameAr: 'الرسم والتلوين', description: 'تنمية المهارات الفنية', schedule: 'يومياً 09:00-10:00', icon: '🎨' },
      { id: 'quran-class', nameAr: 'حلقة القرآن', description: 'حفظ جزء عمّ', schedule: 'يومياً 08:00-09:00', icon: '📖' },
      { id: 'mental-math', nameAr: 'الحساب الذهني', description: 'تعلم الأرقام والعمليات', schedule: 'الأحد والثلاثاء', icon: '🧮' },
      { id: 'games', nameAr: 'ألعاب تعليمية', description: 'تنمية الذكاء', schedule: 'يومياً 11:00-12:00', icon: '🧩' },
    ],
    description: 'A leading kindergarten in Mascara with modern facilities and experienced staff.',
    descriptionAr: 'روضة رائدة في معسكر مع مرافق حديثة وطاقم ذو خبرة عالية. نوفر بيئة آمنة ومحفزة لأطفالكم.',
    coordinates: { lat: 35.3975, lng: 0.1397 },
  },
  {
    id: '2',
    name: 'Rawdat Al-Zahra',
    nameAr: 'روضة الزهراء',
    municipality: 'sig',
    municipalityAr: 'سيق',
    address: 'Avenue de l\'Indépendance, Sig',
    addressAr: 'شارع الاستقلال، سيق',
    phone: '045 78 56 78',
    pricePerMonth: 6500,
    ageRange: { min: 2, max: 5 },
    workingHours: { open: '08:00', close: '16:30' },
    rating: 4.5,
    reviewCount: 89,
    images: [kindergarten2, kindergarten3],
    services: ['meals', 'languages', 'sports'],
    activities: [
      { id: 'english', nameAr: 'اللغة الإنجليزية', description: 'تعلم أساسيات اللغة', schedule: 'الأحد والثلاثاء', icon: '🌍' },
      { id: 'french', nameAr: 'اللغة الفرنسية', description: 'تعلم الحروف والكلمات', schedule: 'الإثنين والأربعاء', icon: '🇫🇷' },
      { id: 'sports', nameAr: 'الرياضة', description: 'أنشطة بدنية متنوعة', schedule: 'يومياً 15:00-16:00', icon: '⚽' },
    ],
    description: 'A warm and welcoming kindergarten in Sig.',
    descriptionAr: 'روضة دافئة ومرحبة في سيق. نركز على تنمية المهارات الاجتماعية والإبداعية للأطفال.',
    coordinates: { lat: 35.5279, lng: -0.1931 },
  },
  {
    id: '3',
    name: 'Rawdat Al-Nour',
    nameAr: 'روضة النور',
    municipality: 'tighennif',
    municipalityAr: 'تيغنيف',
    address: 'Centre Ville, Tighennif',
    addressAr: 'وسط المدينة، تيغنيف',
    phone: '045 65 43 21',
    pricePerMonth: 5500,
    ageRange: { min: 3, max: 6 },
    workingHours: { open: '07:00', close: '17:30' },
    rating: 4.7,
    reviewCount: 67,
    images: [kindergartenNour1, kindergarten1, kindergarten6],
    services: ['bus', 'quran', 'mental-math'],
    activities: [
      { id: 'quran-intensive', nameAr: 'تحفيظ مكثف', description: 'حفظ القرآن مع التجويد', schedule: 'يومياً 08:00-10:00', icon: '📖' },
      { id: 'mental-math', nameAr: 'الحساب الذهني', description: 'برنامج سوروبان', schedule: 'الأحد والثلاثاء والخميس', icon: '🧮' },
      { id: 'arabic', nameAr: 'اللغة العربية', description: 'القراءة والكتابة', schedule: 'يومياً 10:30-11:30', icon: '✏️' },
      { id: 'drawing', nameAr: 'الفنون', description: 'الرسم والأشغال اليدوية', schedule: 'الأربعاء 14:00-15:00', icon: '🎨' },
    ],
    description: 'Educational excellence in Tighennif.',
    descriptionAr: 'تميز تعليمي في تيغنيف. برامج تعليمية متكاملة تجمع بين التعليم الحديث والقيم الإسلامية.',
    coordinates: { lat: 35.4164, lng: 0.3272 },
  },
  {
    id: '4',
    name: 'Rawdat Al-Firdaws',
    nameAr: 'روضة الفردوس',
    municipality: 'mohammadia',
    municipalityAr: 'المحمدية',
    address: 'Cité des 200 Logements, Mohammadia',
    addressAr: 'حي 200 مسكن، المحمدية',
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
      { id: 'swimming', nameAr: 'السباحة', description: 'دروس سباحة للأطفال', schedule: 'السبت 10:00-11:00', icon: '🏊' },
    ],
    description: 'Premium kindergarten services in Mohammadia.',
    descriptionAr: 'خدمات روضة متميزة في المحمدية. بيئة تعليمية شاملة مع أحدث الوسائل التعليمية.',
    coordinates: { lat: 35.5747, lng: -0.0831 },
  },
  {
    id: '5',
    name: 'Rawdat Al-Majd',
    nameAr: 'روضة المجد',
    municipality: 'ghriss',
    municipalityAr: 'غريس',
    address: 'Quartier El-Majd, Ghriss',
    addressAr: 'حي المجد، غريس',
    phone: '045 88 99 00',
    pricePerMonth: 6000,
    ageRange: { min: 3, max: 5 },
    workingHours: { open: '08:00', close: '17:00' },
    rating: 4.6,
    reviewCount: 78,
    images: [kindergarten4, kindergarten2],
    services: ['meals', 'mental-math', 'sports'],
    activities: [
      { id: 'mental-math', nameAr: 'الحساب الذهني', description: 'برنامج متقدم', schedule: 'يومياً 09:00-10:00', icon: '🧮' },
      { id: 'sports', nameAr: 'الرياضة', description: 'كرة القدم والجمباز', schedule: 'يومياً 15:00-16:00', icon: '⚽' },
      { id: 'games', nameAr: 'الألعاب الذكية', description: 'شطرنج وألغاز', schedule: 'الإثنين والأربعاء', icon: '♟️' },
    ],
    description: 'Quality education in Ghriss.',
    descriptionAr: 'تعليم عالي الجودة في غريس. نهتم بتطوير قدرات الطفل العقلية والبدنية.',
    coordinates: { lat: 35.2622, lng: 0.0089 },
  },
  {
    id: '6',
    name: 'Rawdat Al-Salam',
    nameAr: 'روضة السلام',
    municipality: 'mascara',
    municipalityAr: 'معسكر',
    address: 'Cité El-Amir, Mascara',
    addressAr: 'حي الأمير، معسكر',
    phone: '045 80 45 67',
    pricePerMonth: 7500,
    ageRange: { min: 2, max: 5 },
    workingHours: { open: '07:00', close: '16:30' },
    rating: 4.4,
    reviewCount: 92,
    images: [kindergarten5, kindergarten1],
    services: ['bus', 'meals', 'quran', 'languages'],
    activities: [
      { id: 'quran', nameAr: 'القرآن الكريم', description: 'حفظ وتلاوة', schedule: 'يومياً 08:00-09:00', icon: '📖' },
      { id: 'french', nameAr: 'الفرنسية', description: 'محادثة وقراءة', schedule: 'الأحد والثلاثاء', icon: '🇫🇷' },
      { id: 'english', nameAr: 'الإنجليزية', description: 'أساسيات اللغة', schedule: 'الإثنين والأربعاء', icon: '🇬🇧' },
      { id: 'music', nameAr: 'الأناشيد', description: 'أناشيد إسلامية', schedule: 'الخميس', icon: '🎵' },
    ],
    description: 'A peaceful learning environment in Mascara.',
    descriptionAr: 'بيئة تعليمية هادئة في معسكر. نوفر رعاية شاملة وبرامج تعليمية متنوعة.',
    coordinates: { lat: 35.4012, lng: 0.1425 },
  },
  {
    id: '7',
    name: 'Rawdat Al-Iman',
    nameAr: 'روضة الإيمان',
    municipality: 'sig',
    municipalityAr: 'سيق',
    address: 'Rue des Martyrs, Sig',
    addressAr: 'شارع الشهداء، سيق',
    phone: '045 78 12 34',
    pricePerMonth: 5000,
    ageRange: { min: 3, max: 6 },
    workingHours: { open: '08:00', close: '17:00' },
    rating: 4.3,
    reviewCount: 65,
    images: [kindergartenIman1, kindergarten6, kindergarten4],
    services: ['quran', 'mental-math', 'meals'],
    activities: [
      { id: 'quran-tahfidh', nameAr: 'تحفيظ القرآن', description: 'حفظ جزء عمّ كاملاً', schedule: 'يومياً 08:00-10:00', icon: '📖' },
      { id: 'tajweed', nameAr: 'التجويد', description: 'أحكام التلاوة', schedule: 'الأحد والثلاثاء', icon: '🕌' },
      { id: 'islamic-education', nameAr: 'التربية الإسلامية', description: 'الآداب والأخلاق', schedule: 'يومياً', icon: '🌙' },
      { id: 'arabic', nameAr: 'العربية', description: 'القراءة والكتابة', schedule: 'يومياً 11:00-12:00', icon: '✏️' },
      { id: 'mental-math', nameAr: 'الحساب الذهني', description: 'الأرقام والعمليات', schedule: 'الإثنين والأربعاء', icon: '🧮' },
    ],
    description: 'Faith-based education in Sig.',
    descriptionAr: 'تعليم قائم على القيم الإسلامية في سيق. نركز على تحفيظ القرآن والتربية الصالحة.',
    coordinates: { lat: 35.5295, lng: -0.1915 },
  },
  {
    id: '8',
    name: 'Rawdat Al-Badr',
    nameAr: 'روضة البدر',
    municipality: 'mascara',
    municipalityAr: 'معسكر',
    address: 'Boulevard Boudiaf, Mascara',
    addressAr: 'شارع بوضياف، معسكر',
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
      { id: 'robotics', nameAr: 'الروبوتيك', description: 'تعلم البرمجة للأطفال', schedule: 'السبت 09:00-10:00', icon: '🤖' },
      { id: 'art', nameAr: 'الفنون التشكيلية', description: 'نحت ورسم', schedule: 'الخميس 14:00-15:00', icon: '🎭' },
    ],
    description: 'Premium kindergarten with all services in Mascara.',
    descriptionAr: 'روضة متميزة بجميع الخدمات في معسكر. أفضل المرافق والبرامج التعليمية الشاملة.',
    coordinates: { lat: 35.3998, lng: 0.1380 },
  },
  {
    id: '9',
    name: 'Rawdat Al-Warda',
    nameAr: 'روضة الوردة',
    municipality: 'tighennif',
    municipalityAr: 'تيغنيف',
    address: 'Cité 100 Logements, Tighennif',
    addressAr: 'حي 100 مسكن، تيغنيف',
    phone: '045 65 78 90',
    pricePerMonth: 4500,
    ageRange: { min: 3, max: 5 },
    workingHours: { open: '08:00', close: '16:00' },
    rating: 4.2,
    reviewCount: 45,
    images: [kindergarten4, kindergarten6],
    services: ['meals', 'sports'],
    activities: [
      { id: 'sports', nameAr: 'الرياضة', description: 'ألعاب حركية', schedule: 'يومياً 15:00-16:00', icon: '⚽' },
      { id: 'drawing', nameAr: 'الرسم', description: 'تلوين ورسم حر', schedule: 'يومياً 09:00-10:00', icon: '🎨' },
      { id: 'games', nameAr: 'الألعاب', description: 'ألعاب جماعية', schedule: 'يومياً 11:00-12:00', icon: '🎲' },
    ],
    description: 'Affordable kindergarten in Tighennif.',
    descriptionAr: 'روضة بأسعار مناسبة في تيغنيف. نقدم خدمات جيدة بتكلفة معقولة للجميع.',
    coordinates: { lat: 35.4180, lng: 0.3250 },
  },
  {
    id: '10',
    name: 'Rawdat Al-Yasmin',
    nameAr: 'روضة الياسمين',
    municipality: 'mohammadia',
    municipalityAr: 'المحمدية',
    address: 'Rue Didouche Mourad, Mohammadia',
    addressAr: 'شارع ديدوش مراد، المحمدية',
    phone: '045 92 34 56',
    pricePerMonth: 6500,
    ageRange: { min: 2, max: 6 },
    workingHours: { open: '07:30', close: '17:00' },
    rating: 4.7,
    reviewCount: 112,
    images: [kindergarten5, kindergarten3],
    services: ['bus', 'meals', 'languages', 'quran'],
    activities: [
      { id: 'quran', nameAr: 'القرآن', description: 'حفظ وتلاوة', schedule: 'يومياً 08:00-09:00', icon: '📖' },
      { id: 'languages', nameAr: 'اللغات', description: 'فرنسية وإنجليزية', schedule: 'يومياً 10:00-11:00', icon: '🌍' },
      { id: 'music', nameAr: 'الأناشيد', description: 'أناشيد للأطفال', schedule: 'الخميس', icon: '🎵' },
      { id: 'crafts', nameAr: 'الأشغال اليدوية', description: 'صناعة وإبداع', schedule: 'الأربعاء 14:00-15:00', icon: '✂️' },
    ],
    description: 'Quality education in Mohammadia.',
    descriptionAr: 'تعليم عالي الجودة في المحمدية. نوفر بيئة محفزة لنمو الطفل.',
    coordinates: { lat: 35.5760, lng: -0.0810 },
  },
];
