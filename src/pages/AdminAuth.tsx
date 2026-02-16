import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Baby, Mail, Lock, Shield, ArrowRight, User, Phone, Eye, EyeOff } from 'lucide-react';
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
    const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'verify' | 'new_password'>('login');
    const [resetEmail, setResetEmail] = useState(() => localStorage.getItem('adminResetEmail') || '');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { toast } = useToast();
    const [resendTimer, setResendTimer] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    useEffect(() => {
        const isRecovery = searchParams.get('recovery') === 'true';
        if (isRecovery) {
            setMode('new_password');
        }
        checkAdminSession();
    }, [searchParams]);



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
            email: email.trim(),
            password: password.trim(),
        });

        if (error) {
            console.error('Admin login error:', error);
            if (error.message === 'Email not confirmed') {
                toast({
                    title: t('auth.confirmEmail'),
                    description: t('auth.error.notConfirmed'),
                    variant: 'destructive',
                });
            } else {
                const isInvalidCreds = error.message === 'Invalid login credentials';
                toast({
                    title: t('common.error'),
                    description: isInvalidCreds
                        ? `${t('auth.error.invalidLogin')} ${language === 'ar' ? '- تأكد من تأكيد البريد الإلكتروني في Supabase إذا لزم الأمر' : '- Verify email confirmation in Supabase if required'}`
                        : error.message,
                    variant: 'destructive',
                });
            }
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
                description: t('auth.success'),
            });

            // Explicitly navigate to admin dashboard
            setTimeout(() => {
                navigate('/admin');
            }, 100);
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

        // Create user with explicit admin role in metadata
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone,
                    role: 'admin',
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
            // Role is now handled by database trigger
            toast({
                title: language === 'ar' ? 'تم إنشاء الحساب!' : language === 'fr' ? 'Compte créé!' : 'Account Created!',
                description: language === 'ar' ? 'يرجى تأكيد بريدك الإلكتروني ثم تسجيل الدخول' : language === 'fr' ? 'Veuillez confirmer votre email puis vous connecter' : 'Please confirm your email then log in',
            });
            setMode('login');
            setPassword('');
        }

        setIsLoading(false);
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const contact = resetEmail.trim();
        if (!contact) {
            toast({
                title: t('common.error'),
                description: t('auth.error.emailInvalid'),
                variant: 'destructive'
            });
            return;
        }

        // Check if user is trying to use a phone number
        if (!contact.includes('@')) {
            toast({
                title: t('common.error'),
                description: t('auth.error.emailOnly'),
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);

        const { error } = await supabase.auth.resetPasswordForEmail(contact, {
            redirectTo: `${window.location.origin}/admin-auth`,
        });

        if (error) {
            console.error('Reset error:', error);
            toast({
                title: t('common.error'),
                description: error.message,
                variant: 'destructive',
            });
        } else {
            toast({
                title: t('common.updated'),
                description: t('auth.otpSent'),
            });

            // Secondary informative toast
            setTimeout(() => {
                toast({
                    title: t('nav.about'),
                    description: t('auth.error.checkSpam'),
                });
            }, 1000);

            localStorage.setItem('adminResetEmail', contact);
            setMode('verify');
            setOtp('');
        }
        setIsLoading(false);
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;

        setIsLoading(true);
        const contact = resetEmail.trim();
        const { error } = await supabase.auth.resetPasswordForEmail(contact, {
            redirectTo: `${window.location.origin}/admin-auth`,
        });

        if (error) {
            toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
        } else {
            toast({ title: t('common.updated'), description: t('auth.otpSent') });
            setResendTimer(60);
        }
        setIsLoading(false);
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            toast({ title: t('common.error'), description: t('auth.otpPlaceholder'), variant: 'destructive' });
            return;
        }

        setIsLoading(true);
        const { error } = await supabase.auth.verifyOtp({
            email: resetEmail,
            token: otp,
            type: 'recovery',
        });

        if (error) {
            console.error('Admin OTP verification error:', error);
            toast({ title: t('common.error'), description: t('auth.invalidOtp'), variant: 'destructive' });
        } else {
            setMode('new_password');
        }
        setIsLoading(false);
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            toast({ title: t('common.error'), description: t('auth.passwordMin'), variant: 'destructive' });
            return;
        }
        if (newPassword !== confirmPassword) {
            toast({ title: t('common.error'), description: language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match', variant: 'destructive' });
            return;
        }

        setIsLoading(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) {
            toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
        } else {
            toast({ title: t('common.updated'), description: t('auth.passwordResetSuccess') });
            setMode('login');
            setPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
        setIsLoading(false);
    };

    const getTitle = () => {
        switch (mode) {
            case 'forgot':
            case 'verify':
            case 'new_password':
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
                return language === 'ar' ? 'أدخل بريدك الإلكتروني لاستلام رمز إعادة تعيين كلمة المرور' : language === 'fr' ? 'Entrez votre email pour recevoir un code de réinitialisation' : 'Enter your email to receive a reset code';
            case 'verify':
                return t('auth.otpSent');
            case 'new_password':
                return t('auth.setNewPassword');
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
                                            placeholder="ghanemifatima4@gmail.com"
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
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="pr-10 bg-slate-700 border-slate-600 text-white"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
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

                        {mode === 'verify' && (
                            <form onSubmit={handleVerifyOtp} className="space-y-4">
                                <div className="bg-slate-700/50 rounded-lg p-6 text-center border border-slate-600">
                                    <Mail className="w-10 h-10 text-red-500 mx-auto mb-4" />
                                    <p className="text-sm text-gray-200 font-medium mb-2">
                                        {t('auth.otpSent')}
                                    </p>
                                    <p className="text-xs text-gray-400 mb-4">
                                        {t('auth.otpPlaceholder')}
                                    </p>
                                    <Input
                                        type="text"
                                        placeholder="000000"
                                        className="bg-slate-700 border-slate-600 text-white text-center text-2xl tracking-[1em] font-mono"
                                        maxLength={6}
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg"
                                    disabled={isLoading || otp.length !== 6}
                                >
                                    {isLoading ? t('auth.loading') : t('auth.verifyOtp')}
                                </Button>

                                <div className="flex flex-col gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full text-xs text-gray-400 hover:text-white"
                                        onClick={handleResendOtp}
                                        disabled={isLoading || resendTimer > 0}
                                    >
                                        {resendTimer > 0
                                            ? `${t('auth.resendCode')} (${resendTimer}s)`
                                            : t('auth.resendCode')}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full text-xs text-gray-400 hover:text-white"
                                        onClick={() => setMode('forgot')}
                                    >
                                        {language === 'ar' ? 'تغيير البريد الإلكتروني' : 'Change Email'}
                                    </Button>
                                </div>

                                <div className="mt-8 p-4 bg-slate-800/50 rounded-lg text-xs space-y-2 text-gray-400 border border-dashed border-slate-600 text-right" dir="rtl">
                                    <p className="font-semibold text-gray-200 mb-1">
                                        لم يصلك الرمز؟
                                    </p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>تأكد من مجلد الرسائل غير المرغوب فيها (Spam).</li>
                                        <li>تأكد من كتابة البريد الإلكتروني بشكل صحيح.</li>
                                        <li>يرجى الانتظار دقيقتين قبل المحاولة مرة أخرى.</li>
                                        <li>يمكنك نسخ الرمز الموجود في نهاية الرابط الذي يصلك.</li>
                                    </ul>
                                </div>
                            </form>
                        )}

                        {mode === 'new_password' && (
                            <form onSubmit={handleUpdatePassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="new-password" className="text-gray-300">{t('auth.newPassword')}</Label>
                                    <div className="relative">
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <Input
                                            id="new-password"
                                            type={showNewPassword ? "text" : "password"}
                                            className="pr-10 bg-slate-700 border-slate-600 text-white"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                        >
                                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password" className="text-gray-300">{t('auth.confirmNewPassword')}</Label>
                                    <div className="relative">
                                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <Input
                                            id="confirm-password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            className="pr-10 bg-slate-700 border-slate-600 text-white"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? t('auth.loading') : t('auth.setNewPassword')}
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


