import { useState } from 'react';
import { X, User, Phone, Mail, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Kindergarten } from '@/data/kindergartens';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface RegistrationModalProps {
  kindergarten: Kindergarten | null;
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationModal = ({ kindergarten, isOpen, onClose }: RegistrationModalProps) => {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    childName: '',
    childAge: '',
    childGender: '',
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

      // Create registration record
      const { error } = await supabase
        .from('registrations')
        .insert({
          kindergarten_id: kindergarten.id,
          parent_id: session.user.id,
          parent_name: formData.parentName,
          parent_phone: formData.parentPhone,
          parent_email: formData.parentEmail,
          child_name: formData.childName,
          child_age: parseInt(formData.childAge),
          child_gender: formData.childGender,
          notes: formData.notes,
          status: 'pending'
        });

      if (error) throw error;

      toast.success(language === 'ar' ? 'تم إرسال طلب التسجيل بنجاح' : 'Registration request sent successfully');
      onClose();
      setFormData({
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        childName: '',
        childAge: '',
        childGender: '',
        notes: ''
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(language === 'ar' ? 'حدث خطأ في التسجيل' : 'Registration failed');
    } finally {
      setIsLoading(false);
    }

      function newFunction(): "kindergartens" | "notifications" | "owner_kindergartens" | "profiles" | "registration_requests" | "subscription_requests" | "platform_subscriptions" | "reviews" | "user_roles" {
          return 'registrations';
      }
  };

  if (!isOpen || !kindergarten) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              {language === 'ar' ? 'تسجيل في الروضة' : 'Register for Kindergarten'}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              {language === 'ar' ? kindergarten.nameAr : kindergarten.nameFr}
            </h3>
            <p className="text-sm text-blue-600">
              {language === 'ar' ? kindergarten.addressAr : kindergarten.addressFr}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'اسم الوالد' : 'Parent Name'}
              </label>
              <Input
                type="text"
                value={formData.parentName}
                onChange={(e) => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
                required
                placeholder={language === 'ar' ? 'أدخل اسم الوالد' : 'Enter parent name'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
              </label>
              <Input
                type="tel"
                value={formData.parentPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, parentPhone: e.target.value }))}
                required
                placeholder={language === 'ar' ? 'أدخل رقم الهاتف' : 'Enter phone number'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
              </label>
              <Input
                type="email"
                value={formData.parentEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, parentEmail: e.target.value }))}
                required
                placeholder={language === 'ar' ? 'أدخل البريد الإلكتروني' : 'Enter email'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'اسم الطفل' : 'Child Name'}
              </label>
              <Input
                type="text"
                value={formData.childName}
                onChange={(e) => setFormData(prev => ({ ...prev, childName: e.target.value }))}
                required
                placeholder={language === 'ar' ? 'أدخل اسم الطفل' : 'Enter child name'}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ar' ? 'العمر' : 'Age'}
                </label>
                <Input
                  type="number"
                  value={formData.childAge}
                  onChange={(e) => setFormData(prev => ({ ...prev, childAge: e.target.value }))}
                  required
                  min="2"
                  max="6"
                  placeholder={language === 'ar' ? 'العمر' : 'Age'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {language === 'ar' ? 'الجنس' : 'Gender'}
                </label>
                <select
                  value={formData.childGender}
                  onChange={(e) => setFormData(prev => ({ ...prev, childGender: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">
                    {language === 'ar' ? 'اختر' : 'Select'}
                  </option>
                  <option value="male">
                    {language === 'ar' ? 'ذكر' : 'Male'}
                  </option>
                  <option value="female">
                    {language === 'ar' ? 'أنثى' : 'Female'}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ar' ? 'ملاحظات إضافية' : 'Additional Notes'}
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder={language === 'ar' ? 'أي ملاحظات إضافية...' : 'Any additional notes...'}
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  language === 'ar' ? 'جاري الإرسال...' : 'Sending...'
                ) : (
                  language === 'ar' ? 'إرسال الطلب' : 'Send Request'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;