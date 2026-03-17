/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart,
  Settings,
  Bell,
  Search,
  Filter,
  ChevronRight,
  Calendar,
  User as UserIcon,
  LogOut,
  Check,
  X,
  Clock,
  MapPin,
  Star,
  PlusCircle,
  FileText,
  CreditCard,
  Briefcase,
  Users,
  GraduationCap,
  MessageSquare,
  TrendingUp,
  Award,
  BookOpen,
  PieChart,
  Layout,
  Plus,
  Loader2,
  XCircle,
  Edit,
  Building2,
  ArrowRight,
  Heart,
  Activity,
  Wallet,
  Baby,
  CheckCircle2,
  DollarSign,
  Instagram,
  UserCheck,
  UserX,
  Crown,
  Trash,
  Upload,
  UserPlus,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User as AuthUser } from '@supabase/supabase-js';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { arDZ, fr } from 'date-fns/locale';
import { useSubscriptionRequests } from '@/hooks/useSubscriptionRequests';
import PlatformSubscriptionButton from '@/components/PlatformSubscriptionButton';
import SubscriptionInterface from '@/components/SubscriptionInterface';

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
  payment_method?: string;
  transaction_id?: string;
  payment_date?: string;
}

// Mock data for display fallback
const mockKindergarten = {
  id: '1',
  name: 'روضة النور',
  municipality: 'روضتي',
  address: 'حي 500 مسكن، روضتي',
  phone: '0555 12 34 56',
  pricePerMonth: 5000,
  workingHours: '07:00 - 17:00',
  images: ['/placeholder.svg'],
  services: ['وجبات', 'نقل مدرسي', 'لغات']
};

const OwnerDashboard = () => {
  const { t, language, dir } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile, loading: authLoading, logout: authLogout } = useAuth();
  // Use subscription requests hooks
  const { requests: subscriptionRequests, isLoading: loadingSubscriptions, approveRequest, rejectRequest } = useSubscriptionRequests();

  const [isLoading, setIsLoading] = useState(true);
  const [kindergartenId, setKindergartenId] = useState<string | null>(null);

  const [requests, setRequests] = useState<any[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState<any>({
    activities: [],
    coordinates: { lat: 35.3975, lng: 0.1397 },
    images: [],
    programs: []
  });
  const [isTrialActive, setIsTrialActive] = useState(true); // Default to true as requested

  const isAuthorized = profile && profile.role === 'owner' && profile.status === 'approved';

  const fetchDashboardData = async (uid: string) => {
    if (!uid) return;
    try {
      setIsLoading(true);
      
      // 1. Get Kindergarten ID
      const { data: ownerKg, error: kgError } = await supabase
        .from('owner_kindergartens')
        .select('kindergarten_id')
        .eq('owner_id', uid)
        .single();

      if (kgError || !ownerKg) {
        setIsLoading(false);
        return;
      }
      
      const kgId = ownerKg.kindergarten_id;
      setKindergartenId(kgId);

      // 2. Fetch all related data in parallel
      const today = format(new Date(), 'yyyy-MM-dd');
      
      const [
        regRes,
        childRes,
        staffRes,
        attRes,
        payRes,
        detailsRes
      ] = await Promise.all([
        supabase.from('registration_requests').select('*').eq('kindergarten_id', kgId).order('created_at', { ascending: false }),
        supabase.from('children' as any).select('*').eq('kindergarten_id', kgId),
        supabase.from('staff' as any).select('*').eq('kindergarten_id', kgId),
        supabase.from('attendance' as any).select('entity_id, status').eq('kindergarten_id', kgId).eq('attendance_date', today),
        supabase.from('payments' as any).select('*').eq('kindergarten_id', kgId),
        supabase.from('kindergartens').select('*').eq('id', kgId).single()
      ]);

      // Processing results
      if (regRes.data) {
        setRequests(regRes.data.map(r => ({
          ...r,
          childName: r.child_name,
          parentName: r.parent_name,
          childAge: r.child_age,
          createdAt: new Date(r.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')
        })));
      }

      if (childRes.data) setChildren(childRes.data as any);
      if (staffRes.data) setStaff(staffRes.data as any);

      if (attRes.data) {
        const attMap: Record<string, any> = {};
        attRes.data.forEach((a: any) => attMap[a.entity_id] = a.status);
        setAttendance(attMap);
      }

      if (payRes.data) setPayments(payRes.data as any);
      if (detailsRes.data) setEditData(detailsRes.data);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (profile && profile.role === 'owner' && profile.status === 'approved') {
        fetchDashboardData(profile.id);
      } else if (profile) {
        // Logged in but not authorized or approved
        toast({
          title: profile.role !== 'owner' ? 'غير مصرح' : 'قيد المراجعة',
          description: profile.role !== 'owner' 
            ? 'ليس لديك صلاحية الوصول لهذه الصفحة'
            : 'حسابك لا يزال قيد المراجعة من قبل الإدارة.',
          variant: 'destructive',
        });
        if (profile.role !== 'owner' || profile.status === 'rejected') {
          authLogout();
        }
        navigate('/owner-auth');
        setIsLoading(false);
      } else {
        // Not logged in
        navigate('/owner-auth');
        setIsLoading(false);
      }
    }
  }, [profile, authLoading, navigate]);

  const handleLogout = async () => {
    try {
      await authLogout();
      navigate('/owner-auth', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/owner-auth', { replace: true });
    }
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

  const handleSaveDetails = async () => {
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('kindergartens')
        .update({
          name_ar: editData.name_ar,
          phone: editData.phone,
          instagram: editData.instagram,
          description_ar: editData.description_ar,
          programs: editData.programs,
          activities: editData.activities,
          coordinates: editData.coordinates,
          images: editData.images
        })
        .eq('id', kindergartenId);

      if (error) throw error;

      toast({
        title: language === 'ar' ? 'تم الحفظ بنجاح' : 'Enregistré avec succès',
      });
      setIsEditing(false);
      if (profile) fetchDashboardData(profile.id);
    } catch (error: any) {
      toast({
        title: language === 'ar' ? 'خطأ في الحفظ' : 'Erreur de sauvegarde',
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !kindergartenId) return;

    try {
      setIsSaving(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${kindergartenId}/${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('kindergarten-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const newImages = [...(editData.images || []), filePath];
      setEditData({ ...editData, images: newImages });
      
      toast({
        title: language === 'ar' ? 'تم رفع الصورة' : 'Image téléchargée',
      });
    } catch (error: any) {
      toast({
        title: 'Error uploading image',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePayment = async (childId: string) => {
    try {
      if (!kindergartenId || !profile) return;
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
        payment_method: 'manual',
        payment_date: format(new Date(), 'yyyy-MM-dd')
      });

      if (error) throw error;

      fetchDashboardData(profile.id);
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

  if (!isAuthorized && !authLoading) return null;

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-soft">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{language === 'ar' ? 'لوحة التحكم' : 'Tableau de bord'}</h1>
                <p className="text-sm text-muted-foreground">{language === 'ar' ? 'روضة' : 'Crèche'} {mockKindergarten.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Professional Account Subscription */}
              {isTrialActive ? (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white gap-1 px-3 py-1.5 rounded-xl border-none shadow-sm">
                  <Crown className="w-4 h-4 fill-white" />
                  {language === 'ar' ? 'باقة تجريبية مفعلة' : 'Essai gratuit activé'}
                </Badge>
              ) : (
                <SubscriptionInterface onActivate={() => {
                  toast({
                    title: language === 'ar' ? 'طلب التفعيل' : 'Demande d\'activation',
                    description: language === 'ar' ? 'تم تحويلك لصفحة الدفع لتفعيل الحساب المهني' : 'Vous avez été redirigé vers la page de paiement',
                  });
                }} />
              )}
              
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="w-4 h-4" />
                {language === 'ar' ? 'خروج' : 'Déconnexion'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Edit Form Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Edit className="w-6 h-6 text-primary" />
              {language === 'ar' ? 'تعديل معلومات الروضة' : 'Modifier les informations'}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">{language === 'ar' ? 'رقم الهاتف' : 'Téléphone'}</label>
                  <Input
                    value={editData.phone || ''}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-600" />
                    <span>انسقرام (Instagram)</span>
                  </label>
                  <Input
                    placeholder="@username"
                    value={editData.instagram || ''}
                    onChange={(e) => setEditData({ ...editData, instagram: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">{language === 'ar' ? 'وصف الروضة (بالعربية)' : 'Description (Ar)'}</label>
                <Textarea
                  value={editData.description_ar || ''}
                  onChange={(e) => setEditData({ ...editData, description_ar: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-4 mt-6 border-t pt-6">
                <h3 className="font-bold">{language === 'ar' ? 'البرامج والأنشطة' : 'Programmes et Activités'}</h3>
                <p className="text-xs text-muted-foreground mb-2">إضافة برامج تعليمية خاصة بالروضة</p>
                {/* Simplified program editor for now */}
                <Button variant="outline" size="sm" onClick={() => {
                  const newProgs = [...(editData.programs as any || [])];
                  newProgs.push({ id: Date.now().toString(), nameAr: '', nameFr: '', icon: '🌟' });
                  setEditData({ ...editData, programs: newProgs });
                }}>
                  <Plus className="w-4 h-4 ml-1" /> {language === 'ar' ? 'إضافة برنامج' : 'Ajouter un programme'}
                </Button>

                <div className="space-y-3">
                  {(editData.programs as any[])?.map((prog, index) => (
                    <div key={prog.id} className="p-3 border rounded-xl bg-muted/30">
                      <div className="flex justify-between mb-2">
                        <Input
                          size={1}
                          className="w-16 h-8 text-center"
                          value={prog.icon}
                          onChange={(e) => {
                            const newProgs = [...(editData.programs as any || [])];
                            newProgs[index].icon = e.target.value;
                            setEditData({ ...editData, programs: newProgs });
                          }}
                        />
                        <Button variant="ghost" size="sm" onClick={() => {
                          const newProgs = (editData.programs as any[]).filter((_, i) => i !== index);
                          setEditData({ ...editData, programs: newProgs });
                        }}>
                          <XCircle className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                      <Input
                        className="mb-2"
                        placeholder={language === 'ar' ? 'اسم البرنامج بالعربية' : 'Nom du programme (Ar)'}
                        value={prog.nameAr}
                        onChange={(e) => {
                          const newProgs = [...(editData.programs as any || [])];
                          newProgs[index].nameAr = e.target.value;
                          setEditData({ ...editData, programs: newProgs });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8 pt-6 border-t">
              <Button className="flex-1 gradient-accent border-0" onClick={handleSaveDetails}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : (language === 'ar' ? 'حفظ التغييرات' : 'Sauvegarder')}
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                {language === 'ar' ? 'إلغاء' : 'Annuler'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{language === 'ar' ? 'إجمالي الأطفال' : 'Total Enfants'}</p>
                  <p className="text-3xl font-bold text-primary">
                    {isLoading ? <Skeleton className="h-9 w-12" /> : children.length}
                  </p>
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
                  <p className="text-3xl font-bold text-coral">
                    {isLoading ? <Skeleton className="h-9 w-12" /> : children.filter(c => c.medical_condition || c.food_allergies).length}
                  </p>
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
                    {isLoading ? <Skeleton className="h-9 w-16" /> : (children.length > 0 ? Math.round((Object.values(attendance).filter(s => s === 'present').length / children.length) * 100) : 0) + '%'}
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
                  <p className="text-sm text-muted-foreground">{language === 'ar' ? 'مداخيل إلكترونية' : 'Revenus en ligne'}</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {isLoading ? <Skeleton className="h-9 w-24" /> : payments.filter(p => p.payment_method === 'card').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString() + ' دج'}
                  </p>
                </div>
                <CreditCard className="w-10 h-10 text-amber-500/50" />
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
            <TabsTrigger value="subscriptions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border rounded-xl px-6 py-2">
              <CreditCard className="w-4 h-4 ml-2" />
              {language === 'ar' ? 'طلبات الاشتراك' : 'Subscription Requests'}
            </TabsTrigger>
            <TabsTrigger value="children" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border rounded-xl px-6 py-2">
              <Baby className="w-4 h-4 ml-2" />
              {language === 'ar' ? 'الأطفال' : 'Enfants'}
            </TabsTrigger>
            <TabsTrigger value="staff" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border rounded-xl px-6 py-2">
              <GraduationCap className="w-4 h-4 ml-2" />
              {language === 'ar' ? 'الموظفين' : 'Personnel'}
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border rounded-xl px-6 py-2">
              <DollarSign className="w-4 h-4 ml-2" />
              {language === 'ar' ? 'المدفوعات' : 'Paiements'}
            </TabsTrigger>
            <TabsTrigger value="attendance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border rounded-xl px-6 py-2">
              <CheckCircle2 className="w-4 h-4 ml-2" />
              {language === 'ar' ? 'الحضور' : 'Présence'}
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border rounded-xl px-6 py-2">
              <Settings className="w-4 h-4 ml-2" />
              {language === 'ar' ? 'الإعدادات' : 'Paramètres'}
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
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="p-4 rounded-xl border bg-card">
                          <div className="flex justify-between items-center">
                            <div className="space-y-2">
                              <Skeleton className="h-5 w-32" />
                              <Skeleton className="h-4 w-48" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                            <div className="flex gap-2">
                              <Skeleton className="h-10 w-20 rounded-lg" />
                              <Skeleton className="h-10 w-20 rounded-lg" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Requests Tab */}
          <TabsContent value="subscriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'طلبات الاشتراك' : 'Demandes d\'abonnement'}</CardTitle>
                <CardDescription>{language === 'ar' ? 'إدارة طلبات الاشتراك في روضتك' : 'Gérer les demandes d\'abonnement pour votre crèche'}</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingSubscriptions ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">{language === 'ar' ? 'جاري التحميل...' : 'Chargement...'}</p>
                  </div>
                ) : !subscriptionRequests || subscriptionRequests.length === 0 ? (
                  <div className="text-center py-12 bg-muted/50 rounded-2xl border border-dashed border-border">
                    <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{language === 'ar' ? 'لا توجد طلبات اشتراك حالياً' : 'Aucune demande d\'abonnement pour le moment'}</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{language === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
                          <TableHead>{language === 'ar' ? 'ولي الأمر' : 'Parent'}</TableHead>
                          <TableHead>{language === 'ar' ? 'الطفل' : 'Enfant'}</TableHead>
                          <TableHead>{language === 'ar' ? 'العمر' : 'Âge'}</TableHead>
                          <TableHead>{language === 'ar' ? 'الهاتف' : 'Téléphone'}</TableHead>
                          <TableHead>{language === 'ar' ? 'CCP' : 'CCP'}</TableHead>
                          <TableHead>{language === 'ar' ? 'الحالة' : 'Statut'}</TableHead>
                          <TableHead>{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscriptionRequests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">
                                  {new Date(request.created_at).toLocaleDateString(language === 'ar' ? 'ar-DZ' : 'fr-FR')}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm font-medium">
                                  {request.first_name + ' ' + request.last_name}
                                </p>
                                <p className="text-xs text-muted-foreground">{request.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm font-medium">{request.child_name}</p>
                                <p className="text-xs text-muted-foreground">{request.child_age} {language === 'ar' ? 'سنوات' : 'ans'}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{request.child_age}</TableCell>
                            <TableCell className="text-sm">{request.phone}</TableCell>
                            <TableCell className="text-sm font-mono">{request.ccp}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={request.status === 'approved' ? 'default' : request.status === 'rejected' ? 'destructive' : 'secondary'}
                                className={
                                  request.status === 'approved' ? 'bg-green-500 text-white' :
                                  request.status === 'rejected' ? 'bg-red-500 text-white' :
                                  'bg-yellow-500 text-white'
                                }
                              >
                                {request.status === 'approved' ? (language === 'ar' ? 'مقبول' : 'Approuvé') :
                                 request.status === 'rejected' ? (language === 'ar' ? 'مرفوض' : 'Rejeté') :
                                 (language === 'ar' ? 'في الانتظار' : 'En attente')}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {request.status === 'pending' && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                      onClick={() => approveRequest(request.id)}
                                    >
                                      <UserCheck className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => rejectRequest(request.id)}
                                    >
                                      <UserX className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                                <Button variant="ghost" size="sm">
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
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
          </TabsContent>

          {/* Children Tab */}
          <TabsContent value="children" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'الأطفال المسجلين' : 'Enfants inscrits'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {children.map(child => (
                    <div key={child.id} className="p-4 rounded-xl border bg-card flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Baby className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-bold">{child.name}</p>
                          <p className="text-xs text-muted-foreground">{child.age} {language === 'ar' ? 'سنوات' : 'ans'}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{child.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Tab */}
          <TabsContent value="staff" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'طاقم العمل' : 'Personnel'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {staff.map(member => (
                    <div key={member.id} className="p-4 rounded-xl border bg-card flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-bold">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'سجل المدفوعات' : 'Historique des paiements'}</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Simplified payment view */}
                <div className="space-y-3">
                  {payments.map(payment => (
                    <div key={payment.id} className="p-4 rounded-xl border bg-card flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-bold">{payment.amount} دج</p>
                          <p className="text-xs text-muted-foreground">شهر: {payment.for_month}</p>
                        </div>
                      </div>
                      <Badge className={payment.status === 'paid' ? 'bg-mint/20 text-mint-foreground' : 'bg-red-100 text-red-800'}>
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
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

          {/* Settings Tab Content */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Settings Form */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="rounded-3xl border-none shadow-soft overflow-hidden">
                  <CardHeader className="bg-muted/30 pb-4">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary" />
                      {language === 'ar' ? 'إعدادات الروضة' : 'Paramètres de la crèche'}
                    </CardTitle>
                    <CardDescription>
                      {language === 'ar' ? 'تحديث المعلومات الأساسية لروضتك' : 'Mettez à jour les informations de base'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">{language === 'ar' ? 'اسم الروضة' : 'Nom de la crèche'}</label>
                        <Input
                          value={editData.name_ar || ''}
                          onChange={(e) => setEditData({ ...editData, name_ar: e.target.value })}
                          placeholder="مثلاً: روضة البراعم المتفوقة"
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">{language === 'ar' ? 'رقم الهاتف' : 'Téléphone'}</label>
                        <Input
                          value={editData.phone || ''}
                          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                          placeholder="05XX XX XX XX"
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold flex items-center gap-2">
                          <Instagram className="w-4 h-4 text-pink-600" />
                          <span>رابط الإنستغرام</span>
                        </label>
                        <Input
                          value={editData.instagram || ''}
                          onChange={(e) => setEditData({ ...editData, instagram: e.target.value })}
                          placeholder="@username"
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold flex items-center gap-2">
                          <Check className="w-4 h-4 text-blue-600" />
                          <span>رابط الفيسبوك</span>
                        </label>
                        <Input
                          value={editData.facebook || ''}
                          onChange={(e) => setEditData({ ...editData, facebook: e.target.value })}
                          placeholder="fb.com/page"
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span>الموقع الجغرافي (الإحداثيات)</span>
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="number"
                          step="any"
                          value={editData.coordinates?.lat || ''}
                          onChange={(e) => setEditData({ 
                            ...editData, 
                            coordinates: { ...editData.coordinates, lat: parseFloat(e.target.value) } 
                          })}
                          placeholder="خط العرض (Lat)"
                          className="rounded-xl"
                        />
                        <Input
                          type="number"
                          step="any"
                          value={editData.coordinates?.lng || ''}
                          onChange={(e) => setEditData({ 
                            ...editData, 
                            coordinates: { ...editData.coordinates, lng: parseFloat(e.target.value) } 
                          })}
                          placeholder="خط الطول (Lng)"
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="font-bold flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        {language === 'ar' ? 'الأنشطة المتاحة' : 'Activités disponibles'}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {['الرسم', 'الموسيقى', 'الروبوتيك', 'السباحة', 'ألعاب تعليمية', 'تحفيظ القرآن'].map((act) => {
                          const isSelected = (editData.activities || []).includes(act);
                          return (
                            <button
                              key={act}
                              onClick={() => {
                                const current = editData.activities || [];
                                const next = isSelected 
                                  ? current.filter((a: string) => a !== act)
                                  : [...current, act];
                                setEditData({ ...editData, activities: next });
                              }}
                              className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-sm ${
                                isSelected 
                                  ? 'bg-primary/10 border-primary text-primary font-bold' 
                                  : 'bg-background hover:bg-muted/50 border-border text-muted-foreground'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${isSelected ? 'bg-primary border-primary' : 'bg-muted border-border'}`}>
                                {isSelected && <Check className="w-3 h-3 text-white" />}
                              </div>
                              {act}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="pt-6">
                      <Button 
                        onClick={handleSaveDetails} 
                        disabled={isSaving}
                        className="w-full h-12 gradient-accent border-0 rounded-xl shadow-soft font-bold text-lg"
                      >
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (language === 'ar' ? 'حفظ كافة التغييرات' : 'Enregistrer tout')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar: Media & Photos */}
              <div className="space-y-6">
                <Card className="rounded-3xl border-none shadow-soft overflow-hidden">
                  <header className="bg-muted/30 p-4 border-b">
                    <h3 className="font-bold flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-purple-500" />
                      {language === 'ar' ? 'صور الروضة' : 'Photos de la crèche'}
                    </h3>
                  </header>
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {(editData.images || []).map((img: string, idx: number) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                          <img 
                            src={img.startsWith('http') ? img : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/kindergarten-images/${img}`} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                          <button 
                            onClick={() => {
                              const next = (editData.images || []).filter((_: any, i: number) => i !== idx);
                              setEditData({ ...editData, images: next });
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <label className="aspect-square flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all">
                        <Plus className="w-6 h-6 text-muted-foreground mb-1" />
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{language === 'ar' ? 'رفع صورة' : 'Upload'}</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center">
                      {language === 'ar' ? 'يتم حفظ الصور تلقائياً في Supabase Storage' : 'Les photos sont stockées sur Supabase'}
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-none shadow-soft bg-gradient-to-br from-primary to-primary/80 text-white">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Crown className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{language === 'ar' ? 'الباقة التجريبية مفعلة' : 'Essai actif'}</h4>
                      <p className="text-white/80 text-sm">
                        {language === 'ar' 
                          ? 'أنت تستفيد من كافة الميزات المهنية مجاناً خلال الفترة التجريبية.' 
                          : 'Toutes les fonctionnalités premium sont débloquées.'}
                      </p>
                    </div>
                    <div className="pt-2">
                        <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                            {language === 'ar' ? 'غير محدود' : 'Illimité'}
                        </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

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
                        <th className="px-4 py-3">{language === 'ar' ? 'الوسيلة' : 'Méthode'}</th>
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
                              {payment?.payment_method === 'card' ? (
                                <div className="flex flex-col">
                                  <Badge variant="outline" className="w-fit gap-1 text-[10px] border-primary/30 text-primary">
                                    <CreditCard className="w-2.5 h-2.5" />
                                    {language === 'ar' ? 'بطاقة بنكية' : 'Carte'}
                                  </Badge>
                                  {payment.transaction_id && (
                                    <span className="text-[10px] text-muted-foreground font-mono mt-1">
                                      {payment.transaction_id.substring(0, 8)}...
                                    </span>
                                  )}
                                </div>
                              ) : payment?.status === 'paid' ? (
                                <Badge variant="outline" className="w-fit text-[10px]">
                                  {language === 'ar' ? 'يدوي' : 'Manuel'}
                                </Badge>
                              ) : '-'}
                            </td>
                            <td className="px-4 py-4">
                              {!payment || payment.status === 'debt' ? (
                                <Badge variant="secondary" className="bg-coral/10 text-coral">{t('owner.debt')}</Badge>
                              ) : (
                                <Badge className="bg-mint/20 text-mint-foreground">{t('owner.paid')}</Badge>
                              )}
                            </td>
                            <td className="px-4 py-4 text-left">
                              {!payment || payment.status !== 'paid' ? (
                                <Button size="sm" variant="outline" onClick={() => handlePayment(child.id)}>
                                  <DollarSign className="w-4 h-4" /> {language === 'ar' ? 'دفع يدوي' : 'Régler'}
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  {payment.payment_date ? format(new Date(payment.payment_date), 'dd/MM/yyyy') : '-'}
                                </span>
                              )}
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
                <Button variant="outline" onClick={() => setIsEditing(true)}><Edit className="w-4 h-4 ml-1" />{language === 'ar' ? 'تعديل' : 'Modifier'}</Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-xs text-muted-foreground">اسم الروضة</label><p className="font-medium">{mockKindergarten.name}</p></div>
                  <div className="space-y-1"><label className="text-xs text-muted-foreground">البلدية</label><p className="font-medium">{mockKindergarten.municipality}</p></div>
                  <div className="space-y-1"><label className="text-xs text-muted-foreground">رقم الهاتف</label><p className="font-medium">{editData.phone || mockKindergarten.phone}</p></div>
                  <div className="space-y-1"><label className="text-xs text-muted-foreground">السعر الشهري</label><p className="font-medium">{mockKindergarten.pricePerMonth} دج</p></div>
                  <div className="space-y-1"><label className="text-xs text-muted-foreground">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label><p className="font-medium">{editData.email || '-'}</p></div>
                  <div className="space-y-1"><label className="text-xs text-muted-foreground">{language === 'ar' ? 'آخر تحديث' : 'Dernière mise à jour'}</label><p className="font-medium">{editData.updated_at ? format(new Date(editData.updated_at), 'dd/MM/yyyy HH:mm') : '-'}</p></div>
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
