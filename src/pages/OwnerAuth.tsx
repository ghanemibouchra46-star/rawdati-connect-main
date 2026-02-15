import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, User, Phone, Info, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const OwnerAuth = () => {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState<'input' | 'verify' | 'new_password'>('input');
  const [resetEmail, setResetEmail] = useState(() => localStorage.getItem('ownerResetEmail') || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [resendTimer, setResendTimer] = useState(0);
  const [showPasswordToggle, setShowPasswordToggle] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupKindergartenName, setSignupKindergartenName] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          // Check if user has owner role
          setTimeout(() => {
            checkOwnerRole(session.user.id);
          }, 0);
        }
      }
    );

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkOwnerRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [searchParams, navigate]);

  const checkOwnerRole = async (userId: string) => {
    const { data, error } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: 'owner'
    });

    if (data === true) {
      navigate('/owner');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: 'خطأ',
        description: 'يرجى ملء جميع الحقول',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: 'خطأ في تسجيل الدخول',
          description: error.message === 'Invalid login credentials'
            ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            : error.message,
          variant: 'destructive',
        });
        return;
      }

      if (data.user) {
        // Check if user has owner role
        const { data: hasOwnerRole } = await supabase.rpc('has_role', {
          _user_id: data.user.id,
          _role: 'owner'
        });

        if (hasOwnerRole) {
          toast({
            title: 'مرحباً بك',
            description: 'تم تسجيل الدخول بنجاح',
          });
          navigate('/owner');
        } else {
          // Sign out if not an owner
          await supabase.auth.signOut();
          toast({
            title: 'غير مصرح',
            description: 'هذا الحساب غير مسجل كمدير روضة. يرجى التواصل مع الإدارة.',
            variant: 'destructive',
          });
        }
      }
    } catch (error: any) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({
        title: 'خطأ',
        description: 'يرجى إدخال البريد الإلكتروني',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: "http://localhost:8081/owner-auth",
      });

      if (error) {
        toast({
          title: 'خطأ',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'تم الإرسال',
          description: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
        });
        localStorage.setItem('ownerResetEmail', resetEmail);
        setResetStep('verify');
        setOtp('');
      }
    } catch (error) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: "http://localhost:8081/owner-auth",
      });

      if (error) {
        toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
      } else {
        toast({ title: t('common.updated'), description: t('auth.otpSent') });
        setResendTimer(60);
      }
    } catch (error) {
      toast({ title: t('common.error'), description: 'Error resending', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({ title: t('common.error'), description: t('auth.otpPlaceholder'), variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: resetEmail,
        token: otp,
        type: 'recovery',
      });

      if (error) {
        toast({ title: t('common.error'), description: t('auth.invalidOtp'), variant: 'destructive' });
      } else {
        setResetStep('new_password');
      }
    } catch (error) {
      toast({ title: t('common.error'), description: 'حدث خطأ غير متوقع', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({ title: 'خطأ', description: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'خطأ', description: 'كلمات المرور غير متطابقة', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'نجاح', description: 'تم تغيير كلمة المرور بنجاح' });
        setShowForgotPassword(false);
        setResetStep('input');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      toast({ title: 'خطأ', description: 'حدث خطأ غير متوقع', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signupName || !signupEmail || !signupPassword || !signupPhone || !signupKindergartenName) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill all fields',
        variant: 'destructive',
      });
      return;
    }

    if (signupPassword.length < 6) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: t('auth.passwordMin'),
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: signupName,
            phone: signupPhone,
            kindergarten_name: signupKindergartenName,
            role: 'owner',
          }
        }
      });

      if (error) {
        toast({
          title: language === 'ar' ? 'خطأ في إنشاء الحساب' : 'Signup Error',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      if (data.user) {
        setVerificationEmail(signupEmail);
        setShowVerification(true);
        toast({
          title: t('auth.confirmEmail'),
          description: t('auth.confirmDesc') + ' ' + signupEmail,
        });
      }
    } catch (error: any) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: 'حدث خطأ غير متوقع',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
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

  if (showVerification) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
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
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shadow-soft group-hover:shadow-hover transition-all duration-300">
              <Building2 className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div className="flex flex-col text-right">
              <span className="font-bold text-xl text-foreground leading-tight">روضتي</span>
              <span className="text-sm text-muted-foreground leading-tight">مساحة المديرين</span>
            </div>
          </Link>
        </div>

        <Card className="shadow-card border-border/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{t('nav.ownerLogin')}</CardTitle>
            <CardDescription>
              {!showForgotPassword ? t('auth.subtitle') : t('auth.resetPassword')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showForgotPassword ? (
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
                  <TabsTrigger value="signup">{t('auth.signup')}</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="example@email.com"
                          className="pr-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">كلمة المرور</Label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={showPasswordToggle ? "text" : "password"}
                          placeholder="••••••••"
                          className="pr-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                          dir="ltr"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswordToggle(!showPasswordToggle)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPasswordToggle ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-secondary hover:underline transition-colors"
                      >
                        هل نسيت كلمة السر؟
                      </button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>جاري تسجيل الدخول...</span>
                        </>
                      ) : (
                        <>
                          <span>دخول</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
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
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-kindergarten">{t('auth.kindergartenName')}</Label>
                      <div className="relative">
                        <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="signup-kindergarten"
                          type="text"
                          placeholder=""
                          className="pr-10"
                          required
                          value={signupKindergartenName}
                          onChange={(e) => setSignupKindergartenName(e.target.value)}
                          disabled={isLoading}
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
                          disabled={isLoading}
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
                          disabled={isLoading}
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
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{t('auth.loading')}</span>
                        </>
                      ) : (
                        <>
                          <span>{t('auth.signup')}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">
                    {resetStep === 'input' ? 'إعادة تعيين كلمة المرور' :
                      resetStep === 'verify' ? 'التحقق من الرمز' :
                        'تعيين كلمة مرور جديدة'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {resetStep === 'input' ? 'أدخل بريدك الإلكتروني لاستلام رمز إعادة تعيين كلمة المرور' :
                      resetStep === 'verify' ? 'أدخل الرمز المكون من 6 أرقام المرسل إلى بريدك' :
                        'أدخل كلمة المرور الجديدة'}
                  </p>
                </div>

                {resetStep === 'input' && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">البريد الإلكتروني</Label>
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
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>جاري الإرسال...</span>
                        </>
                      ) : (
                        <span>إرسال الرمز</span>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => setShowForgotPassword(false)}
                    >
                      العودة لتسجيل الدخول
                    </Button>
                  </form>
                )}

                {resetStep === 'verify' && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-6 text-center border border-border/50">
                      <Mail className="w-10 h-10 text-secondary mx-auto mb-4" />
                      <p className="text-sm font-medium mb-2">
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

                    <div className="mt-8 p-4 bg-muted/30 rounded-lg text-xs space-y-2 text-muted-foreground border border-dashed text-right" dir="rtl">
                      <p className="font-semibold text-foreground mb-1">
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

                {resetStep === 'new_password' && (
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
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
                      <Label htmlFor="confirm-password">تأكيد كلمة المرور الجديدة</Label>
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
                      className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>جاري التغيير...</span>
                        </>
                      ) : (
                        <span>حفظ كلمة المرور</span>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            )}

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>{t('auth.ownerSignupSubtitle')}</p>
            </div>

            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm text-primary hover:underline"
              >
                العودة للرئيسية
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OwnerAuth;
