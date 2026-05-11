import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import ComingSoon from "./pages/ComingSoon";
import Index from "./pages/Index";
import Favorites from "./pages/Favorites";
import About from "./pages/About";
import AdminImport from "./pages/AdminImport";
import AdminProducts from "./pages/AdminProducts";
import Catalog from "./pages/Catalog";
import Auth from "./pages/Auth";
import RugProgram from "./pages/RugProgram";
import MeridianLamp from "./pages/MeridianLamp";
import SizeGuide from "./pages/SizeGuide";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const PREVIEW_KEY = "comeback_preview_access";
const PREVIEW_PASSWORD = "comeback2026";

const hasPreviewAccess = () => {
  if (typeof window === "undefined") return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") === PREVIEW_PASSWORD) {
      localStorage.setItem(PREVIEW_KEY, "1");
      return true;
    }
    return localStorage.getItem(PREVIEW_KEY) === "1";
  } catch {
    return false;
  }
};

const App = () => {
  if (!hasPreviewAccess()) {
    return (
      <HelmetProvider>
        <ComingSoon />
      </HelmetProvider>
    );
  }
  return (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          
            <FavoritesProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/catalog" element={<ProtectedRoute><Catalog /></ProtectedRoute>} />
                  {/* Legacy redirects → catalog */}
                  <Route path="/products" element={<Navigate to="/catalog" replace />} />
                  <Route path="/product/:id" element={<Navigate to="/catalog" replace />} />
                  <Route path="/pallets" element={<Navigate to="/catalog" replace />} />
                  <Route path="/pallets/:palletId" element={<Navigate to="/catalog" replace />} />
                  <Route path="/pallet" element={<Navigate to="/catalog" replace />} />
                  <Route path="/cart" element={<Navigate to="/catalog" replace />} />
                  <Route path="/rug-program" element={<RugProgram />} />
                  <Route path="/rechargeable-table-lamps" element={<MeridianLamp />} />
                  <Route path="/size-guide" element={<SizeGuide />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/admin/products" element={<Navigate to="/admin" replace />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminProducts />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/import"
                    element={
                      <ProtectedRoute>
                        <AdminImport />
                      </ProtectedRoute>
                    }
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                
              </BrowserRouter>
            </FavoritesProvider>
          
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
