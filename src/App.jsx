import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import VocationalTest from '@/pages/VocationalTest';
import TestResults from '@/pages/TestResults';
import ExploreCareers from '@/pages/ExploreCareers';
import CareerDetail from '@/pages/CareerDetail';
import InterviewSimulation from '@/pages/InterviewSimulation';
import Contact from '@/pages/Contact';
import Community from '@/pages/Community';
import Profile from '@/pages/Profile';
import EditProfile from '@/pages/EditProfile';
import Dashboard from '@/pages/Dashboard';
import Notifications from '@/pages/Notifications';
import QAPage from '@/pages/QAPage';
import QuestionDetail from '@/pages/QuestionDetail';
import Search from '@/pages/Search';
import VocationalHistory from '@/pages/VocationalHistory';
import Mentorias from '@/pages/Mentorias';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      {/* Add your page Route elements here */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<Home />} />
      <Route path="/teste-vocacional" element={<VocationalTest />} />
      <Route path="/resultado-teste" element={<TestResults />} />
      <Route path="/carreiras" element={<ExploreCareers />} />
      <Route path="/carreira/:id" element={<CareerDetail />} />
      <Route path="/simulacao-entrevista" element={<InterviewSimulation />} />
      <Route path="/contato" element={<Contact />} />
      <Route path="/comunidade" element={<Community />} />
      <Route path="/editar-perfil" element={<EditProfile />} />
      <Route path="/perfil/:id" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/notificacoes" element={<Notifications />} />
      <Route path="/perguntas" element={<QAPage />} />
      <Route path="/pergunta/:id" element={<QuestionDetail />} />
      <Route path="/buscar" element={<Search />} />
      <Route path="/historico-testes" element={<VocationalHistory />} />
      <Route path="/mentorias" element={<Mentorias />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App