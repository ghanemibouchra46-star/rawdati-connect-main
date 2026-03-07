import { useState } from 'react';
import { X, Calendar, Clock, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  kindergartenId: string;
  kindergartenName: string;
  onSuccess?: () => void;
}

const BookingModal = ({
  isOpen,
  onClose,
  kindergartenId,
  kindergartenName,
  onSuccess
}: BookingModalProps) => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    visitDate: '',
    visitTime: '',
    visitorName: '',
    phone: '',
    email: '',
    purpose: '',
    numberOfVisitors: '1'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast.error(language === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first');
        return;
      }

      // Create visit booking
      const { error } = await supabase
        .from('visit_bookings')
        .insert({
          user_id: session.user.id,
          kindergarten_id: kindergartenId,
          visit_date: formData.visitDate,
          visit_time: formData.visitTime,
          visitor_name: formData.visitorName,
          phone: formData.phone,
          email: formData.email,
          purpose: formData.purpose,
          number_of_visitors: parseInt(formData.numberOfVisitors),
          status: 'pending'
        });

      if (error) throw error;

      toast.success(language === 'ar' ? 'تم إرسال طلب الزيارة بنجاح!' : 'Visit booking request sent successfully!');
      onSuccess?.();
      onClose();
      setFormData({
        visitDate: '',
        visitTime: '',
        visitorName: '',
        phone: '',
        email: '',
        purpose: '',
        numberOfVisitors: '1'
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(language === 'ar' ? 'فشل في إرسال طلب الزيارة' : 'Visit booking request failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {language === 'ar' ? 'حجز زيارة' : 'Book a Visit'}
          </DialogTitle>
          <p className="text-sm text-gray-600">
            {language === 'ar' ? `حجز زيارة لـ: ${kindergartenName}` : `Book a visit for: ${kindergartenName}`}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="visitorName">
              {language === 'ar' ? 'اسم الزائر' : 'Visitor Name'} *
            </Label>
            <Input
              id="visitorName"
              value={formData.visitorName}
              onChange={(e) => handleInputChange('visitorName', e.target.value)}
              placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full name'}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">
              {language === 'ar' ? 'البريد الإلكتروني' : 'Email'} *
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">
              {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+212 6XX XXX XXX"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="visitDate">
                {language === 'ar' ? 'تاريخ الزيارة' : 'Visit Date'} *
              </Label>
              <Input
                id="visitDate"
                type="date"
                value={formData.visitDate}
                onChange={(e) => handleInputChange('visitDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <Label htmlFor="visitTime">
                {language === 'ar' ? 'وقت الزيارة' : 'Visit Time'} *
              </Label>
              <Input
                id="visitTime"
                type="time"
                value={formData.visitTime}
                onChange={(e) => handleInputChange('visitTime', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="numberOfVisitors">
              {language === 'ar' ? 'عدد الزوار' : 'Number of Visitors'}
            </Label>
            <Select value={formData.numberOfVisitors} onValueChange={(value) => handleInputChange('numberOfVisitors', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="purpose">
              {language === 'ar' ? 'غرض الزيارة' : 'Purpose of Visit'}
            </Label>
            <Input
              id="purpose"
              value={formData.purpose}
              onChange={(e) => handleInputChange('purpose', e.target.value)}
              placeholder={language === 'ar' ? 'مثال: زيارة تعريفية، مقابلة' : 'e.g., Introductory visit, Interview'}
            />
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
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {language === 'ar' ? 'جاري الحجز...' : 'Booking...'}
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'حجز' : 'Book'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;