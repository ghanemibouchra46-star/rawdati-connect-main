export interface SpeechTherapist {
  id: string;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  specialtyAr: string;
  specialtyFr: string;
  specialtyEn: string;
  addressAr: string;
  addressFr: string;
  addressEn: string;
  municipalityId: string;
  phone: string;
  workingHours: string;
  rating: number;
  image: string;
  experience: number;
  servicesAr: string[];
  servicesFr: string[];
  servicesEn: string[];
}

export const speechTherapists: SpeechTherapist[] = [
  {
    id: '1',
    nameAr: 'أ. سارة بن يحيى',
    nameFr: 'Mme. Sarah Benyahia',
    nameEn: 'Mrs. Sarah Benyahia',
    specialtyAr: 'أرطفونيا الأطفال',
    specialtyFr: 'Orthophonie Pédiatrique',
    specialtyEn: 'Pediatric Speech Therapy',
    addressAr: 'شارع الاستقلال',
    addressFr: 'Rue de l\'Indépendance',
    addressEn: 'Independence Street',
    municipalityId: 'mascara',
    phone: '0555 11 22 33',
    workingHours: '09:00 - 17:00',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    experience: 8,
    servicesAr: ['تأخر النطق', 'صعوبات التعلم', 'اضطرابات الكلام', 'التأتأة'],
    servicesFr: ['Retard de parole', 'Difficultés d\'apprentissage', 'Troubles du langage', 'Bégaiement'],
    servicesEn: ['Speech Delay', 'Learning Difficulties', 'Speech Disorders', 'Stuttering']
  },
  {
    id: '2',
    nameAr: 'أ. محمد بوخالفة',
    nameFr: 'M. Mohamed Boukhalfa',
    nameEn: 'Mr. Mohamed Boukhalfa',
    specialtyAr: 'أرطفونيا وعلاج النطق',
    specialtyFr: 'Orthophonie et Logopédie',
    specialtyEn: 'Speech and Language Therapy',
    addressAr: 'حي النصر',
    addressFr: 'Cité En-Nasr',
    addressEn: 'En-Nasr District',
    municipalityId: 'sig',
    phone: '0661 44 55 66',
    workingHours: '08:00 - 16:00',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400',
    experience: 12,
    servicesAr: ['تأخر النطق', 'اضطرابات الصوت', 'البلع', 'التوحد'],
    servicesFr: ['Retard de parole', 'Troubles de la voix', 'Déglutition', 'Autisme'],
    servicesEn: ['Speech Delay', 'Voice Disorders', 'Swallowing', 'Autism']
  },
  {
    id: '3',
    nameAr: 'أ. فاطمة مرابط',
    nameFr: 'Mme. Fatma Merabet',
    nameEn: 'Mrs. Fatma Merabet',
    specialtyAr: 'أرطفونيا الأطفال والمراهقين',
    specialtyFr: 'Orthophonie Enfants et Adolescents',
    specialtyEn: 'Children and Adolescents Speech Therapy',
    addressAr: 'وسط المدينة',
    addressFr: 'Centre Ville',
    addressEn: 'City Center',
    municipalityId: 'tighennif',
    phone: '0770 77 88 99',
    workingHours: '10:00 - 18:00',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    experience: 6,
    servicesAr: ['صعوبات القراءة', 'عسر الكتابة', 'اضطرابات اللغة', 'التأخر اللغوي'],
    servicesFr: ['Dyslexie', 'Dysgraphie', 'Troubles du langage', 'Retard de langage'],
    servicesEn: ['Dyslexia', 'Dysgraphia', 'Language Disorders', 'Language Delay']
  },
  {
    id: '4',
    nameAr: 'أ. عبد القادر بلعيد',
    nameFr: 'M. Abdelkader Belaid',
    nameEn: 'Mr. Abdelkader Belaid',
    specialtyAr: 'أرطفونيا عامة',
    specialtyFr: 'Orthophonie Générale',
    specialtyEn: 'General Speech Therapy',
    addressAr: 'حي الزيتون',
    addressFr: 'Cité Ez-Zitoun',
    addressEn: 'Ez-Zitoun District',
    municipalityId: 'mohammadia',
    phone: '0550 00 11 22',
    workingHours: '08:30 - 15:30',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    experience: 10,
    servicesAr: ['اضطرابات النطق', 'التأتأة', 'فقدان السمع', 'إعادة التأهيل'],
    servicesFr: ['Troubles d\'articulation', 'Bégaiement', 'Perte auditive', 'Rééducation'],
    servicesEn: ['Articulation Disorders', 'Stuttering', 'Hearing Loss', 'Rehabilitation']
  },
  {
    id: '5',
    nameAr: 'أ. نورة بن حسين',
    nameFr: 'Mme. Noura Benhocine',
    nameEn: 'Mrs. Noura Benhocine',
    specialtyAr: 'أرطفونيا الطفولة المبكرة',
    specialtyFr: 'Orthophonie de la petite enfance',
    specialtyEn: 'Early Childhood Speech Therapy',
    addressAr: 'شارع الأمير عبد القادر',
    addressFr: 'Rue Emir Abdelkader',
    addressEn: 'Emir Abdelkader Street',
    municipalityId: 'ghriss',
    phone: '0662 33 44 55',
    workingHours: '09:00 - 16:00',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    experience: 7,
    servicesAr: ['تأخر النطق', 'التوحد', 'صعوبات التعلم', 'اضطرابات التواصل'],
    servicesFr: ['Retard de parole', 'Autisme', 'Difficultés d\'apprentissage', 'Troubles de communication'],
    servicesEn: ['Speech Delay', 'Autism', 'Learning Difficulties', 'Communication Disorders']
  },
  {
    id: '6',
    nameAr: 'أ. كريم بوزيان',
    nameFr: 'M. Karim Bouziane',
    nameEn: 'Mr. Karim Bouziane',
    specialtyAr: 'أرطفونيا وعلاج النطق',
    specialtyFr: 'Orthophonie et Logopédie',
    specialtyEn: 'Speech and Language Therapy',
    addressAr: 'حي النور',
    addressFr: 'Cité En-Nour',
    addressEn: 'En-Nour District',
    municipalityId: 'mascara',
    phone: '0771 66 77 88',
    workingHours: '08:00 - 14:00',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
    experience: 15,
    servicesAr: ['جميع اضطرابات النطق', 'التأهيل السمعي', 'صعوبات البلع', 'اضطرابات الصوت'],
    servicesFr: ['Tous les troubles de la parole', 'Rééducation auditive', 'Troubles de déglutition', 'Troubles de la voix'],
    servicesEn: ['All Speech Disorders', 'Auditory Rehabilitation', 'Swallowing Difficulties', 'Voice Disorders']
  }
];
