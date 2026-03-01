import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ar' | 'fr' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    dir: 'rtl' | 'ltr';
}

const translations: Record<Language, Record<string, string>> = {
    ar: {
        // Welcome & General
        'welcome': 'مرحباً بكم',
        'welcome.subtitle': 'منصة روضتي - Rawdati',
        'platform.name': 'روضتي',
        'mascara': 'Rawdati',

        // Navigation
        'nav.home': 'الرئيسية',
        'nav.kindergartens': 'الروضات',
        'nav.doctors': 'الأطباء',
        'nav.speechTherapy': 'أخصائيو الأرطفونيا',
        'nav.clothing': 'ملابس الأطفال',
        'nav.about': 'من نحن',
        'nav.login': 'تسجيل الدخول',
        'nav.ownerLogin': 'دخول الملاك',

        // Hero Section
        'hero.title1': 'اختر الروضة المثالية',
        'hero.title2': 'لطفلك',
        'hero.description': 'نساعدك في العثور على أفضل رياض الأطفال من خلال معلومات شاملة وتقييمات حقيقية',
        'hero.explore': 'استكشف الروضات',
        'hero.aboutUs': 'تعرف علينا',

        // Features
        'features.title': 'لماذا روضتي؟',
        'features.subtitle': 'نوفر لك كل ما تحتاجه لاتخاذ القرار الصحيح',
        'features.certified': 'روضات معتمدة',
        'features.certifiedDesc': 'جميع الروضات مرخصة وتتبع معايير الجودة التعليمية',
        'features.reviews': 'تقييمات حقيقية',
        'features.reviewsDesc': 'آراء وتجارب أولياء أمور حقيقيين لمساعدتك في الاختيار',
        'features.nearby': 'سهلة الوصول',
        'features.nearbyDesc': 'ابحث عن روضات في منطقتك أو المناطق المجاورة',
        'features.easyRegister': 'تسجيل سهل',
        'features.easyRegisterDesc': 'سجّل طفلك مباشرة عبر المنصة بخطوات بسيطة',

        // Services
        'services.title': 'خدماتنا',
        'services.subtitle': 'نقدم لك مجموعة من الخدمات المتكاملة لرعاية طفلك',
        'services.kindergartens': 'الروضات',
        'services.kindergartensDesc': 'اكتشف أفضل رياض الأطفال',
        'services.doctors': 'أطباء الأطفال',
        'services.doctorsDesc': 'قائمة بأطباء الأطفال المتخصصين في المنطقة',
        'services.speechTherapy': 'أخصائيو الأرطفونيا',
        'services.speechTherapyDesc': 'أخصائيون في علاج اضطرابات النطق والتواصل',
        'services.clothing': 'محلات الملابس',
        'services.clothingDesc': 'أفضل محلات ملابس الأطفال',
        'hero.badge': 'أفضل الروضات لطفلك',
        'hero.searchPlaceholder': 'ابحث باسم الروضة...',
        'hero.searchButton': 'بحث',
        'hero.municipalitiesLabel': 'البلديات الرئيسية:',
        'hero.otherServices': 'خدمات أخرى:',

        // CTA
        'cta.ownerTitle': 'هل أنت صاحب روضة؟',
        'cta.ownerDesc': 'انضم إلى منصة روضتي وأوصل روضتك لآلاف الأولياء الباحثين عن أفضل الخيارات لأطفالهم',
        'cta.register': 'سجّل روضتك الآن',

        // Language Selector
        'language.select': 'اختر اللغة',
        'language.ar': 'العربية',
        'language.fr': 'Français',
        'language.en': 'English',

        'footer.rights': 'جميع الحقوق محفوظة',
        'footer.description': 'منصة رقمية لمساعدة الأولياء في إيجاد أفضل الخدمات لأطفالهم',

        // Kindergartens Page
        'kindergartens.pageTitle': 'روضاتنا',
        'kindergartens.pageSubtitle': 'اختر من بين أفضل الروضات، مع معلومات شاملة عن الأسعار والخدمات والتقييمات',
        'kindergartens.searchPlaceholder': 'ابحث عن روضة...',
        'kindergartens.count': 'عرض {count} روضة',
        'kindergartens.noResults': 'لا توجد نتائج',
        'kindergartens.noResultsDesc': 'جرب تغيير معايير البحث',
        'kindergartens.clearFilters': 'مسح جميع الفلاتر',

        // Filters
        'filter.title': 'تصفية النتائج',
        'filter.municipality': 'البلدية',
        'filter.allMunicipalities': 'كل البلديات',
        'filter.priceRange': 'نطاق السعر (دج)',
        'filter.services': 'الخدمات المتوفرة',
        'filter.transport': 'النقل المدرسي',
        'filter.meals': 'إطعام',
        'filter.summerCamp': 'مخيم صيفي',
        'filter.extracurricular': 'نشاطات إضافية',
        'filter.medical': 'متابعة طبية',

        // Cards & Modals
        'card.viewDetails': 'عرض التفاصيل',
        'card.register': 'حجز مقعد',
        'modal.details': 'تفاصيل الروضة',
        'modal.registration': 'طلب حجز مقعد',
        'modal.close': 'إغلاق',
        'modal.send': 'إرسال الطلب',

        // Kindergarten Details
        'details.about': 'عن الروضة',
        'details.hours': 'ساعات العمل',
        'details.age': 'الفئة العمرية',
        'details.reviews': 'تقييمات الأولياء',
        'details.addReview': 'أضف تقييمك',
        'details.nameLabel': 'اسمك',
        'details.namePlaceholder': 'أدخل اسمك',
        'details.ratingLabel': 'التقييم',
        'details.commentLabel': 'تعليقك (اختياري)',
        'details.commentPlaceholder': 'شاركنا رأيك عن هذه الروضة...',
        'details.noReviews': 'لا توجد تقييمات بعد. كن أول من يقيّم هذه الروضة!',
        'details.submit': 'إرسال التقييم',
        'details.submitting': 'جاري الإرسال...',
        'details.loadingReviews': 'جاري تحميل التقييمات...',
        'details.map': 'الموقع على الخريطة',
        'details.successReview': 'تم إرسال تقييمك بنجاح',
        'details.errorReview': 'حدث خطأ أثناء إرسال التقييم',
        'details.errorName': 'الرجاء إدخال اسمك',

        // Registration Modal
        'registration.parentName': 'اسم الولي',
        'registration.childName': 'اسم الطفل',
        'registration.childAge': 'العمر',
        'registration.message': 'رسالة إضافية (اختياري)',
        'registration.messagePlaceholder': 'أي معلومات إضافية تود مشاركتها...',
        'registration.loginRequired': 'تسجيل الدخول مطلوب',
        'registration.loginRequiredDesc': 'يجب تسجيل الدخول لإرسال طلب تسجيل طفلك',
        'registration.successTitle': 'تم ارسال طلبك بنجاح',
        'registration.successDesc': 'لقد تم ارسال طلبك لتسجيل طفلك في {name} بنجاح. سنتواصل معك قريباً.',
        'registration.errorAuth': 'يجب تسجيل الدخول لإرسال طلب التسجيل',
        'registration.errorSubmit': 'لم نتمكن من إرسال طلبك. يرجى المحاولة مرة أخرى.',
        'registration.hasDisease': 'هل طفلك يعاني من مرض؟',
        'registration.diseaseDetails': 'تفاصيل المرض أو الحالة الصحية',
        'registration.hasAllergy': 'هل يعاني طفلك من أي حساسية غذائية؟',
        'registration.allergyDetails': 'تفاصيل الحساسية الغذائية',

        // Doctors Page
        'doctors.pageTitle': 'أطباء الأطفال',
        'doctors.pageSubtitle': 'قائمة شاملة لأفضل أطباء الأطفال',
        'doctors.find': 'اعثر على طبيب أطفال موثوق',
        'doctors.searchPlaceholder': 'ابحث باسم الطبيب أو التخصص...',
        'doctors.experience': 'خبرة {years} سنة',
        'doctors.callNow': 'اتصل الآن',
        'doctors.all': 'الكل',

        // Feature & Partners
        'filter.autism': 'جناح أطفال التوحد',
        'details.autism': 'يتوفر جناح خاص لأطفال التوحد',
        'details.partners': 'الشركاء',
        'details.partnerDoctor': 'أطباء متعاقدون',
        'details.partnerStore': 'محلات تابعة',

        // Speech Therapy Page
        'speech.pageTitle': 'أخصائيي الأرطفونيا',
        'speech.pageSubtitle': 'قائمة شاملة لأفضل أخصائيي الأرطفونيا',
        'speech.find': 'اعثر على أخصائي أرطفونيا خبير',
        'speech.searchPlaceholder': 'ابحث باسم الأخصائي أو التخصص...',

        // Clothing Stores Page
        'clothing.pageTitle': 'محلات ملابس الأطفال',
        'clothing.pageSubtitle': 'اكتشف أفضل محلات ملابس الأطفال',
        'clothing.find': 'اكتشف أفضل محلات ملابس الأطفال',
        'clothing.searchPlaceholder': 'ابحث باسم المحل أو المدينة...',
        'clothing.priceRange': 'نطاق السعر',

        // About Page
        'about.title': 'من نحن',
        'about.heroTitle': 'نحن هنا من أجل أطفالكم',
        'about.heroSubtitle': 'منصة رقمية تجمع رياض الأطفال في مكان واحد',
        'about.desc1': 'نحن منصة رقمية وُجدت لتسهيل طريق الأولياء في أهم قرار يخص أطفالهم: اختيار الروضة المناسبة.',
        'about.desc2': 'نجمع رياض الأطفال في فضاء واحد موثوق، ونقدّم معلومات واضحة تساعد الأولياء على الاختيار براحة واطمئنان.',
        'about.desc3': 'انطلقت فكرتنا من واقع نعيشه، ومن إحساس بمسؤولية تجاه الطفولة، لأن كل طفل يستحق بداية آمنة وبيئة تربوية جيدة.',
        'about.desc4': 'هدفنا هو بناء جسر ثقة بين الأولياء ورياض الأطفال، وتسهيل التواصل بينهم بطريقة بسيطة، شفافة، وقابلة للتطوير.',
        'about.quote': 'نؤمن أن الاهتمام بالطفل اليوم هو استثمار في مستقبل أفضل غدًا.',
        'about.values': 'قيمنا',
        'about.value1.title': 'الثقة والأمان',
        'about.value1.desc': 'نحرص على تقديم معلومات موثوقة ودقيقة لمساعدة الأولياء في اتخاذ القرار الصحيح',
        'about.value2.title': 'الاهتمام بالطفولة',
        'about.value2.desc': 'نؤمن بأن كل طفل يستحق أفضل بداية ممكنة في رحلته التعليمية',
        'about.value3.title': 'التواصل الشفاف',
        'about.value3.desc': 'نسعى لبناء جسور تواصل واضحة بين الأولياء ورياض الأطفال',
        'about.value4.title': 'التطوير المستمر',
        'about.value4.desc': 'نعمل باستمرار على تحسين خدماتنا لتلبية احتياجات الأولياء والروضات',

        // Common
        'common.error': 'خطأ',
        'common.updated': 'تم التحديث',
        'common.notSpecified': 'غير محدد',
        'common.save': 'حفظ',
        'common.cancel': 'إلغاء',
        'common.delete': 'حذف',
        'common.edit': 'تعديل',

        // Auth
        'auth.login': 'تسجيل الدخول',
        'auth.signup': 'حساب جديد',
        'auth.welcome': 'مرحباً بك',
        'auth.subtitle': 'سجل دخولك للوصول إلى حسابك',
        'auth.email': 'البريد الإلكتروني',
        'auth.password': 'كلمة المرور',
        'auth.fullName': 'الاسم الكامل',
        'auth.phone': 'رقم الهاتف',
        'auth.loading': 'جاري التحميل...',
        'auth.backHome': 'العودة للصفحة الرئيسية',
        'auth.confirmEmail': 'تأكيد البريد الإلكتروني',
        'auth.confirmDesc': 'تم إرسال رابط التأكيد إلى',
        'auth.openEmail': 'افتح بريدك الإلكتروني واضغط على رابط التأكيد',
        'auth.resend': 'إعادة إرسال الرابط',
        'auth.backLogin': 'العودة لتسجيل الدخول',
        'auth.verified': 'تم التأكيد بنجاح!',
        'auth.passwordMin': 'يجب أن تكون 6 أحرف على الأقل',
        'auth.error.nameRequired': 'يرجى إدخال الاسم الكامل',
        'auth.error.phoneRequired': 'يرجى إدخال رقم الهاتف',
        'auth.error.phoneInvalid': 'رقم الهاتف يجب أن يتكون من 10 أرقام',
        'auth.error.emailInvalid': 'يرجى إدخال بريد إلكتروني صحيح',
        'auth.error.passwordRequired': 'يرجى إدخال كلمة المرور',
        'auth.error.signup': 'حدث خطأ أثناء إنشاء الحساب',
        'auth.forgotPassword': 'هل نسيت كلمة السر؟',
        'auth.resetPassword': 'إعادة تعيين كلمة المرور',
        'auth.resetPasswordDesc': 'أدخل بريدك الإلكتروني لاستلام رمز إعادة تعيين كلمة المرور',
        'auth.sendResetLink': 'إرسال الرمز',
        'auth.resetEmailSent': 'تم إرسال رمز إعادة التعيين إلى بريدك الإلكتروني',
        'auth.otpSent': 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
        'auth.verifyOtp': 'تأكيد الرمز',
        'auth.otpPlaceholder': 'أدخل الرمز المكون من 6 أرقام',
        'auth.newPassword': 'كلمة المرور الجديدة',
        'auth.confirmNewPassword': 'تأكيد كلمة المرور الجديدة',
        'auth.passwordResetSuccess': 'تم تغيير كلمة المرور بنجاح!',
        'auth.invalidOtp': 'رابط التحقق غير صحيح أو منتهي الصلاحية',
        'auth.setNewPassword': 'تعيين كلمة مرور جديدة',
        'auth.success': 'تم تسجيل الدخول بنجاح',
        'auth.error.checkSpam': 'إذا لم يصلك البريد، يرجى التحقق من ملف البريد المزعج (Spam) أو المحاولة بعد ساعة بسبب قيود الإرسال.',
        'auth.error.emailOnly': 'حالياً، استعادة كلمة المرور متاحة عبر البريد الإلكتروني فقط.',
        'auth.kindergartenName': 'اسم الروضة',
        'auth.ownerSignupSubtitle': 'سجل بياناتك لإنشاء حساب مدير روضة',

        // Admin Dashboard
        'admin.title': 'لوحة تحكم الأدمين',
        'admin.subtitle': 'روضتي - Rawdati',
        'admin.totalUsers': 'إجمالي المستخدمين',
        'admin.pending': 'في الانتظار',
        'admin.approved': 'موافق عليهم',
        'admin.rejected': 'مرفوضين',
        'admin.manageUsers': 'إدارة المستخدمين',
        'admin.name': 'الاسم',
        'admin.phone': 'الهاتف',
        'admin.role': 'الدور',
        'admin.status': 'الحالة',
        'admin.date': 'تاريخ التسجيل',
        'booking.title': 'حجز موعد زيارة',
        'booking.success': 'تم حجز موعد',
        'booking.successDesc': 'سنتصل بك لتأكيد الموعد',
        'admin.actions': 'الإجراءات',
        'admin.logout': 'خروج',
        'admin.home': 'الرئيسية',
        'admin.noUsers': 'لا يوجد مستخدمين',

        // Owner Dashboard
        'owner.medicalAlert': 'تنبيهات طبية',
        'owner.attendanceRate': 'نسبة الحضور',
        'owner.totalDebt': 'إجمالي الديون',
        'owner.attendance': 'الحضور',
        'owner.finance': 'المالية',
        'owner.stats': 'الإحصائيات',
        'owner.presence': 'تسجيل الحضور اليومي',
        'owner.children': 'الأطفال',
        'owner.staff': 'الطاقم',
        'owner.paid': 'تم الدفع',
        'owner.debt': 'دَيْن',
        'owner.paymentStatus': 'حالة الدفع',
        'owner.medicalStats': 'إحصائيات طبية',
        'owner.foodAllergy': 'حساسية غذائية',
        'owner.chronicDisease': 'أمراض مزمنة',
        'admin.role.admin': 'أدمين',
        'admin.role.owner': 'مالك روضة',
        'admin.role.parent': 'ولي أمر',
        'admin.status.approved': 'موافق عليه',
        'admin.status.rejected': 'مرفوض',
        'admin.status.pending': 'معلق',

        // Admin Auth
        'admin.auth.title': 'دخول الأدمين',
        'admin.auth.desc': 'أدخل بيانات حسابك للوصول للوحة التحكم',

        // Parent Dashboard
        'parent.title': 'لوحة تحكم الولي',
        'parent.welcome': 'مرحباً',
        'parent.myChildren': 'أطفالي',
        'parent.noChildren': 'لا يوجد أطفال مسجلين',
        'parent.noChildrenDesc': 'سيتم إضافة أطفالك عند تسجيلهم في إحدى الروضات',
        'parent.latestActivities': 'آخر النشاطات',
        'parent.noActivities': 'لا توجد نشاطات حتى الآن',
        'parent.quickActions': 'إجراءات سريعة',
        'parent.notifications': 'الإشعارات',
        'parent.photos': 'الصور',
        'parent.schedule': 'الجدول',
        'parent.settings': 'الإعدادات',
        'parent.age': 'سنوات',
        'parent.activity.learning': 'تعلم',
        'parent.activity.play': 'لعب',
        'parent.activity.meal': 'وجبة',
        'parent.activity.nap': 'قيلولة',
        'parent.activity.other': 'نشاط',

        'auth.error.invalidLogin': 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        'auth.error.notConfirmed': 'يرجى تأكيد بريدك الإلكتروني أولاً',
        'auth.error.alreadyRegistered': 'هذا البريد الإلكتروني مسجل بالفعل',
        'auth.error.resendFailed': 'فشل في إعادة إرسال رابط التأكيد',
        'auth.error.notAdmin': 'ليس لديك صلاحيات الأدمين',

        // Chatbot
        'chatbot.welcome': 'مرحباً، أنا المساعد الذكي لـ "روضتي". كيف يمكنني مساعدتك؟',
        'chatbot.placeholder': 'اكتب سؤالك هنا...',
        'chatbot.send': 'إرسال',
        'chatbot.title': 'المساعد الذكي',
        'chatbot.typing': 'جاري الكتابة...',
        'chatbot.error': 'عذراً، حدث خطأ ما. حاول مرة أخرى.',
    },
    fr: {
        // Welcome & General
        'welcome': 'Bienvenue',
        'welcome.subtitle': 'Plateforme Rawdati - Rawdati',
        'platform.name': 'Rawdati',
        'mascara': 'Rawdati',

        // Navigation
        'nav.home': 'Accueil',
        'nav.kindergartens': 'Jardins d\'enfants',
        'nav.doctors': 'Médecins',
        'nav.speechTherapy': 'Orthophonistes',
        'nav.clothing': 'Vêtements enfants',
        'nav.about': 'À propos',
        'nav.login': 'Connexion',
        'nav.ownerLogin': 'Espace propriétaire',

        // Hero Section
        'hero.title1': 'Choisissez le jardin d\'enfants idéal',
        'hero.title2': 'pour votre enfant',
        'hero.description': 'Nous vous aidons à trouver les meilleurs jardins d\'enfants avec des informations complètes et des avis authentiques',
        'hero.explore': 'Explorer les jardins',
        'hero.aboutUs': 'À propos de nous',

        // Features
        'features.title': 'Pourquoi Rawdati?',
        'features.subtitle': 'Nous vous fournissons tout ce dont vous avez besoin pour prendre la bonne décision',
        'features.certified': 'Jardins certifiés',
        'features.certifiedDesc': 'Tous les jardins sont agréés et suivent les normes de qualité éducative',
        'features.reviews': 'Avis authentiques',
        'features.reviewsDesc': 'Opinions et expériences de vrais parents pour vous aider à choisir',
        'features.nearby': 'Près de chez vous',
        'features.nearbyDesc': 'Trouvez des jardins dans votre commune ou les zones voisines',
        'features.easyRegister': 'Inscription facile',
        'features.easyRegisterDesc': 'Inscrivez votre enfant directement via la plateforme en quelques étapes',

        // Services
        'services.title': 'Nos services',
        'services.subtitle': 'Nous vous offrons une gamme de services intégrés pour les soins de votre enfant',
        'services.kindergartens': 'Jardins d\'enfants',
        'services.kindergartensDesc': 'Découvrez les meilleurs jardins d\'enfants',
        'services.doctors': 'Pédiatres',
        'services.doctorsDesc': 'Liste des pédiatres spécialisés',
        'services.speechTherapy': 'Orthophonistes',
        'services.speechTherapyDesc': 'Spécialistes des troubles de la parole et de la communication',
        'services.clothing': 'Boutiques de vêtements',
        'services.clothingDesc': 'Les meilleures boutiques de vêtements pour enfants',
        'hero.badge': 'Les meilleurs jardins d\'enfants',
        'hero.searchPlaceholder': 'Rechercher par nom...',
        'hero.searchButton': 'Rechercher',
        'hero.municipalitiesLabel': 'Principales communes:',
        'hero.otherServices': 'Autres services:',

        // CTA
        'cta.ownerTitle': 'Êtes-vous propriétaire d\'un jardin d\'enfants?',
        'cta.ownerDesc': 'Rejoignez la plateforme Rawdati et atteignez des milliers de parents à la recherche des meilleures options',
        'cta.register': 'Inscrivez votre jardin maintenant',

        // Language Selector
        'language.select': 'Choisir la langue',
        'language.ar': 'العربية',
        'language.fr': 'Français',
        'language.en': 'English',

        // Footer
        'footer.rights': 'Tous droits réservés',
        'footer.description': 'Plateforme numérique pour aider les parents à trouver les meilleurs services pour leurs enfants à Mascara',

        // Kindergartens Page
        'kindergartens.pageTitle': 'Jardins d\'enfants à Mascara',
        'kindergartens.pageSubtitle': 'Choisissez parmi les meilleurs jardins d\'enfants à Mascara, avec des informations sur les prix, services et avis',
        'kindergartens.searchPlaceholder': 'Chercher un jardin...',
        'kindergartens.count': 'Affichage de {count} jardin(s)',
        'kindergartens.noResults': 'Aucun résultat',
        'kindergartens.noResultsDesc': 'Essayez de modifier vos critères de recherche',
        'kindergartens.clearFilters': 'Effacer tous les filtres',

        // Filters
        'filter.title': 'Filtrer les résultats',
        'filter.municipality': 'Commune',
        'filter.allMunicipalities': 'Toutes les communes',
        'filter.priceRange': 'Tranche de prix (DA)',
        'filter.services': 'Services disponibles',
        'filter.transport': 'Transport scolaire',
        'filter.meals': 'Repas',
        'filter.summerCamp': 'Camps d\'été',
        'filter.extracurricular': 'Activités parascolaires',
        'filter.medical': 'Suivi médical',

        // Cards & Modals
        'card.viewDetails': 'Voir les détails',
        'card.register': 'Réserver une place',
        'modal.details': 'Détails du jardin',
        'modal.registration': 'Demande de réservation',
        'modal.close': 'Fermer',
        'modal.send': 'Envoyer la demande',

        // Kindergarten Details
        'details.about': 'À propos du jardin',
        'details.hours': 'Heures de travail',
        'details.age': 'Tranche d\'âge',
        'details.reviews': 'Avis des parents',
        'details.addReview': 'Ajouter un avis',
        'details.nameLabel': 'Votre nom',
        'details.namePlaceholder': 'Entrez votre nom',
        'details.ratingLabel': 'Évaluation',
        'details.commentLabel': 'Votre commentaire (optionnel)',
        'details.commentPlaceholder': 'Partagez votre avis sur ce jardin...',
        'details.noReviews': 'Aucun avis pour le moment. Soyez le premier à donner votre avis !',
        'details.submit': 'Envoyer l\'avis',
        'details.submitting': 'Envoi en cours...',
        'details.loadingReviews': 'Chargement des avis...',
        'details.map': 'Emplacement sur la carte',
        'details.successReview': 'Votre avis a été envoyé avec succès',
        'details.errorReview': 'Une erreur est survenue lors de l\'envoi de l\'avis',
        'details.errorName': 'Veuillez entrer votre nom',

        // Registration Modal
        'registration.parentName': 'Nom du parent',
        'registration.childName': 'Nom de l\'enfant',
        'registration.childAge': 'Âge',
        'registration.message': 'Message supplémentaire (optionnel)',
        'registration.messagePlaceholder': 'Toute information supplémentaire...',
        'registration.loginRequired': 'Connexion requise',
        'registration.loginRequiredDesc': 'Vous devez être connecté pour inscrire votre enfant',
        'registration.successTitle': 'Inscription réussie !',
        'registration.successDesc': 'L\'inscription de votre enfant à {name} a été confirmée avec succès. Nous vous contacterons bientôt.',
        'registration.errorAuth': 'Veuillez vous connecter pour envoyer la demande',
        'registration.errorSubmit': 'Impossible d\'envoyer votre demande. Veuillez réessayer.',
        'registration.hasDisease': 'Votre enfant souffre-t-il d\'une maladie ?',
        'registration.diseaseDetails': 'Détails de la maladie ou condition médicale',
        'registration.hasAllergy': 'Votre enfant a-t-il des allergies alimentaires ?',
        'registration.allergyDetails': 'Détails des allergies alimentaires',

        // Doctors Page
        'doctors.pageTitle': 'Pédiatres à Mascara',
        'doctors.pageSubtitle': 'Une liste complète des meilleurs pédiatres de la wilaya de Mascara',
        'doctors.find': 'Trouvez un pédiatre de confiance',
        'doctors.searchPlaceholder': 'Rechercher par nom ou spécialité...',
        'doctors.experience': '{years} ans d\'expérience',
        'doctors.callNow': 'Appeler maintenant',
        'doctors.all': 'Tous',

        // Feature & Partners
        'filter.autism': 'Aile pour autistes',
        'details.autism': 'Aile spéciale pour enfants autistes disponible',
        'details.partners': 'Partenaires',
        'details.partnerDoctor': 'Médecins conventionnés',
        'details.partnerStore': 'Magasins partenaires',

        // Speech Therapy Page
        'speech.pageTitle': 'Orthophonistes à Mascara',
        'speech.pageSubtitle': 'Une liste complète des meilleurs orthophonistes de la wilaya de Mascara',
        'speech.find': 'Trouvez un orthophoniste expert',
        'speech.searchPlaceholder': 'Rechercher par nom ou spécialité...',

        // Clothing Stores Page
        'clothing.pageTitle': 'Magasins de vêtements pour enfants à Mascara',
        'clothing.pageSubtitle': 'Découvrez les meilleurs magasins de vêtements pour enfants à Mascara',
        'clothing.find': 'Découvrez les meilleurs magasins de vêtements',
        'clothing.searchPlaceholder': 'Rechercher par nom ou ville...',
        'clothing.priceRange': 'Tranche de prix',

        // About Page
        'about.title': 'À propos de nous',
        'about.heroTitle': 'Nous sommes là pour vos enfants',
        'about.heroSubtitle': 'Une plateforme numérique regroupant les jardins d\'enfants',
        'about.desc1': 'Nous sommes une plateforme numérique créée pour faciliter le choix des parents pour la décision la plus importante pour leurs enfants : choisir le bon jardin d\'enfants.',
        'about.desc2': 'Nous regroupons les jardins d\'enfants dans un espace unique et fiable, en fournissant des informations claires pour aider les parents à choisir en toute sérénité.',
        'about.desc3': 'Notre idée est née d\'une réalité vécue et d\'un sens de la responsabilité envers l\'enfance, car chaque enfant mérite un début sûr et un bon environnement éducatif.',
        'about.desc4': 'Notre objectif est de construire un pont de confiance entre les parents et les jardins d\'enfants, facilitant ainsi la communication de manière simple, transparente et évolutive.',
        'about.quote': 'Nous pensons que prendre soin de l\'enfant aujourd\'hui est un investissement pour un avenir meilleur demain.',
        'about.values': 'Nos Valeurs',
        'about.value1.title': 'Confiance et Sécurité',
        'about.value1.desc': 'Nous nous engageons à fournir des informations fiables et précises pour aider les parents à prendre la bonne décision.',
        'about.value2.title': 'Soutien à l\'Enfance',
        'about.value2.desc': 'Nous croyons que chaque enfant mérite le meilleur départ possible dans son parcours éducatif.',
        'about.value3.title': 'Communication Transparente',
        'about.value3.desc': 'Nous cherchons à construire des ponts de communication clairs entre les parents et les jardins d\'enfants.',
        'about.value4.title': 'Développement Continu',
        'about.value4.desc': 'Nous travaillons constamment à l\'amélioration de nos services pour répondre aux besoins des parents et des jardins d\'enfants.',

        // Common
        'common.error': 'Erreur',
        'common.updated': 'Mis à jour',
        'common.notSpecified': 'Non spécifié',
        'common.save': 'Enregistrer',
        'common.cancel': 'Annuler',
        'common.delete': 'Supprimer',
        'common.edit': 'Modifier',

        // Auth
        'auth.login': 'Connexion',
        'booking.title': 'Réserver une visite',
        'booking.success': 'Réservation réussie',
        'booking.successDesc': 'Nous vous contacterons pour confirmer le rendez-vous',
        'auth.signup': 'Nouveau compte',
        'auth.welcome': 'Bienvenue',
        'auth.subtitle': 'Connectez-vous pour accéder à votre compte',
        'auth.email': 'Email',
        'auth.password': 'Mot de passe',
        'auth.fullName': 'Nom complet',
        'auth.phone': 'Numéro de téléphone',
        'auth.loading': 'Chargement...',
        'auth.backHome': 'Retour à l\'accueil',
        'auth.confirmEmail': 'Confirmer l\'email',
        'auth.confirmDesc': 'Un lien de confirmation a été envoyé à',
        'auth.openEmail': 'Ouvrez votre email et cliquez sur le lien de confirmation',
        'auth.resend': 'Renvoyer le lien',
        'auth.backLogin': 'Retour à la connexion',
        'auth.verified': 'Confirmé avec succès !',
        'auth.passwordMin': 'Doit comporter au moins 6 caractères',
        'auth.error.nameRequired': 'Le nom complet est requis',
        'auth.error.phoneRequired': 'Le numéro de téléphone est requis',
        'auth.error.phoneInvalid': 'Le numéro de téléphone doit comporter 10 chiffres',
        'auth.error.emailInvalid': 'Veuillez entrer un email valide',
        'auth.error.passwordRequired': 'Le mot de passe est requis',
        'auth.error.signup': 'Une erreur est survenue lors de la création du compte',
        'auth.forgotPassword': 'Mot de passe oublié ?',
        'auth.resetPassword': 'Réinitialiser le mot de passe',
        'auth.resetPasswordDesc': 'Entrez votre email pour recevoir un lien de réinitialisation',
        'auth.sendResetLink': 'Envoyer le lien',
        'auth.resetEmailSent': 'Un lien de réinitialisation a été envoyé à votre adresse email',
        'auth.otpSent': 'Un lien de vérification a été envoyé à votre email',
        'auth.verifyOtp': 'Vérifier le lien',
        'auth.otpPlaceholder': 'Veuillez vérifier votre email et cliquer sur le lien envoyé',
        'auth.newPassword': 'Nouveau mot de passe',
        'auth.confirmNewPassword': 'Confirmer le nouveau mot de passe',
        'auth.passwordResetSuccess': 'Mot de passe changé avec succès !',
        'auth.invalidOtp': 'Lien de vérification invalide ou expiré',
        'auth.setNewPassword': 'Définir un nouveau mot de passe',
        'auth.success': 'Connexion réussie',
        'auth.error.checkSpam': 'Si vous ne recevez pas l\'e-mail, veuillez vérifier vos spams ou réessayer dans une heure en raison des limites d\'envoi.',
        'auth.error.emailOnly': 'Actuellement, la réinitialisation du mot de passe est disponible par e-mail uniquement.',
        'auth.kindergartenName': "Nom du jardin d'enfants",
        'auth.ownerSignupSubtitle': "Enregistrez vos données pour créer un compte propriétaire",

        // Admin Dashboard
        'admin.title': 'Tableau de bord Admin',
        'admin.subtitle': 'Rawdati - Mascara',
        'admin.totalUsers': 'Total Utilisateurs',
        'admin.pending': 'En attente',
        'admin.approved': 'Approuvés',
        'admin.rejected': 'Refusés',
        'admin.manageUsers': 'Gérer les utilisateurs',
        'admin.name': 'Nom',
        'admin.phone': 'Téléphone',
        'admin.role': 'Rôle',
        'admin.status': 'Statut',
        'admin.date': 'Date d\'inscription',
        'admin.actions': 'Actions',
        'admin.logout': 'Déconnexion',
        'admin.home': 'Accueil',
        'admin.noUsers': 'Aucun utilisateur',

        // Owner Dashboard
        'owner.medicalAlert': 'Alertes médicales',
        'owner.attendanceRate': 'Taux de présence',
        'owner.totalDebt': 'Dettes totales',
        'owner.attendance': 'Présence',
        'owner.finance': 'Finance',
        'owner.stats': 'Statistiques',
        'owner.presence': 'Présence quotidienne',
        'owner.children': 'Enfants',
        'owner.staff': 'Personnel',
        'owner.paid': 'Payé',
        'owner.debt': 'Dette',
        'owner.paymentStatus': 'Statut de paiement',
        'owner.medicalStats': 'Stats médicales',
        'owner.foodAllergy': 'Allergie alimentaire',
        'owner.chronicDisease': 'Maladie chronique',
        'admin.role.admin': 'Admin',
        'admin.role.owner': 'Propriétaire',
        'admin.role.parent': 'Parent',
        'admin.status.approved': 'Approuvé',
        'admin.status.rejected': 'Refusé',
        'admin.status.pending': 'En attente',

        // Admin Auth
        'admin.auth.title': 'Connexion Admin',
        'admin.auth.desc': 'Entrez vos identifiants pour accéder au panneau',

        // Parent Dashboard
        'parent.title': 'Tableau de bord Parent',
        'parent.welcome': 'Bonjour',
        'parent.myChildren': 'Mes enfants',
        'parent.noChildren': 'Aucun enfant inscrit',
        'parent.noChildrenDesc': 'Vos enfants seront ajoutés lors de l\'inscription à un jardin d\'enfants',
        'parent.latestActivities': 'Dernières activités',
        'parent.noActivities': 'Aucune activité pour le moment',
        'parent.quickActions': 'Actions rapides',
        'parent.notifications': 'Notifications',
        'parent.photos': 'Photos',
        'parent.schedule': 'Emploi du temps',
        'parent.settings': 'Paramètres',
        'parent.age': 'ans',
        'parent.activity.learning': 'Apprentissage',
        'parent.activity.play': 'Jeu',
        'parent.activity.meal': 'Repas',
        'parent.activity.nap': 'Sieste',
        'parent.activity.other': 'Activité',

        'auth.error.invalidLogin': 'Email ou mot de passe incorrect',
        'auth.error.notConfirmed': 'Veuillez confirmer votre email d\'abord',
        'auth.error.alreadyRegistered': 'Cet email est déjà enregistré',
        'auth.error.resendFailed': 'Échec de l\'envoi du lien de confirmation',
        'auth.error.notAdmin': 'Vous n\'avez pas les droits d\'administrateur',

        // Chatbot
        'chatbot.welcome': 'Bonjour, je suis l\'assistant IA de "Rawdati". Comment puis-je vous aider ?',
        'chatbot.placeholder': 'Écrivez votre question ici...',
        'chatbot.send': 'Envoyer',
        'chatbot.title': 'Assistant IA',
        'chatbot.typing': 'En train d\'écrire...',
        'chatbot.error': 'Désolé, une erreur s\'est produite. Réessayez.',
    },
    en: {
        // Welcome & General
        'welcome': 'Welcome',
        'welcome.subtitle': 'Rawdati Platform - Rawdati',
        'platform.name': 'Rawdati',
        'mascara': 'Rawdati',

        // Navigation
        'nav.home': 'Home',
        'nav.kindergartens': 'Kindergartens',
        'nav.doctors': 'Doctors',
        'nav.speechTherapy': 'Speech Therapists',
        'nav.clothing': 'Kids Clothing',
        'nav.about': 'About Us',
        'nav.login': 'Login',
        'nav.ownerLogin': 'Owner Login',

        // Hero Section
        'hero.title1': 'Choose the perfect kindergarten',
        'hero.title2': 'for your child',
        'hero.description': 'We help you find the best kindergartens with comprehensive information and authentic reviews',
        'hero.explore': 'Explore Kindergartens',
        'hero.aboutUs': 'About Us',

        // Features
        'features.title': 'Why Rawdati?',
        'features.subtitle': 'We provide you with everything you need to make the right decision',
        'features.certified': 'Certified Kindergartens',
        'features.certifiedDesc': 'All kindergartens are licensed and follow educational quality standards',
        'features.reviews': 'Authentic Reviews',
        'features.reviewsDesc': 'Real parents opinions and experiences to help you choose',
        'features.nearby': 'Near You',
        'features.nearbyDesc': 'Find kindergartens in your municipality or nearby areas',
        'features.easyRegister': 'Easy Registration',
        'features.easyRegisterDesc': 'Register your child directly via the platform in simple steps',

        // Services
        'services.title': 'Our Services',
        'services.subtitle': 'We offer you a range of integrated services for your child\'s care',
        'services.kindergartens': 'Kindergartens',
        'services.kindergartensDesc': 'Discover the best kindergartens',
        'services.doctors': 'Pediatricians',
        'services.doctorsDesc': 'List of specialized pediatricians',
        'services.speechTherapy': 'Speech Therapists',
        'services.speechTherapyDesc': 'Specialists in speech and communication disorders',
        'services.clothing': 'Clothing Stores',
        'services.clothingDesc': 'Best children\'s clothing stores',
        'hero.badge': 'Best Kindergartens for Your Child',
        'hero.searchPlaceholder': 'Search by name...',
        'hero.searchButton': 'Search',
        'hero.municipalitiesLabel': 'Main Municipalities:',
        'hero.otherServices': 'Other Services:',

        // CTA
        'cta.ownerTitle': 'Are you a kindergarten owner?',
        'cta.ownerDesc': 'Join Rawdati platform and reach thousands of parents looking for the best options',
        'cta.register': 'Register your kindergarten now',

        // Language Selector
        'language.select': 'Select Language',
        'language.ar': 'العربية',
        'language.fr': 'Français',
        'language.en': 'English',

        // Footer
        'footer.rights': 'All rights reserved',
        'footer.description': 'Digital platform to help parents find the best services for their children in Mascara',

        // Kindergartens Page
        'kindergartens.pageTitle': 'Kindergartens in Mascara',
        'kindergartens.pageSubtitle': 'Choose from the best kindergartens in Mascara, with info on prices, services, and reviews',
        'kindergartens.searchPlaceholder': 'Search kindergarten...',
        'kindergartens.count': 'Showing {count} kindergarten(s)',
        'kindergartens.noResults': 'No results found',
        'kindergartens.noResultsDesc': 'Try changing your search criteria',
        'kindergartens.clearFilters': 'Clear all filters',

        // Filters
        'filter.title': 'Filter Results',
        'filter.municipality': 'Municipality',
        'filter.allMunicipalities': 'All Municipalities',
        'filter.priceRange': 'Price Range (DA)',
        'filter.services': 'Available Services',
        'filter.transport': 'School Transport',
        'filter.meals': 'Meals',
        'filter.summerCamp': 'Summer Camp',
        'filter.extracurricular': 'Extracurricular Activities',
        'filter.medical': 'Medical Follow-up',

        // Cards & Modals
        'card.viewDetails': 'View Details',
        'card.register': 'Book a Seat',
        'modal.details': 'Kindergarten Details',
        'modal.registration': 'Seat Booking Request',
        'modal.close': 'Close',
        'modal.send': 'Send Request',

        // Kindergarten Details
        'details.about': 'About Kindergarten',
        'details.hours': 'Working Hours',
        'details.age': 'Age Range',
        'details.reviews': 'Parents Reviews',
        'details.addReview': 'Add Your Review',
        'details.nameLabel': 'Your Name',
        'details.namePlaceholder': 'Enter your name',
        'details.ratingLabel': 'Rating',
        'details.commentLabel': 'Your Comment (optional)',
        'details.commentPlaceholder': 'Share your opinion about this kindergarten...',
        'details.noReviews': 'No reviews yet. Be the first to review this kindergarten!',
        'details.submit': 'Send Review',
        'details.submitting': 'Sending...',
        'details.loadingReviews': 'Loading reviews...',
        'details.map': 'Location on Map',
        'details.successReview': 'Your review was submitted successfully',
        'details.errorReview': 'An error occurred while submitting the review',
        'details.errorName': 'Please enter your name',

        // Registration Modal
        'registration.parentName': 'Parent Name',
        'registration.childName': 'Child Name',
        'registration.childAge': 'Age',
        'registration.message': 'Additional Message (optional)',
        'registration.messagePlaceholder': 'Any additional information...',
        'registration.loginRequired': 'Login Required',
        'registration.loginRequiredDesc': 'You must be logged in to register your child',
        'booking.title': 'Book a Visit',
        'booking.success': 'Booking Confirmed',
        'booking.successDesc': 'We will contact you to confirm the appointment',
        'registration.successTitle': 'Registration successful!',
        'registration.successDesc': 'Your child\'s registration at {name} has been successfully confirmed. We will contact you soon.',
        'registration.errorAuth': 'Please log in to send your request',
        'registration.errorSubmit': 'We couldn\'t send your request. Please try again.',
        'registration.hasDisease': 'Does your child suffer from any disease?',
        'registration.diseaseDetails': 'Medical condition or disease details',
        'registration.hasAllergy': 'Does your child have any food allergies?',
        'registration.allergyDetails': 'Food allergy details',
        'auth.success': 'Login successful',

        // Owner Dashboard New Features
        'owner.stats': 'Statistics',
        'owner.attendance': 'Attendance',
        'owner.finance': 'Finance',
        'owner.medicalStats': 'Medical Stats',
        'owner.attendanceRate': 'Attendance Rate',
        'owner.paid': 'Paid',
        'owner.debt': 'Debt',
        'owner.totalDebt': 'Total Debt',
        'owner.staff': 'Staff/Teachers',
        'owner.children': 'Children',
        'owner.presence': 'Attendance Log',
        'owner.medicalAlert': 'Special Care Needed',
        'owner.foodAllergy': 'Food Allergy',
        'owner.chronicDisease': 'Chronic Disease',
        'owner.paymentStatus': 'Payment Status',
        'owner.markPresence': 'Mark Present',
        'owner.markAbsence': 'Mark Absent',

        // Doctors Page
        'doctors.pageTitle': 'Pediatricians in Mascara',
        'doctors.pageSubtitle': 'A comprehensive list of the best pediatricians in Mascara province',
        'doctors.find': 'Find a Trusted Pediatrician',
        'doctors.searchPlaceholder': 'Search by name or specialty...',
        'doctors.experience': '{years} years experience',
        'doctors.callNow': 'Call Now',
        'doctors.all': 'All',

        // Feature & Partners
        'filter.autism': 'Autism Wing',
        'details.autism': 'Special Autism Wing Available',
        'details.partners': 'Partners',
        'details.partnerDoctor': 'Contracted Doctors',
        'details.partnerStore': 'Partner Stores',

        // Speech Therapy Page
        'speech.pageTitle': 'Speech Therapists in Mascara',
        'speech.pageSubtitle': 'A comprehensive list of the best speech therapists in Mascara',
        'speech.find': 'Find an Expert Speech Therapist',
        'speech.searchPlaceholder': 'Search by name or specialty...',

        // Clothing Stores Page
        'clothing.pageTitle': 'Children\'s Clothing Stores in Mascara',
        'clothing.pageSubtitle': 'Discover the best children\'s clothing stores in Mascara',
        'clothing.find': 'Discover the best clothing stores',
        'clothing.searchPlaceholder': 'Search by store name or city...',
        'clothing.priceRange': 'Price Range',

        // About Page
        'about.title': 'About Us',
        'about.heroTitle': 'We Are Here for Your Children',
        'about.heroSubtitle': 'A digital platform bringing kindergartens to one place',
        'about.desc1': 'We are a digital platform created to facilitate parents in the most important decision for their children: choosing the right kindergarten.',
        'about.desc2': 'We bring kindergartens into one reliable space, providing clear information to help parents choose with peace of mind.',
        'about.desc3': 'Our idea came from a lived reality and a sense of responsibility towards childhood, because every child deserves a safe start and a good educational environment.',
        'about.desc4': 'Our goal is to build a bridge of trust between parents and kindergartens, facilitating communication in a simple, transparent, and scalable way.',
        'about.quote': 'We believe that taking care of children today is an investment in a better future tomorrow.',
        'about.values': 'Our Values',
        'about.value1.title': 'Trust and Security',
        'about.value1.desc': 'We focus on providing reliable and accurate information to help parents make the right decision.',
        'about.value2.title': 'Childhood Care',
        'about.value2.desc': 'We believe every child deserves the best possible start in their educational journey.',
        'about.value3.title': 'Transparent Communication',
        'about.value3.desc': 'We strive to build clear communication channels between parents and kindergartens.',
        'about.value4.title': 'Continuous Development',
        'about.value4.desc': 'We are constantly working to improve our services to meet the needs of parents and kindergartens.',

        // Common
        'common.error': 'Error',
        'common.updated': 'Updated',
        'common.notSpecified': 'Not specified',
        'common.save': 'Save',
        'common.cancel': 'Cancel',
        'common.delete': 'Delete',
        'common.edit': 'Edit',

        // Auth
        'auth.login': 'Login',
        'auth.signup': 'Sign Up',
        'auth.welcome': 'Welcome',
        'auth.subtitle': 'Login to access your account',
        'auth.email': 'Email',
        'auth.password': 'Password',
        'auth.fullName': 'Full Name',
        'auth.phone': 'Phone Number',
        'auth.loading': 'Loading...',
        'auth.backHome': 'Back to Home',
        'auth.confirmEmail': 'Confirm Email',
        'auth.confirmDesc': 'A confirmation link has been sent to',
        'auth.openEmail': 'Open your email and click the confirmation link',
        'auth.resend': 'Resend Link',
        'auth.backLogin': 'Back to Login',
        'auth.verified': 'Confirmed successfully!',
        'auth.passwordMin': 'Must be at least 6 characters',
        'auth.error.nameRequired': 'Full name is required',
        'auth.error.phoneRequired': 'Phone number is required',
        'auth.error.phoneInvalid': 'Phone number must be 10 digits',
        'auth.error.emailInvalid': 'Please enter a valid email',
        'auth.error.passwordRequired': 'Password is required',
        'auth.error.signup': 'An error occurred during sign up',
        'auth.forgotPassword': 'Forgot password?',
        'auth.resetPassword': 'Reset Password',
        'auth.resetPasswordDesc': 'Enter your email to receive a reset link',
        'auth.sendResetLink': 'Send Link',
        'auth.resetEmailSent': 'A reset link has been sent to your email address',
        'auth.otpSent': 'A verification link has been sent to your email',
        'auth.verifyOtp': 'Verify Link',
        'auth.otpPlaceholder': 'Please check your email and click the link sent',
        'auth.newPassword': 'New Password',
        'auth.confirmNewPassword': 'Confirm New Password',
        'auth.passwordResetSuccess': 'Password changed successfully!',
        'auth.invalidOtp': 'Verification link is invalid or expired',
        'auth.setNewPassword': 'Set New Password',
        'auth.kindergartenName': 'Kindergarten Name',
        'auth.ownerSignupSubtitle': 'Register your details to create an owner account',

        // Admin Dashboard
        'admin.title': 'Admin Dashboard',
        'admin.subtitle': 'Rawdati - Mascara',
        'admin.totalUsers': 'Total Users',
        'admin.pending': 'Pending',
        'admin.approved': 'Approved',
        'admin.rejected': 'Rejected',
        'admin.manageUsers': 'Manage Users',
        'admin.name': 'Name',
        'admin.phone': 'Phone',
        'admin.role': 'Role',
        'admin.status': 'Status',
        'admin.date': 'Registration Date',
        'admin.actions': 'Actions',
        'admin.logout': 'Logout',
        'admin.home': 'Home',
        'admin.noUsers': 'No users found',
        'admin.role.admin': 'Admin',
        'admin.role.owner': 'Owner',
        'admin.role.parent': 'Parent',
        'admin.status.approved': 'Approved',
        'admin.status.rejected': 'Rejected',
        'admin.status.pending': 'Pending',

        // Admin Auth
        'admin.auth.title': 'Admin Login',
        'admin.auth.desc': 'Enter your credentials to access the dashboard',

        // Parent Dashboard
        'parent.title': 'Parent Dashboard',
        'parent.welcome': 'Welcome',
        'parent.myChildren': 'My Children',
        'parent.noChildren': 'No children registered',
        'parent.noChildrenDesc': 'Your children will be added when registered in a kindergarten',
        'parent.latestActivities': 'Latest Activities',
        'parent.noActivities': 'No activities yet',
        'parent.quickActions': 'Quick Actions',
        'parent.notifications': 'Notifications',
        'parent.photos': 'Photos',
        'parent.schedule': 'Schedule',
        'parent.settings': 'Settings',
        'parent.age': 'years',
        'parent.activity.learning': 'Learning',
        'parent.activity.play': 'Play',
        'parent.activity.meal': 'Meal',
        'parent.activity.nap': 'Nap',
        'parent.activity.other': 'Activity',

        'auth.error.invalidLogin': 'Invalid email or password',
        'auth.error.notConfirmed': 'Please confirm your email first',
        'auth.error.alreadyRegistered': 'Email already registered',
        'auth.error.resendFailed': 'Failed to resend confirmation link',
        'auth.error.notAdmin': 'You do not have admin privileges',

        // Chatbot
        'chatbot.welcome': 'Hello, I am the AI assistant of "Rawdati". How can I help you?',
        'chatbot.placeholder': 'Type your question here...',
        'chatbot.send': 'Send',
        'chatbot.title': 'AI Assistant',
        'chatbot.typing': 'Typing...',
        'chatbot.error': 'Sorry, something went wrong. Try again.',
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('selectedLanguage') as Language;
        return saved || 'ar';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('selectedLanguage', lang);
        // Update document direction
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    };

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    const dir = language === 'ar' ? 'rtl' : 'ltr';

    useEffect(() => {
        document.documentElement.dir = dir;
        document.documentElement.lang = language;
    }, [language, dir]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
