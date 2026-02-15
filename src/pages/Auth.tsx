import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Baby, Mail, Lock, User, ArrowRight, CheckCircle, Phone, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const Auth = () => {
  const { t, dir, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState(() => localStorage.getItem('resetEmail') || '');
  const [otp, setOtp] = useState('');
  const [resetStep, setResetStep] = useState<'input' | 'verify' | 'new_password'>('input');
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
      setShowForgotPassword(true);
      setResetStep('new_password');
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        if (session.user.email_confirmed_at) {
          navigate('/parent');
        }
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && session.user.email_confirmed_at) {
        navigate('/parent');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });

    if (error) {
      if (error.message === 'Email not confirmed') {
        setVerificationEmail(loginEmail);
        setShowVerification(true);
        toast({
          title: t('auth.confirmEmail'),
          description: t('auth.error.notConfirmed'),
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('common.error'),
          description: error.message === 'Invalid login credentials'
            ? t('auth.error.invalidLogin')
            : error.message,
          variant: 'destructive',
        });
      }
    } else if (data.user) {
      if (!data.user.email_confirmed_at) {
        setVerificationEmail(loginEmail);
        setShowVerification(true);
        toast({
          title: t('auth.confirmEmail'),
          description: t('auth.error.notConfirmed'),
          variant: 'destructive',
        });
      } else {
        toast({
          title: t('common.updated'),
          description: t('auth.welcome'),
        });
        navigate('/parent');
      }
    }

    setIsLoading(false);
  };

  const validateSignup = () => {
    if (!signupName.trim()) {
      toast({ title: t('common.error'), description: t('auth.error.nameRequired'), variant: 'destructive' });
      return false;
    }
    if (!signupPhone.trim()) {
      toast({ title: t('common.error'), description: t('auth.error.phoneRequired'), variant: 'destructive' });
      return false;
    }
    // Simple Algerian phone validation: 10 digits
    if (!/^\d{10}$/.test(signupPhone)) {
      toast({ title: t('common.error'), description: t('auth.error.phoneInvalid'), variant: 'destructive' });
      return false;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      toast({ title: t('common.error'), description: t('auth.error.emailInvalid'), variant: 'destructive' });
      return false;
    }
    if (signupPassword.length < 6) {
      toast({ title: t('common.error'), description: t('auth.passwordMin'), variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSignup()) return;

    setIsLoading(true);
    const redirectUrl = `${window.location.origin}/auth?verified=true`;

    const { data, error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: signupName,
          phone: signupPhone,
          role: 'parent',
        }
      }
    });

    if (error) {
      toast({
        title: t('common.error'),
        description: error.message === 'User already registered'
          ? t('auth.error.alreadyRegistered')
          : error.message,
        variant: 'destructive',
      });
    } else if (data.user) {
      // Profile and role are now handled by database trigger
      setVerificationEmail(signupEmail);
      setShowVerification(true);

      toast({
        title: t('auth.confirmEmail'),
        description: t('auth.confirmDesc') + ' ' + signupEmail,
      });
    }

    setIsLoading(false);
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: verificationEmail,
    });

    if (error) {
      toast({
        title: t('common.error'),
        description: t('auth.error.resendFailed'),
        variant: 'destructive',
      });
    } else {
      toast({
        title: t('common.updated'),
        description: t('auth.confirmDesc') + ' ' + verificationEmail,
      });
    }
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const contact = resetEmail.trim();
    if (!contact) {
      toast({ title: t('common.error'), description: t('auth.error.emailInvalid'), variant: 'destructive' });
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
      redirectTo: "http://localhost:8081/auth",
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

      localStorage.setItem('resetEmail', contact);
      setResetStep('verify');
      setOtp(''); // Clear any previous OTP
    }
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    const contact = resetEmail.trim();
    const { error } = await supabase.auth.resetPasswordForEmail(contact, {
      redirectTo: "http://localhost:8081/auth",
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
      console.error('OTP verification error:', error);
      toast({ title: t('common.error'), description: t('auth.invalidOtp'), variant: 'destructive' });
    } else {
      setResetStep('new_password');
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
      toast({ title: t('common.error'), description: t('auth.error.passwordMismatch'), variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
    } else {
      toast({ title: t('common.updated'), description: t('auth.passwordResetSuccess') });
      setShowForgotPassword(false);
      setResetStep('input');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('verified') === 'true') {
      toast({
        title: t('common.updated'),
        description: t('auth.verified'),
      });
    }
    if (params.get('reset') === 'true') {
      toast({
        title: t('common.updated'),
        description: t('auth.resetEmailSent'),
      });
    }
  }, [t]);

  if (showVerification) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4" dir={dir}>
        <div className="w-full max-w-md">
          <Card className="border-border/50 shadow-soft">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">{t('auth.confirmEmail')}</CardTitle>
              <CardDescription>
                {t('auth.confirmDesc')}
              </CardDescription>
              <p className="font-semibold text-primary mt-2" dir="ltr">{verificationEmail}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t('auth.openEmail')}
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleResendVerification}
                disabled={isLoading}
              >
                {isLoading ? t('auth.loading') : t('auth.resend')}
              </Button>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setShowVerification(false)}
              >
                {t('auth.backLogin')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4" dir={dir}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-2xl gradient-accent flex items-center justify-center shadow-soft group-hover:shadow-hover transition-all duration-300">
              <Baby className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex flex-col text-right">
              <span className="font-bold text-2xl text-foreground">{t('platform.name')}</span>
              <span className="text-sm text-muted-foreground">{t('mascara')}</span>
            </div>
          </Link>
        </div>

        <Card className="border-border/50 shadow-soft">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl">{t('auth.welcome')}</CardTitle>
            <CardDescription>
              {t('auth.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showForgotPassword && (
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
                  <TabsTrigger value="signup">{t('auth.signup')}</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">{t('auth.email')}</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="example@email.com"
                          className="pr-10"
                          dir="ltr"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">{t('auth.password')}</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pr-10"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-primary hover:underline transition-colors"
                      >
                        {t('auth.forgotPassword')}
                      </button>
                    </div>
                    <Button
                      type="submit"
                      className="w-full gradient-accent border-0 shadow-soft hover:shadow-hover"
                      disabled={isLoading}
                    >
                      {isLoading ? t('auth.loading') : t('auth.login')}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">{t('auth.fullName')}</Label>
                      <div className="relative">
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder=""
                          className="pr-10"
                          required
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-phone">{t('auth.phone')}</Label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-phone"
                          type="tel"
                          placeholder="0555123456"
                          className="pr-10"
                          dir="ltr"
                          required
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">{t('auth.email')}</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="example@email.com"
                          className="pr-10"
                          dir="ltr"
                          required
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">{t('auth.password')}</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pr-10"
                          required
                          minLength={6}
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">{t('auth.passwordMin')}</p>
                    </div>
                    <Button
                      type="submit"
                      className="w-full gradient-accent border-0 shadow-soft hover:shadow-hover"
                      disabled={isLoading}
                    >
                      {isLoading ? t('auth.loading') : t('auth.signup')}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}

            {showForgotPassword && (
              <div className="space-y-4 pt-4">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">{t('auth.resetPassword')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {resetStep === 'input' ? t('auth.resetPasswordDesc') :
                      resetStep === 'verify' ? t('auth.otpSent') :
                        t('auth.setNewPassword')}
                  </p>
                </div>

                {resetStep === 'input' && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">{t('auth.email')}</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="example@email.com"
                          className="pr-10"
                          dir="ltr"
                          required
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full gradient-accent border-0 shadow-soft hover:shadow-hover"
                      disabled={isLoading}
                    >
                      {isLoading ? t('auth.loading') : t('auth.sendResetLink')}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => setShowForgotPassword(false)}
                    >
                      {t('auth.backLogin')}
                    </Button>
                  </form>
                )}

                {resetStep === 'verify' && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-6 text-center">
                      <Mail className="w-10 h-10 text-primary mx-auto mb-4" />
                      <p className="text-sm text-foreground font-medium mb-2">
                        {t('auth.otpSent')}
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        {t('auth.otpPlaceholder')}
                      </p>
                      <Input
                        type="text"
                        placeholder="000000"
                        className="text-center text-2xl tracking-[1em] font-mono"
                        maxLength={6}
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || otp.length !== 6}
                    >
                      {isLoading ? t('auth.loading') : t('auth.verifyOtp')}
                    </Button>

                    <div className="flex flex-col gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full text-xs"
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
                        className="w-full text-xs"
                        onClick={() => setResetStep('input')}
                      >
                        {language === 'ar' ? 'تغيير البريد الإلكتروني' : 'Change Email'}
                      </Button>
                    </div>

                    <div className="mt-8 p-4 bg-muted/30 rounded-lg text-xs space-y-2 text-muted-foreground border border-dashed">
                      <p className="font-semibold text-foreground mb-1">
                        {language === 'ar' ? 'لم يصلك الرمز؟' : 'Didn\'t receive the code?'}
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>{language === 'ar' ? 'تأكد من مجلد الرسائل غير المرغوب فيها (Spam).' : 'Check your Spam/Junk folder.'}</li>
                        <li>{language === 'ar' ? 'تأكد من كتابة البريد الإلكتروني بشكل صحيح.' : 'Make sure the email is typed correctly.'}</li>
                        <li>{language === 'ar' ? 'يرجى الانتظار دقيقتين قبل المحاولة مرة أخرى.' : 'Please wait 2 minutes before retrying.'}</li>
                        <li>{language === 'ar' ? 'يمكنك نسخ الرمز الموجود في نهاية الرابط الذي يصلك.' : 'You can copy the code from the end of the link sent to you.'}</li>
                      </ul>
                    </div>
                  </form>
                )}

                {resetStep === 'new_password' && (
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">{t('auth.newPassword')}</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          className="pr-10"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">{t('auth.confirmNewPassword')}</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          className="pr-10"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full gradient-accent border-0 shadow-soft hover:shadow-hover"
                      disabled={isLoading}
                    >
                      {isLoading ? t('auth.loading') : t('auth.setNewPassword')}
                    </Button>
                  </form>
                )}
              </div>
            )}

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
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

export default Auth;
