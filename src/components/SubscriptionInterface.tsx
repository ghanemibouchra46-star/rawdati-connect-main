import { useState, useEffect } from 'react';
import { 
  Crown, 
  CheckCircle2, 
  Search, 
  Users, 
  Image as ImageIcon, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface SubscriptionInterfaceProps {
  onActivate?: () => void;
}

const SubscriptionInterface = ({ onActivate }: SubscriptionInterfaceProps) => {
  const { language, dir } = useLanguage();
  const [userType, setUserType] = useState<'kindergarten' | 'parent' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUserType = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching user type:', error);
        // Fallback to checking roles if user_type is not yet populated
        const { data: hasOwner } = await supabase.rpc('has_role', {
          _user_id: session.user.id,
          _role: 'owner'
        });
        
        if (hasOwner) {
          setUserType('kindergarten');
        } else {
          setUserType('parent');
        }
      } else {
        setUserType((profile as any).user_type as 'kindergarten' | 'parent');
      }
      setIsLoading(false);
    };

    fetchUserType();
  }, []);

  if (isLoading) return null;

  const content = {
    kindergarten: {
      title: language === 'ar' ? 'تفعيل الحساب المهني للمؤسسة' : 'Activer le compte professionnel',
      subtitle: language === 'ar' ? 'ارتقِ بمؤسستك إلى المستوى التالي' : 'Passez votre établissement au niveau supérieur',
      icon: <ShieldCheck className="w-12 h-12 text-primary" />,
      features: [
        {
          icon: <Users className="w-5 h-5 text-blue-500" />,
          text: language === 'ar' ? 'إدارة الأطفال بشكل كامل ومتطور' : 'Gestion complète et avancée des enfants'
        },
        {
          icon: <ImageIcon className="w-5 h-5 text-purple-500" />,
          text: language === 'ar' ? 'نشر النشاطات واللحظات اليومية' : 'Publication d\'activités et moments quotidiens'
        },
        {
          icon: <Search className="w-5 h-5 text-green-500" />,
          text: language === 'ar' ? 'الظهور في نتائج البحث الأولى' : 'Apparaître dans les premiers résultats de recherche'
        }
      ],
      buttonText: language === 'ar' ? 'اطلب الباقة الآن' : 'Demander le pack maintenant',
      accentColor: 'from-primary/20 to-primary/5'
    },
    parent: {
      title: language === 'ar' ? 'خدمة المتابعة اليومية' : 'Service de suivi quotidien',
      subtitle: language === 'ar' ? 'ابقَ على اتصال دائم بطفلك' : 'Restez toujours connecté à votre enfant',
      icon: <Sparkles className="w-12 h-12 text-amber-500" />,
      features: [
        {
          icon: <ImageIcon className="w-5 h-5 text-pink-500" />,
          text: language === 'ar' ? 'رؤية صور نشاطات الطفل اليومية' : 'Voir les photos des activités quotidiennes'
        },
        {
          icon: <Clock className="w-5 h-5 text-cyan-500" />,
          text: language === 'ar' ? 'تتبع الحضور والغياب لحظة بلحظة' : 'Suivre la présence et l\'absence en temps réel'
        }
      ],
      buttonText: language === 'ar' ? 'تفعيل الخدمة' : 'Activer le service',
      accentColor: 'from-amber-500/20 to-amber-500/5'
    }
  };

  const activeContent = userType ? content[userType] : null;

  if (!activeContent) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white border border-border/50 shadow-soft hover:shadow-hover transition-all duration-300 text-right overflow-hidden w-full max-w-md">
          <div className={`absolute inset-0 bg-gradient-to-br ${activeContent.accentColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
          
          <div className="relative z-10 w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            {activeContent.icon}
          </div>
          
          <div className="relative z-10 flex-1" dir={dir}>
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
              {activeContent.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {activeContent.subtitle}
            </p>
          </div>
          
          <div className="relative z-10 w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center group-hover:bg-primary/10 group-hover:translate-x-1 transition-all">
            <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          </div>
        </button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden border-none shadow-2xl" dir={dir}>
        <div className={`h-32 bg-gradient-to-br ${activeContent.accentColor} relative flex items-center justify-center`}>
          <div className="absolute top-4 right-4 animate-pulse">
            <Zap className="w-6 h-6 text-primary fill-primary" />
          </div>
          <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center">
            {activeContent.icon}
          </div>
        </div>
        
        <div className="p-6 pt-8 space-y-6">
          <div className="text-center">
            <DialogTitle className="text-2xl font-black text-foreground mb-2">
              {activeContent.title}
            </DialogTitle>
            <p className="text-muted-foreground">
              {activeContent.subtitle}
            </p>
          </div>
          
          <div className="space-y-4">
            {activeContent.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  {feature.icon}
                </div>
                <span className="font-medium text-foreground">{feature.text}</span>
                <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />
              </div>
            ))}
          </div>
          
          <Button 
            onClick={() => {
              setIsOpen(false);
              onActivate?.();
            }}
            className="w-full h-14 gradient-accent border-0 rounded-2xl shadow-soft hover:shadow-hover transition-all duration-300 text-lg font-bold group"
          >
            {activeContent.buttonText}
            <ArrowRight className={`w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          </Button>
          
          <p className="text-center text-xs text-muted-foreground">
            {language === 'ar' 
              ? 'بالضغط على الزر، سيتم توجيهك إلى صفحة الدفع الآمنة' 
              : 'En cliquant sur le bouton, vous serez redirigé vers la page de paiement sécurisée'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionInterface;
