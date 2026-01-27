import { useEffect, useRef, useState } from 'react';
import {
  X, Star, MapPin, Clock, Users, Phone, ChevronLeft, ChevronRight,
  Bus, Utensils, Calculator, Globe, BookOpen, Dumbbell, MessageSquare, Send, Coins, Layout, Puzzle, Stethoscope, ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Kindergarten } from '@/data/kindergartens';
import { supabase } from '@/integrations/supabase/client';
import ReviewCard from '@/components/ReviewCard';
import ActivityCard from '@/components/ActivityCard';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface KindergartenDetailModalProps {
  kindergarten: Kindergarten | null;
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
  onBook: () => void;
}

interface Review {
  id: string;
  parent_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

const serviceIcons: Record<string, React.ReactNode> = {
  bus: <Bus className="w-4 h-4" />,
  meals: <Utensils className="w-4 h-4" />,
  'mental-math': <Calculator className="w-4 h-4" />,
  languages: <Globe className="w-4 h-4" />,
  quran: <BookOpen className="w-4 h-4" />,
  sports: <Dumbbell className="w-4 h-4" />,
};

const KindergartenDetailModal = ({ kindergarten, isOpen, onClose, onRegister, onBook }: KindergartenDetailModalProps) => {
  const { t, language, dir } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const serviceNames: Record<string, string> = {
    bus: t('filter.transport'),
    meals: t('filter.meals'),
    'mental-math': t('filter.extracurricular'),
    languages: t('language.select'),
    quran: t('filter.quran') || 'Quran',
    sports: t('filter.sports') || 'Sports',
  };

  useEffect(() => {
    const fetchReviews = async () => {
      if (!kindergarten || !isOpen) return;

      setLoadingReviews(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('kindergarten_id', kindergarten.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setReviews(data);
      }
      setLoadingReviews(false);
    };

    fetchReviews();
  }, [kindergarten, isOpen]);

  useEffect(() => {
    if (isOpen && kindergarten && mapRef.current && !mapInstanceRef.current) {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      mapInstanceRef.current = L.map(mapRef.current).setView(
        [kindergarten.coordinates.lat, kindergarten.coordinates.lng],
        15
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapInstanceRef.current);

      L.marker([kindergarten.coordinates.lat, kindergarten.coordinates.lng])
        .addTo(mapInstanceRef.current)
        .bindPopup(language === 'ar' ? kindergarten.nameAr : kindergarten.nameFr)
        .openPopup();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, kindergarten, language]);

  const handleSubmitReview = async () => {
    if (!kindergarten || !reviewForm.name.trim()) {
      toast.error(t('details.errorName'));
      return;
    }

    setSubmittingReview(true);

    const { error } = await supabase
      .from('reviews')
      .insert({
        kindergarten_id: kindergarten.id,
        parent_name: reviewForm.name,
        rating: reviewForm.rating,
        comment: reviewForm.comment || null,
      });

    if (error) {
      toast.error(t('details.errorReview'));
    } else {
      toast.success(t('details.successReview'));
      setReviewForm({ name: '', rating: 5, comment: '' });
      setShowReviewForm(false);
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('kindergarten_id', kindergarten.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setReviews(data);
    }

    setSubmittingReview(false);
  };

  if (!isOpen || !kindergarten) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % kindergarten.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + kindergarten.images.length) % kindergarten.images.length);
  };

  const name = language === 'ar' ? kindergarten.nameAr : kindergarten.nameFr;
  const description = language === 'ar' ? kindergarten.descriptionAr : kindergarten.descriptionFr;
  const municipality = language === 'ar' ? kindergarten.municipalityAr : kindergarten.municipalityFr;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-card rounded-3xl shadow-card max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" dir={dir}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} z-20 p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors shadow-soft`}
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        {/* Image Gallery */}
        <div className="relative h-72 md:h-96 overflow-hidden rounded-t-3xl">
          <img
            src={kindergarten.images[currentImageIndex]}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

          {/* Gallery Navigation */}
          {kindergarten.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors`}
              >
                {dir === 'rtl' ? <ChevronRight className="w-5 h-5 text-foreground" /> : <ChevronLeft className="w-5 h-5 text-foreground" />}
              </button>
              <button
                onClick={nextImage}
                className={`absolute ${dir === 'rtl' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors`}
              >
                {dir === 'rtl' ? <ChevronLeft className="w-5 h-5 text-foreground" /> : <ChevronRight className="w-5 h-5 text-foreground" />}
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {kindergarten.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-primary-foreground w-6' : 'bg-primary-foreground/50'
                      }`}
                  />
                ))}
              </div>
            </>
          )}

          <div className={`absolute bottom-4 ${dir === 'rtl' ? 'right-4' : 'left-4'}`}>
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground drop-shadow-lg">
              {name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Quick Info */}
          <div className={`flex flex-wrap gap-4 mb-6 ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl">
              <Star className="w-5 h-5 text-accent fill-accent" />
              <span className="font-bold text-foreground">{kindergarten.rating}</span>
              <span className="text-muted-foreground">({kindergarten.reviewCount} {language === 'ar' ? 'تقييم' : 'avis'})</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl">
              <MapPin className="w-5 h-5 text-coral" />
              <span className="text-foreground">{municipality}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl">
              <span className="font-bold text-primary">{kindergarten.pricePerMonth.toLocaleString()} {t('mascara') === 'معسكر' ? 'دج' : 'DA'}</span>
              <span className="text-muted-foreground">/{language === 'ar' ? 'شهر' : 'mois'}</span>
            </div>
            {kindergarten.hasAutismWing && (
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl border border-purple-200">
                <Puzzle className="w-5 h-5" />
                <span className="font-bold text-sm">{t('details.autism')}</span>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="mb-6 bg-muted/50 rounded-xl p-4 border border-border/50">
            <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              {language === 'ar' ? 'تفصيلات السعر' : 'Détails des tarifs'}
            </h3>
            <div className="space-y-2">
              {kindergarten.priceBreakdown.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-card rounded-lg border border-border/30">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {language === 'ar' ? item.nameAr : item.nameFr}
                      {item.optional && <span className="text-xs text-muted-foreground mx-1">({language === 'ar' ? 'اختياري' : 'Optionnel'})</span>}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.type === 'annual' ? (language === 'ar' ? 'سنوي' : 'Annuel') : (language === 'ar' ? 'شهري' : 'Mensuel')}
                    </span>
                  </div>
                  <span className="font-bold text-primary">
                    {item.price.toLocaleString()} {t('mascara') === 'معسكر' ? 'دج' : 'DA'}
                  </span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-border flex justify-between items-center bg-primary/5 p-3 rounded-lg">
                <span className="font-bold">{language === 'ar' ? 'المجموع الشهري التقديري' : 'Total mensuel estimé'}</span>
                <span className="font-bold text-lg text-primary">
                  {kindergarten.pricePerMonth.toLocaleString()} {t('mascara') === 'معسكر' ? 'دج' : 'DA'}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className={`text-lg font-bold text-foreground mb-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('details.about')}</h3>
            <p className={`text-muted-foreground leading-relaxed ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-muted rounded-xl p-4 text-center">
              <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{t('details.hours')}</p>
              <p className="font-semibold text-foreground">{kindergarten.workingHours.open} - {kindergarten.workingHours.close}</p>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center">
              <Users className="w-6 h-6 text-secondary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{t('details.age')}</p>
              <p className="font-semibold text-foreground">{kindergarten.ageRange.min} - {kindergarten.ageRange.max} {t('parent.age')}</p>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center">
              <Phone className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{t('auth.phone')}</p>
              <p className="font-semibold text-foreground" dir="ltr">{kindergarten.phone}</p>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center">
              <MapPin className="w-6 h-6 text-coral mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{t('filter.municipality')}</p>
              <p className="font-semibold text-foreground text-sm">{municipality}</p>
            </div>
          </div>

          {/* Services */}
          <div className="mb-6">
            <h3 className={`text-lg font-bold text-foreground mb-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('filter.services')}</h3>
            <div className={`flex flex-wrap gap-2 ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}>
              {kindergarten.services.map((service) => (
                <Badge
                  key={service}
                  variant="secondary"
                  className="gap-2 px-4 py-2 text-sm bg-sky-light text-foreground rounded-xl"
                >
                  {serviceIcons[service]}
                  {serviceNames[service] || service}
                </Badge>
              ))}
            </div>
          </div>

          {/* Activities */}
          {kindergarten.activities && kindergarten.activities.length > 0 && (
            <div className="mb-6">
              <h3 className={`text-lg font-bold text-foreground mb-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{language === 'ar' ? 'الأنشطة والبرامج' : 'Activités et Programmes'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {kindergarten.activities.slice(0, 6).map((activity) => (
                  <ActivityCard key={activity.id} activity={{
                    ...activity,
                    nameAr: language === 'ar' ? activity.nameAr : activity.nameFr
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Facilities */}
          {kindergarten.facilities && kindergarten.facilities.length > 0 && (
            <div className="mb-6">
              <h3 className={`text-lg font-bold text-foreground mb-3 ${dir === 'rtl' ? 'text-right' : 'text-left'} flex items-center gap-2`}>
                <Layout className="w-5 h-5 text-purple-500" />
                {language === 'ar' ? 'مرافق الروضة (من الداخل)' : 'Installations (Intérieur)'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {kindergarten.facilities.map((facility, index) => (
                  <div key={index} className="group relative aspect-video rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <img
                      src={facility.image}
                      alt={language === 'ar' ? facility.nameAr : facility.nameFr}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                      <span className="text-white font-bold text-sm">
                        {language === 'ar' ? facility.nameAr : facility.nameFr}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}



          {/* Partners Section */}
          {(kindergarten.partners?.doctors?.length > 0 || kindergarten.partners?.stores?.length > 0) && (
            <div className="mb-6 bg-blue-50/50 rounded-xl p-4 border border-blue-100">
              <h3 className={`text-lg font-bold text-foreground mb-3 ${dir === 'rtl' ? 'text-right' : 'text-left'} flex items-center gap-2`}>
                <Users className="w-5 h-5 text-blue-500" />
                {t('details.partners')}
              </h3>
              <div className="space-y-4">
                {kindergarten.partners?.doctors?.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 font-semibold text-blue-700 mb-2">
                      <Stethoscope className="w-4 h-4" /> {t('details.partnerDoctor')}
                    </h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {kindergarten.partners.doctors.map((doc, i) => (
                        <li key={i}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {kindergarten.partners?.stores?.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 font-semibold text-pink-700 mb-2">
                      <ShoppingBag className="w-4 h-4" /> {t('details.partnerStore')}
                    </h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                      {kindergarten.partners.stores.map((store, i) => (
                        <li key={i}>{store}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="mb-6">
            <div className={`flex items-center justify-between mb-3 ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {t('details.reviews')}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="gap-2"
              >
                <Star className="w-4 h-4" />
                {t('details.addReview')}
              </Button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="bg-muted/50 rounded-xl p-4 mb-4 border border-border/30">
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium text-foreground mb-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('details.nameLabel')}</label>
                    <Input
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      placeholder={t('details.namePlaceholder')}
                      className={`bg-card ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium text-foreground mb-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('details.ratingLabel')}</label>
                    <div className={`flex gap-1 ${dir === 'rtl' ? 'flex-row' : 'flex-row-reverse'}`}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="p-1"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${star <= reviewForm.rating
                              ? 'text-accent fill-accent'
                              : 'text-muted-foreground/30'
                              }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium text-foreground mb-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('details.commentLabel')}</label>
                    <Textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder={t('details.commentPlaceholder')}
                      className={`bg-card ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleSubmitReview}
                    disabled={submittingReview}
                    className="w-full gap-2 font-bold"
                  >
                    <Send className="w-4 h-4" />
                    {submittingReview ? t('details.submitting') : t('details.submit')}
                  </Button>
                </div>
              </div>
            )}

            {/* Reviews List */}
            {loadingReviews ? (
              <div className="text-center py-4 text-muted-foreground">{t('details.loadingReviews')}</div>
            ) : reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground bg-muted/30 rounded-xl">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>{t('details.noReviews')}</p>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="mb-6">
            <h3 className={`text-lg font-bold text-foreground mb-3 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('details.map')}</h3>
            <div ref={mapRef} className="h-64 rounded-2xl overflow-hidden border border-border" />
          </div>

          {/* CTA */}
          <div className="flex gap-4">
            <Button
              onClick={onBook}
              variant="outline"
              className="flex-1 h-14 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold text-lg rounded-xl transition-all"
            >
              {language === 'ar' ? 'حجز موعد زيارة' : 'Réserver une visite'}
            </Button>
            <Button
              onClick={onRegister}
              className="flex-1 h-14 gradient-accent border-0 rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 text-primary-foreground font-bold text-lg"
            >
              {t('card.register')}
            </Button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default KindergartenDetailModal;
