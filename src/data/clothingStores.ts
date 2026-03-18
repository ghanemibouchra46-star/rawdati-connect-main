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
    addressAr: 'شارع الاستقلال',
    addressFr: 'Rue de l\'Indépendance',
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
    addressAr: 'حي النور',
    addressFr: 'Cité En-Nour',
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
    addressAr: 'وسط المدينة',
    addressFr: 'Centre Ville',
    municipalityId: 'tighennif',
    phone: '0770 33 44 55',
    workingHours: '09:00 - 21:00',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400',
    categoriesAr: ['ملابس مناسبات', 'ملابس يومية', 'أحذية'],
    categoriesFr: ['Tenues de cérémonie', 'Vêtements quotidiens', 'Chaussures'],
    priceRangeAr: 'مرتفع',
    priceRangeFr: 'Élevé'
  },
  {
    id: '4',
    nameAr: 'محل براعم الجنة',
    nameFr: 'Magasin Bourgeons du Paradis',
    addressAr: 'شارع الأمل',
    addressFr: 'Rue de l\'Espoir',
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
    addressAr: 'حي السلام',
    addressFr: 'Cité Es-Salam',
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
    nameAr: 'مملكة الألعاب والملابس',
    nameFr: 'Royaume des Jouets et Vêtements',
    addressAr: 'نهج 1 نوفمبر',
    addressFr: 'Boulevard 1er Novembre',
    municipalityId: 'mascara',
    phone: '0551 66 77 88',
    workingHours: '10:00 - 22:00',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400',
    categoriesAr: ['ألعاب', 'ملابس رضع', 'هدايا'],
    categoriesFr: ['Jouets', 'Nouveaux-nés', 'Cadeaux'],
    priceRangeAr: 'متوسط',
    priceRangeFr: 'Moyen'
  },
  {
    id: '7',
    nameAr: 'عالم الطفل السعيد',
    nameFr: 'Monde de l\'Enfant Heureux',
    addressAr: 'حي المستقبل',
    addressFr: 'Cité El Mostakbel',
    municipalityId: 'sig',
    phone: '0664 77 88 99',
    workingHours: '09:00 - 20:00',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400',
    categoriesAr: ['ملابس أطفال', 'أحذية', 'أدوات مدرسية'],
    categoriesFr: ['Vêtements', 'Chaussures', 'Fournitures scolaires'],
    priceRangeAr: 'اقتصادي',
    priceRangeFr: 'Économique'
  },
  {
    id: '8',
    nameAr: 'بيبي شوب (تمثيلي)',
    nameFr: 'Baby Shop (Mock)',
    addressAr: 'وسط المدينة',
    addressFr: 'Centre Ville',
    municipalityId: 'tighennif',
    phone: '0772 88 99 00',
    workingHours: '08:00 - 19:00',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1519689689358-09705f76efd9?w=400',
    categoriesAr: ['مستلزمات رضع', 'ملابس نوم', 'ألعاب'],
    categoriesFr: ['Puericulture', 'Pyjamas', 'Jouets'],
    priceRangeAr: 'متوسط',
    priceRangeFr: 'Moyen'
  }
];
