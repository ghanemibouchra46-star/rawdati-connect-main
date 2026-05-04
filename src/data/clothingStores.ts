export interface ClothingStore {
  id: string;
  nameAr: string;
  nameFr: string;
  nameEn: string;
  addressAr: string;
  addressFr: string;
  addressEn: string;
  municipalityId: string;
  phone: string;
  workingHours: string;
  rating: number;
  image: string;
  categoriesAr: string[];
  categoriesFr: string[];
  categoriesEn: string[];
  priceRangeAr: string;
  priceRangeFr: string;
  priceRangeEn: string;
}

export const clothingStores: ClothingStore[] = [
  {
    id: '1',
    nameAr: 'بوتيك الملائكة الصغار',
    nameFr: 'Boutique Petits Anges',
    nameEn: 'Little Angels Boutique',
    addressAr: 'شارع الاستقلال',
    addressFr: 'Rue de l\'Indépendance',
    addressEn: 'Independence Street',
    municipalityId: 'mascara',
    phone: '0555 11 22 33',
    workingHours: '09:00 - 20:00',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400',
    categoriesAr: ['ملابس أطفال', 'أحذية', 'إكسسوارات'],
    categoriesFr: ['Vêtements enfants', 'Chaussures', 'Accessoires'],
    categoriesEn: ['Kids Clothing', 'Shoes', 'Accessories'],
    priceRangeAr: 'متوسط',
    priceRangeFr: 'Moyen',
    priceRangeEn: 'Medium'
  },
  {
    id: '2',
    nameAr: 'دار الأطفال للملابس',
    nameFr: 'Maison des Enfants',
    nameEn: 'Childrens House',
    addressAr: 'حي النور',
    addressFr: 'Cité En-Nour',
    addressEn: 'En-Nour District',
    municipalityId: 'sig',
    phone: '0661 22 33 44',
    workingHours: '08:30 - 19:30',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    categoriesAr: ['ملابس رضع', 'ملابس أطفال', 'بيجامات'],
    categoriesFr: ['Articles nouveaux-nés', 'Vêtements enfants', 'Pyjamas'],
    categoriesEn: ['Baby Gear', 'Kids Clothing', 'Pyjamas'],
    priceRangeAr: 'اقتصادي',
    priceRangeFr: 'Économique',
    priceRangeEn: 'Budget'
  },
  {
    id: '3',
    nameAr: 'أزياء الطفولة',
    nameFr: 'Mode Enfantine',
    nameEn: 'Childhood Fashion',
    addressAr: 'وسط المدينة',
    addressFr: 'Centre Ville',
    addressEn: 'City Center',
    municipalityId: 'tighennif',
    phone: '0770 33 44 55',
    workingHours: '09:00 - 21:00',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400',
    categoriesAr: ['ملابس مناسبات', 'ملابس يومية', 'أحذية'],
    categoriesFr: ['Tenues de cérémonie', 'Vêtements quotidiens', 'Chaussures'],
    categoriesEn: ['Occasion Wear', 'Casual Wear', 'Shoes'],
    priceRangeAr: 'مرتفع',
    priceRangeFr: 'Élevé',
    priceRangeEn: 'Premium'
  },
  {
    id: '4',
    nameAr: 'محل براعم الجنة',
    nameFr: 'Magasin Bourgeons du Paradis',
    nameEn: 'Paradise Buds Shop',
    addressAr: 'شارع الأمل',
    addressFr: 'Rue de l\'Espoir',
    addressEn: 'Hope Street',
    municipalityId: 'mohammadia',
    phone: '0550 44 55 66',
    workingHours: '08:00 - 18:00',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400',
    categoriesAr: ['ملابس أطفال', 'ألعاب', 'مستلزمات'],
    categoriesFr: ['Vêtements enfants', 'Jouets', 'Articles divers'],
    categoriesEn: ['Kids Clothing', 'Toys', 'Essentials'],
    priceRangeAr: 'متوسط',
    priceRangeFr: 'Moyen',
    priceRangeEn: 'Medium'
  },
  {
    id: '5',
    nameAr: 'عالم الصغار',
    nameFr: 'Monde des Petits',
    nameEn: 'Kids World',
    addressAr: 'حي السلام',
    addressFr: 'Cité Es-Salam',
    addressEn: 'Es-Salam District',
    municipalityId: 'ghriss',
    phone: '0662 55 66 77',
    workingHours: '09:30 - 20:30',
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400',
    categoriesAr: ['ملابس رضع', 'ملابس أطفال', 'إكسسوارات'],
    categoriesFr: ['Articles nouveaux-nés', 'Vêtements enfants', 'Accessoires'],
    categoriesEn: ['Baby Clothing', 'Kids Clothing', 'Accessories'],
    priceRangeAr: 'اقتصادي',
    priceRangeFr: 'Économique',
    priceRangeEn: 'Budget'
  },
  {
    id: '6',
    nameAr: 'مملكة الألعاب والملابس',
    nameFr: 'Royaume des Jouets et Vêtements',
    nameEn: 'Kingdom of Toys and Clothing',
    addressAr: 'نهج 1 نوفمبر',
    addressFr: 'Boulevard 1er Novembre',
    addressEn: '1er Novembre Boulevard',
    municipalityId: 'mascara',
    phone: '0551 66 77 88',
    workingHours: '10:00 - 22:00',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400',
    categoriesAr: ['ألعاب', 'ملابس رضع', 'هدايا'],
    categoriesFr: ['Jouets', 'Nouveaux-nés', 'Cadeaux'],
    categoriesEn: ['Toys', 'Baby Clothing', 'Gifts'],
    priceRangeAr: 'متوسط',
    priceRangeFr: 'Moyen',
    priceRangeEn: 'Medium'
  },
  {
    id: '7',
    nameAr: 'عالم الطفل السعيد',
    nameFr: 'Monde de l\'Enfant Heureux',
    nameEn: 'Happy Child World',
    addressAr: 'حي المستقبل',
    addressFr: 'Cité El Mostakbel',
    addressEn: 'El Mostakbel District',
    municipalityId: 'sig',
    phone: '0664 77 88 99',
    workingHours: '09:00 - 20:00',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400',
    categoriesAr: ['ملابس أطفال', 'أحذية', 'أدوات مدرسية'],
    categoriesFr: ['Vêtements', 'Chaussures', 'Fournitures scolaires'],
    categoriesEn: ['Kids Clothing', 'Shoes', 'School Supplies'],
    priceRangeAr: 'اقتصادي',
    priceRangeFr: 'Économique',
    priceRangeEn: 'Budget'
  },
  {
    id: '8',
    nameAr: 'بيبي شوب (تمثيلي)',
    nameFr: 'Baby Shop (Mock)',
    nameEn: 'Baby Shop (Mock)',
    addressAr: 'وسط المدينة',
    addressFr: 'Centre Ville',
    addressEn: 'City Center',
    municipalityId: 'tighennif',
    phone: '0772 88 99 00',
    workingHours: '08:00 - 19:00',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=400',
    categoriesAr: ['مستلزمات رضع', 'ملابس نوم', 'ألعاب'],
    categoriesFr: ['Puericulture', 'Pyjamas', 'Jouets'],
    categoriesEn: ['Baby Essentials', 'Pyjamas', 'Toys'],
    priceRangeAr: 'متوسط',
    priceRangeFr: 'Moyen',
    priceRangeEn: 'Medium'
  }
];
