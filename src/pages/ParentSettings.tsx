import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Baby, Settings, ArrowRight, User, Phone, Mail, Bell, Globe, Moon, Sun, Shield, LogOut, Camera, Check, Save, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage, Language } from '@/contexts/LanguageContext';

const ParentSettings = () => {
    const { t, dir, language, setLanguage } = useLanguage();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Password change
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Profile
    const [profile, setProfile] = useState({
        fullName: '',
        phone: '',
        email: ''
    });

    // Notification Settings
    const [notifications, setNotifications] = useState({
        activities: true,
        announcements: true,
        reminders: true,
        messages: true
    });

    // Appearance
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
            navigate('/auth');
            return;
        }
        loadProfile(session.user.id, session.user.email || '');
    };

    const loadProfile = async (userId: string, email: string) => {
        const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name, phone')
            .eq('id', userId)
            .single();

        if (profileData) {
            setProfile({
                fullName: profileData.full_name || '',
                phone: profileData.phone || '',
                email: email
            });
        }
        setIsLoading(false);
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: profile.fullName,
                    phone: profile.phone
                })
                .eq('id', session.user.id);

            if (error) {
                toast({
                    title: t('common.error'),
                    description: language === 'ar' ? 'حدث خطأ أثناء الحفظ' : language === 'fr' ? 'Erreur lors de la sauvegarde' : 'Error while saving',
                    variant: 'destructive'
                });
            } else {
                toast({
                    title: t('common.updated'),
                    description: language === 'ar' ? 'تم حفظ التغييرات بنجاح' : language === 'fr' ? 'Modifications enregistrées' : 'Changes saved successfully'
                });
            }
        }
        setIsSaving(false);
    };

    const handleChangePassword = async () => {
        // Validate passwords
        if (newPassword.length < 6) {
            toast({
                title: t('common.error'),
                description: t('auth.passwordMin'),
                variant: 'destructive'
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast({
                title: t('common.error'),
                description: language === 'ar' ? 'كلمة المرور غير متطابقة' : language === 'fr' ? 'Les mots de passe ne correspondent pas' : 'Passwords do not match',
                variant: 'destructive'
            });
            return;
        }

        setIsChangingPassword(true);

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            toast({
                title: t('common.error'),
                description: language === 'ar' ? 'فشل تغيير كلمة المرور' : language === 'fr' ? 'Échec du changement de mot de passe' : 'Failed to change password',
                variant: 'destructive'
            });
        } else {
            toast({
                title: t('common.updated'),
                description: language === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : language === 'fr' ? 'Mot de passe modifié avec succès' : 'Password changed successfully'
            });
            setShowPasswordDialog(false);
            setNewPassword('');
            setConfirmPassword('');
        }

        setIsChangingPassword(false);
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            window.location.href = '/auth';
        } catch (error) {
            console.error('Logout error:', error);
            window.location.href = '/auth';
        }
    };

    const languages: { code: Language; name: string; flag: string }[] = [
        { code: 'ar', name: 'العربية', flag: '🇩🇿' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'en', name: 'English', flag: '🇬🇧' }
    ];

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
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                <Settings className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-foreground">{t('parent.settings')}</h1>
                                <p className="text-xs text-muted-foreground">
                                    {language === 'ar' ? 'إدارة حسابك' : language === 'fr' ? 'Gérer votre compte' : 'Manage your account'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 space-y-6 max-w-2xl">
                {/* Profile Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            {language === 'ar' ? 'الملف الشخصي' : language === 'fr' ? 'Profil' : 'Profile'}
                        </CardTitle>
                        <CardDescription>
                            {language === 'ar' ? 'إدارة معلوماتك الشخصية' : language === 'fr' ? 'Gérer vos informations personnelles' : 'Manage your personal information'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Avatar */}
                        <div className="flex items-center gap-4">
                            <Avatar className="w-20 h-20 border-2 border-primary/20">
                                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                                    {profile.fullName.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Camera className="w-4 h-4" />
                                {language === 'ar' ? 'تغيير الصورة' : language === 'fr' ? 'Changer la photo' : 'Change Photo'}
                            </Button>
                        </div>

                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    {t('auth.fullName')}
                                </Label>
                                <Input
                                    id="fullName"
                                    value={profile.fullName}
                                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                    placeholder={language === 'ar' ? 'الاسم الكامل' : language === 'fr' ? 'Nom complet' : 'Full Name'}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    {t('auth.phone')}
                                </Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    dir="ltr"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                    placeholder="0555123456"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                    {t('auth.email')}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    dir="ltr"
                                    value={profile.email}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">
                                    {language === 'ar' ? 'لا يمكن تغيير البريد الإلكتروني' : language === 'fr' ? 'L\'email ne peut pas être modifié' : 'Email cannot be changed'}
                                </p>
                            </div>
                        </div>

                        <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {language === 'ar' ? 'جاري الحفظ...' : language === 'fr' ? 'Enregistrement...' : 'Saving...'}
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    {t('common.save')}
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Notifications Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary" />
                            {language === 'ar' ? 'الإشعارات' : language === 'fr' ? 'Notifications' : 'Notifications'}
                        </CardTitle>
                        <CardDescription>
                            {language === 'ar' ? 'تحكم في الإشعارات التي تصلك' : language === 'fr' ? 'Contrôlez les notifications que vous recevez' : 'Control notifications you receive'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{language === 'ar' ? 'نشاطات الطفل' : language === 'fr' ? 'Activités de l\'enfant' : 'Child Activities'}</Label>
                                <p className="text-sm text-muted-foreground">
                                    {language === 'ar' ? 'تلقي إشعارات عن أنشطة طفلك' : language === 'fr' ? 'Recevoir des notifications sur les activités' : 'Get notified about activities'}
                                </p>
                            </div>
                            <Switch
                                checked={notifications.activities}
                                onCheckedChange={(checked) => setNotifications({ ...notifications, activities: checked })}
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{language === 'ar' ? 'الإعلانات' : language === 'fr' ? 'Annonces' : 'Announcements'}</Label>
                                <p className="text-sm text-muted-foreground">
                                    {language === 'ar' ? 'تلقي إعلانات الروضة' : language === 'fr' ? 'Recevoir les annonces du jardin' : 'Get kindergarten announcements'}
                                </p>
                            </div>
                            <Switch
                                checked={notifications.announcements}
                                onCheckedChange={(checked) => setNotifications({ ...notifications, announcements: checked })}
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{language === 'ar' ? 'التذكيرات' : language === 'fr' ? 'Rappels' : 'Reminders'}</Label>
                                <p className="text-sm text-muted-foreground">
                                    {language === 'ar' ? 'تذكيرات الدفع والمواعيد' : language === 'fr' ? 'Rappels de paiement et rendez-vous' : 'Payment and appointment reminders'}
                                </p>
                            </div>
                            <Switch
                                checked={notifications.reminders}
                                onCheckedChange={(checked) => setNotifications({ ...notifications, reminders: checked })}
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{language === 'ar' ? 'رسائل المعلمات' : language === 'fr' ? 'Messages des enseignantes' : 'Teacher Messages'}</Label>
                                <p className="text-sm text-muted-foreground">
                                    {language === 'ar' ? 'رسائل مباشرة من المعلمات' : language === 'fr' ? 'Messages directs des enseignantes' : 'Direct messages from teachers'}
                                </p>
                            </div>
                            <Switch
                                checked={notifications.messages}
                                onCheckedChange={(checked) => setNotifications({ ...notifications, messages: checked })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Language Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-primary" />
                            {language === 'ar' ? 'اللغة' : language === 'fr' ? 'Langue' : 'Language'}
                        </CardTitle>
                        <CardDescription>
                            {language === 'ar' ? 'اختر لغة التطبيق' : language === 'fr' ? 'Choisissez la langue de l\'application' : 'Choose app language'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-3">
                            {languages.map((lang) => (
                                <Button
                                    key={lang.code}
                                    variant={language === lang.code ? "default" : "outline"}
                                    className="h-auto py-4 flex-col gap-2"
                                    onClick={() => setLanguage(lang.code)}
                                >
                                    <span className="text-2xl">{lang.flag}</span>
                                    <span className="text-sm">{lang.name}</span>
                                    {language === lang.code && (
                                        <Check className="w-4 h-4" />
                                    )}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Security Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            {language === 'ar' ? 'الأمان' : language === 'fr' ? 'Sécurité' : 'Security'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-2"
                            onClick={() => setShowPasswordDialog(true)}
                        >
                            <Lock className="w-4 h-4" />
                            {language === 'ar' ? 'تغيير كلمة المرور' : language === 'fr' ? 'Changer le mot de passe' : 'Change Password'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Logout Button */}
                <Button
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4" />
                    {language === 'ar' ? 'تسجيل الخروج' : language === 'fr' ? 'Déconnexion' : 'Logout'}
                </Button>

                {/* App Version */}
                <p className="text-center text-xs text-muted-foreground py-4">
                    {language === 'ar' ? 'روضتي - الإصدار' : language === 'fr' ? 'Rawdati - Version' : 'Rawdati - Version'} 1.0.0
                </p>
            </main>

            {/* Password Change Dialog */}
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogContent className="sm:max-w-md" dir={dir}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Lock className="w-5 h-5 text-primary" />
                            {language === 'ar' ? 'تغيير كلمة المرور' : language === 'fr' ? 'Changer le mot de passe' : 'Change Password'}
                        </DialogTitle>
                        <DialogDescription>
                            {language === 'ar' ? 'أدخل كلمة المرور الجديدة' : language === 'fr' ? 'Entrez votre nouveau mot de passe' : 'Enter your new password'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">
                                {language === 'ar' ? 'كلمة المرور الجديدة' : language === 'fr' ? 'Nouveau mot de passe' : 'New Password'}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">{t('auth.passwordMin')}</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                {language === 'ar' ? 'تأكيد كلمة المرور' : language === 'fr' ? 'Confirmer le mot de passe' : 'Confirm Password'}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="pr-10"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowPasswordDialog(false);
                                setNewPassword('');
                                setConfirmPassword('');
                            }}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            onClick={handleChangePassword}
                            disabled={isChangingPassword || !newPassword || !confirmPassword}
                            className="gap-2"
                        >
                            {isChangingPassword ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {language === 'ar' ? 'جاري التغيير...' : language === 'fr' ? 'Modification...' : 'Changing...'}
                                </>
                            ) : (
                                <>
                                    <Check className="w-4 h-4" />
                                    {language === 'ar' ? 'تغيير' : language === 'fr' ? 'Changer' : 'Change'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ParentSettings;

