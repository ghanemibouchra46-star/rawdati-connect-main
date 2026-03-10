/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { X, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { Kindergarten } from '@/data/kindergartens';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  kindergarten: Kindergarten;
  onBook?: (bookingData: any) => void;
}

const BookingModal = ({ isOpen, onClose, kindergarten, onBook }: BookingModalProps) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    childName: '',
    childAge: '',
    bookingDate: '',
    bookingTime: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const bookingData = {
        ...formData,
        kindergartenId: kindergarten.id,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      onBook?.(bookingData);

      // Reset form
      setFormData({
        parentName: '',
        parentEmail: '',
        parentPhone: '',
        childName: '',
        childAge: '',
        bookingDate: '',
        bookingTime: '',
        notes: ''
      });

      onClose();
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {language === 'ar' ? 'حجز موعد' : 'Réserver un rendez-vous'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold">{kindergarten.name}</h3>
            <p className="text-sm text-muted-foreground">
              {language === 'ar' ? 'احجز موعد لزيارة الروضة' : 'Réserver une visite de la crèche'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parentName">
                  {language === 'ar' ? 'اسم ولي الأمر' : 'Nom du parent'}
                </Label>
                <Input
                  id="parentName"
                  value={formData.parentName}
                  onChange={(e) => handleInputChange('parentName', e.target.value)}
                  placeholder={language === 'ar' ? 'الاسم الكامل' : 'Nom complet'}
                  required
                />
              </div>

              <div>
                <Label htmlFor="parentEmail">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </Label>
                <Input
                  id="parentEmail"
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => handleInputChange('parentEmail', e.target.value)}
                  placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parentPhone">
                  {language === 'ar' ? 'رقم الهاتف' : 'Téléphone'}
                </Label>
                <Input
                  id="parentPhone"
                  value={formData.parentPhone}
                  onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                  placeholder={language === 'ar' ? 'رقم الهاتف' : 'Téléphone'}
                  required
                />
              </div>

              <div>
                <Label htmlFor="childName">
                  {language === 'ar' ? 'اسم الطفل' : 'Nom de l\'enfant'}
                </Label>
                <Input
                  id="childName"
                  value={formData.childName}
                  onChange={(e) => handleInputChange('childName', e.target.value)}
                  placeholder={language === 'ar' ? 'اسم الطفل' : 'Nom de l\'enfant'}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="childAge">
                  {language === 'ar' ? 'عمر الطفل' : 'Âge de l\'enfant'}
                </Label>
                <Input
                  id="childAge"
                  value={formData.childAge}
                  onChange={(e) => handleInputChange('childAge', e.target.value)}
                  placeholder={language === 'ar' ? 'العمر' : 'Âge'}
                  required
                />
              </div>

              <div>
                <Label htmlFor="bookingDate">
                  {language === 'ar' ? 'تاريخ الحجز' : 'Date de réservation'}
                </Label>
                <Input
                  id="bookingDate"
                  type="date"
                  value={formData.bookingDate}
                  onChange={(e) => handleInputChange('bookingDate', e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bookingTime">
                {language === 'ar' ? 'وقت الحجز' : 'Heure de réservation'}
              </Label>
              <Input
                id="bookingTime"
                type="time"
                value={formData.bookingTime}
                onChange={(e) => handleInputChange('bookingTime', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="notes">
                {language === 'ar' ? 'ملاحظات' : 'Notes'}
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder={language === 'ar' ? 'أي معلومات إضافية...' : 'Informations supplémentaires...'}
                rows={3}
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
                {language === 'ar' ? 'إلغاء' : 'Annuler'}
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin mr-2" />
                    {language === 'ar' ? 'جاري الحجز...' : 'Réservation...'}
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'احجز الآن' : 'Réserver maintenant'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;