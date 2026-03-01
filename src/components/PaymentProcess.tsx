import React, { useState, useEffect } from 'react';
import {
    CreditCard,
    CheckCircle2,
    Loader2,
    AlertCircle,
    Smartphone,
    ArrowRight,
    ShieldCheck,
    Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface PaymentProcessProps {
    amount: number;
    childName: string;
    month: string;
    onSuccess: (transactionId: string) => void;
    onCancel: () => void;
}

const PaymentProcess: React.FC<PaymentProcessProps> = ({
    amount,
    childName,
    month,
    onSuccess,
    onCancel
}) => {
    const { t, language, dir } = useLanguage();
    const [step, setStep] = useState<'selection' | 'processing' | 'success'>('selection');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (step === 'processing') {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setStep('success'), 500);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 300);
            return () => clearInterval(interval);
        }
    }, [step]);

    const handlePay = () => {
        setStep('processing');
    };

    const handleFinalize = () => {
        const mockTxId = `TXN-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
        onSuccess(mockTxId);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" dir={dir}>
            <Card className="w-full max-w-md shadow-2xl border-primary/20 bg-background animate-in zoom-in-95 duration-200">
                {step === 'selection' && (
                    <>
                        <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="outline" className="text-xs font-mono">SECURE CHECKOUT</Badge>
                                <Lock className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <CreditCard className="w-6 h-6 text-primary" />
                                {language === 'ar' ? 'الدفع الإلكتروني' : 'Paiement en ligne'}
                            </CardTitle>
                            <CardDescription>
                                {language === 'ar'
                                    ? 'اختر وسيلة الدفع لإتمام العملية بكل أمان'
                                    : 'Choisissez votre mode de paiement pour finaliser l\'opération en toute sécurité'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="p-4 rounded-xl bg-muted/50 border space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">{language === 'ar' ? 'الطفل:' : 'Enfant:'}</span>
                                    <span className="font-semibold">{childName}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">{language === 'ar' ? 'شهر:' : 'Mois:'}</span>
                                    <span className="font-semibold">{month}</span>
                                </div>
                                <div className="pt-2 border-t flex justify-between items-center">
                                    <span className="font-bold text-foreground">{language === 'ar' ? 'إجمالي المبلغ:' : 'Total amount:'}</span>
                                    <span className="text-xl font-bold text-primary">{amount.toLocaleString()} دج</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <button className="flex items-center gap-4 p-4 rounded-xl border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-all text-right group">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                        <CreditCard className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold">{language === 'ar' ? 'البطاقة الذهبية / CIB' : 'Edahabia / CIB'}</p>
                                        <p className="text-xs text-muted-foreground">{language === 'ar' ? 'دفع سريع وآمن' : 'Paiement rapide et sécurisé'}</p>
                                    </div>
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                </button>

                                <button className="flex items-center gap-4 p-4 rounded-xl border hover:bg-muted/50 transition-all text-right group opacity-50 cursor-not-allowed">
                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                        <Smartphone className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold">{language === 'ar' ? 'BaridiMob' : 'BaridiMob'}</p>
                                        <p className="text-xs text-muted-foreground">{language === 'ar' ? 'قريباً...' : 'Bientôt...'}</p>
                                    </div>
                                </button>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Button className="w-full py-6 text-lg font-bold gradient-accent" onClick={handlePay}>
                                    {language === 'ar' ? 'تأكيد ودفع' : 'Confirmer et Payer'}
                                </Button>
                                <Button variant="ghost" className="w-full" onClick={onCancel}>
                                    {language === 'ar' ? 'إلغاء' : 'Annuler'}
                                </Button>
                            </div>

                            <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest pt-2">
                                <ShieldCheck className="w-3 h-3" />
                                SSL Encrypted Payment
                            </div>
                        </CardContent>
                    </>
                )}

                {step === 'processing' && (
                    <CardContent className="py-16 text-center space-y-6">
                        <div className="relative w-24 h-24 mx-auto">
                            <Loader2 className="w-24 h-24 text-primary animate-spin opacity-20" />
                            <CreditCard className="w-10 h-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">{language === 'ar' ? 'جاري معالجة الدفع...' : 'Traitement du paiement...'}</h3>
                            <p className="text-sm text-muted-foreground">{language === 'ar' ? 'يرجى عدم إغلاق الصفحة' : 'Veuillez ne pas fermer la page'}</p>
                        </div>
                        <div className="max-w-[200px] mx-auto">
                            <Progress value={progress} className="h-2" />
                        </div>
                    </CardContent>
                )}

                {step === 'success' && (
                    <CardContent className="py-12 text-center space-y-6">
                        <div className="w-20 h-20 bg-mint/20 rounded-full flex items-center justify-center mx-auto animate-in zoom-in-50 duration-500">
                            <CheckCircle2 className="w-12 h-12 text-mint-foreground" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-mint-foreground">{language === 'ar' ? 'تم الدفع بنجاح!' : 'Paiement réussi!'}</h3>
                            <p className="text-muted-foreground italic text-sm">{language === 'ar' ? 'تم استلام طلبكم وتحديث الحالة تلقائياً' : 'Votre demande a été reçue et l\'état mis à jour'}</p>
                        </div>

                        <div className="p-4 rounded-xl bg-muted/50 border-dashed border-2 text-sm space-y-1">
                            <p className="text-muted-foreground">{language === 'ar' ? 'رقم المعاملة:' : 'No. transaction:'}</p>
                            <p className="font-mono font-bold text-primary">TXN-{Math.random().toString(36).substring(2, 11).toUpperCase()}</p>
                        </div>

                        <Button className="w-full py-6 text-lg font-bold" onClick={handleFinalize}>
                            {language === 'ar' ? 'العودة للرئيسية' : 'Retour à l\'accueil'}
                            <ArrowRight className={`w-5 h-5 ml-2 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                        </Button>
                    </CardContent>
                )}
            </Card>
        </div>
    );
};

export default PaymentProcess;
