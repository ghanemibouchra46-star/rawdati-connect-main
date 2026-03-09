export interface Doctor {
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
}

export const doctors: Doctor[] = [
  {
    id: '1',
    name_ar: 'د. محمد بن عودة',
    nameFr: 'Dr. Mohamed Ben Aouda',
    specialty_ar: 'طب أطفال',
    specialtyFr: 'Pédiatrie',
    address_ar: 'مستشفى روضتي، معسكر',
    addressFr: 'Hôpital روضتي, Mascara',
    municipalityId: 'mascara',
    phone: '0555 12 34 56',
    workingHours: '08:00 - 16:00',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    experience: 15
  },
  {
    id: '2',
    name_ar: 'د. فاطمة الزهراء بوعلام',
    nameFr: 'Dr. Fatima Zahra Boualam',
    specialty_ar: 'طب أطفال وحديثي الولادة',
    specialtyFr: 'Pédiatrie et Néonatologie',
    address_ar: 'عيادة خاصة، سيق',
    addressFr: 'Cabinet privé, Sig',
    municipalityId: 'sig',
    phone: '0661 23 45 67',
    workingHours: '09:00 - 17:00',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    experience: 12
  },
  {
    id: '3',
    name_ar: 'د. عبد الرحمن مرابط',
    nameFr: 'Dr. Abdelrahman Merabet',
    specialty_ar: 'طب أطفال وتغذية',
    specialtyFr: 'Pédiatrie et Nutrition',
    address_ar: 'مركز صحي، تيغنيف',
    addressFr: 'Centre de santé, Tighennif',
    municipalityId: 'tighennif',
    phone: '0770 34 56 78',
    workingHours: '08:30 - 15:30',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
    experience: 10
  },
  {
    id: '4',
    name_ar: 'د. نورة بن ساسي',
    nameFr: 'Dr. Noura Ben Sassi',
    specialty_ar: 'طب أطفال وأمراض الحساسية',
    specialtyFr: 'Pédiatrie et Allergologie',
    address_ar: 'عيادة خاصة، المحمدية',
    addressFr: 'Cabinet privé, Mohammadia',
    municipalityId: 'mohammadia',
    phone: '0550 45 67 89',
    workingHours: '09:00 - 18:00',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    experience: 8
  },
  {
    id: '5',
    name_ar: 'د. كريم بوزيان',
    nameFr: 'Dr. Karim Bouziane',
    specialty_ar: 'طب الأطفال العام',
    specialtyFr: 'Pédiatrie Générale',
    address_ar: 'حي الزيتون، غريس',
    addressFr: 'Cité Ez-Zitoun, Ghriss',
    municipalityId: 'ghriss',
    phone: '0662 56 78 90',
    workingHours: '08:00 - 14:00',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
    experience: 20
  },
  {
    id: '6',
    name_ar: 'د. كريم بوزيان',
    nameFr: 'Dr. Karim Bouziane',
    specialty_ar: 'طب أطفال وأمراض الجهاز التنفسي',
    specialtyFr: 'Pédiatrie et Pneumologie',
    address_ar: 'مستشفى روضتي، معسكر',
    addressFr: 'Hôpital روضتي, Mascara',
    municipalityId: 'mascara',
    phone: '0771 67 89 01',
    workingHours: '10:00 - 18:00',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400',
    experience: 14
  }
];
