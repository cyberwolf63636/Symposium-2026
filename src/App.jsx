import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import RegistrationPage from './pages/RegistrationPage';
import StatusPage from './pages/StatusPage';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// ✅ NEW: Import your Popup and 404 Components
// (Make sure the paths match where you saved them! Adjust to './pages/NotFound' if you put it in the pages folder)
import CelebrationPopup from './components/CelebrationPopup';
import NotFound from './pages/NotFound'; 

// 1. Layout for Public Pages (Navbar + Footer)
const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet /> {/* This renders the specific page content */}
      </main>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <>
      {/* ✅ NEW: Global Celebration Popup - Will show once per session */}
      <CelebrationPopup />

      {/* This container renders all your toast popups globally */}
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          style: {
            background: '#1e293b', 
            color: '#fff', 
            border: '1px solid #334155',
          },
        }}
      />

      <Routes>
        
        {/* PUBLIC ROUTES (With Navbar & Footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/status" element={<StatusPage />} />
          
          {/* ✅ NEW: 404 Catch-All Route */}
          {/* Must be at the bottom of this block. Any unknown URL will trigger this! */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* ADMIN ROUTES (Fullscreen - No Navbar/Footer) */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

      </Routes>
    </>
  );
};

export default App;