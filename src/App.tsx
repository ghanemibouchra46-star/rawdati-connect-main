import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
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
import NotFound from "./pages/NotFound";

import AIChatbot from "./components/AIChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
