import { useState } from 'react';
import { X, Calendar, Clock, User, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Kindergarten } from '@/data/kindergartens';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface BookingModalProps {
  kindergarten: Kindergarten | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal = ({ kindergarten, isOpen, onClose }: BookingModalProps) => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: '1',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kindergarten) return;

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error(language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first');
        return;
      }

      // Create booking record
      const { error } = await supabase
        .from('bookings')
        .insert({
          kindergarten_id: kindergarten.id,
          parent_id: session.user.id,
          booking_date: formData.date,
          booking_time: formData.time,
          duration: parseInt(formData.duration),
          notes: formData.notes,
          status: 'pending'
        });

      if (error) throw error;

      toast.success(language === 'ar' ? 'تم الحجز بنجاح' : 'Booking successful');
      onClose();
      setFormData({
        date: '',
        time: '',
        duration: '1',
        notes: ''
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(language === 'ar' ? 'حدث خطأ في الحجز' : 'Booking failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !kindergarten) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {language === 'ar' ? 'حجز زيارة' : 'Book Visit'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">
              {language === 'ar' ? kindergarten.nameAr : kindergarten.nameFr}
            </h3>
            <p className="text-sm text-green-600">
              {language === 'ar' ? kindergarten.addressAr : kindergarten.addressFr}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'تاريخ الزيارة' : 'Visit Date'}
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'وقت الزيارة' : 'Visit Time'}
              </label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'مدة الزيارة (ساعات)' : 'Visit Duration (hours)'}
              </label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="1">1 ساعة</option>
                <option value="2">2 ساعات</option>
                <option value="3">3 ساعات</option>
                <option value="4">4 ساعات</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'ملاحظات' : 'Notes'}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder={language === 'ar' ? 'أي ملاحظات إضافية...' : 'Any additional notes...'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                rows={3}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                {language === 'ar' ? 'معلومات مهمة:' : 'Important Information:'}
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• {language === 'ar' ? 'الزيارة مجانية' : 'Visit is free'}</li>
                <li>• {language === 'ar' ? 'يجب تأكيد الحجز من الروضة' : 'Booking must be confirmed by kindergarten'}</li>
                <li>• {language === 'ar' ? 'يمكن إلغاء الحجز قبل 24 ساعة' : 'Booking can be cancelled 24 hours in advance'}</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {language === 'ar' ? 'جاري الحجز...' : 'Booking...'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {language === 'ar' ? 'حجز الزيارة' : 'Book Visit'}
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;