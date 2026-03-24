import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Baby, LogOut, Home, Bell, User, Calendar, Clock, Image, Settings, ChevronLeft, CreditCard, DollarSign, CheckCircle } from 'lucide-react';
import PaymentProcess from '@/components/PaymentProcess';
import SubscriptionInterface from '@/components/SubscriptionInterface';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSelector from '@/components/LanguageSelector';
import { useKindergartens } from '@/hooks/useKindergartens';
import { useSubscriptionRequests } from '@/hooks/useSubscriptionRequests';

interface Child {
    id: string;
    name: string;
    age: number;
    photo_url: string | null;
    kindergarten_name: string;
    status: string;
}

interface Activity {
    id: string;
    child_name: string;
    activity_type: string;
    description: string;
    photo_url: string | null;
    created_at: string;
}

interface Payment {
    id: string;
    child_id: string;
    amount: number;
    for_month: number;
    for_year: number;
    status: 'paid' | 'pending' | 'debt';
    payment_date: string | null;
    kindergarten_id: string;
}

const ParentDashboard = () => {
    const { profile: authProfile, loading: authLoading, logout: authLogout } = useAuth();
    const { t, dir, language } = useLanguage();
    const { data: kindergartens = [] } = useKindergartens();
    const { requests: subscriptionRequests, isLoading: loadingSubscriptions } = useSubscriptionRequests();
    const [children, setChildren] = useState<Child[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activePayment, setActivePayment] = useState<{
        amount: number;
        childName: string;
        month: string;
        childId: string;
        kindergartenId: string;
        monthNum: number;
        year: number;
    } | null>(null);
    const [showPaymentRedirect, setShowPaymentRedirect] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        if (!authLoading) {
            if (authProfile) {
                fetchDashboardData(authProfile.id);
            } else {
                navigate('/auth');
            }
        }
    }, [authProfile, authLoading, navigate, kindergartens]); // Added kindergartens to dependencies as it's used in fetchDashboardData

    const fetchDashboardData = async (userId: string) => {
        setIsLoading(true);
        try {
            const { data: registrationData } = await supabase
                .from('registration_requests')
                .select('*')
                .eq('user_id', userId);

            if (registrationData) {
                const mappedChildren = registrationData.map(reg => {
                    const kg = kindergartens.find(k => k.id === reg.kindergarten_id);
                    return {
                        id: reg.id,
                        name: reg.child_name,
                        age: reg.child_age,
                        photo_url: null, // Placeholder as it's not in DB yet
                        kindergarten_name: language === 'ar' ? (kg?.name_ar || reg.kindergarten_id) : (kg?.nameFr || reg.kindergarten_id),
                        status: reg.status
                    };
                });
                setChildren(mappedChildren);

                // Fetch activities for all children
                const childNames = registrationData?.map(r => r.child_name) || [];
                if (childNames.length > 0) {
                    const { data: activitiesData } = await supabase
                        .from('activities' as any)
                        .select('*')
                        .in('child_name', childNames)
                        .order('created_at', { ascending: false })
                        .limit(5);

                    if (activitiesData) {
                        setActivities(activitiesData as any);
                    }
                }

                // Fetch payments
                const childIds = mappedChildren.map(c => c.id);
                if (childIds.length > 0) {
                    const { data: paymentsData } = await supabase
                        .from('payments' as any)
                        .select('*')
                        .in('child_id', childIds)
                        .order('created_at', { ascending: false });

                    if (paymentsData) {
                        setPayments(paymentsData as any);
                    }
                }
            } else {
                setChildren([]);
                setActivities([]);
                setPayments([]);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast({
                title: language === 'ar' ? 'خطأ' : 'Erreur',
                description: language === 'ar' ? 'فشل في تحميل بيانات لوحة التحكم.' : 'Échec du chargement des données du tableau de bord.',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            toast({
                title: language === 'ar' ? 'جاري تسجيل الخروج...' : 'Déconnexion en cours...',
            });
            await authLogout();
            window.location.href = '/auth';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '/auth';
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'learning': return '📚';
            case 'play': return '🎮';
            case 'meal': return '🍽️';
            case 'nap': return '😴';
            default: return '📌';
        }
    };

    const getActivityLabel = (type: string) => {
        switch (type) {
            case 'learning': return t('parent.activity.learning');
            case 'play': return t('parent.activity.play');
            case 'meal': return t('parent.activity.meal');
            case 'nap': return t('parent.activity.nap');
            default: return t('parent.activity.other');
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString(language === 'ar' ? 'ar-DZ' : 'fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    const handlePaymentSuccess = async (txId: string) => {
        if (!activePayment) return;

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase.from('payments' as any)).insert({
                child_id: activePayment.childId,
                kindergarten_id: activePayment.kindergartenId,
                amount: activePayment.amount,
                for_month: activePayment.monthNum,
                for_year: activePayment.year,
                status: 'paid',
                payment_date: new Date().toISOString()
            });

            if (error) throw error;

            toast({
                title: language === 'ar' ? 'تم الدفع بنجاح' : 'Paiement effectué',
                description: language === 'ar' ? 'تم تحديث سجل المدفوعات الخاص بطفلك' : 'Le registre des paiements a été mis à jour',
            });

            setActivePayment(null);
            fetchDashboardData(authProfile!.id); // Refresh data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Payment save error:', error);
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive'
            });
        }
    };

    const getMonthName = (month: number) => {
        const date = new Date();
        date.setMonth(month - 1);
        return date.toLocaleString(language === 'ar' ? 'ar-DZ' : 'fr-FR', { month: 'long' });
    };

    if (isLoading || authLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <div className="relative">
                    <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center animate-pulse">
                        <Baby className="w-10 h-10 text-primary animate-bounce" />
                    </div>
                </div>
                <div className="mt-8 text-center space-y-2">
                    <h2 className="text-xl font-bold text-foreground">
                        {language === 'ar' ? 'جاري تحميل لوحة التحكم...' : 'Chargement du tableau de bord...'}
                    </h2>
                    <p className="text-muted-foreground animate-pulse text-sm">
                        {language === 'ar' ? 'يرجى الانتظار قليلاً، نحن نجهز مساحتك' : 'Veuillez patienter, nous préparons votre espace'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/30" dir={dir}>
            {/* Header */}
            <header className="bg-card border-b border-border sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link to="/" className="p-2 rounded-lg hover:bg-muted transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </Link>
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Baby className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-foreground">{language === 'ar' ? 'لوحة التحكم' : 'Tableau de bord'}</h1>
                                <p className="text-sm text-muted-foreground">{language === 'ar' ? 'ولي الأمر' : 'Parent'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <LanguageSelector />
                            <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full">
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 space-y-8">
                {/* Daily Follow-up Subscription */}
                <div className="flex justify-center md:justify-start">
                    <SubscriptionInterface onActivate={() => {
                        setShowPaymentRedirect(true);
                        toast({
                            title: language === 'ar' ? 'طلب التفعيل' : 'Demande d\'activation',
                            description: language === 'ar' ? 'تم تحويلك لصفحة الدفع لتفعيل خدمة المتابعة اليومية' : 'Vous avez été redirigé vers la page de paiement',
                        });
                    }} />
                </div>

                {/* Children Section */}
                <section>
                    <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <Baby className="w-5 h-5 text-primary" />
                        {t('parent.myChildren')}
                    </h2>

                    {children.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="py-8 text-center">
                                <Baby className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">{t('parent.noChildren')}</p>
                                <p className="text-sm text-muted-foreground mt-2">{t('parent.noChildrenDesc')}</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {children.map((child) => (
                                <Card key={child.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-16 h-16 border-2 border-primary/20">
                                                {child.photo_url ? (
                                                    <AvatarImage src={child.photo_url} alt={child.name} />
                                                ) : (
                                                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                                                        {child.name.charAt(0)}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg text-foreground">{child.name}</h3>
                                                <p className="text-sm text-muted-foreground">{child.age} {t('parent.age')}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="outline" className="text-xs">
                                                        {child.kindergarten_name}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>


                {/* Payments Section */}
                <section>
                    <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary" />
                        {language === 'ar' ? 'متابعة المدفوعات' : 'Suivi des paiements'}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {children.map(child => {
                            const curMonth = new Date().getMonth() + 1;
                            const curYear = new Date().getFullYear();
                            const isPaid = payments.some(p =>
                                p.child_id === child.id &&
                                p.for_month === curMonth &&
                                p.for_year === curYear &&
                                p.status === 'paid'
                            );
                            
                            // Find kindergarten safely
                            const kg = kindergartens.find(k => 
                                (language === 'ar' ? k.name_ar === child.kindergarten_name : k.nameFr === child.kindergarten_name) ||
                                k.id === (child as any).kindergarten_id
                            );
                            const price = kg?.pricePerMonth || 7000;

                            return (
                                <Card key={`pay-${child.id}`} className={`overflow-hidden transition-all duration-300 ${!isPaid ? 'border-2 border-primary shadow-soft' : 'border border-border/50 opacity-80'}`}>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-center">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                                    <p className="font-bold text-lg text-foreground">{child.name}</p>
                                                </div>
                                                <p className="text-sm text-muted-foreground mr-4">
                                                    {getMonthName(curMonth)} {curYear}
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <p className="text-2xl font-black text-primary">
                                                    {price.toLocaleString()} {language === 'ar' ? 'دج' : 'DZD'}
                                                </p>
                                                {isPaid ? (
                                                    <Badge className="bg-mint text-white px-3 py-1 rounded-full flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        {language === 'ar' ? 'تم الدفع' : 'Payé'}
                                                    </Badge>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        className="h-10 px-6 rounded-full gradient-accent shadow-soft hover:shadow-hover hover:scale-105 transition-all text-sm font-bold flex items-center gap-2"
                                                        onClick={() => {
                                                            if (kg) {
                                                                setActivePayment({
                                                                    amount: price,
                                                                    childName: child.name,
                                                                    month: getMonthName(curMonth),
                                                                    childId: child.id,
                                                                    kindergartenId: kg.id,
                                                                    monthNum: curMonth,
                                                                    year: curYear
                                                                });
                                                            } else {
                                                                toast({
                                                                    title: language === 'ar' ? 'خطأ' : 'Erreur',
                                                                    description: language === 'ar' ? 'لم يتم العثور على معلومات الروضة' : 'Informations de jardin d\'enfants non trouvées',
                                                                    variant: 'destructive'
                                                                });
                                                            }
                                                        }}
                                                    >
                                                        <CreditCard className="w-4 h-4" />
                                                        {language === 'ar' ? 'دفع الآن' : 'Payer maintenant'}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                {/* Activities Feed */}
                <section>
                    <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        {t('parent.latestActivities')}
                    </h2>

                    {activities.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="py-8 text-center">
                                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">{t('parent.noActivities')}</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {activities.map((activity) => (
                                <Card key={activity.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                                                {getActivityIcon(activity.activity_type)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-semibold text-foreground">{activity.child_name}</span>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {getActivityLabel(activity.activity_type)}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                                                {activity.photo_url && (
                                                    <div className="mt-2 rounded-lg overflow-hidden">
                                                        <img src={activity.photo_url} alt="" className="w-full max-w-xs rounded-lg" />
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                {formatTime(activity.created_at)}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>

                {/* Quick Actions */}
                <section>
                    <h2 className="text-lg font-bold text-foreground mb-4">{t('parent.quickActions')}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50" onClick={() => navigate('/parent/notifications')}>
                            <CardContent className="p-4 text-center">
                                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-500/10 flex items-center justify-center">
                                    <Bell className="w-6 h-6 text-blue-500" />
                                </div>
                                <p className="text-sm font-medium">{t('parent.notifications')}</p>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50" onClick={() => navigate('/parent/photos')}>
                            <CardContent className="p-4 text-center">
                                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <Image className="w-6 h-6 text-green-500" />
                                </div>
                                <p className="text-sm font-medium">{t('parent.photos')}</p>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50" onClick={() => navigate('/parent/schedule')}>
                            <CardContent className="p-4 text-center">
                                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-purple-500/10 flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-purple-500" />
                                </div>
                                <p className="text-sm font-medium">{t('parent.schedule')}</p>
                            </CardContent>
                        </Card>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50" onClick={() => navigate('/parent/settings')}>
                            <CardContent className="p-4 text-center">
                                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-orange-500/10 flex items-center justify-center">
                                    <Settings className="w-6 h-6 text-orange-500" />
                                </div>
                                <p className="text-sm font-medium">{t('parent.settings')}</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </main>

            {activePayment && (
                <PaymentProcess
                    kindergarten={kindergartens.find(k => k.id === activePayment.kindergartenId)!}
                    bookingData={{
                        childName: activePayment.childName,
                        month: activePayment.month,
                        amount: activePayment.amount,
                        monthNum: activePayment.monthNum,
                        year: activePayment.year,
                        childId: activePayment.childId
                    }}
                    onComplete={() => setActivePayment(null)}
                    onSuccess={(txId) => handlePaymentSuccess(txId)}
                />
            )}

            {showPaymentRedirect && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="w-full max-w-lg shadow-2xl border-primary/20 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1.5 gradient-accent" />
                        <CardContent className="p-8 text-center space-y-6">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 scale-in animate-bounce-subtle">
                                <CreditCard className="w-10 h-10 text-primary" />
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-foreground">
                                    {language === 'ar' ? 'جاري تحويلك للدفع' : 'Redirection vers le paiement'}
                                </h3>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {language === 'ar' 
                                        ? 'تم تحويلك لصفحة الدفع لتفعيل خدمة المتابعة اليومية' 
                                        : 'Vous avez été redirigé vers la page de paiement pour activer le service de suivi quotidien'}
                                </p>
                            </div>

                            <div className="pt-4">
                                <Button 
                                    onClick={() => setShowPaymentRedirect(false)}
                                    className="w-full h-12 rounded-2xl font-bold text-lg shadow-soft hover:shadow-hover transition-all"
                                    variant="outline"
                                >
                                    {language === 'ar' ? 'إغلاق' : 'Fermer'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

        </div>
    );
};

export default ParentDashboard;
