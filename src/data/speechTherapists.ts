export interface SpeechTherapist {
  id: string;
  name_ar: string;
  nameFr: string;
  specialty_ar: string;
  specialtyFr: string;
  address_ar: string;
  addressFr: string;
  municipalityId: string;
  phone: string;
  workingHours: string;
  rating: number;
  image: string;
  experience: number;
  services_ar: string[];
  servicesFr: string[];
}

export const speechTherapists: SpeechTherapist[] = [
  {
    id: '1',
    name_ar: 'أ. سارة بن يحيى',
    nameFr: 'Mme. Sarah Benyahia',
    specialty_ar: 'أرطفونيا الأطفال',
    specialtyFr: 'Orthophonie Pédiatrique',
    address_ar: 'شارع الاستقلال، روضتي',
    addressFr: 'Rue de l\'Indépendance, روضتي',
    municipalityId: 'mascara',
    phone: '0555 11 22 33',
    workingHours: '09:00 - 17:00',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    experience: 8,
    services_ar: ['تأخر النطق', 'صعوبات التعلم', 'اضطرابات الكلام', 'التأتأة'],
    servicesFr: ['Retard de parole', 'Difficultés d\'apprentissage', 'Troubles du langage', 'Bégaiement']
  },
  {
    id: '2',
    name_ar: 'أ. محمد بوخالفة',
    nameFr: 'M. Mohamed Boukhalfa',
    specialty_ar: 'أرطفونيا وعلاج النطق',
    specialtyFr: 'Orthophonie et Logopédie',
    address_ar: 'حي النصر، سيق',
    addressFr: 'Cité En-Nasr, Sig',
    municipalityId: 'sig',
    phone: '0661 44 55 66',
    workingHours: '08:00 - 16:00',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400',
    experience: 12,
    services_ar: ['تأخر النطق', 'اضطرابات الصوت', 'البلع', 'التوحد'],
    servicesFr: ['Retard de parole', 'Troubles de la voix', 'Déglutition', 'Autisme']
  },
  {
    id: '3',
    name_ar: 'أ. فاطمة مرابط',
    nameFr: 'Mme. Fatma Merabet',
    specialty_ar: 'أرطفونيا الأطفال والمراهقين',
    specialtyFr: 'Orthophonie Enfants et Adolescents',
    address_ar: 'وسط المدينة، تيغنيف',
    addressFr: 'Centre Ville, Tighennif',
    municipalityId: 'tighennif',
    phone: '0770 77 88 99',
    workingHours: '10:00 - 18:00',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    experience: 6,
    services_ar: ['صعوبات القراءة', 'عسر الكتابة', 'اضطرابات اللغة', 'التأخر اللغوي'],
    servicesFr: ['Dyslexie', 'Dysgraphie', 'Troubles du langage', 'Retard de langage']
  },
  {
    id: '4',
    name_ar: 'أ. عبد القادر بلعيد',
    nameFr: 'M. Abdelkader Belaid',
    specialty_ar: 'أرطفونيا عامة',
    specialtyFr: 'Orthophonie Générale',
    address_ar: 'حي الزيتون، المحمدية',
    addressFr: 'Cité Ez-Zitoun, Mohammadia',
    municipalityId: 'mohammadia',
    phone: '0550 00 11 22',
    workingHours: '08:30 - 15:30',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    experience: 10,
    services_ar: ['اضطرابات النطق', 'التأتأة', 'فقدان السمع', 'إعادة التأهيل'],
    servicesFr: ['Troubles d\'articulation', 'Bégaiement', 'Perte auditive', 'Rééducation']
  },
  {
    id: '5',
    name_ar: 'أ. نورة بن حسين',
    nameFr: 'Mme. Noura Benhocine',
    specialty_ar: 'أرطفونيا الطفولة المبكرة',
    specialtyFr: 'Orthophonie de la petite enfance',
    address_ar: 'شارع الأمير عبد القادر، غريس',
    addressFr: 'Rue Emir Abdelkader, Ghriss',
    municipalityId: 'ghriss',
    phone: '0662 33 44 55',
    workingHours: '09:00 - 16:00',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    experience: 7,
    services_ar: ['تأخر النطق', 'التوحد', 'صعوبات التعلم', 'اضطرابات التواصل'],
    servicesFr: ['Retard de parole', 'Autisme', 'Difficultés d\'apprentissage', 'Troubles de communication']
  },
  {
    id: '6',
    name_ar: 'أ. كريم بوزيان',
    nameFr: 'M. Karim Bouziane',
    specialty_ar: 'أرطفونيا وعلاج النطق',
    specialtyFr: 'Orthophonie et Logopédie',
    address_ar: 'حي النور، روضتي',
    addressFr: 'Cité En-Nour, روضتي',
    municipalityId: 'mascara',
    phone: '0771 66 77 88',
    workingHours: '08:00 - 14:00',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
    experience: 15,
    services_ar: ['جميع اضطرابات النطق', 'التأهيل السمعي', 'صعوبات البلع', 'اضطرابات الصوت'],
    servicesFr: ['Tous les troubles de la parole', 'Rééducation auditive', 'Troubles de déglutition', 'Troubles de la voix']
  }
];
