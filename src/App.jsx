import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import ExplorePage from './pages/public/ExplorePage';
import EventDetailPage from './pages/public/EventDetailPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Marketplace Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/jelajah" element={<ExplorePage />} />
              <Route path="/event/:id" element={<EventDetailPage />} />
              <Route path="/tentang" element={<AboutPage />} />
              <Route path="/kontak" element={<ContactPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
