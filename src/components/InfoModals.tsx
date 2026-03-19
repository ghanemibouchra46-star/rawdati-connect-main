import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Check, HelpCircle, CreditCard, Building2, LayoutDashboard, Users, FileText, Mail, Phone, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal = ({ isOpen, onClose }: ModalProps) => {
  const { dir } = useLanguage();

  const plans = [
    {
      name: "الخطة المجانية",
      price: "0 دج",
      duration: "/ شهر",
      features: ["تجربة المنصة مجاناً لمدة شهر", "إضافة معلومات الروضة", "ظهور في نتائج البحث"],
      color: "bg-blue-500/10 text-blue-600",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "الخطة المهنية (Pro)",
      price: "2000 دج",
      duration: "/ شهر",
      features: ["كل ميزات الخطة المجانية", "إدارة ملفات الأطفال", "نشر الأنشطة اليومية"],
      color: "bg-emerald-500/10 text-emerald-600",
      buttonColor: "bg-emerald-600 hover:bg-emerald-700",
      popular: true,
    },
    {
      name: "الخطة المميزة (Premium)",
      price: "5000 دج",
      duration: "/ شهر",
      features: ["كل ميزات Pro", "إشعارات فورية للأولياء", "تقارير مالية وإدارية", "دعم فني مخصص"],
      color: "bg-pink-500/10 text-pink-600",
      buttonColor: "bg-pink-600 hover:bg-pink-700",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir={dir}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            خطط الأسعار لأصحاب الروضات
          </DialogTitle>
          <DialogDescription>
            اختر الخطة المناسبة لنمو روضتك وتسهيل إدارتها
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular ? "border-emerald-500 scale-105 shadow-lg z-10" : "border-border"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  الأكثر طلباً
                </span>
              )}
              <div className={`w-12 h-12 rounded-xl ${plan.color} flex items-center justify-center mb-4`}>
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-black">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.duration}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const FAQModal = ({ isOpen, onClose }: ModalProps) => {
  const { dir } = useLanguage();

  const faqs = [
    {
      q: "كيف يمكنني تسجيل روضتي في المنصة؟",
      a: "يمكنك التسجيل بسهولة عبر الضغط على 'سجل روضتك' في الموقع، ثم ملء البيانات المطلوبة لإنشاء حساب مالك الروضة وتفعيل ملفك.",
    },
    {
      q: "هل المنصة مجانية للأولياء؟",
      a: "نعم، المنصة مجانية تماماً للأولياء للبحث عن الروضات، تصفح الصور، قراءة التقييمات، والتواصل المبدئي.",
    },
    {
      q: "ما هي الوثائق المطلوبة لتفعيل حساب الروضة؟",
      a: "للتأكد من موثوقية المنصة، نطلب نسخة من الاعتماد الوزاري وبطاقة تعريف مالك الروضة.",
    },
    {
      q: "كيف يمكنني التواصل مع الدعم الفني؟",
      a: "يمكنك التواصل معنا عبر رقم الهاتف 0798960780 أو عبر البريد الإلكتروني Rawdati245@gmail.com الموضح في أسفل الصفحة.",
    },
    {
      q: "هل تدعم المنصة إدارة المدفوعات؟",
      a: "نعم، توفر المنصة نظاماً متكاملاً لمتابعة مستحقات الروضة وإرسال وصولات الدفع الرقمية للأولياء.",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir={dir}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-primary" />
            الأسئلة الشائعة
          </DialogTitle>
          <DialogDescription>
            إليك إجابات على أكثر الأسئلة شيوعاً حول منصة روضتي
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {faqs.map((faq, index) => (
            <div key={index} className="p-4 rounded-xl bg-muted/30 border border-border/50">
              <h3 className="font-bold text-lg mb-2 text-primary">{faq.q}</h3>
              <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const RegisterInfoModal = ({ isOpen, onClose }: ModalProps) => {
  const { dir } = useLanguage();
  const navigate = useNavigate();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir={dir}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            انضم إلى منصة روضتي
          </DialogTitle>
          <DialogDescription>
            سجل روضتك اليوم وكن جزءاً من أكبر شبكة لرياض الأطفال في الجزائر
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-6 text-right" dir="rtl">
          <div className="flex gap-3 p-3 rounded-xl bg-pink-500/5 border border-pink-500/10">
            <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-pink-500" />
            </div>
            <div>
              <h4 className="font-bold text-sm">وصول أوسع للجمهور</h4>
              <p className="text-xs text-muted-foreground">تواصل مع آلاف الآباء الباحثين عن روضة لأطفالهم في منطقتك.</p>
            </div>
          </div>
          
          <div className="flex gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h4 className="font-bold text-sm">إدارة رقمية متكاملة</h4>
              <p className="text-xs text-muted-foreground">نظم حضور الأطفال، المدفوعات، والأنشطة اليومية بسهولة.</p>
            </div>
          </div>
        </div>

        <Button 
          className="w-full h-12 gradient-accent border-0"
          onClick={() => {
            onClose();
            navigate('/owner-auth');
          }}
        >
          ابدأ التسجيل الآن
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export const DashboardInfoModal = ({ isOpen, onClose }: ModalProps) => {
  const { dir } = useLanguage();
  const navigate = useNavigate();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir={dir}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            لوحة التحكم الذكية
          </DialogTitle>
          <DialogDescription>
            كل ما تحتاجه لإدارة روضتك في مكان واحد
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-6 text-right" dir="rtl">
          <p className="text-sm text-muted-foreground leading-relaxed">
            توفر لك لوحة التحكم نظرة شاملة على أداء روضتك، حيث يمكنك:
          </p>
          <ul className="space-y-2">
            {[
              "متابعة تسجيلات الأطفال الجديدة",
              "إدارة جدول الحصص والوجبات",
              "مشاركة الصور والأنشطة مع الأولياء",
              "إصدار الفواتير ومتابعة المداخيل"
            ].map((item, id) => (
              <li key={id} className="flex items-center gap-2 text-sm justify-start">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Button 
          className="w-full h-12 gradient-accent border-0"
          onClick={() => {
            onClose();
            navigate('/owner');
          }}
        >
          الانتقال إلى لوحة التحكم
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export const ContactModal = ({ isOpen, onClose }: ModalProps) => {
  const { dir } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir={dir}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Phone className="w-6 h-6 text-primary" />
            اتصل بنا
          </DialogTitle>
          <DialogDescription>
            نحن هنا لمساعدتك والإجابة على استفساراتك
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 my-6 text-right" dir="rtl">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">رقم الهاتف</h4>
              <a href="tel:0798960780" className="text-lg font-bold text-primary hover:underline" dir="ltr">0798960780</a>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">البريد الإلكتروني</h4>
              <p className="text-gray-600">Rawdati245@gmail.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-pink-500/5 border border-pink-500/10">
            <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center shrink-0">
              <Facebook className="w-6 h-6 text-pink-500" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">فيسبوك</h4>
              <a 
                href="https://www.facebook.com/profile.php?id=61579605182708" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                صفحتنا الرسمية
              </a>
            </div>
          </div>
        </div>

        <Button 
          className="w-full h-12 gradient-accent border-0"
          onClick={onClose}
        >
          إغلاق
        </Button>
      </DialogContent>
    </Dialog>
  );
};
