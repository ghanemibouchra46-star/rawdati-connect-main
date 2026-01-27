import { useState } from 'react';
import { X, User, Phone, Mail, Baby, Calendar, Send, CheckCircle, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Kindergarten } from '@/data/kindergartens';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface RegistrationModalProps {
  kindergarten: Kindergarten | null;
  isOpen: boolean;
  onClose: () => void;
}

const RegistrationModal = ({ kindergarten, isOpen, onClose }: RegistrationModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    email: '',
    childName: '',
    childAge: '',
    message: '',
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session?.user) {
        // Pre-fill email if available
        setFormData(prev => ({
          ...prev,
          email: session.user.email || ''
        }));
      }
    };
    
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen]);

  if (!isOpen || !kindergarten) return null;

  const handleLoginRedirect = () => {
    onClose();
    navigate('/auth');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'يرجى تسجيل الدخول',
          description: 'يجب تسجيل الدخول لإرسال طلب التسجيل',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase.from('registration_requests').insert({
        kindergarten_id: kindergarten.id,
        parent_name: formData.parentName,
        phone: formData.phone,
        email: formData.email || null,
        child_name: formData.childName,
        child_age: parseInt(formData.childAge),
        message: formData.message || null,
        user_id: user.id,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: 'تم إرسال الطلب بنجاح!',
        description: `سيتواصل معك فريق ${kindergarten.nameAr} قريباً.`,
      });

      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          parentName: '',
          phone: '',
          email: '',
          childName: '',
          childAge: '',
          message: '',
        });
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'حدث خطأ',
        description: 'لم نتمكن من إرسال طلبك. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal */}
      <div className="relative bg-card rounded-3xl shadow-card max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-card rounded-t-3xl border-b border-border p-6 z-10">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-accent flex items-center justify-center shadow-soft">
              <Baby className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground">طلب تسجيل</h2>
            <p className="text-sm text-muted-foreground mt-1">{kindergarten.nameAr}</p>
          </div>
        </div>

        {/* Login Required State */}
        {isAuthenticated === false ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <LogIn className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">تسجيل الدخول مطلوب</h3>
            <p className="text-muted-foreground mb-6">يجب تسجيل الدخول لإرسال طلب تسجيل طفلك</p>
            <Button
              onClick={handleLoginRedirect}
              className="gradient-accent border-0 rounded-xl shadow-soft text-primary-foreground font-semibold gap-2"
            >
              <LogIn className="w-5 h-5" />
              تسجيل الدخول
            </Button>
          </div>
        ) : isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">تم الإرسال بنجاح!</h3>
            <p className="text-muted-foreground">سنتواصل معك قريباً إن شاء الله</p>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Parent Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                اسم الولي
              </label>
              <Input
                required
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                placeholder="أدخل اسمك الكامل"
                className="h-12 bg-muted/50 border-border rounded-xl"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent" />
                رقم الهاتف
              </label>
              <Input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="07XX XX XX XX"
                className="h-12 bg-muted/50 border-border rounded-xl"
                dir="ltr"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary" />
                البريد الإلكتروني (اختياري)
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
                className="h-12 bg-muted/50 border-border rounded-xl"
                dir="ltr"
              />
            </div>

            {/* Child Name & Age */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Baby className="w-4 h-4 text-coral" />
                  اسم الطفل
                </label>
                <Input
                  required
                  value={formData.childName}
                  onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                  placeholder="اسم الطفل"
                  className="h-12 bg-muted/50 border-border rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-mint" />
                  العمر
                </label>
                <Input
                  required
                  type="number"
                  min="1"
                  max="7"
                  value={formData.childAge}
                  onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                  placeholder="سنوات"
                  className="h-12 bg-muted/50 border-border rounded-xl"
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">رسالة إضافية (اختياري)</label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="أي معلومات إضافية تود مشاركتها..."
                className="bg-muted/50 border-border rounded-xl resize-none"
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 gradient-accent border-0 rounded-xl shadow-soft hover:shadow-hover transition-all duration-300 text-primary-foreground font-semibold text-lg gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  إرسال الطلب
                </>
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistrationModal;
