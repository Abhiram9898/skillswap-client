import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Footer from './pages/Footer';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import ScrollToTop from './components/ScrollToTop';

import UserBookingsPage from './pages/UserBookingsPage';
import InstructorBookingsPage from './pages/InstructorBookingsPage';
import InstructorDashboard from './pages/InstructorDashboard';
import MySkillsPage from './pages/MySkillsPage';
import CreateSkillPage from './pages/CreateSkillPage';
import InstructorSettingsPage from './pages/InstructorSettingsPage';
import EditSkillPage from './pages/EditSkillPage';

import { useSelector } from 'react-redux';
import { Suspense, lazy } from 'react';

// Lazy loaded pages
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginForm'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const SkillListPage = lazy(() => import('./pages/SkillList'));
const SkillDetailPage = lazy(() => import('./pages/SkillDetail'));
const ProfilePage = lazy(() => import('./pages/ProfileScreen'));
const MyBookingsPage = lazy(() => import('./pages/MyBookingsPage'));
const ChatPage = lazy(() => import('./pages/ChatPage')); // Accepts bookingId via useParams
const BookSkillPage = lazy(() => import('./pages/BookSkillPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboard'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// ✅ Role-based Dashboard Resolver
const RoleBasedDashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);

  if (userInfo?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (userInfo?.role === 'instructor') return <Navigate to="/instructor/dashboard" replace />;

  return <DashboardPage />;
};

const App = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow">
          <Suspense
            fallback={
              <div className="text-center py-20 text-lg text-blue-600 animate-pulse">
                Loading Page...
              </div>
            }
          >
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route
                path="/login"
                element={userInfo ? <Navigate to="/dashboard" replace /> : <LoginPage />}
              />
              <Route
                path="/register"
                element={userInfo ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
              />

              {/* Skill Browsing */}
              <Route path="/skills">
                <Route index element={<SkillListPage />} />
                <Route path=":id" element={<SkillDetailPage />} />
              </Route>

              {/* Private Routes */}
              <Route element={<PrivateRoute />}>
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route path="/my-bookings" element={<MyBookingsPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/chat/:bookingId" element={<ChatPage />} />
                <Route path="/book/:id" element={<BookSkillPage />} />
                <Route path="/dashboard" element={<RoleBasedDashboard />} />

                {/* Instructor Routes */}
                <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
                <Route path="/instructor/my-skills" element={<MySkillsPage />} />
                <Route path="/instructor/create-skill" element={<CreateSkillPage />} />
                <Route path="/instructor/settings" element={<InstructorSettingsPage />} />
                <Route path="/instructor/bookings" element={<InstructorBookingsPage />} />
                <Route path="/instructor/edit-skill/:id" element={<EditSkillPage />} />

                {/* ✅ NEW: Instructor Chat Overview */}
                <Route path="/instructor/chat" element={<ChatPage />} />

                {/* User Bookings */}
                <Route path="/bookings" element={<UserBookingsPage />} />
              </Route>

              {/* Admin Only Routes */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route path="dashboard" element={<AdminDashboardPage />} />
              </Route>

              {/* 404 Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
