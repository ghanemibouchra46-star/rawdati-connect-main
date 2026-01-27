export interface ClothingStore {
  id: string;
  name: string;
  address: string;
  municipality: string;
  phone: string;
  workingHours: string;
  rating: number;
  image: string;
  categories: string[];
  priceRange: string;
}

export const clothingStores: ClothingStore[] = [
  {
    id: '1',
    name: 'بوتيك الملائكة الصغار',
    address: 'شارع الاستقلال، معسكر',
    municipality: 'معسكر',
    phone: '0555 11 22 33',
    workingHours: '09:00 - 20:00',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400',
    categories: ['ملابس أطفال', 'أحذية', 'إكسسوارات'],
    priceRange: 'متوسط'
  },
  {
    id: '2',
    name: 'دار الأطفال للملابس',
    address: 'حي النور، سيق',
    municipality: 'سيق',
    phone: '0661 22 33 44',
    workingHours: '08:30 - 19:30',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    categories: ['ملابس رضع', 'ملابس أطفال', 'بيجامات'],
    priceRange: 'اقتصادي'
  },
  {
    id: '3',
    name: 'أزياء الطفولة',
    address: 'وسط المدينة، تيغنيف',
    municipality: 'تيغنيف',
    phone: '0770 33 44 55',
    workingHours: '09:00 - 21:00',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    categories: ['ملابس مناسبات', 'ملابس يومية', 'أحذية'],
    priceRange: 'مرتفع'
  },
  {
    id: '4',
    name: 'محل براعم الجنة',
    address: 'شارع الأمل، المحمدية',
    municipality: 'المحمدية',
    phone: '0550 44 55 66',
    workingHours: '08:00 - 18:00',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400',
    categories: ['ملابس أطفال', 'ألعاب', 'مستلزمات'],
    priceRange: 'متوسط'
  },
  {
    id: '5',
    name: 'عالم الصغار',
    address: 'حي السلام، غريس',
    municipality: 'غريس',
    phone: '0662 55 66 77',
    workingHours: '09:30 - 20:30',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400',
    categories: ['ملابس رضع', 'ملابس أطفال', 'إكسسوارات'],
    priceRange: 'اقتصادي'
  },
  {
    id: '6',
    name: 'بوتيك النجوم الصغيرة',
    address: 'شارع 1 نوفمبر، معسكر',
    municipality: 'معسكر',
    phone: '0771 66 77 88',
    workingHours: '10:00 - 21:00',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400',
    categories: ['ملابس مناسبات', 'ملابس ماركات', 'أحذية فاخرة'],
    priceRange: 'مرتفع'
  }
];
