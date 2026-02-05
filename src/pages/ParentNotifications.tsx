import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby, Bell, ArrowRight, CheckCircle, Info, AlertTriangle, Calendar, MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

interface Notification {
    id: string;
    type: 'activity' | 'announcement' | 'reminder' | 'message';
    title: string;
    description: string;
    time: string;
    isRead: boolean;
    childName?: string;
    icon: 'activity' | 'announcement' | 'reminder' | 'message';
}

const ParentNotifications = () => {
    const { t, dir, language } = useLanguage();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
            navigate('/auth');
            return;
        }
        loadNotifications();
    };

    const loadNotifications = () => {
        // Demo notifications data
        const demoNotifications: Notification[] = [
            {
                id: '1',
                type: 'activity',
                title: language === 'ar' ? 'نشاط تعليمي جديد' : language === 'fr' ? 'Nouvelle activité éducative' : 'New Learning Activity',
                description: language === 'ar' ? 'أحمد تعلم الحروف الأبجدية اليوم وأظهر تقدماً ملحوظاً!' : language === 'fr' ? 'Ahmed a appris l\'alphabet aujourd\'hui et a montré des progrès remarquables!' : 'Ahmed learned the alphabet today and showed remarkable progress!',
                time: language === 'ar' ? 'منذ 30 دقيقة' : language === 'fr' ? 'Il y a 30 min' : '30 min ago',
                isRead: false,
                childName: language === 'ar' ? 'أحمد' : 'Ahmed',
                icon: 'activity'
            },
            {
                id: '2',
                type: 'announcement',
                title: language === 'ar' ? 'إعلان هام من الروضة' : language === 'fr' ? 'Annonce importante' : 'Important Announcement',
                description: language === 'ar' ? 'سيتم تنظيم رحلة ترفيهية يوم الأحد القادم. يرجى تحضير وجبة خفيفة لطفلك.' : language === 'fr' ? 'Une sortie récréative sera organisée dimanche prochain. Veuillez préparer une collation.' : 'A recreational trip will be organized next Sunday. Please prepare a snack for your child.',
                time: language === 'ar' ? 'منذ ساعة' : language === 'fr' ? 'Il y a 1 heure' : '1 hour ago',
                isRead: false,
                icon: 'announcement'
            },
            {
                id: '3',
                type: 'reminder',
                title: language === 'ar' ? 'تذكير بموعد الدفع' : language === 'fr' ? 'Rappel de paiement' : 'Payment Reminder',
                description: language === 'ar' ? 'يرجى تسديد رسوم الشهر القادم قبل تاريخ 10 فبراير.' : language === 'fr' ? 'Veuillez régler les frais du mois prochain avant le 10 février.' : 'Please pay next month\'s fees before February 10th.',
                time: language === 'ar' ? 'منذ ساعتين' : language === 'fr' ? 'Il y a 2 heures' : '2 hours ago',
                isRead: true,
                icon: 'reminder'
            },
            {
                id: '4',
                type: 'activity',
                title: language === 'ar' ? 'وقت اللعب' : language === 'fr' ? 'Temps de jeu' : 'Playtime',
                description: language === 'ar' ? 'سارة لعبت مع أصدقائها في الحديقة وقضت وقتاً ممتعاً.' : language === 'fr' ? 'Sara a joué avec ses amis dans le jardin et a passé un bon moment.' : 'Sara played with her friends in the garden and had a great time.',
                time: language === 'ar' ? 'منذ 3 ساعات' : language === 'fr' ? 'Il y a 3 heures' : '3 hours ago',
                isRead: true,
                childName: language === 'ar' ? 'سارة' : 'Sara',
                icon: 'activity'
            },
            {
                id: '5',
                type: 'message',
                title: language === 'ar' ? 'رسالة من المعلمة' : language === 'fr' ? 'Message de l\'enseignante' : 'Message from Teacher',
                description: language === 'ar' ? 'أود إعلامكم أن أحمد أظهر موهبة في الرسم. ننصح بتشجيعه في المنزل.' : language === 'fr' ? 'Je voudrais vous informer qu\'Ahmed a montré un talent pour le dessin. Nous vous conseillons de l\'encourager à la maison.' : 'I would like to inform you that Ahmed has shown a talent for drawing. We recommend encouraging him at home.',
                time: language === 'ar' ? 'أمس' : language === 'fr' ? 'Hier' : 'Yesterday',
                isRead: true,
                childName: language === 'ar' ? 'أحمد' : 'Ahmed',
                icon: 'message'
            },
            {
                id: '6',
                type: 'announcement',
                title: language === 'ar' ? 'عطلة نهاية الأسبوع' : language === 'fr' ? 'Congé de fin de semaine' : 'Weekend Holiday',
                description: language === 'ar' ? 'ستكون الروضة مغلقة يوم الخميس القادم بمناسبة العيد الوطني.' : language === 'fr' ? 'Le jardin d\'enfants sera fermé jeudi prochain à l\'occasion de la fête nationale.' : 'The kindergarten will be closed next Thursday for the national holiday.',
                time: language === 'ar' ? 'منذ يومين' : language === 'fr' ? 'Il y a 2 jours' : '2 days ago',
                isRead: true,
                icon: 'announcement'
            }
        ];
        setNotifications(demoNotifications);
        setIsLoading(false);
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'activity':
                return <Star className="w-5 h-5 text-yellow-500" />;
            case 'announcement':
                return <Info className="w-5 h-5 text-blue-500" />;
            case 'reminder':
                return <AlertTriangle className="w-5 h-5 text-orange-500" />;
            case 'message':
                return <MessageCircle className="w-5 h-5 text-green-500" />;
            default:
                return <Bell className="w-5 h-5 text-primary" />;
        }
    };

    const getNotificationBg = (type: string) => {
        switch (type) {
            case 'activity':
                return 'bg-yellow-500/10';
            case 'announcement':
                return 'bg-blue-500/10';
            case 'reminder':
                return 'bg-orange-500/10';
            case 'message':
                return 'bg-green-500/10';
            default:
                return 'bg-primary/10';
        }
    };

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const filteredNotifications = filter === 'unread'
        ? notifications.filter(n => !n.isRead)
        : notifications;

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Baby className="w-12 h-12 text-primary mx-auto animate-bounce" />
                    <p className="mt-4 text-muted-foreground">{t('auth.loading')}</p>
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
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate('/parent')}
                                className="rounded-full"
                            >
                                <ArrowRight className={`w-5 h-5 ${dir === 'ltr' ? 'rotate-180' : ''}`} />
                            </Button>
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Bell className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-foreground">{t('parent.notifications')}</h1>
                                <p className="text-xs text-muted-foreground">
                                    {unreadCount > 0
                                        ? (language === 'ar' ? `${unreadCount} إشعارات غير مقروءة` : language === 'fr' ? `${unreadCount} non lues` : `${unreadCount} unread`)
                                        : (language === 'ar' ? 'لا توجد إشعارات جديدة' : language === 'fr' ? 'Aucune nouvelle notification' : 'No new notifications')
                                    }
                                </p>
                            </div>
                        </div>
                        <LanguageSelector />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 space-y-6">
                {/* Filter Tabs */}
                <div className="flex items-center justify-between">
                    <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')} className="w-auto">
                        <TabsList className="grid grid-cols-2 w-[200px]">
                            <TabsTrigger value="all">
                                {language === 'ar' ? 'الكل' : language === 'fr' ? 'Toutes' : 'All'}
                            </TabsTrigger>
                            <TabsTrigger value="unread" className="relative">
                                {language === 'ar' ? 'غير مقروءة' : language === 'fr' ? 'Non lues' : 'Unread'}
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>

                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-primary">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            {language === 'ar' ? 'تحديد الكل كمقروء' : language === 'fr' ? 'Tout marquer comme lu' : 'Mark all as read'}
                        </Button>
                    )}
                </div>

                {/* Notifications List */}
                <div className="space-y-3">
                    {filteredNotifications.length === 0 ? (
                        <Card className="border-dashed">
                            <CardContent className="py-12 text-center">
                                <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                                <p className="text-muted-foreground text-lg">
                                    {language === 'ar' ? 'لا توجد إشعارات' : language === 'fr' ? 'Pas de notifications' : 'No notifications'}
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    {language === 'ar' ? 'ستظهر هنا الإشعارات الجديدة من الروضة' : language === 'fr' ? 'Les nouvelles notifications apparaîtront ici' : 'New notifications from kindergarten will appear here'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredNotifications.map((notification) => (
                            <Card
                                key={notification.id}
                                className={`transition-all duration-300 hover:shadow-lg cursor-pointer ${!notification.isRead ? 'border-primary/50 bg-primary/5' : ''}`}
                                onClick={() => markAsRead(notification.id)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-full ${getNotificationBg(notification.type)} flex items-center justify-center flex-shrink-0`}>
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className={`font-semibold text-foreground ${!notification.isRead ? 'text-primary' : ''}`}>
                                                        {notification.title}
                                                    </h3>
                                                    {notification.childName && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            {notification.childName}
                                                        </Badge>
                                                    )}
                                                    {!notification.isRead && (
                                                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {notification.time}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {notification.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default ParentNotifications;
