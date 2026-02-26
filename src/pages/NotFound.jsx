import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f172a] text-white p-6 text-center">
      <Terminal size={80} className="text-blue-500 mb-6 opacity-80" />
      
      <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
        404
      </h1>
      
      <h2 className="text-2xl md:text-3xl font-bold mb-4">
        System Error: Page Not Found
      </h2>
      
      <p className="text-slate-400 max-w-md mb-8">
        It looks like you've wandered into an undocumented sector. The page you are looking for has been moved, deleted, or never existed.
      </p>
      
      <Link 
        to="/" 
        className="flex items-center gap-2 px-8 py-4 font-bold text-white transition-all border border-blue-500 rounded-full hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
      >
        <Home size={20} />
        Return to Base
      </Link>
    </div>
  );
};

export default NotFound;