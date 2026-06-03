import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { CatalogOrderProvider } from "@/contexts/CatalogOrderContext";
import { BuildOrderProvider } from "@/contexts/BuildOrderContext";
import OrderBar from "@/components/OrderBar";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Favorites from "./pages/Favorites";
import About from "./pages/About";
import AdminImport from "./pages/AdminImport";
import AdminProducts from "./pages/AdminProducts";
import AdminImports from "./pages/AdminImports";
import Catalog from "./pages/Catalog";
import Auth from "./pages/Auth";
import RugProgram from "./pages/RugProgram";
import LightingProgram from "./pages/LightingProgram";
import MirrorProgram from "./pages/MirrorProgram";
import MeridianLamp from "./pages/MeridianLamp";
import SizeGuide from "./pages/SizeGuide";
import Seating from "./pages/Seating";
import Tables from "./pages/Tables";
import Beds from "./pages/Beds";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => {
  return (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          
            <FavoritesProvider>
              <CatalogOrderProvider>
              <BuildOrderProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <ScrollToTop />
                <OrderBar />
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
                  <Route path="/rugs" element={<Navigate to="/rug-program" replace />} />
                  <Route path="/lighting-program" element={<LightingProgram />} />
                  <Route path="/lighting" element={<Navigate to="/lighting-program" replace />} />
                  <Route path="/Lighting-Program" element={<Navigate to="/lighting-program" replace />} />
                  <Route path="/mirror-program" element={<MirrorProgram />} />
                  <Route path="/mirrors" element={<Navigate to="/mirror-program" replace />} />
                  <Route path="/Mirror-Program" element={<Navigate to="/mirror-program" replace />} />
                  <Route path="/rechargeable-table-lamps" element={<MeridianLamp />} />
                  <Route path="/seating" element={<Seating />} />
                  <Route path="/tables" element={<Tables />} />
                  <Route path="/beds" element={<Beds />} />
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
                  <Route
                    path="/admin/imports"
                    element={
                      <ProtectedRoute>
                        <AdminImports />
                      </ProtectedRoute>
                    }
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
                
              </BrowserRouter>
              </BuildOrderProvider>
              </CatalogOrderProvider>
            </FavoritesProvider>
          
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
  );
};

export default App;
