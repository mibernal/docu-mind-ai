// src/App.tsx - Agregar Onboarding a las rutas
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding"; // NUEVA IMPORTACIÓN
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import DocumentDetail from "./pages/DocumentDetail";
import DocumentUpload from "./pages/DocumentUpload";
import Templates from "./pages/Templates";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.status === 429) return false;
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: (failureCount, error: any) => {
        if (error?.status === 429) return false;
        return failureCount < 1;
      },
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // NUEVA LÓGICA: Redirigir a onboarding si el usuario no tiene preferencias
  if (!user.preferences && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route 
                path="/" 
                element={
                  <PublicRoute>
                    <Index />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              
              {/* NUEVA RUTA DE ONBOARDING */}
              <Route 
                path="/onboarding" 
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <Onboarding />
                    </ErrorBoundary>
                  </ProtectedRoute>
                } 
              />
              
              {/* Rutas protegidas con Error Boundary */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <Dashboard />
                    </ErrorBoundary>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/documents" 
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <Documents />
                    </ErrorBoundary>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/documents/:id" 
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <DocumentDetail />
                    </ErrorBoundary>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/documents/upload" 
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <DocumentUpload />
                    </ErrorBoundary>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/templates" 
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <Templates />
                    </ErrorBoundary>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <Settings />
                    </ErrorBoundary>
                  </ProtectedRoute>
                } 
              />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            <Toaster 
              position="top-right"
              duration={4000}
              expand={true}
              closeButton
              richColors
            />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;