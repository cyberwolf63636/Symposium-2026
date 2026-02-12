import React, { useState, useEffect } from 'react';
import { supabase } from '../api/SupabaseClient';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Shield, Lock, ChevronRight, Loader2 } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthorizedDevice, setIsAuthorizedDevice] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 🛡️ SECURITY LAYER 1: DEVICE AUTHORIZATION
  // Prevents the login page from even rendering unless authorized.
  useEffect(() => {
    // 1. Check if this device is already trusted
    const localKey = localStorage.getItem('info_sec_key');
    
    // 2. Check if the URL contains the one-time setup code
    // Example usage: your-site.com/admin?setup=cyberwolf2026
    const urlCode = searchParams.get('setup');

    if (localKey === 'valid_admin_device') {
      setIsAuthorizedDevice(true);
    } else if (urlCode === 'cyberwolf2026') { 
      // ✅ Device Authorized! Save the key.
      localStorage.setItem('info_sec_key', 'valid_admin_device');
      setIsAuthorizedDevice(true);
      toast.success("Device Authorized Successfully!");
      // Clean the URL so the secret code isn't visible
      navigate('/admin', { replace: true });
    } else {
      // ❌ Unauthorized access attempt -> Kick to Home
      navigate('/'); 
    }
  }, [navigate, searchParams]);

  // 🛡️ SECURITY LAYER 2: MAGIC LINK & EMAIL WHITELIST
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 🔒 STRICT WHITELIST: Only this email can trigger a login link
    const ALLOWED_ADMINS = ["pugazhmanik24@gmail.com"]; 

    if (!ALLOWED_ADMINS.includes(email)) {
      toast.error("Security Alert: Unauthorized Email Access");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          // Redirects the user back to the dashboard after they click the email link
          emailRedirectTo: window.location.origin + '/admin/dashboard', 
        },
      });

      if (error) throw error;
      toast.success("Magic Link sent! Check your inbox.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // If the device isn't authorized, don't render anything (prevents flickering)
  if (!isAuthorizedDevice) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600/20 p-4 rounded-full">
            <Shield className="text-blue-500 w-10 h-10" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-white text-center mb-2">Secure Admin Access</h2>
        <p className="text-slate-400 text-center text-sm mb-8">Enter authorized credential to continue.</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Administrator Email</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                placeholder="admin@college.edu"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Send Magic Link <ChevronRight size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;