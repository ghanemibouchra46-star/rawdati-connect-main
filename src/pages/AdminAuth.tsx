import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Baby, Mail, Lock, Shield, ArrowRight, User, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

const AdminAuth = () => {
    const { t, dir, language } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
    const [resetEmail, setResetEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        checkAdminSession();
    }, []);

    const checkAdminSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            // Check if user is admin
            const { data: roleData } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', session.user.id)
                .eq('role', 'admin')
                .single();

            if (roleData) {
                navigate('/admin');
            }
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast({
                title: t('common.error'),
                description: error.message === 'Invalid login credentials'
                    ? t('auth.error.invalidLogin')
                    : error.message,
                variant: 'destructive',
            });
            setIsLoading(false);
            return;
        }

        if (data.user) {
            // Check if user has admin role
            const { data: roleData, error: roleError } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', data.user.id)
                .eq('role', 'admin')
                .single();

            if (roleError || !roleData) {
                await supabase.auth.signOut();
                toast({
                    title: t('common.error'),
                    description: t('auth.error.notAdmin'),
                    variant: 'destructive',
                });
                setIsLoading(false);
                return;
            }

            toast({
                title: t('auth.welcome'),
                description: t('common.updated'),
            });
            navigate('/admin');
        }

        setIsLoading(false);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName.trim()) {
            toast({ title: t('common.error'), description: t('auth.error.nameRequired'), variant: 'destructive' });
            return;
        }
        if (!phone.trim() || phone.length < 10) {
            toast({ title: t('common.error'), description: t('auth.error.phoneInvalid'), variant: 'destructive' });
            return;
        }
        if (password.length < 6) {
            toast({ title: t('common.error'), description: t('auth.passwordMin'), variant: 'destructive' });
            return;
        }

        setIsLoading(true);

        // Create user
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone,
                }
            }
        });

        if (error) {
            toast({
                title: t('common.error'),
                description: error.message,
                variant: 'destructive',
            });
            setIsLoading(false);
            return;
        }

        if (data.user) {
            // Sign in immediately to get an authenticated session
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                // If email confirmation is required
                toast({
                    title: language === 'ar' ? 'تم إنشاء الحساب!' : language === 'fr' ? 'Compte créé!' : 'Account Created!',
                    description: language === 'ar' ? 'يرجى تأكيد بريدك الإلكتروني ثم تسجيل الدخول' : language === 'fr' ? 'Veuillez confirmer votre email puis vous connecter' : 'Please confirm your email then log in',
                });
                setMode('login');
                setPassword('');
                setIsLoading(false);
                return;
            }

            // Create profile with authenticated session
            const { error: profileError } = await supabase.from('profiles').upsert({
                id: data.user.id,
                full_name: fullName,
                phone: phone,
            });

            // Add admin role with authenticated session
            const { error: roleError } = await supabase.from('user_roles').insert({
                user_id: data.user.id,
                role: 'admin',
            });

            if (roleError) {
                console.error('Role insert error:', roleError);
                // Sign out if role assignment failed
                await supabase.auth.signOut();
                toast({
                    title: t('common.error'),
                    description: language === 'ar' ? 'فشل في إضافة صلاحيات الأدمين. تواصل مع المسؤول.' : language === 'fr' ? 'Échec de l\'ajout des droits admin. Contactez l\'administrateur.' : 'Failed to add admin rights. Contact administrator.',
                    variant: 'destructive',
                });
                setIsLoading(false);
                return;
            }

            toast({
                title: language === 'ar' ? 'تم إنشاء الحساب!' : language === 'fr' ? 'Compte créé!' : 'Account Created!',
                description: language === 'ar' ? 'مرحباً بك في لوحة التحكم' : language === 'fr' ? 'Bienvenue dans le tableau de bord' : 'Welcome to the dashboard',
            });
            navigate('/admin');
        }

        setIsLoading(false);
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetEmail.trim()) {
            toast({
                title: t('common.error'),
                description: t('auth.error.emailInvalid'),
                variant: 'destructive'
            });
            return;
        }

        setIsLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
            redirectTo: `${window.location.origin}/admin-auth?reset=true`,
        });

        if (error) {
            toast({
                title: t('common.error'),
                description: error.message,
                variant: 'destructive',
            });
        } else {
            toast({
                title: t('common.updated'),
                description: t('auth.resetEmailSent'),
            });
            setMode('login');
            setResetEmail('');
        }
        setIsLoading(false);
    };

    const getTitle = () => {
        switch (mode) {
            case 'signup':
                return language === 'ar' ? 'إنشاء حساب أدمين' : language === 'fr' ? 'Créer un compte admin' : 'Create Admin Account';
            case 'forgot':
                return language === 'ar' ? 'استعادة كلمة المرور' : language === 'fr' ? 'Récupérer le mot de passe' : 'Reset Password';
            default:
                return t('admin.auth.title');
        }
    };

    const getDescription = () => {
        switch (mode) {
            case 'signup':
                return language === 'ar' ? 'أدخل بياناتك لإنشاء حساب جديد' : language === 'fr' ? 'Entrez vos informations pour créer un nouveau compte' : 'Enter your details to create a new account';
            case 'forgot':
                return language === 'ar' ? 'أدخل بريدك الإلكتروني لاستلام رابط إعادة تعيين كلمة المرور' : language === 'fr' ? 'Entrez votre email pour recevoir un lien de réinitialisation' : 'Enter your email to receive a reset link';
            default:
                return t('admin.auth.desc');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4" dir={dir}>
            <div className="absolute top-4 right-4">
                <LanguageSelector />
            </div>
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-3 group">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300">
                            <Shield className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex flex-col text-right">
                            <span className="font-bold text-2xl text-white">{t('admin.title')}</span>
                            <span className="text-sm text-gray-400">{t('admin.subtitle')}</span>
                        </div>
                    </Link>
                </div>

                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-xl text-white">{getTitle()}</CardTitle>
                        <CardDescription className="text-gray-400">{getDescription()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {mode === 'login' && (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-300">{t('auth.email')}</Label>
                                    <div className="relative">
                                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="admin@rawdati.com"
                                            className="pr-10 bg-slate-700 border-slate-600 text-white placeholder:text-gray-500"
                                            dir="ltr"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-gray-300">{t('auth.password')}</Label>
                                    <div className="relative">
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pr-10 bg-slate-700 border-slate-600 text-white"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setMode('forgot')}
                                        className="text-sm text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        {t('auth.forgotPassword')}
                                    </button>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? t('auth.loading') : t('auth.login')}
                                </Button>
                                <div className="text-center pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setMode('signup')}
                                        className="text-sm text-gray-400 hover:text-white transition-colors"
                                    >
                                        {language === 'ar' ? 'ليس لديك حساب؟ أنشئ حساب جديد' : language === 'fr' ? 'Pas de compte? Créer un nouveau' : "Don't have an account? Create one"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {mode === 'signup' && (
                            <form onSubmit={handleSignup} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-gray-300">{t('auth.fullName')}</Label>
                                    <div className="relative">
                                        <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <Input
                                            id="fullName"
                                            type="text"
                                            placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                                            className="pr-10 bg-slate-700 border-slate-600 text-white placeholder:text-gray-500"
                                            required
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-gray-300">{t('auth.phone')}</Label>
                                    <div className="relative">
                                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="0555123456"
                                            className="pr-10 bg-slate-700 border-slate-600 text-white placeholder:text-gray-500"
                                            dir="ltr"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-email" className="text-gray-300">{t('auth.email')}</Label>
                                    <div className="relative">
                                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            placeholder="admin@rawdati.com"
                                            className="pr-10 bg-slate-700 border-slate-600 text-white placeholder:text-gray-500"
                                            dir="ltr"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="signup-password" className="text-gray-300">{t('auth.password')}</Label>
                                    <div className="relative">
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <Input
                                            id="signup-password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pr-10 bg-slate-700 border-slate-600 text-white"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500">{t('auth.passwordMin')}</p>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? t('auth.loading') : (language === 'ar' ? 'إنشاء الحساب' : language === 'fr' ? 'Créer le compte' : 'Create Account')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full text-gray-400 hover:text-white"
                                    onClick={() => setMode('login')}
                                >
                                    {t('auth.backLogin')}
                                </Button>
                            </form>
                        )}

                        {mode === 'forgot' && (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="reset-email" className="text-gray-300">{t('auth.email')}</Label>
                                    <div className="relative">
                                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <Input
                                            id="reset-email"
                                            type="email"
                                            placeholder="admin@rawdati.com"
                                            className="pr-10 bg-slate-700 border-slate-600 text-white placeholder:text-gray-500"
                                            dir="ltr"
                                            required
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? t('auth.loading') : t('auth.sendResetLink')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full text-gray-400 hover:text-white"
                                    onClick={() => setMode('login')}
                                >
                                    {t('auth.backLogin')}
                                </Button>
                            </form>
                        )}

                        <div className="mt-6 text-center">
                            <Link
                                to="/"
                                className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1"
                            >
                                <ArrowRight className="w-4 h-4" />
                                {t('auth.backHome')}
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminAuth;


