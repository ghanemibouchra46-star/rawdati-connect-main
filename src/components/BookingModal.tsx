
import { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, User, Phone, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Kindergarten } from '@/data/kindergartens';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { arDZ, fr } from 'date-fns/locale';

interface BookingModalProps {
    kindergarten: Kindergarten | null;
    isOpen: boolean;
    onClose: () => void;
}

const timeSlots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00'
];

const BookingModal = ({ kindergarten, isOpen, onClose }: BookingModalProps) => {
    const { t, language, dir } = useLanguage();
    const { toast } = useToast();
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [parentName, setParentName] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Check for user session to pre-fill info
            const checkUser = async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    // Ideally fetch profile here, but for now we wait for user input or use metadata if available
                }
            };
            checkUser();
        }
    }, [isOpen]);

    if (!isOpen || !kindergarten) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !selectedTime || !parentName || !phone) {
            toast({
                title: t('common.error'),
                description: t('details.fillAllFields') || 'Please fill all fields',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: t('common.error'),
                    description: t('registration.loginRequired'),
                    variant: 'destructive',
                });
                setIsSubmitting(false);
                return;
            }

            const { error } = await (supabase.from('bookings') as any).insert({
                kindergarten_id: kindergarten.id,
                user_id: user.id,
                parent_name: parentName,
                phone: phone,
                booking_date: format(date, 'yyyy-MM-dd'),
                booking_time: selectedTime,
            });

            if (error) throw error;

            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setDate(undefined);
                setSelectedTime('');
                setParentName('');
                setPhone('');
            }, 2000);

        } catch (error) {
            console.error('Booking error:', error);
            toast({
                title: t('common.error'),
                description: 'Failed to book visit. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-card rounded-3xl shadow-card max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in" dir={dir}>
                <div className="sticky top-0 bg-card/95 backdrop-blur z-10 p-4 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold">{t('booking.title') || (language === 'ar' ? 'حجز موعد زيارة' : 'Book a Visit')}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {isSuccess ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{t('booking.success') || (language === 'ar' ? 'تم الحجز بنجاح' : 'Booking Confirmed')}</h3>
                        <p className="text-muted-foreground">{t('booking.successDesc') || (language === 'ar' ? 'سنتصل بك لتأكيد الموعد' : 'We will contact you to confirm.')}</p>
                    </div>
                ) : (
                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <User className="w-4 h-4 text-primary" />
                                {t('registration.parentName')}
                            </label>
                            <Input
                                value={parentName}
                                onChange={(e) => setParentName(e.target.value)}
                                placeholder={t('auth.fullName')}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary" />
                                {t('auth.phone')}
                            </label>
                            <Input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="0555..."
                                dir="ltr"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-primary" />
                                {t('booking.selectDate') || (language === 'ar' ? 'اختر تاريخاً' : 'Select Date')}
                            </label>
                            <div className="border rounded-xl p-2 flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                    initialFocus
                                    locale={language === 'ar' ? arDZ : fr}
                                    className="p-3"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                {t('booking.selectTime') || (language === 'ar' ? 'اختر توقيتاً' : 'Select Time')}
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {timeSlots.map((time) => (
                                    <Button
                                        key={time}
                                        variant={selectedTime === time ? "default" : "outline"}
                                        onClick={() => setSelectedTime(time)}
                                        className="w-full text-sm"
                                    >
                                        {time}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !date || !selectedTime}
                            className="w-full h-12 gradient-accent font-bold text-lg"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                t('booking.confirm') || (language === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking')
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingModal;
