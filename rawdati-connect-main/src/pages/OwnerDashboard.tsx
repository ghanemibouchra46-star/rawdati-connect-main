import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Building2, Users, Edit, Plus, Clock, Phone, MapPin, DollarSign, LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

// Mock data for demonstration
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

const mockRequests: Array<{
  id: string;
  parentName: string;
  childName: string;
  childAge: number;
  phone: string;
  status: string;
  createdAt: string;
}> = [];

const OwnerDashboard = () => {
  const [requests, setRequests] = useState(mockRequests);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => {
            checkOwnerRole(session.user.id);
          }, 0);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/owner-auth');
  };

  const handleStatusChange = (requestId: string, newStatus: string) => {
    setRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
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

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
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
                  <ArrowRight className="w-4 h-4" />
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
                  <p className="text-3xl font-bold text-primary">{requests.length}</p>
                </div>
                <Users className="w-10 h-10 text-primary/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">قيد الانتظار</p>
                  <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
                </div>
                <Clock className="w-10 h-10 text-amber-500/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-mint/10 to-mint/5 border-mint/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">مقبولة</p>
                  <p className="text-3xl font-bold text-mint-foreground">{approvedCount}</p>
                </div>
                <Users className="w-10 h-10 text-mint/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="requests" className="gap-2">
              <Users className="w-4 h-4" />
              طلبات التسجيل
            </TabsTrigger>
            <TabsTrigger value="info" className="gap-2">
              <Building2 className="w-4 h-4" />
              معلومات الروضة
            </TabsTrigger>
          </TabsList>

          {/* Registration Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  طلبات التسجيل الواردة
                </CardTitle>
                <CardDescription>
                  إدارة طلبات تسجيل الأطفال المقدمة من الأولياء
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div 
                      key={request.id}
                      className="p-4 rounded-xl border border-border bg-card hover:shadow-soft transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-foreground">{request.childName}</h3>
                            {getStatusBadge(request.status)}
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span>الولي: {request.parentName}</span>
                            <span>العمر: {request.childAge} سنوات</span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {request.phone}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            تاريخ الطلب: {request.createdAt}
                          </p>
                        </div>
                        
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm"
                              onClick={() => handleStatusChange(request.id, 'approved')}
                              className="gradient-accent border-0"
                            >
                              قبول
                            </Button>
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(request.id, 'rejected')}
                            >
                              رفض
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {requests.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>لا توجد طلبات تسجيل حالياً</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Kindergarten Info Tab */}
          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      معلومات الروضة
                    </CardTitle>
                    <CardDescription>
                      تعديل بيانات الروضة والخدمات المقدمة
                    </CardDescription>
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Edit className="w-4 h-4" />
                    تعديل
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">اسم الروضة</label>
                      <p className="font-semibold text-foreground">{mockKindergarten.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">البلدية</label>
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {mockKindergarten.municipality}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">العنوان</label>
                      <p className="font-semibold text-foreground">{mockKindergarten.address}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">رقم الهاتف</label>
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        {mockKindergarten.phone}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">السعر الشهري</label>
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        {mockKindergarten.pricePerMonth.toLocaleString()} دج
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">ساعات العمل</label>
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        {mockKindergarten.workingHours}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">الخدمات المقدمة</label>
                  <div className="flex flex-wrap gap-2">
                    {mockKindergarten.services.map((service, index) => (
                      <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                        {service}
                      </Badge>
                    ))}
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-primary">
                      <Plus className="w-3 h-3 ml-1" />
                      إضافة
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">صور الروضة</label>
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center border-2 border-dashed border-border">
                      <Plus className="w-6 h-6 text-muted-foreground" />
                    </div>
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

export default OwnerDashboard;
