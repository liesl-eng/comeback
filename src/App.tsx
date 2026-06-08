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
import Restocking from "./pages/Restocking";
import Favorites from "./pages/Favorites";
import About from "./pages/About";
import AdminImport from "./pages/AdminImport";
import AdminProducts from "./pages/AdminProducts";
import AdminImports from "./pages/AdminImports";

import Auth from "./pages/Auth";
import RugProgram from "./pages/RugProgram";
import LightingProgram from "./pages/LightingProgram";
import MirrorProgram from "./pages/MirrorProgram";
import MeridianLamp from "./pages/MeridianLamp";
import SizeGuide from "./pages/SizeGuide";
import Seating from "./pages/Seating";
import Tables from "./pages/Tables";
import Beds from "./pages/Beds";
import Cabinets from "./pages/Cabinets";
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
                  <Route path="/auth" element={<Auth />} />
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
                  {/* All other routes show the Restocking placeholder */}
                  <Route path="*" element={<Restocking />} />
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
