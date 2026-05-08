import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PalletProvider } from "@/contexts/PalletContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PalletTray from "@/components/PalletTray";
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

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <PalletProvider>
            <FavoritesProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/catalog" element={<Catalog />} />
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
                  <Route path="/catalog" element={<Catalog />} />
                  <Route
                    path="/admin/products"
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
                <PalletTray />
              </BrowserRouter>
            </FavoritesProvider>
          </PalletProvider>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
