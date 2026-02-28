import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Users, UserCheck, UserX, Clock, LogOut, Home,
    Building2, LayoutDashboard, Settings as SettingsIcon,
    Search, Filter, CheckCircle2, XCircle, Info, ChevronRight,
    TrendingUp, Baby, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import { Separator } from '@/components/ui/separator';
import { kindergartens as localKindergartens } from '@/data/kindergartens';

interface UserProfile {
    id: string;
    full_name: string | null;
    phone: string | null;
    created_at: string;
    status: string | null;
    email?: string;
    role?: string;
}

interface Kindergarten {
    id: string;
    name_ar: string;
    name_fr: string;
    address_ar: string;
    address_fr: string;
    municipality: string;
    municipality_ar: string;
    municipality_fr: string;
    owner_id?: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

// Adapter to convert local kindergarten data to admin format
function adaptKindergarten(kg: typeof localKindergartens[0]): Kindergarten {
    return {
        id: kg.id,
        name_ar: kg.nameAr,
        name_fr: kg.nameFr,
        address_ar: kg.addressAr,
        address_fr: kg.addressFr,
        municipality: kg.municipality,
        municipality_ar: kg.municipalityAr,
        municipality_fr: kg.municipalityFr,
        status: 'approved',
        created_at: new Date().toISOString(),
    };
}

interface RegistrationRequest {
    id: string;
    kindergarten_id: string;
    parent_name: string;
    phone: string;
    email: string | null;
    child_name: string;
    child_age: number;
    message: string | null;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    user_id?: string;
}

const AdminDashboard = () => {
    const { t, dir, language } = useLanguage();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [kindergartens, setKindergartens] = useState<Kindergarten[]>([]);
    const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalKindergartens: 0,
        pendingApprovals: 0,
        activeParents: 0,
        activeOwners: 0
    });

    useEffect(() => {
        const init = async () => {
            const hasAccess = await checkAdminAccess();
            if (hasAccess) {
                fetchData();
            }
        };
        init();
    }, []);

    const checkAdminAccess = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
            navigate('/admin-auth');
            return false;
        }

        const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .eq('role', 'admin')
            .single();

        if (!roleData) {
            const userEmail = session.user.email?.toLowerCase() || '';
            const adminEmails = ['bouchragh1268967@gmail.com'];
            const isAdminEmail = adminEmails.includes(userEmail);
            const hasAdminMetadata =
                session.user.user_metadata?.role === 'admin' ||
                session.user.app_metadata?.role === 'admin';

            if (!hasAdminMetadata && !isAdminEmail) {
                navigate('/admin-auth');
                return false;
            }
        }
        return true;
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch users/profiles
            const { data: profiles } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            // Fetch roles
            const { data: roles } = await supabase
                .from('user_roles')
                .select('user_id, role');

            // Load kindergartens from local data (not from DB - data is static)
            const adaptedKindergartens = localKindergartens.map(adaptKindergarten);

            // Fetch registration requests
            const { data: regData } = await supabase
                .from('registration_requests')
                .select('*')
                .order('created_at', { ascending: false });

            const usersWithRoles = (profiles || []).map(profile => ({
                ...profile,
                role: roles?.find(r => r.user_id === profile.id)?.role || 'parent'
            }));

            setUsers(usersWithRoles);
            setKindergartens(adaptedKindergartens);
            setRegistrationRequests((regData as unknown as RegistrationRequest[]) || []);

            const activeOwners = usersWithRoles.filter(u => u.role === 'owner').length;
            const activeParents = usersWithRoles.filter(u => u.role === 'parent').length;

            // Calculate stats
            setStats({
                totalUsers: usersWithRoles.length,
                totalKindergartens: adaptedKindergartens.length,
                pendingApprovals: 0,
                activeParents: activeParents,
                activeOwners: activeOwners
            });

        } catch (error) {
            console.error('Fetch error:', error);
            toast({
                title: t('common.error'),
                description: language === 'ar' ? 'حدث خطأ أثناء جلب البيانات' : 'Error fetching data',
                variant: 'destructive',
            });
        }
        setIsLoading(false);
    };

    const updateUserStatus = async (userId: string, status: 'approved' | 'rejected') => {
        const { error } = await supabase
            .from('profiles')
            .update({ status: status as any })
            .eq('id', userId);

        if (error) {
            toast({ title: t('common.error'), variant: 'destructive' });
            return;
        }

        toast({ title: t('common.updated') });
        fetchData();
    };

    const updateKGStatus = async (kgId: string, status: 'approved' | 'rejected') => {
        const { error } = await supabase
            .from('kindergartens')
            .update({ status: status as any })
            .eq('id', kgId);

        if (error) {
            toast({ title: t('common.error'), variant: 'destructive' });
            return;
        }

        toast({ title: t('common.updated') });
        fetchData();
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/auth');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Shield className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
                    <p className="mt-4 text-slate-400">{t('auth.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200" dir={dir}>
            {/* Sidebar / Topbar for Admin */}
            <header className="bg-slate-900/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-white leading-tight">Rawdati <span className="text-red-500">Admin</span></h1>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest">{language === 'ar' ? 'لوحة التحكم المركزية' : 'Central Control Panel'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <LanguageSelector />
                            <Separator orientation="vertical" className="h-6 bg-white/10" />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate('/')}
                                className="text-slate-400 hover:text-white hover:bg-white/5"
                            >
                                <Home className="w-5 h-5" />
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleLogout}
                                className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20"
                            >
                                <LogOut className="w-4 h-4 mx-2" />
                                {t('admin.logout')}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { label: t('admin.totalUsers'), value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { label: language === 'ar' ? 'الروضات' : 'Kindergartens', value: stats.totalKindergartens, icon: Building2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                        { label: language === 'ar' ? 'طلبات قيد الانتظار' : 'Pending Requests', value: stats.pendingApprovals, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                        { label: language === 'ar' ? 'أولياء الأمور' : 'Parents', value: stats.activeParents, icon: Baby, color: 'text-green-500', bg: 'bg-green-500/10' },
                    ].map((stat, i) => (
                        <Card key={i} className="bg-slate-900 border-white/5 overflow-hidden relative group hover:border-red-500/30 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                                        <h3 className="text-3xl font-bold mt-1 text-white">{stat.value}</h3>
                                    </div>
                                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-1 text-[10px] text-green-500 font-medium">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>+12% {language === 'ar' ? 'هذا الشهر' : 'this month'}</span>
                                </div>
                            </CardContent>
                            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent w-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Card>
                    ))}
                </div>

                <Tabs defaultValue="overview" className="space-y-6" dir={dir}>
                    <TabsList className="bg-slate-900 border border-white/5 p-1">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                            <LayoutDashboard className="w-4 h-4 mx-2" />
                            {language === 'ar' ? 'نظرة عامة' : 'Overview'}
                        </TabsTrigger>
                        <TabsTrigger value="kindergartens" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                            <Building2 className="w-4 h-4 mx-2" />
                            {language === 'ar' ? 'الروضات' : 'Kindergartens'}
                        </TabsTrigger>
                        <TabsTrigger value="registrations" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                            <Baby className="w-4 h-4 mx-2" />
                            {language === 'ar' ? 'طلبات التسجيل' : 'Registrations'}
                        </TabsTrigger>
                        <TabsTrigger value="users" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                            <Users className="w-4 h-4 mx-2" />
                            {language === 'ar' ? 'المستخدمين' : 'Users'}
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">
                            <SettingsIcon className="w-4 h-4 mx-2" />
                            {language === 'ar' ? 'الإعدادات' : 'Settings'}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="bg-slate-900 border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg">{language === 'ar' ? 'الطلبات الأخيرة' : 'Recent Activity'}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {kindergartens.slice(0, 5).map(kg => (
                                            <div key={kg.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                                                        <Building2 className="w-5 h-5 text-red-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-white">{language === 'ar' ? kg.name_ar : kg.name_fr}</p>
                                                        <p className="text-xs text-slate-400">{language === 'ar' ? kg.municipality_ar : kg.municipality_fr}</p>
                                                    </div>
                                                </div>
                                                <Badge variant={kg.status === 'approved' ? 'default' : 'secondary'} className={kg.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : ''}>
                                                    {kg.status === 'approved' ? (language === 'ar' ? 'موافق عليه' : 'Approved') :
                                                        kg.status === 'rejected' ? (language === 'ar' ? 'مرفوض' : 'Rejected') :
                                                            (language === 'ar' ? 'معلق' : 'Pending')}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="ghost" className="w-full mt-4 text-slate-400 text-xs hover:text-white" onClick={() => { }}>
                                        {language === 'ar' ? 'عرض الكل' : 'View All'}
                                        <ChevronRight className="w-3 h-3 mx-1" />
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-900 border-white/5">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg">{language === 'ar' ? 'توزع المستخدمين' : 'User Distribution'}</CardTitle>
                                </CardHeader>
                                <CardContent className="h-[300px] flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="relative w-40 h-40">
                                            <svg className="w-full h-full" viewBox="0 0 36 36">
                                                <path className="text-slate-800" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                                <path className="text-red-500" strokeDasharray={`${stats.totalUsers > 0 ? (stats.activeOwners / stats.totalUsers) * 100 : 0}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                                <span className="text-2xl font-bold text-white">{stats.totalUsers}</span>
                                                <span className="text-[10px] text-slate-400 uppercase tracking-tighter">{language === 'ar' ? 'مستخدم' : 'Users'}</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-xs">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                                {language === 'ar' ? 'أصحاب الروضات' : 'Owners'} ({stats.totalUsers > 0 ? Math.round((stats.activeOwners / stats.totalUsers) * 100) : 0}%)
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <div className="w-2 h-2 rounded-full bg-slate-700" />
                                                {language === 'ar' ? 'أولياء الأمور' : 'Parents'} ({stats.totalUsers > 0 ? Math.round((stats.activeParents / stats.totalUsers) * 100) : 0}%)
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="kindergartens">
                        <Card className="bg-slate-900 border-white/5">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-white">{language === 'ar' ? 'إدارة الروضات' : 'Manage Kindergartens'}</CardTitle>
                                    <CardDescription>{language === 'ar' ? 'مراجعة وتوثيق الروضات المسجلة' : 'Review and verify registered kindergartens'}</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <Input className="bg-slate-800 border-white/5 pl-9 w-64" placeholder={language === 'ar' ? 'بحث...' : 'Search...'} />
                                    </div>
                                    <Button variant="outline" size="icon" className="bg-slate-800 border-white/5"><Filter className="w-4 h-4" /></Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-white/5">
                                            <TableRow className="border-white/5">
                                                <TableHead className="text-slate-400">{language === 'ar' ? 'الاسم' : 'Name'}</TableHead>
                                                <TableHead className="text-slate-400">{language === 'ar' ? 'العنوان' : 'Address'}</TableHead>
                                                <TableHead className="text-slate-400">{language === 'ar' ? 'المدينة' : 'City'}</TableHead>
                                                <TableHead className="text-slate-400">{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                                                <TableHead className="text-slate-400 text-left">{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {kindergartens.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                                        {language === 'ar' ? 'لا توجد روضات' : 'No kindergartens found'}
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                kindergartens.map((kg) => (
                                                    <TableRow key={kg.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                                        <TableCell className="font-medium text-white">{language === 'ar' ? kg.name_ar : kg.name_fr}</TableCell>
                                                        <TableCell className="text-slate-400 text-sm max-w-[200px] truncate">{language === 'ar' ? kg.address_ar : kg.address_fr}</TableCell>
                                                        <TableCell className="text-slate-400">{language === 'ar' ? kg.municipality_ar : kg.municipality_fr}</TableCell>
                                                        <TableCell>
                                                            <Badge
                                                                className={
                                                                    kg.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                                        kg.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                                            'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                                }
                                                            >
                                                                {kg.status}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex gap-2">
                                                                {kg.status !== 'approved' && (
                                                                    <Button
                                                                        size="sm"
                                                                        className="bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white border-green-500/20"
                                                                        onClick={() => updateKGStatus(kg.id, 'approved')}
                                                                    >
                                                                        <CheckCircle2 className="w-4 h-4" />
                                                                    </Button>
                                                                )}
                                                                {kg.status !== 'rejected' && (
                                                                    <Button
                                                                        size="sm"
                                                                        className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20"
                                                                        onClick={() => updateKGStatus(kg.id, 'rejected')}
                                                                    >
                                                                        <XCircle className="w-4 h-4" />
                                                                    </Button>
                                                                )}
                                                                <Button size="sm" variant="ghost" className="text-slate-400"><Info className="w-4 h-4" /></Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="registrations">
                        <Card className="bg-slate-900 border-white/5">
                            <CardHeader>
                                <CardTitle className="text-white">{language === 'ar' ? 'طلبات تسجيل الأطفال' : 'Child Registration Requests'}</CardTitle>
                                <CardDescription>{language === 'ar' ? 'متابعة طلبات التسجيل المرسلة من الأولياء' : 'Monitor registration requests sent by parents'}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-white/5">
                                            <TableRow className="border-white/5">
                                                <TableHead className="text-slate-400">{language === 'ar' ? 'الطفل' : 'Child'}</TableHead>
                                                <TableHead className="text-slate-400">{language === 'ar' ? 'ولي الأمر' : 'Parent'}</TableHead>
                                                <TableHead className="text-slate-400">{language === 'ar' ? 'الروضة' : 'Kindergarten'}</TableHead>
                                                <TableHead className="text-slate-400">{language === 'ar' ? 'التوجيه' : 'Status'}</TableHead>
                                                <TableHead className="text-slate-400">{language === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {registrationRequests.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                                        {language === 'ar' ? 'لا توجد طلبات تسجيل' : 'No registration requests found'}
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                registrationRequests.map((reg) => {
                                                    const kg = kindergartens.find(k => k.id === reg.kindergarten_id);
                                                    return (
                                                        <TableRow key={reg.id} className="border-white/5 hover:bg-white/5 transition-colors">
                                                            <TableCell>
                                                                <div className="font-medium text-white">{reg.child_name}</div>
                                                                <div className="text-xs text-slate-500">{reg.child_age} {language === 'ar' ? 'سنوات' : 'years'}</div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-white">{reg.parent_name}</div>
                                                                <div className="text-xs text-slate-500">{reg.phone}</div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="text-white">{kindergartens.find(k => k.id === reg.kindergarten_id)?.[language === 'ar' ? 'name_ar' : 'name_fr'] || reg.kindergarten_id}</div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge
                                                                    className={
                                                                        reg.status === 'approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                                            reg.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                                                'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                                    }
                                                                >
                                                                    {reg.status}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-slate-400 text-sm">
                                                                {new Date(reg.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="users">
                        <Card className="bg-slate-900 border-white/5">
                            <CardHeader>
                                <CardTitle className="text-white">{language === 'ar' ? 'إدارة المستخدمين' : 'User Management'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {users.map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-red-500/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-white/10 uppercase">
                                                    {(user.full_name || 'U').charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">{user.full_name || 'Anonymous User'}</p>
                                                    <p className="text-xs text-slate-500">{user.phone || 'No phone provided'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">{language === 'ar' ? 'تاريخ الانضمام' : 'Joined Date'}</p>
                                                    <p className="text-xs text-slate-300">{new Date(user.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <Badge variant="outline" className="capitalize text-slate-400 border-white/10">{user.role}</Badge>

                                                {user.role === 'owner' && (
                                                    <div className="flex gap-1">
                                                        {user.status !== 'approved' && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-green-500 hover:text-green-400 hover:bg-green-500/10"
                                                                onClick={() => updateUserStatus(user.id, 'approved')}
                                                            >
                                                                <UserCheck className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                        {user.status !== 'rejected' && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                                                                onClick={() => updateUserStatus(user.id, 'rejected')}
                                                            >
                                                                <UserX className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                )}

                                                <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white"><ChevronRight className="w-5 h-5" /></Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings">
                        <Card className="bg-slate-900 border-white/5">
                            <CardHeader>
                                <CardTitle className="text-white">{language === 'ar' ? 'إعدادات المنصة' : 'Platform Settings'}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-red-500 uppercase tracking-widest">{language === 'ar' ? 'العامة' : 'General'}</h4>
                                        <div className="space-y-2">
                                            <Label>{language === 'ar' ? 'اسم المنصة' : 'Platform Name'}</Label>
                                            <Input className="bg-slate-800 border-white/5" defaultValue="Rawdati Connect" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>{language === 'ar' ? 'البريد الإلكتروني للدعم' : 'Support Email'}</Label>
                                            <Input className="bg-slate-800 border-white/5" defaultValue="support@rawdati.com" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-red-500 uppercase tracking-widest">{language === 'ar' ? 'الأمان' : 'Security'}</h4>
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div>
                                                <p className="text-sm font-medium text-white">{language === 'ar' ? 'توثيق الروضات' : 'Kindergarten Verification'}</p>
                                                <p className="text-xs text-slate-500">{language === 'ar' ? 'طلب الموافقة اليدوية لجميع الروضات الجديدة' : 'Require manual approval for all new kindergartens'}</p>
                                            </div>
                                            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
                                        </div>
                                    </div>
                                </div>
                                <Separator className="bg-white/5" />
                                <div className="flex justify-end">
                                    <Button className="bg-red-500 hover:bg-red-600 text-white px-8">
                                        {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
};

export default AdminDashboard;
