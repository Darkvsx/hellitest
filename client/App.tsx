import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ServicesProvider } from "@/hooks/useServices";
import { CartProvider } from "@/hooks/useCart";
import { OrdersProvider } from "@/hooks/useOrders";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LiveChat } from "@/components/LiveChat";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Account from "./pages/Account";
import AdminDashboard from "./pages/AdminDashboard";
import EnhancedAdminDashboard from "./pages/EnhancedAdminDashboard";
import FAQ from "./pages/FAQ";
import Bundles from "./pages/Bundles";
import About from "./pages/About";
import Contact from "./pages/Contact";
import OrderTracking from "./pages/OrderTracking";
import Checkout from "./pages/Checkout";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ServicesProvider>
            <CartProvider>
              <OrdersProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/cart"
                      element={
                        <ProtectedRoute>
                          <Cart />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/account"
                      element={
                        <ProtectedRoute>
                          <Account />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/bundles" element={<Bundles />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route
                      path="/order/:orderId"
                      element={
                        <ProtectedRoute>
                          <OrderTracking />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute requireAdmin>
                          <EnhancedAdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <LiveChat />
                </BrowserRouter>
              </OrdersProvider>
            </CartProvider>
          </ServicesProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
