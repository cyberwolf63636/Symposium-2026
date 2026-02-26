import React, { useState, useEffect } from 'react';
import { X, Sparkles, MapPin } from 'lucide-react';

const CelebrationPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if they've already seen the popup this session
    const hasSeenPopup = sessionStorage.getItem('infovista_hype');
    if (!hasSeenPopup) {
      // Slight delay so the site loads first, then BAM!
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    sessionStorage.setItem('infovista_hype', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg overflow-hidden bg-slate-900 border-2 border-blue-500 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.3)] animate-in zoom-in-95 duration-500">
        
        {/* Close Button */}
        <button 
          onClick={closePopup}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="flex justify-center mb-4 text-yellow-400 animate-bounce">
            <Sparkles size={48} />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
            THE DAY IS <span className="text-blue-500">HERE!</span>
          </h2>
          
          <p className="text-lg text-slate-300 mb-6">
            Welcome to INFOVISTA 2026. Get ready for an incredible day of technology, innovation, and competition.
          </p>

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6 inline-block text-left">
            <p className="text-white flex items-center gap-2 mb-2 font-bold">
              <MapPin size={18} className="text-red-400" /> Offline Registrations Open!
            </p>
            <p className="text-sm text-slate-400 pl-6">
              Head to the <strong>Main Auditorium</strong> before 10:00 AM to secure your spot.
            </p>
          </div>

          <button 
            onClick={closePopup}
            className="w-full py-4 font-bold text-white transition-all bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl hover:scale-105 shadow-lg shadow-blue-900/20"
          >
            LET'S GO! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

export default CelebrationPopup;