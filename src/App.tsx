import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PalletProvider } from "@/contexts/PalletContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PalletTray from "@/components/PalletTray";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Pallets from "./pages/Pallets";
import PalletDetail from "./pages/PalletDetail";
import PalletSummary from "./pages/PalletSummary";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import About from "./pages/About";
import AdminImport from "./pages/AdminImport";
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
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route
                    path="/pallets"
                    element={
                      <ProtectedRoute>
                        <Pallets />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pallets/:palletId"
                    element={
                      <ProtectedRoute>
                        <PalletDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/pallet" element={<PalletSummary />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/rug-program" element={<RugProgram />} />
                  <Route path="/rechargeable-table-lamps" element={<MeridianLamp />} />
                  <Route path="/size-guide" element={<SizeGuide />} />
                  <Route path="/favorites" element={<Favorites />} />
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
