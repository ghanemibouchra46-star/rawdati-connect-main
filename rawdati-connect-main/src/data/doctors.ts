export interface Doctor {
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
}

export const doctors: Doctor[] = [
  {
    id: '1',
    name: 'د. محمد بن عمر',
    specialty: 'طب الأطفال العام',
    address: 'شارع الاستقلال، معسكر',
    municipality: 'معسكر',
    phone: '0555 12 34 56',
    workingHours: '08:00 - 16:00',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    experience: 15
  },
  {
    id: '2',
    name: 'د. فاطمة الزهراء بوعلام',
    specialty: 'طب الأطفال وحديثي الولادة',
    address: 'حي النصر، سيق',
    municipality: 'سيق',
    phone: '0661 23 45 67',
    workingHours: '09:00 - 17:00',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    experience: 12
  },
  {
    id: '3',
    name: 'د. عبد الرحمن مرابط',
    specialty: 'طب الأطفال والحساسية',
    address: 'شارع الأمير عبد القادر، تيغنيف',
    municipality: 'تيغنيف',
    phone: '0770 34 56 78',
    workingHours: '08:30 - 15:30',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
    experience: 10
  },
  {
    id: '4',
    name: 'د. نورة بن ساسي',
    specialty: 'طب الأطفال والتغذية',
    address: 'وسط المدينة، المحمدية',
    municipality: 'المحمدية',
    phone: '0550 45 67 89',
    workingHours: '09:00 - 18:00',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    experience: 8
  },
  {
    id: '5',
    name: 'د. كريم بوزيان',
    specialty: 'طب الأطفال العام',
    address: 'حي الزيتون، غريس',
    municipality: 'غريس',
    phone: '0662 56 78 90',
    workingHours: '08:00 - 14:00',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
    experience: 20
  },
  {
    id: '6',
    name: 'د. سمية بلخير',
    specialty: 'طب الأطفال وأمراض الجهاز التنفسي',
    address: 'شارع محمد بوضياف، معسكر',
    municipality: 'معسكر',
    phone: '0771 67 89 01',
    workingHours: '10:00 - 18:00',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=400',
    experience: 14
  }
];
