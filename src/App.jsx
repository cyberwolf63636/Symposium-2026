import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // ✅ NEW: Import Toaster

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
      {/* ✅ NEW: This container renders all your popups globally */}
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          style: {
            background: '#1e293b', // Dark blue-gray background
            color: '#fff', // White text
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
        </Route>

        {/* ADMIN ROUTES (Fullscreen - No Navbar/Footer) */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

      </Routes>
    </>
  );
};

export default App;