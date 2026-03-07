import { useState } from 'react';
import { X, User, Mail, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const RegistrationModal = ({ isOpen, onClose, onSuccess }: RegistrationModalProps) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        toast.error(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone
          }
        }
      });

      if (error) throw error;

      toast.success(language === 'ar' ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!');
      onSuccess?.();
      onClose();
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(language === 'ar' ? 'فشل في إنشاء الحساب' : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {language === 'ar' ? 'إنشاء حساب جديد' : 'Créer un nouveau compte'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">
                {language === 'ar' ? 'الاسم الكامل' : 'Nom complet'}
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder={language === 'ar' ? 'الاسم الكامل' : 'Nom complet'}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">
                {language === 'ar' ? 'رقم الهاتف' : 'Téléphone'}
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder={language === 'ar' ? 'رقم الهاتف' : 'Téléphone'}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">
                {language === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder={language === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">
                {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirmer le mot de passe'}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder={language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirmer le mot de passe'}
                required
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
                    <Calendar className="w-4 h-4 animate-spin mr-2" />
                    {language === 'ar' ? 'جاري الإنشاء...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'إنشاء حساب' : 'Créer un compte'}
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

export default RegistrationModal;
