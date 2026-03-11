import { useState } from 'react';
import { X, Calendar, Clock, User, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Kindergarten } from '@/data/kindergartens';
import { format } from 'date-fns';
import { arDZ, fr } from 'date-fns/locale';

interface BookingModalProps {
  kindergarten: Kindergarten | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ kindergarten, isOpen, onClose }: BookingModalProps) => {
  const { t, language, dir } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  if (!isOpen || !kindergarten) return null;

  const timeSlots = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"
  ];

  const handleSubmit = async () => {
    if (!date || !selectedTime) {
      toast.error(language === 'ar' ? 'يرجى اختيار التاريخ والوقت' : 'Veuillez choisir la date et l\'heure');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user?.id || null,
          title: language === 'ar' ? 'طلب حجز موعد' : 'Demande de rendez-vous',
          message: language === 'ar' 
            ? `طلب حجز موعد لزيارة روضة ${kindergarten.name_ar} يوم ${date} على الساعة ${selectedTime}`
            : `Demande de rendez-vous pour visiter ${kindergarten.nameFr} le ${date} à ${selectedTime}`,
          type: 'booking',
          related_id: kindergarten.id
        });

      if (error) throw error;

      toast.success(t('booking.success'), {
        description: t('booking.successDesc')
      });
      
      onClose();
      setDate('');
      setSelectedTime('');
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const name = language === 'ar' ? kindergarten.name_ar : kindergarten.nameFr;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />
      
      <div className="relative bg-card rounded-3xl shadow-card max-w-md w-full p-6 md:p-8 animate-scale-in" dir={dir}>
        <button
          onClick={onClose}
          className={`absolute top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} p-2 hover:bg-muted rounded-full transition-colors`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('booking.title')}
          </h2>
          <p className="text-muted-foreground mt-1">
            {language === 'ar' ? `حجز زيارة لـ ${name}` : `Réserver une visite pour ${name}`}
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className={`text-sm font-medium text-foreground ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              {language === 'ar' ? 'اختر التاريخ' : 'Choisir la date'}
            </label>
            <Input
              type="date"
              min={format(new Date(), 'yyyy-MM-dd')}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 bg-muted/50 border-border rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-medium text-foreground ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              {language === 'ar' ? 'اختر التوقيت' : 'Choisir l\'heure'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`py-3 rounded-xl border-2 transition-all font-medium ${
                    selectedTime === time
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-transparent bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !date || !selectedTime}
            className="w-full h-14 gradient-accent border-0 rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 text-primary-foreground font-bold text-lg"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              t('booking.confirm') || (language === 'ar' ? 'تأكيد الحجز' : 'Confirmer')
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;