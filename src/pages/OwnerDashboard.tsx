import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  Users,
  Edit,
  Plus,
  Clock,
  Phone,
  MapPin,
  DollarSign,
  LogOut,
  Loader2,
  Heart,
  Activity,
  Wallet,
  CheckCircle2,
  XCircle,
  Filter,
  Baby
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { useLanguage } from '@/contexts/LanguageContext';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { arDZ, fr } from 'date-fns/locale';

// Types
interface Child {
  id: string;
  name: string;
  age: number;
  medical_condition: string | null;
  food_allergies: string | null;
  status: string;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  phone: string;
}

interface PaymentRecord {
  id: string;
  child_id: string;
  amount: number;
  status: 'paid' | 'pending' | 'debt';
  for_month: number;
}

// Mock data for display fallback
const mockKindergarten = {
  id: '1',
  name: 'روضة النور',
  municipality: 'معسكر',
  address: 'حي 500 مسكن، معسكر',
  phone: '0555 12 34 56',
  pricePerMonth: 5000,
  workingHours: '07:00 - 17:00',
  images: ['/placeholder.svg'],
  services: ['وجبات', 'نقل مدرسي', 'لغات']
};

const OwnerDashboard = () => {
  const { t, language, dir } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [kindergartenId, setKindergartenId] = useState<string | null>(null);

  const [requests, setRequests] = useState<any[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});

  const fetchDashboardData = async (uid: string) => {
    try {
      // 1. Get Kindergarten ID
      const { data: ownerKg } = await supabase
        .from('owner_kindergartens')
        .select('kindergarten_id')
        .eq('owner_id', uid)
        .single();

      if (!ownerKg) return;
      const kgId = ownerKg.kindergarten_id;
      setKindergartenId(kgId);

      // 2. Fetch Registration Requests
      const { data: reqData } = await supabase
        .from('registration_requests')
        .select('*')
        .eq('kindergarten_id', kgId)
        .order('created_at', { ascending: false });

      if (reqData) {
        setRequests(reqData.map(r => ({
          ...r,
          childName: r.child_name,
          parentName: r.parent_name,
          childAge: r.child_age,
          createdAt: new Date(r.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')
        })));
      }

      // 3. Fetch Children
      const { data: childData } = await supabase
        .from('children' as any)
        .select('*')
        .eq('kindergarten_id', kgId);
      if (childData) setChildren(childData as any);

      // 4. Fetch Staff
      const { data: staffData } = await (supabase.from('staff' as any))
        .select('*')
        .eq('kindergarten_id', kgId);
      if (staffData) setStaff(staffData as any);

      // 5. Today's Attendance
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data: attData } = await (supabase.from('attendance' as any))
        .select('entity_id, status')
        .eq('kindergarten_id', kgId)
        .eq('attendance_date', today);

      if (attData) {
        const attMap: Record<string, any> = {};
        attData.forEach((a: any) => attMap[a.entity_id] = a.status);
        setAttendance(attMap);
      }

      // 6. Payments
      const { data: payData } = await (supabase.from('payments' as any))
        .select('*')
        .eq('kindergarten_id', kgId);
      if (payData) setPayments(payData as any);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    }
  };

  const checkOwnerRole = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'owner'
      });

      if (error) {
        console.error('Error checking role:', error);
        setIsAuthorized(false);
        navigate('/owner-auth');
      } else if (data === true) {
        setIsAuthorized(true);
        fetchDashboardData(userId);
      } else {
        toast({
          title: 'غير مصرح',
          description: 'ليس لديك صلاحية الوصول لهذه الصفحة',
          variant: 'destructive',
        });
        await supabase.auth.signOut();
        navigate('/owner-auth');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          checkOwnerRole(session.user.id);
        } else {
          setIsLoading(false);
          navigate('/owner-auth');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkOwnerRole(session.user.id);
      } else {
        setIsLoading(false);
        navigate('/owner-auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('registration_requests')
        .update({ status: newStatus } as any)
        .eq('id', requestId);

      if (error) throw error;

      setRequests(prev =>
        prev.map(req =>
          req.id === requestId ? { ...req, status: newStatus } : req
        )
      );
      toast({ title: t('common.updated') });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleAttendance = async (entityId: string, entityType: 'child' | 'staff', status: 'present' | 'absent' | 'late') => {
    try {
      if (!kindergartenId) return;
      const today = format(new Date(), 'yyyy-MM-dd');

      const { error } = await (supabase.from('attendance' as any)).upsert({
        kindergarten_id: kindergartenId,
        entity_id: entityId,
        entity_type: entityType,
        attendance_date: today,
        status: status
      }, { onConflict: 'entity_id, attendance_date' });

      if (error) throw error;

      setAttendance(prev => ({ ...prev, [entityId]: status }));
      toast({ title: t('common.updated') });
    } catch (error) {
      console.error('Attendance error:', error);
    }
  };

  const handlePayment = async (childId: string) => {
    try {
      if (!kindergartenId || !user) return;
      const amount = 5000;
      const month = new Date().getMonth() + 1;
      const year = new Date().getFullYear();

      const { error } = await (supabase.from('payments' as any)).upsert({
        kindergarten_id: kindergartenId,
        child_id: childId,
        amount: amount,
        for_month: month,
        for_year: year,
        status: 'paid',
        payment_date: format(new Date(), 'yyyy-MM-dd')
      });

      if (error) throw error;

      fetchDashboardData(user.id);
      toast({ title: t('owner.paid') });
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800">قيد الانتظار</Badge>;
      case 'approved':
        return <Badge className="bg-mint/20 text-mint-foreground">مقبول</Badge>;
      case 'rejected':
        return <Badge variant="destructive">مرفوض</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">لوحة تحكم المدير</h1>
                <p className="text-sm text-muted-foreground">{mockKindergarten.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="ghost" className="gap-2">
                  <span>الرئيسية</span>
                  <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-0' : 'rotate-180'}`} />
                </Button>
              </Link>
              <Button variant="outline" onClick={handleLogout} className="gap-2 text-destructive hover:text-destructive">
                <LogOut className="w-4 h-4" />
                <span>خروج</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{language === 'ar' ? 'إجمالي الأطفال' : 'Total Enfants'}</p>
                  <p className="text-3xl font-bold text-primary">{children.length}</p>
                </div>
                <Users className="w-10 h-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-coral/10 to-coral/5 border-coral/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('owner.medicalAlert')}</p>
                  <p className="text-3xl font-bold text-coral">{children.filter(c => c.medical_condition || c.food_allergies).length}</p>
                </div>
                <Heart className="w-10 h-10 text-coral/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-mint/10 to-mint/5 border-mint/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('owner.attendanceRate')}</p>
                  <p className="text-3xl font-bold text-mint-foreground">
                    {children.length > 0 ? Math.round((Object.values(attendance).filter(s => s === 'present').length / children.length) * 100) : 0}%
                  </p>
                </div>
                <Activity className="w-10 h-10 text-mint/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('owner.totalDebt')}</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {payments.filter(p => p.status === 'debt').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()} دج
                  </p>
                </div>
                <DollarSign className="w-10 h-10 text-amber-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0 mb-6">
            <TabsTrigger value="requests" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border rounded-xl px-6 py-2">
              <Users className="w-4 h-4 ml-2" />
              {language === 'ar' ? 'الطلبات' : 'Demandes'}
            </TabsTrigger>
            <TabsTrigger value="attendance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border rounded-xl px-6 py-2">
              <Activity className="w-4 h-4 ml-2" />
              {t('owner.attendance')}
            </TabsTrigger>
            <TabsTrigger value="finance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border rounded-xl px-6 py-2">
              <Wallet className="w-4 h-4 ml-2" />
              {t('owner.finance')}
            </TabsTrigger>
            <TabsTrigger value="stats" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border rounded-xl px-6 py-2">
              <Filter className="w-4 h-4 ml-2" />
              {t('owner.stats')}
            </TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border rounded-xl px-6 py-2">
              <Building2 className="w-4 h-4 ml-2" />
              {t('modal.details')}
            </TabsTrigger>
          </TabsList>

          {/* Registration Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'طلبات التسجيل' : 'Demandes d\'inscription'}</CardTitle>
                <CardDescription>{t('admin.manageUsers')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div key={request.id} className="p-4 rounded-xl border bg-card hover:shadow-soft transition-all">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{request.childName}</h3>
                            {getStatusBadge(request.status)}
                          </div>
                          <p className="text-sm text-muted-foreground">{t('registration.parentName')}: {request.parentName}</p>
                          <p className="text-xs text-muted-foreground">{request.createdAt}</p>
                        </div>
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleStatusChange(request.id, 'approved')} className="bg-mint hover:bg-mint/90">{language === 'ar' ? 'قبول' : 'Accepter'}</Button>
                            <Button size="sm" variant="outline" onClick={() => handleStatusChange(request.id, 'rejected')}>{language === 'ar' ? 'رفض' : 'Refuser'}</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {requests.length === 0 && <div className="text-center py-10 text-muted-foreground">{t('admin.noUsers')}</div>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('owner.presence')}</CardTitle>
                <CardDescription>{format(new Date(), 'eeee, d MMMM yyyy', { locale: language === 'ar' ? arDZ : fr })}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Children */}
                  <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2"><Baby className="w-4 h-4 text-primary" />{t('owner.children')}</h3>
                    <div className="space-y-2">
                      {children.map(child => (
                        <div key={child.id} className="flex items-center justify-between p-3 rounded-xl border bg-card">
                          <span className="font-medium text-sm">{child.name}</span>
                          <div className="flex gap-2">
                            <button className={`p-1.5 rounded-lg transition-all ${attendance[child.id] === 'present' ? 'bg-mint text-white' : 'bg-muted hover:bg-muted/80'}`} onClick={() => handleAttendance(child.id, 'child', 'present')}><CheckCircle2 className="w-4 h-4" /></button>
                            <button className={`p-1.5 rounded-lg transition-all ${attendance[child.id] === 'absent' ? 'bg-destructive text-white' : 'bg-muted hover:bg-muted/80'}`} onClick={() => handleAttendance(child.id, 'child', 'absent')}><XCircle className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Staff */}
                  <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2"><Users className="w-4 h-4 text-accent" />{t('owner.staff')}</h3>
                    <div className="space-y-2">
                      {staff.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 rounded-xl border bg-card">
                          <div>
                            <p className="font-medium text-sm">{member.name}</p>
                            <p className="text-[10px] text-muted-foreground">{member.role}</p>
                          </div>
                          <div className="flex gap-2">
                            <button className={`p-1.5 rounded-lg transition-all ${attendance[member.id] === 'present' ? 'bg-mint text-white' : 'bg-muted hover:bg-muted/80'}`} onClick={() => handleAttendance(member.id, 'staff', 'present')}><CheckCircle2 className="w-4 h-4" /></button>
                            <button className={`p-1.5 rounded-lg transition-all ${attendance[member.id] === 'absent' ? 'bg-destructive text-white' : 'bg-muted hover:bg-muted/80'}`} onClick={() => handleAttendance(member.id, 'staff', 'absent')}><XCircle className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Finance Tab */}
          <TabsContent value="finance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('owner.finance')}</CardTitle>
                <CardDescription>{format(new Date(), 'MMMM yyyy', { locale: language === 'ar' ? arDZ : fr })}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead className="bg-muted/50 text-xs font-bold uppercase">
                      <tr>
                        <th className="px-4 py-3">{t('registration.childName')}</th>
                        <th className="px-4 py-3">{t('owner.paymentStatus')}</th>
                        <th className="px-4 py-3 text-left">{t('admin.actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {children.map(child => {
                        const payment = payments.find(p => p.child_id === child.id && p.for_month === (new Date().getMonth() + 1));
                        return (
                          <tr key={child.id} className="hover:bg-muted/30">
                            <td className="px-4 py-4">{child.name}</td>
                            <td className="px-4 py-4">
                              {!payment || payment.status === 'debt' ? (
                                <Badge variant="secondary" className="bg-coral/10 text-coral">{t('owner.debt')}</Badge>
                              ) : (
                                <Badge className="bg-mint/20 text-mint-foreground">{t('owner.paid')}</Badge>
                              )}
                            </td>
                            <td className="px-4 py-4 text-left">
                              <Button size="sm" variant="outline" onClick={() => handlePayment(child.id)}>
                                <DollarSign className="w-4 h-4" /> {language === 'ar' ? 'دفع' : 'Régler'}
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Heart className="w-5 h-5 text-coral" />{t('owner.medicalStats')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span>{t('owner.foodAllergy')}</span><span className="font-bold">{children.filter(c => c.food_allergies).length}</span></div>
                    <Progress value={(children.filter(c => c.food_allergies).length / (children.length || 1)) * 100} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span>{t('owner.chronicDisease')}</span><span className="font-bold">{children.filter(c => c.medical_condition).length}</span></div>
                    <Progress value={(children.filter(c => c.medical_condition).length / (children.length || 1)) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2"><Activity className="w-5 h-5 text-mint-foreground" />{t('owner.attendanceRate')}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-6">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/20" />
                      <circle cx="48" cy="48" r="42" stroke="currentColor" strokeWidth="8" strokeDasharray={264} strokeDashoffset={264 - (264 * (Object.values(attendance).filter(s => s === 'present').length / (children.length || 1)))} strokeLinecap="round" fill="transparent" className="text-mint transition-all" />
                    </svg>
                    <span className="absolute text-xl font-bold">{children.length > 0 ? Math.round((Object.values(attendance).filter(s => s === 'present').length / children.length) * 100) : 0}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Kindergarten Info */}
          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle>{t('modal.details')}</CardTitle><CardDescription>{mockKindergarten.address}</CardDescription></div>
                <Button variant="outline"><Edit className="w-4 h-4 ml-1" />{language === 'ar' ? 'تعديل' : 'Modifier'}</Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-xs text-muted-foreground">اسم الروضة</label><p className="font-medium">{mockKindergarten.name}</p></div>
                  <div className="space-y-1"><label className="text-xs text-muted-foreground">البلدية</label><p className="font-medium">{mockKindergarten.municipality}</p></div>
                  <div className="space-y-1"><label className="text-xs text-muted-foreground">رقم الهاتف</label><p className="font-medium">{mockKindergarten.phone}</p></div>
                  <div className="space-y-1"><label className="text-xs text-muted-foreground">السعر الشهري</label><p className="font-medium">{mockKindergarten.pricePerMonth} دج</p></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default OwnerDashboard;
