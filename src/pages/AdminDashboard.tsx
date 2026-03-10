import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield, Users, UserCheck, UserX, Clock, LogOut, Home,
    Building2, LayoutDashboard, Settings as SettingsIcon,
    Search, Filter, CheckCircle2, XCircle, Info, ChevronRight,
    TrendingUp, Baby, Star, CreditCard, Calendar, Check, X, MapPin
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
    updated_at: string;
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

const mockRegistrations: RegistrationRequest[] = [];

// Adapter to convert local kindergarten data to admin format
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function adaptKindergarten(kg: any): Kindergarten {
    return {
        id: kg.id,
        name_ar: kg.name_ar,
        name_fr: kg.nameFr,
        address_ar: kg.address_ar,
        address_fr: kg.addressFr,
        municipality: kg.municipality,
        municipality_ar: kg.municipality_ar,
        municipality_fr: kg.municipalityFr,
        status: 'approved',
        created_at: kg.created_at || new Date().toISOString(),
    };
}

const AdminDashboard = () => {
    const { t, dir, language } = useLanguage();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [kindergartens, setKindergartens] = useState<Kindergarten[]>(localKindergartens.map(adaptKindergarten));
    const [registrationRequests, setRegistrationRequests] = useState<RegistrationRequest[]>(mockRegistrations);
    const [localMockRegs, setLocalMockRegs] = useState<RegistrationRequest[]>(mockRegistrations);
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalKindergartens: localKindergartens.length,
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const checkAdminAccess = async () => {
        let { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
            // إعادة محاولة مرة واحدة (قد تكون الجلسة لم تُحفظ بعد بعد تسجيل الدخول)
            await new Promise((r) => setTimeout(r, 200));
            const retry = await supabase.auth.getSession();
            session = retry.data.session;
        }
        if (!session?.user) {
            navigate('/admin-auth', { replace: true });
            return false;
        }

        const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .eq('role', 'admin')
            .single();

        const userEmail = session.user.email?.toLowerCase() || '';
        const adminEmails = ['bouchragh1268967@gmail.com', 'ghanemifatima4@gmail.com', 'ghanemibouchra46@gmail.com'];
        const isAdminEmail = adminEmails.includes(userEmail);
        const hasAdminMetadata =
            session.user.user_metadata?.role === 'admin' ||
            session.user.app_metadata?.role === 'admin';

        if (!roleData && !isAdminEmail && !hasAdminMetadata) {
            navigate('/admin-auth?error=not_admin', { replace: true });
            return false;
        }

        // التأكد من وجود سطر الأدمن في user_roles حتى تسمح RLS برؤية كل المستخدمين (أولياء الأمور، إلخ)
        if (!roleData && isAdminEmail) {
            const { error } = await supabase
                .from('user_roles')
                .insert({
                    user_id: session.user.id,
                    role: 'admin',
                    created_at: new Date().toISOString()
                });
            if (error && error.code !== '23505') { // Ignore duplicate key error
                console.error('Error creating admin role:', error);
            }
        }

        return true;
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);

            // Fetch users
            const { data: usersData, error: usersError } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (usersError) throw usersError;

            // Fetch kindergartens
            const { data: kindergartensData, error: kindergartensError } = await supabase
                .from('kindergartens')
                .select('*')
                .order('created_at', { ascending: false });

            if (kindergartensError) throw kindergartensError;

            setUsers(usersData || []);
            setKindergartens(kindergartensData?.map(adaptKindergarten) || localKindergartens.map(adaptKindergarten));

            // Calculate stats
            const totalUsers = usersData?.length || 0;
            const activeParents = usersData?.filter((u: { role: string }) => u.role === 'parent').length || 0;
            const activeOwners = usersData?.filter((u: { role: string }) => u.role === 'owner').length || 0;

            setStats({
                totalUsers,
                totalKindergartens: kindergartensData?.length || localKindergartens.length,
                pendingApprovals: 0,
                activeParents,
                activeOwners
            });

        } catch (error) {
            console.error('Error fetching data:', error);
            toast({
                title: language === 'ar' ? 'خطأ' : 'Error',
                description: language === 'ar' ? 'فشل في تحميل البيانات' : 'Failed to load data',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin-auth');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" dir={dir}>
            {/* Header */}
            <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Shield className="w-8 h-8 text-blue-400" />
                            <div>
                                <h1 className="text-xl font-bold text-white">
                                    {language === 'ar' ? 'لوحة تحكم الأدمن' : 'Admin Dashboard'}
                                </h1>
                                <p className="text-sm text-slate-400">
                                    {language === 'ar' ? 'إدارة المنصة' : 'Platform Management'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <LanguageSelector />
                            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                                <LogOut className="w-4 h-4" />
                                {language === 'ar' ? 'خروج' : 'Logout'}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4 bg-white/5">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
                            {language === 'ar' ? 'نظرة عامة' : 'Overview'}
                        </TabsTrigger>
                        <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">
                            {language === 'ar' ? 'المستخدمون' : 'Users'}
                        </TabsTrigger>
                        <TabsTrigger value="kindergartens" className="data-[state=active]:bg-blue-600">
                            {language === 'ar' ? 'الروضات' : 'Kindergartens'}
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600">
                            {language === 'ar' ? 'الإعدادات' : 'Settings'}
                        </TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="bg-slate-800 border-white/10">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-300">
                                        {language === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}
                                    </CardTitle>
                                    <Users className="h-4 w-4 text-slate-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800 border-white/10">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-300">
                                        {language === 'ar' ? 'الروضات' : 'Kindergartens'}
                                    </CardTitle>
                                    <Building2 className="h-4 w-4 text-slate-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">{stats.totalKindergartens}</div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800 border-white/10">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-300">
                                        {language === 'ar' ? 'أولياء الأمور' : 'Parents'}
                                    </CardTitle>
                                    <UserCheck className="h-4 w-4 text-slate-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">{stats.activeParents}</div>
                                </CardContent>
                            </Card>

                            <Card className="bg-slate-800 border-white/10">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-slate-300">
                                        {language === 'ar' ? 'أصحاب الروضات' : 'Owners'}
                                    </CardTitle>
                                    <UserX className="h-4 w-4 text-slate-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-white">{stats.activeOwners}</div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Users Tab */}
                    <TabsContent value="users" className="space-y-6">
                        <Card className="bg-slate-800 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">{language === 'ar' ? 'المستخدمون' : 'Users'}</CardTitle>
                                <CardDescription className="text-slate-400">
                                    {language === 'ar' ? 'إدارة مستخدمي المنصة' : 'Manage platform users'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                        <p className="text-slate-400">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
                                    </div>
                                ) : users.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                        <p className="text-slate-400">{language === 'ar' ? 'لا يوجد مستخدمون' : 'No users found'}</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-white/5">
                                                <TableRow className="border-white/5">
                                                    <TableHead className="text-slate-400">{language === 'ar' ? 'الاسم' : 'Name'}</TableHead>
                                                    <TableHead className="text-slate-400">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</TableHead>
                                                    <TableHead className="text-slate-400">{language === 'ar' ? 'الهاتف' : 'Phone'}</TableHead>
                                                    <TableHead className="text-slate-400">{language === 'ar' ? 'الدور' : 'Role'}</TableHead>
                                                    <TableHead className="text-slate-400">{language === 'ar' ? 'تاريخ التسجيل' : 'Registration Date'}</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {users.map((user) => (
                                                    <TableRow key={user.id} className="border-white/5">
                                                        <TableCell className="text-white">{user.full_name || 'N/A'}</TableCell>
                                                        <TableCell className="text-white">{user.email || 'N/A'}</TableCell>
                                                        <TableCell className="text-white">{user.phone || 'N/A'}</TableCell>
                                                        <TableCell className="text-white">
                                                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                                                                {user.role || 'user'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-white">
                                                            {new Date(user.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Kindergartens Tab */}
                    <TabsContent value="kindergartens" className="space-y-6">
                        <Card className="bg-slate-800 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">{language === 'ar' ? 'الروضات' : 'Kindergartens'}</CardTitle>
                                <CardDescription className="text-slate-400">
                                    {language === 'ar' ? 'إدارة روضات الأطفال' : 'Manage kindergartens'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                                        <p className="text-slate-400">{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
                                    </div>
                                ) : kindergartens.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                        <p className="text-slate-400">{language === 'ar' ? 'لا توجد روضات' : 'No kindergartens found'}</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-white/5">
                                                <TableRow className="border-white/5">
                                                    <TableHead className="text-slate-400">{language === 'ar' ? 'الاسم' : 'Name'}</TableHead>
                                                    <TableHead className="text-slate-400">{language === 'ar' ? 'العنوان' : 'Address'}</TableHead>
                                                    <TableHead className="text-slate-400">{language === 'ar' ? 'البلدية' : 'Municipality'}</TableHead>
                                                    <TableHead className="text-slate-400">{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                                                    <TableHead className="text-slate-400">{language === 'ar' ? 'تاريخ الإنشاء' : 'Created Date'}</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {kindergartens.map((kg) => (
                                                    <TableRow key={kg.id} className="border-white/5">
                                                        <TableCell className="text-white">
                                                            {language === 'ar' ? kg.name_ar : kg.name_fr}
                                                        </TableCell>
                                                        <TableCell className="text-white">
                                                            {language === 'ar' ? kg.address_ar : kg.address_fr}
                                                        </TableCell>
                                                        <TableCell className="text-white">
                                                            {language === 'ar' ? kg.municipality_ar : kg.municipality_fr}
                                                        </TableCell>
                                                        <TableCell className="text-white">
                                                            <Badge className={
                                                                kg.status === 'approved' ? 'bg-green-500 text-white' :
                                                                kg.status === 'rejected' ? 'bg-red-500 text-white' :
                                                                'bg-yellow-500 text-white'
                                                            }>
                                                                {kg.status === 'approved' ? (language === 'ar' ? 'مقبول' : 'Approved') :
                                                                 kg.status === 'rejected' ? (language === 'ar' ? 'مرفوض' : 'Rejected') :
                                                                 (language === 'ar' ? 'في الانتظار' : 'Pending')}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-white">
                                                            {new Date(kg.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Settings Tab */}
                    <TabsContent value="settings" className="space-y-6">
                        <Card className="bg-slate-800 border-white/10">
                            <CardHeader>
                                <CardTitle className="text-white">{language === 'ar' ? 'إعدادات المنصة' : 'Platform Settings'}</CardTitle>
                                <CardDescription className="text-slate-400">
                                    {language === 'ar' ? 'إدارة إعدادات المنصة' : 'Manage platform settings'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div>
                                        <Label className="text-white">{language === 'ar' ? 'اللغة الافتراضية' : 'Default Language'}</Label>
                                        <p className="text-sm text-slate-400 mt-1">
                                            {language === 'ar' ? 'العربية / الفرنسية' : 'Arabic / French'}
                                        </p>
                                    </div>
                                    <Separator className="bg-white/10" />
                                    <div>
                                        <Label className="text-white">{language === 'ar' ? 'حالة المنصة' : 'Platform Status'}</Label>
                                        <p className="text-sm text-slate-400 mt-1">
                                            {language === 'ar' ? 'نشطة' : 'Active'}
                                        </p>
                                    </div>
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
