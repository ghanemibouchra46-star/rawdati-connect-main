export interface SpeechTherapist {
  id: string;
  name: string;
  specialty: string;
  address: string;
  municipality: string;
  phone: string;
  workingHours: string;
  rating: number;
  image: string;
  experience: number;
  services: string[];
}

export const speechTherapists: SpeechTherapist[] = [
  {
    id: '1',
    name: 'أ. سارة بن يحيى',
    specialty: 'أرطفونيا الأطفال',
    address: 'شارع الاستقلال، معسكر',
    municipality: 'معسكر',
    phone: '0555 11 22 33',
    workingHours: '09:00 - 17:00',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    experience: 8,
    services: ['تأخر النطق', 'صعوبات التعلم', 'اضطرابات الكلام', 'التأتأة']
  },
  {
    id: '2',
    name: 'أ. محمد بوخالفة',
    specialty: 'أرطفونيا وعلاج النطق',
    address: 'حي النصر، سيق',
    municipality: 'سيق',
    phone: '0661 44 55 66',
    workingHours: '08:00 - 16:00',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400',
    experience: 12,
    services: ['تأخر النطق', 'اضطرابات الصوت', 'البلع', 'التوحد']
  },
  {
    id: '3',
    name: 'أ. فاطمة مرابط',
    specialty: 'أرطفونيا الأطفال والمراهقين',
    address: 'وسط المدينة، تيغنيف',
    municipality: 'تيغنيف',
    phone: '0770 77 88 99',
    workingHours: '10:00 - 18:00',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    experience: 6,
    services: ['صعوبات القراءة', 'عسر الكتابة', 'اضطرابات اللغة', 'التأخر اللغوي']
  },
  {
    id: '4',
    name: 'أ. عبد القادر بلعيد',
    specialty: 'أرطفونيا عامة',
    address: 'حي الزيتون، المحمدية',
    municipality: 'المحمدية',
    phone: '0550 00 11 22',
    workingHours: '08:30 - 15:30',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    experience: 10,
    services: ['اضطرابات النطق', 'التأتأة', 'فقدان السمع', 'إعادة التأهيل']
  },
  {
    id: '5',
    name: 'أ. نورة بن حسين',
    specialty: 'أرطفونيا الطفولة المبكرة',
    address: 'شارع الأمير عبد القادر، غريس',
    municipality: 'غريس',
    phone: '0662 33 44 55',
    workingHours: '09:00 - 16:00',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    experience: 7,
    services: ['تأخر النطق', 'التوحد', 'صعوبات التعلم', 'اضطرابات التواصل']
  },
  {
    id: '6',
    name: 'أ. كريم بوزيان',
    specialty: 'أرطفونيا وعلاج النطق',
    address: 'حي النور، معسكر',
    municipality: 'معسكر',
    phone: '0771 66 77 88',
    workingHours: '08:00 - 14:00',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
    experience: 15,
    services: ['جميع اضطرابات النطق', 'التأهيل السمعي', 'صعوبات البلع', 'اضطرابات الصوت']
  }
];
