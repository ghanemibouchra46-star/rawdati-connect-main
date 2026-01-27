import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Baby, Mail, Lock, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

const AdminAuth = () => {
    const { t, dir } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
                        <CardTitle className="text-xl text-white">{t('admin.auth.title')}</CardTitle>
                        <CardDescription className="text-gray-400">
                            {t('admin.auth.desc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white shadow-lg"
                                disabled={isLoading}
                            >
                                {isLoading ? t('auth.loading') : t('auth.login')}
                            </Button>
                        </form>

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
