import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "./integrations/supabase/client";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { useToast } from "./hooks/use-toast";
import Index from "./pages/Index";
import Welcome from "./pages/Welcome";
import About from "./pages/About";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerAuth from "./pages/OwnerAuth";
import OwnerDashboard from "./pages/OwnerDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import ParentNotifications from "./pages/ParentNotifications";
import ParentPhotos from "./pages/ParentPhotos";
import ParentSchedule from "./pages/ParentSchedule";
import ParentSettings from "./pages/ParentSettings";
import Kindergartens from "./pages/Kindergartens";
import ClothingStores from "./pages/ClothingStores";
import Doctors from "./pages/Doctors";
import SpeechTherapy from "./pages/SpeechTherapy";
import Recovery from "./pages/Recovery";
import NotFound from "./pages/NotFound";

import AIChatbot from "./components/AIChatbot";

const queryClient = new QueryClient();

const AuthHandler = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    // Aggressive manual check for tokens (Fallback for onAuthStateChange)
    const checkTokenManual = () => {
      const hash = window.location.hash;
      const search = window.location.search;
      if (hash.includes('access_token=') && (hash.includes('type=recovery') || search.includes('type=recovery'))) {
        console.log("Manual token capture: Recovery detected");

        // Check current path to determine where to redirect
        if (window.location.pathname.includes('/admin-auth')) {
          navigate('/admin-auth?recovery=true', { replace: true });
        } else if (window.location.pathname.includes('/owner-auth')) {
          navigate('/owner-auth?recovery=true', { replace: true });
        } else {
          navigate('/auth?recovery=true', { replace: true });
        }

        toast({
          title: language === 'ar' ? "تم كشف جلسة استعادة" : "Recovery session detected",
          description: language === 'ar' ? "يرجى تعيين كلمة المرور الجديدة" : "Please set your new password",
        });
        return true;
      }
      return false;
    };

    checkTokenManual();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event, session ? "Session set" : "No session");
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && window.location.href.includes('type=recovery'))) {
        if (window.location.pathname.includes('/admin-auth')) {
          navigate('/admin-auth?recovery=true', { replace: true });
        } else if (window.location.pathname.includes('/owner-auth')) {
          navigate('/owner-auth?recovery=true', { replace: true });
        } else {
          navigate('/auth?recovery=true', { replace: true });
        }
        toast({
          title: language === 'ar' ? "تم تفعيل وضع الاستعادة" : "Recovery mode active",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, language, toast]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <AuthHandler />
          <AIChatbot />
          <Routes>
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/" element={< Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin-auth" element={<AdminAuth />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/owner-auth" element={<OwnerAuth />} />
            <Route path="/owner" element={<OwnerDashboard />} />
            <Route path="/parent" element={<ParentDashboard />} />
            <Route path="/parent/notifications" element={<ParentNotifications />} />
            <Route path="/parent/photos" element={<ParentPhotos />} />
            <Route path="/parent/schedule" element={<ParentSchedule />} />
            <Route path="/parent/settings" element={<ParentSettings />} />
            <Route path="/kindergartens" element={<Kindergartens />} />
            <Route path="/clothing-stores" element={<ClothingStores />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/speech-therapy" element={<SpeechTherapy />} />
            <Route path="/recovery" element={<Recovery />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
