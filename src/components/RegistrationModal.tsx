import { useState } from 'react';
import { X, User, Mail, Phone, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  kindergartenId: string;
  kindergartenName: string;
  onSuccess?: () => void;
}

const RegistrationModal = ({
  isOpen,
  onClose,
  kindergartenId,
  kindergartenName,
  onSuccess
}: RegistrationModalProps) => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    childName: '',
    parentName: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    address: ''
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

      // Create registration request
      const { error } = await supabase
        .from('registrations')
        .insert({
          user_id: session.user.id,
          kindergarten_id: kindergartenId,
          child_name: formData.childName,
          parent_name: formData.parentName,
          email: formData.email,
          phone: formData.phone,
          birth_date: formData.birthDate,
          gender: formData.gender,
          address: formData.address,
          status: 'pending'
        });

      if (error) throw error;

      toast.success(language === 'ar' ? 'تم إرسال طلب التسجيل بنجاح!' : 'Registration request sent successfully!');
      onSuccess?.();
      onClose();
      setFormData({
        childName: '',
        parentName: '',
        email: '',
        phone: '',
        birthDate: '',
        gender: '',
        address: ''
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(language === 'ar' ? 'فشل في إرسال طلب التسجيل' : 'Registration request failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {language === 'ar' ? 'تسجيل طفل' : 'Child Registration'}
          </DialogTitle>
          <p className="text-sm text-gray-600">
            {language === 'ar' ? `التسجيل في: ${kindergartenName}` : `Registering for: ${kindergartenName}`}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="childName">
              {language === 'ar' ? 'اسم الطفل' : 'Child Name'} *
            </Label>
            <Input
              id="childName"
              value={formData.childName}
              onChange={(e) => handleInputChange('childName', e.target.value)}
              placeholder={language === 'ar' ? 'الاسم الكامل للطفل' : 'Child full name'}
              required
            />
          </div>

          <div>
            <Label htmlFor="parentName">
              {language === 'ar' ? 'اسم الوالد' : 'Parent Name'} *
            </Label>
            <Input
              id="parentName"
              value={formData.parentName}
              onChange={(e) => handleInputChange('parentName', e.target.value)}
              placeholder={language === 'ar' ? 'اسم الوالد أو الوصي' : 'Parent or guardian name'}
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

          <div>
            <Label htmlFor="birthDate">
              {language === 'ar' ? 'تاريخ الميلاد' : 'Birth Date'} *
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="gender">
              {language === 'ar' ? 'الجنس' : 'Gender'} *
            </Label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'اختر الجنس' : 'Select gender'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{language === 'ar' ? 'ذكر' : 'Male'}</SelectItem>
                <SelectItem value="female">{language === 'ar' ? 'أنثى' : 'Female'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="address">
              {language === 'ar' ? 'العنوان' : 'Address'}
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder={language === 'ar' ? 'العنوان الكامل' : 'Full address'}
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
                  {language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  {language === 'ar' ? 'تسجيل' : 'Register'}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationModal;