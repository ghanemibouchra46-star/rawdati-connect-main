import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Baby, LogOut, Home, Bell, User, Calendar, Clock, Image, Settings, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import { kindergartens } from '@/data/kindergartens';

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

const ParentDashboard = () => {
    const { t, dir, language } = useLanguage();
    const [children, setChildren] = useState<Child[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [profile, setProfile] = useState<{ full_name: string; phone: string } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
            navigate('/auth');
            return;
        }

        const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, phone')
            .eq('id', session.user.id)
            .single();

        if (profileData) {
            setProfile(profileData);
        }

        const { data: registrationData } = await supabase
            .from('registration_requests')
            .select('*')
            .eq('user_id', session.user.id);

        if (registrationData) {
            const mappedChildren = registrationData.map(reg => {
                const kg = kindergartens.find(k => k.id === reg.kindergarten_id);
                return {
                    id: reg.id,
                    name: reg.child_name,
                    age: reg.child_age,
                    photo_url: null,
                    kindergarten_name: language === 'ar' ? (kg?.nameAr || reg.kindergarten_id) : (kg?.nameFr || reg.kindergarten_id),
                    status: reg.status
                };
            });
            setChildren(mappedChildren);
        } else {
            setChildren([]);
        }

        setActivities([]); // Set to empty as we don't have a real activities table yet

        setIsLoading(false);
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            // Using window.location.href for a hard redirect to ensure session is cleared
            window.location.href = '/auth';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '/auth';
        }
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'learning':
                return '📚';
            case 'play':
                return '🎮';
            case 'meal':
                return '🍽️';
            case 'nap':
                return '😴';
            default:
                return '📌';
        }
    };

    const getActivityLabel = (type: string) => {
        switch (type) {
            case 'learning':
                return t('parent.activity.learning');
            case 'play':
                return t('parent.activity.play');
            case 'meal':
                return t('parent.activity.meal');
            case 'nap':
                return t('parent.activity.nap');
            default:
                return t('parent.activity.other');
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString(language === 'ar' ? 'ar-DZ' : 'fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

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
                            <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                                <Baby className="w-5 h-5 text-primary-foreground" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-foreground">{t('parent.welcome')} {profile?.full_name?.split(' ')[0]}</h1>
                                <p className="text-xs text-muted-foreground">{t('parent.title')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <LanguageSelector />
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">3</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                                <Home className="w-5 h-5" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-500 hover:text-red-600">
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 space-y-6">
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
        </div>
    );
};

export default ParentDashboard;
