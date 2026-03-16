import React from 'react';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const LogoGallery = () => {
  const navigate = useNavigate();
  const { dir } = useLanguage();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-black mb-12 text-slate-800">معرض الشعارات - Logo Gallery</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 max-w-4xl w-full">
        {/* Final Selection */}
        <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center border-4 border-pink-100 col-span-1 md:col-span-2">
          <Logo size="xl" variant="graduated" className="mb-6 flex-col" />
          <h2 className="text-3xl font-bold mb-2">التصميم النهائي: الطفل المتخرج</h2>
          <p className="text-slate-500 mb-6 text-lg">تصميم مبهج مع قبعة التخرج وكلمة "روضتي" المنسقة</p>
          <Button className="px-12 bg-pink-500 hover:bg-pink-600">هذا هو الشعار المعتمد</Button>
        </div>

        {/* Option 2 */}
        <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center border-4 border-emerald-100">
          <Logo size="xl" variant="growth" className="mb-6" />
          <h2 className="text-2xl font-bold mb-2">الخيار 2: التعليمي</h2>
          <p className="text-slate-500 mb-6">يركز على النمو والشتلة العلمية</p>
          <Button className="w-full bg-emerald-500 hover:bg-emerald-600">اختيار هذا التصميم</Button>
        </div>

        {/* Option 3 */}
        <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center text-center border-4 border-blue-100">
          <Logo size="xl" variant="playful" className="mb-6" />
          <h2 className="text-2xl font-bold mb-2">الخيار 3: المرح</h2>
          <p className="text-slate-500 mb-6">أشكال ملونة تعبر عن اللعب والنشاط</p>
          <Button className="w-full bg-blue-500 hover:bg-blue-600">اختيار هذا التصميم</Button>
        </div>
      </div>

      <Button 
        variant="ghost" 
        className="mt-12 gap-2"
        onClick={() => navigate('/')}
      >
        <ArrowIcon className="w-5 h-5" />
        العودة للرئيسية
      </Button>
    </div>
  );
};

export default LogoGallery;
