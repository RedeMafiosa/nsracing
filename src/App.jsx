import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { SupabaseAuthProvider, useSupabaseAuth } from '@/lib/SupabaseAuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import Casa from './pages/Casa';
import Lives from './pages/Lives';
import Arquivo from './pages/Arquivo';
import Suporte from './pages/Suporte';
import Perfil from './pages/Perfil';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const AuthenticatedApp = () => {
  const { isLoadingAuth } = useSupabaseAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="font-display text-primary text-sm tracking-wider neon-text-sm">NsRacing</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<Casa />} />
        <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
          <Route path="/lives" element={<Lives />} />
          <Route path="/arquivo" element={<Arquivo />} />
          <Route path="/suporte" element={<Suporte />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <SupabaseAuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </SupabaseAuthProvider>
    </AuthProvider>
  );
}

export default App;