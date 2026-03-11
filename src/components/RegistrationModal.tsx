import { useState } from 'react';
import { X, User, Phone, Mail, Calendar, Send, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Kindergarten } from '@/data/kindergartens';

interface RegistrationModalProps {
  kindergarten: Kindergarten | null;
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationModal = ({ kindergarten, isOpen, onClose }: RegistrationModalProps) => {
  const { t, language, dir } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    email: '',
    childName: '',
    childAge: '',
    message: ''
  });

  if (!isOpen || !kindergarten) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('registration_requests')
        .insert({
          kindergarten_id: kindergarten.id,
          parent_name: formData.parentName,
          child_name: formData.childName,
          child_age: parseInt(formData.childAge),
          phone: formData.phone,
          email: formData.email || null,
          message: formData.message || null,
          user_id: user?.id || null,
          status: 'pending'
        });

      if (error) throw error;

      toast.success(t('registration.successTitle'), {
        description: t('registration.successDesc').replace('{name}', language === 'ar' ? kindergarten.name_ar : kindergarten.nameFr)
      });
      
      onClose();
      setFormData({
        parentName: '',
        phone: '',
        email: '',
        childName: '',
        childAge: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(t('registration.errorSubmit'));
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
      
      <div className="relative bg-card rounded-3xl shadow-card max-w-lg w-full p-6 md:p-8 animate-scale-in overflow-y-auto max-h-[90vh]" dir={dir}>
        <button
          onClick={onClose}
          className={`absolute top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} p-2 hover:bg-muted rounded-full transition-colors`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            {t('modal.registration')}
          </h2>
          <p className="text-muted-foreground mt-1">
            {language === 'ar' ? `التسجيل في ${name}` : `Inscription à ${name}`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className={`text-sm font-medium text-foreground ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('registration.parentName')}</label>
            <Input
              required
              value={formData.parentName}
              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              placeholder={t('auth.fullName')}
              className={`h-12 bg-muted/50 border-border rounded-xl ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={`text-sm font-medium text-foreground ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('auth.phone')}</label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0XXXXXXXXX"
                className={`h-12 bg-muted/50 border-border rounded-xl ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium text-foreground ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('auth.email')}</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className={`h-12 bg-muted/50 border-border rounded-xl ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={`text-sm font-medium text-foreground ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('registration.childName')}</label>
              <Input
                required
                value={formData.childName}
                onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                placeholder={t('registration.childName')}
                className={`h-12 bg-muted/50 border-border rounded-xl ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
              />
            </div>
            <div className="space-y-2">
              <label className={`text-sm font-medium text-foreground ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('registration.childAge')}</label>
              <Input
                required
                type="number"
                min="1"
                max="7"
                value={formData.childAge}
                onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                placeholder={t('parent.age')}
                className={`h-12 bg-muted/50 border-border rounded-xl ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-sm font-medium text-foreground ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('registration.message')}</label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={t('registration.messagePlaceholder')}
              className={`bg-muted/50 border-border rounded-xl resize-none ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
              rows={3}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-14 gradient-accent border-0 rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 text-primary-foreground font-bold text-lg gap-2`}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                {t('modal.send')}
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;
