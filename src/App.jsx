import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import ExplorePage from './pages/public/ExplorePage';
import EventDetailPage from './pages/public/EventDetailPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import CheckoutPage from './pages/public/CheckoutPage';
import TicketSuccessPage from './pages/public/TicketSuccessPage';
import OrganizersPage from './pages/public/OrganizersPage';
import OrderLookupPage from './pages/public/OrderLookupPage';
import FaqPage from './pages/public/FaqPage';
import TermsPage from './pages/public/TermsPage';
import PrivacyPage from './pages/public/PrivacyPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterEOPage from './pages/auth/RegisterEOPage';

// EO Pages
import EODashboardPage from './pages/eo/EODashboardPage';
import EOEventsPage from './pages/eo/EOEventsPage';
import EOCreateEventPage from './pages/eo/EOCreateEventPage';
import EOReportsPage from './pages/eo/EOReportsPage';
import EOStaffPage from './pages/eo/EOStaffPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminEOApprovalsPage from './pages/admin/AdminEOApprovalsPage';
import AdminEventApprovalsPage from './pages/admin/AdminEventApprovalsPage';
import AdminTransactionsPage from './pages/admin/AdminTransactionsPage';

// Staff Pages
import StaffScannerPage from './pages/staff/StaffScannerPage';
import StaffEventsPage from './pages/staff/StaffEventsPage';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Marketplace Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/jelajah" element={<ExplorePage />} />
              <Route path="/event/:id" element={<EventDetailPage />} />
              <Route path="/penyelenggara" element={<OrganizersPage />} />
              <Route path="/cek-pesanan" element={<OrderLookupPage />} />
              <Route path="/tentang" element={<AboutPage />} />
              <Route path="/kontak" element={<ContactPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/syarat-ketentuan" element={<TermsPage />} />
              <Route path="/kebijakan-privasi" element={<PrivacyPage />} />
              <Route path="/checkout/:eventId" element={<CheckoutPage />} />
              <Route path="/tiket-berhasil/:orderId" element={<TicketSuccessPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/eo/register" element={<RegisterEOPage />} />

            {/* Event Organizer (EO) Protected Routes */}
            <Route path="/eo" element={<DashboardLayout requiredRole="eo" />}>
              <Route path="dashboard" element={<EODashboardPage />} />
              <Route path="events" element={<EOEventsPage />} />
              <Route path="events/new" element={<EOCreateEventPage />} />
              <Route path="reports" element={<EOReportsPage />} />
              <Route path="staff" element={<EOStaffPage />} />
            </Route>

            {/* Admin Platform Protected Routes */}
            <Route path="/admin" element={<DashboardLayout requiredRole="admin" />}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="eo-approvals" element={<AdminEOApprovalsPage />} />
              <Route path="event-approvals" element={<AdminEventApprovalsPage />} />
              <Route path="transactions" element={<AdminTransactionsPage />} />
            </Route>

            {/* Staff Verifikator Protected Routes */}
            <Route path="/staff" element={<DashboardLayout requiredRole="staff" />}>
              <Route path="scanner" element={<StaffScannerPage />} />
              <Route path="events" element={<StaffEventsPage />} />
            </Route>
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
