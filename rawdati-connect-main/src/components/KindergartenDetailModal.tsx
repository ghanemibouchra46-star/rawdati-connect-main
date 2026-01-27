import { useEffect, useRef, useState } from 'react';
import { 
  X, Star, MapPin, Clock, Users, Phone, ChevronLeft, ChevronRight,
  Bus, Utensils, Calculator, Globe, BookOpen, Dumbbell, MessageSquare, Send
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

interface KindergartenDetailModalProps {
  kindergarten: Kindergarten | null;
  isOpen: boolean;
  onClose: () => void;
  onRegister: () => void;
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

const serviceNames: Record<string, string> = {
  bus: 'نقل مدرسي',
  meals: 'وجبات غذائية',
  'mental-math': 'حساب ذهني',
  languages: 'لغات أجنبية',
  quran: 'تحفيظ القرآن',
  sports: 'أنشطة رياضية',
};

const KindergartenDetailModal = ({ kindergarten, isOpen, onClose, onRegister }: KindergartenDetailModalProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch reviews
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
        .bindPopup(kindergarten.nameAr)
        .openPopup();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen, kindergarten]);

  const handleSubmitReview = async () => {
    if (!kindergarten || !reviewForm.name.trim()) {
      toast.error('الرجاء إدخال اسمك');
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
      toast.error('حدث خطأ أثناء إرسال التقييم');
    } else {
      toast.success('تم إرسال تقييمك بنجاح');
      setReviewForm({ name: '', rating: 5, comment: '' });
      setShowReviewForm(false);
      // Refresh reviews
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card rounded-3xl shadow-card max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors shadow-soft"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        {/* Image Gallery */}
        <div className="relative h-72 md:h-96 overflow-hidden rounded-t-3xl">
          <img
            src={kindergarten.images[currentImageIndex]}
            alt={kindergarten.nameAr}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

          {/* Gallery Navigation */}
          {kindergarten.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={nextImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-card/80 backdrop-blur-sm rounded-full hover:bg-card transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {kindergarten.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-primary-foreground w-6' : 'bg-primary-foreground/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Name Overlay */}
          <div className="absolute bottom-4 right-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground drop-shadow-lg">
              {kindergarten.nameAr}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Quick Info */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl">
              <Star className="w-5 h-5 text-accent fill-accent" />
              <span className="font-bold text-foreground">{kindergarten.rating}</span>
              <span className="text-muted-foreground">({kindergarten.reviewCount} تقييم)</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-xl">
              <MapPin className="w-5 h-5 text-coral" />
              <span className="text-foreground">{kindergarten.municipalityAr}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl">
              <span className="font-bold text-primary">{kindergarten.pricePerMonth.toLocaleString()} دج</span>
              <span className="text-muted-foreground">/شهر</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground mb-2">عن الروضة</h3>
            <p className="text-muted-foreground leading-relaxed">{kindergarten.descriptionAr}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-muted rounded-xl p-4 text-center">
              <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">ساعات العمل</p>
              <p className="font-semibold text-foreground">{kindergarten.workingHours.open} - {kindergarten.workingHours.close}</p>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center">
              <Users className="w-6 h-6 text-secondary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">الفئة العمرية</p>
              <p className="font-semibold text-foreground">{kindergarten.ageRange.min} - {kindergarten.ageRange.max} سنوات</p>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center">
              <Phone className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">الهاتف</p>
              <p className="font-semibold text-foreground" dir="ltr">{kindergarten.phone}</p>
            </div>
            <div className="bg-muted rounded-xl p-4 text-center">
              <MapPin className="w-6 h-6 text-coral mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">العنوان</p>
              <p className="font-semibold text-foreground text-sm">{kindergarten.municipalityAr}</p>
            </div>
          </div>

          {/* Services */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground mb-3">الخدمات المتوفرة</h3>
            <div className="flex flex-wrap gap-2">
              {kindergarten.services.map((service) => (
                <Badge
                  key={service}
                  variant="secondary"
                  className="gap-2 px-4 py-2 text-sm bg-sky-light text-foreground rounded-xl"
                >
                  {serviceIcons[service]}
                  {serviceNames[service]}
                </Badge>
              ))}
            </div>
          </div>

          {/* Activities */}
          {kindergarten.activities && kindergarten.activities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground mb-3">الأنشطة والبرامج</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {kindergarten.activities.slice(0, 6).map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                تقييمات الأولياء
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="gap-2"
              >
                <Star className="w-4 h-4" />
                أضف تقييمك
              </Button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="bg-muted/50 rounded-xl p-4 mb-4 border border-border/30">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">اسمك</label>
                    <Input
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      placeholder="أدخل اسمك"
                      className="bg-card"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">التقييم</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="p-1"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              star <= reviewForm.rating
                                ? 'text-accent fill-accent'
                                : 'text-muted-foreground/30'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">تعليقك (اختياري)</label>
                    <Textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="شاركنا رأيك عن هذه الروضة..."
                      className="bg-card"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleSubmitReview}
                    disabled={submittingReview}
                    className="w-full gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {submittingReview ? 'جاري الإرسال...' : 'إرسال التقييم'}
                  </Button>
                </div>
              </div>
            )}

            {/* Reviews List */}
            {loadingReviews ? (
              <div className="text-center py-4 text-muted-foreground">جاري تحميل التقييمات...</div>
            ) : reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground bg-muted/30 rounded-xl">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>لا توجد تقييمات بعد. كن أول من يقيّم هذه الروضة!</p>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-foreground mb-3">الموقع على الخريطة</h3>
            <div ref={mapRef} className="h-64 rounded-2xl overflow-hidden border border-border" />
          </div>

          {/* CTA */}
          <Button
            onClick={onRegister}
            className="w-full h-14 gradient-accent border-0 rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 text-primary-foreground font-semibold text-lg"
          >
            سجل طفلك الآن
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KindergartenDetailModal;
