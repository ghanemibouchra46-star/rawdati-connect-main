/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby, Bell, ArrowRight, CheckCircle, Info, AlertTriangle, Calendar, MessageCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSelector from '@/components/LanguageSelector';
import { useParentNotifications, useMarkNotificationRead } from '@/hooks/useWeeklySchedule';

interface Notification {
    id: string;
    type: string;
    title: string;
    description: string;
    time: string;
    isRead: boolean;
    childName?: string | null;
}

const ParentNotifications = () => {
    const { profile, loading: authLoading } = useAuth();
    const { t, dir, language } = useLanguage();
    const navigate = useNavigate();
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const { data: rawNotifications, isLoading: notificationsLoading } = useParentNotifications();
    const { mutate: markNotificationRead } = useMarkNotificationRead();

    useEffect(() => {
        if (!authLoading && !profile) {
            navigate('/auth');
        }
    }, [profile, authLoading, navigate]);

    const formatNotificationTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const diffSeconds = Math.floor((Date.now() - date.getTime()) / 1000);

        if (diffSeconds < 60) {
            return language === 'ar' ? 'قبل لحظات' : language === 'fr' ? 'Il y a quelques secondes' : 'just now';
        }
        if (diffSeconds < 3600) {
            const minutes = Math.floor(diffSeconds / 60);
            return language === 'ar'
                ? `قبل ${minutes} دقيقة`
                : language === 'fr'
                    ? `Il y a ${minutes} min`
                    : `${minutes} min ago`;
        }
        if (diffSeconds < 86400) {
            const hours = Math.floor(diffSeconds / 3600);
            return language === 'ar'
                ? `قبل ${hours} ساعة`
                : language === 'fr'
                    ? `Il y a ${hours} h`
                    : `${hours} hour${hours > 1 ? 's' : ''} ago`;
        }

        return date.toLocaleDateString(language === 'ar' ? 'ar-DZ' : language === 'fr' ? 'fr-FR' : 'en-US', {
            day: 'numeric',
            month: 'short'
        });
    };

    const notifications = useMemo(() => {
        return (rawNotifications || []).map((item: any) => ({
            id: item.id,
            type: item.type || 'info',
            title: item.title || item.message || '',
            description: item.message || '',
            time: item.created_at ? formatNotificationTime(item.created_at) : '',
            isRead: item.is_read ?? false,
            childName: item.child_name || null,
        })) as Notification[];
    }, [rawNotifications, formatNotificationTime]);

    const filteredNotifications = useMemo(
        () => (filter === 'unread' ? notifications.filter(n => !n.isRead) : notifications),
        [filter, notifications]
    );

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const markAsRead = (id: string) => {
        markNotificationRead(id);
    };

    const markAllAsRead = () => {
        notifications.filter(n => !n.isRead).forEach(n => markNotificationRead(n.id));
    };

    const isLoading = authLoading || notificationsLoading;

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

    const isPageLoading = authLoading || notificationsLoading;
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
                                        ? t('notif.unreadCount').replace('{count}', unreadCount.toString())
                                        : t('notif.noNew')
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
                                {t('common.all')}
                            </TabsTrigger>
                            <TabsTrigger value="unread" className="relative">
                                {t('notif.unread')}
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
                            {t('notif.markAllRead')}
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
                                    {t('notif.noNotifs')}
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    {t('notif.noNotifsDesc')}
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
    </div>
  );
};

export default ParentNotifications;