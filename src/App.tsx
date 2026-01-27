import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import Kindergartens from "./pages/Kindergartens";
import Auth from "./pages/Auth";
import OwnerAuth from "./pages/OwnerAuth";
import OwnerDashboard from "./pages/OwnerDashboard";
import ParentDashboard from "./pages/ParentDashboard";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import Doctors from "./pages/Doctors";
import SpeechTherapy from "./pages/SpeechTherapy";
import ClothingStores from "./pages/ClothingStores";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/kindergartens" element={<Kindergartens />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/parent" element={<ParentDashboard />} />
            <Route path="/owner-auth" element={<OwnerAuth />} />
            <Route path="/owner" element={<OwnerDashboard />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/speech-therapy" element={<SpeechTherapy />} />
            <Route path="/clothing-stores" element={<ClothingStores />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin-auth" element={<AdminAuth />} />
            <Route path="/admin" element={<AdminDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
