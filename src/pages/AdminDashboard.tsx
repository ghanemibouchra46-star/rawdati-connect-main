import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, UserCheck, UserX, Clock, LogOut, Home, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

interface UserProfile {
    id: string;
    full_name: string | null;
    phone: string | null;
    created_at: string;
    status: string | null;
    email?: string;
    role?: string;
}

const AdminDashboard = () => {
    const { t, dir, language } = useLanguage();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
    });
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        checkAdminAccess();
        fetchUsers();
    }, []);

    const checkAdminAccess = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
            navigate('/admin-auth');
            return;
        }

        const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .eq('role', 'admin')
            .single();

        if (!roleData) {
            navigate('/admin-auth');
        }
    };

    const fetchUsers = async () => {
        setIsLoading(true);

        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            toast({
                title: t('common.error'),
                description: t('admin.errorFetch'),
                variant: 'destructive',
            });
            setIsLoading(false);
            return;
        }

        const { data: roles } = await supabase
            .from('user_roles')
            .select('user_id, role');

        const usersWithRoles = (profiles || []).map(profile => ({
            ...profile,
            role: roles?.find(r => r.user_id === profile.id)?.role || 'parent'
        }));

        setUsers(usersWithRoles);

        const pending = usersWithRoles.filter(u => u.status === 'pending' || !u.status).length;
        const approved = usersWithRoles.filter(u => u.status === 'approved').length;
        const rejected = usersWithRoles.filter(u => u.status === 'rejected').length;

        setStats({
            total: usersWithRoles.length,
            pending,
            approved,
            rejected
        });

        setIsLoading(false);
    };

    const updateUserStatus = async (userId: string, status: 'approved' | 'rejected') => {
        const { error } = await supabase
            .from('profiles')
            .update({ status })
            .eq('id', userId);

        if (error) {
            toast({
                title: t('common.error'),
                description: t('admin.errorUpdate'),
                variant: 'destructive',
            });
            return;
        }

        toast({
            title: t('common.updated'),
            description: status === 'approved' ? t('admin.statusApprovedDesc') : t('admin.statusRejectedDesc'),
        });

        fetchUsers();
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin-auth');
    };

    const getStatusBadge = (status: string | null) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{t('admin.status.approved')}</Badge>;
            case 'rejected':
                return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">{t('admin.status.rejected')}</Badge>;
            default:
                return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">{t('admin.status.pending')}</Badge>;
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">{t('admin.role.admin')}</Badge>;
            case 'owner':
                return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{t('admin.role.owner')}</Badge>;
            default:
                return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">{t('admin.role.parent')}</Badge>;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800" dir={dir}>
            {/* Header */}
            <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-white">{t('admin.title')}</h1>
                                <p className="text-xs text-gray-400">{t('admin.subtitle')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <LanguageSelector />
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate('/')}
                                className="text-gray-400 hover:text-white"
                            >
                                <Home className="w-4 h-4 mx-2" />
                                {t('admin.home')}
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLogout}
                                className="text-red-400 hover:text-red-300"
                            >
                                <LogOut className="w-4 h-4 mx-2" />
                                {t('admin.logout')}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">{t('admin.totalUsers')}</CardTitle>
                            <Users className="w-4 h-4 text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stats.total}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-yellow-400">{t('admin.pending')}</CardTitle>
                            <Clock className="w-4 h-4 text-yellow-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-green-400">{t('admin.approved')}</CardTitle>
                            <UserCheck className="w-4 h-4 text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-400">{stats.approved}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-red-400">{t('admin.rejected')}</CardTitle>
                            <UserX className="w-4 h-4 text-red-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Users Table */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            {t('admin.manageUsers')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8 text-gray-400">{t('auth.loading')}</div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">{t('admin.noUsers')}</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-slate-700">
                                            <TableHead className="text-gray-400">{t('admin.name')}</TableHead>
                                            <TableHead className="text-gray-400">{t('admin.phone')}</TableHead>
                                            <TableHead className="text-gray-400">{t('admin.role')}</TableHead>
                                            <TableHead className="text-gray-400">{t('admin.status')}</TableHead>
                                            <TableHead className="text-gray-400">{t('admin.date')}</TableHead>
                                            <TableHead className="text-gray-400">{t('admin.actions')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id} className="border-slate-700">
                                                <TableCell className="text-white font-medium">
                                                    {user.full_name || t('common.notSpecified')}
                                                </TableCell>
                                                <TableCell className="text-gray-300">
                                                    {user.phone || '-'}
                                                </TableCell>
                                                <TableCell>
                                                    {getRoleBadge(user.role || 'parent')}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(user.status)}
                                                </TableCell>
                                                <TableCell className="text-gray-400 text-sm">
                                                    {new Date(user.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {user.status !== 'approved' && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                                                onClick={() => updateUserStatus(user.id, 'approved')}
                                                            >
                                                                <UserCheck className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                        {user.status !== 'rejected' && user.role !== 'admin' && (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                                onClick={() => updateUserStatus(user.id, 'rejected')}
                                                            >
                                                                <UserX className="w-4 h-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
};

export default AdminDashboard;

