import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import CarDetailsPage from './pages/CarDetailsPage';
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage';
import HostDashboardPage from './pages/HostDashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RentalManagementPage from './pages/RentalManagementPage';
import AddCarPage from './pages/AddCarPage';
import PaymentPage from './pages/PaymentPage';
import MessagesPage from './pages/MessagesPage';
import HostProfilePage from './pages/HostProfilePage';
import NotificationsPage from './pages/NotificationsPage';

function FooterWrapper() {
  const location = useLocation();
  if (location.pathname !== '/') return null;
  return <Footer />;
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public/Guest Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/car/:id" element={<CarDetailsPage />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Host Routes */}
            <Route path="/host/dashboard" element={<HostDashboardPage />} />
            <Route path="/host-profile/:id" element={<HostProfilePage />} />
            <Route path="/add-car" element={<AddCarPage />} />
            <Route path="/edit-car/:id" element={<AddCarPage />} />
            
            {/* Rental Management Route */}
            <Route path="/rental/:id" element={<RentalManagementPage />} />
            
            {/* Legacy Admin Routes (Redirects) */}
            <Route path="/admin" element={<Navigate to="/profile" replace />} />
            <Route path="/admin/login" element={<Navigate to="/login" replace />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Common Routes */}
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Routes>
        </main>
        <FooterWrapper />
      </div>
    </Router>
  );
}

export default App;
