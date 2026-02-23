import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CityPage from "./pages/CityPage";
import Contact from "./pages/Contact";
import EmbedPage from "./pages/EmbedPage";
import NearestPharmacy from "./pages/NearestPharmacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/il/:citySlug" element={<CityPage />} />
          <Route path="/il/:citySlug/:districtSlug" element={<CityPage />} />
          <Route path="/en-yakin" element={<NearestPharmacy />} />
          <Route path="/iletisim" element={<Contact />} />
          <Route path="/sitene-ekle" element={<EmbedPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
