export interface ClothingStore {
  id: string;
  nameAr: string;
  nameFr: string;
  addressAr: string;
  addressFr: string;
  municipalityId: string;
  phone: string;
  workingHours: string;
  rating: number;
  image: string;
  categoriesAr: string[];
  categoriesFr: string[];
  priceRangeAr: string;
  priceRangeFr: string;
}

export const clothingStores: ClothingStore[] = [
  {
    id: '1',
    nameAr: 'بوتيك الملائكة الصغار',
    nameFr: 'Boutique Petits Anges',
    addressAr: 'شارع الاستقلال، Rawdati',
    addressFr: 'Rue de l\'Indépendance, Rawdati',
    municipalityId: 'mascara',
    phone: '0555 11 22 33',
    workingHours: '09:00 - 20:00',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400',
    categoriesAr: ['ملابس أطفال', 'أحذية', 'إكسسوارات'],
    categoriesFr: ['Vêtements enfants', 'Chaussures', 'Accessoires'],
    priceRangeAr: 'متوسط',
    priceRangeFr: 'Moyen'
  },
  {
    id: '2',
    nameAr: 'دار الأطفال للملابس',
    nameFr: 'Maison des Enfants',
    addressAr: 'حي النور، سيق',
    addressFr: 'Cité En-Nour, Sig',
    municipalityId: 'sig',
    phone: '0661 22 33 44',
    workingHours: '08:30 - 19:30',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    categoriesAr: ['ملابس رضع', 'ملابس أطفال', 'بيجامات'],
    categoriesFr: ['Articles nouveaux-nés', 'Vêtements enfants', 'Pyjamas'],
    priceRangeAr: 'اقتصادي',
    priceRangeFr: 'Économique'
  },
  {
    id: '3',
    nameAr: 'أزياء الطفولة',
    nameFr: 'Mode Enfantine',
    addressAr: 'وسط المدينة، تيغنيف',
    addressFr: 'Centre Ville, Tighennif',
    municipalityId: 'tighennif',
    phone: '0770 33 44 55',
    workingHours: '09:00 - 21:00',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    categoriesAr: ['ملابس مناسبات', 'ملابس يومية', 'أحذية'],
    categoriesFr: ['Tenues de cérémonie', 'Vêtements quotidiens', 'Chaussures'],
    priceRangeAr: 'مرتفع',
    priceRangeFr: 'Élevé'
  },
  {
    id: '4',
    nameAr: 'محل براعم الجنة',
    nameFr: 'Magasin Bourgeons du Paradis',
    addressAr: 'شارع الأمل، المحمدية',
    addressFr: 'Rue de l\'Espoir, Mohammadia',
    municipalityId: 'mohammadia',
    phone: '0550 44 55 66',
    workingHours: '08:00 - 18:00',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400',
    categoriesAr: ['ملابس أطفال', 'ألعاب', 'مستلزمات'],
    categoriesFr: ['Vêtements enfants', 'Jouets', 'Articles divers'],
    priceRangeAr: 'متوسط',
    priceRangeFr: 'Moyen'
  },
  {
    id: '5',
    nameAr: 'عالم الصغار',
    nameFr: 'Monde des Petits',
    addressAr: 'حي السلام، غريس',
    addressFr: 'Cité Es-Salam, Ghriss',
    municipalityId: 'ghriss',
    phone: '0662 55 66 77',
    workingHours: '09:30 - 20:30',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400',
    categoriesAr: ['ملابس رضع', 'ملابس أطفال', 'إكسسوارات'],
    categoriesFr: ['Articles nouveaux-nés', 'Vêtements enfants', 'Accessoires'],
    priceRangeAr: 'اقتصادي',
    priceRangeFr: 'Économique'
  },
  {
    id: '6',
    nameAr: 'بوتيك النجوم الصغيرة',
    nameFr: 'Boutique Petites Étoiles',
    addressAr: 'شارع 1 نوفمبر، Rawdati',
    addressFr: 'Boulevard 1er Novembre, Rawdati',
    municipalityId: 'mascara',
    phone: '0771 66 77 88',
    workingHours: '10:00 - 21:00',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400',
    categoriesAr: ['ملابس مناسبات', 'ملابس ماركات', 'أحذية فاخرة'],
    categoriesFr: ['Tenues de cérémonie', 'Grandes marques', 'Chaussures de luxe'],
    priceRangeAr: 'مرتفع',
    priceRangeFr: 'Élevé'
  }
];
