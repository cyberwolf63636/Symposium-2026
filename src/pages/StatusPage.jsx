import React, { useState } from 'react';
import { supabase } from '../api/SupabaseClient';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import { Search, Download, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

const StatusPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  const checkStatus = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your registered email");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Checking records...");

    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('email', email)
        .single(); // We expect 1 user per email

      if (error || !data) throw new Error("No registration found for this email.");

      setUserData(data);
      toast.success("Record Found!", { id: toastId });

    } catch (err) {
      setUserData(null);
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = () => {
    if (!userData) return;

    const doc = new jsPDF();
    
    // -- TICKET DESIGN --
    // Header
    doc.setFillColor(15, 23, 42); // Dark Blue Background
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("INFOVISTA 2026", 105, 20, null, null, "center");
    doc.setFontSize(12);
    doc.text("Official Entry Ticket", 105, 30, null, null, "center");

    // Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    
    let y = 60;
    const addLine = (label, value) => {
      doc.setFont("helvetica", "bold");
      doc.text(label, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 80, y);
      y += 15;
    };

    addLine("Name:", userData.full_name);
    addLine("Reg Type:", userData.reg_type.toUpperCase());
    addLine("College:", userData.college);
    addLine("Transaction ID:", userData.transaction_id);
    addLine("Events:", Array.isArray(userData.selected_events) ? userData.selected_events.join(", ") : userData.selected_events);
    
    // Status Badge
    doc.setDrawColor(0, 128, 0);
    doc.setLineWidth(1);
    doc.roundedRect(150, 50, 40, 15, 3, 3);
    doc.setTextColor(0, 128, 0);
    doc.setFontSize(10);
    doc.text("CONFIRMED", 170, 60, null, null, "center");

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Please show this ticket at the registration desk.", 105, 280, null, null, "center");

    // Save
    doc.save(`Ticket_${userData.full_name}.pdf`);
    toast.success("Ticket Downloaded!");
  };

  return (
    <div className="pt-24 min-h-screen bg-slate-950 text-white flex flex-col items-center px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
        <h2 className="text-2xl font-bold text-center mb-2">Check Registration Status</h2>
        <p className="text-slate-400 text-center text-sm mb-8">Enter your email to verify status & download ticket.</p>

        <form onSubmit={checkStatus} className="space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="email" 
              placeholder="Enter your registered email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Check Status"}
          </button>
        </form>

        {userData && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-950 p-6 rounded-xl border border-slate-800">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg">{userData.full_name}</h3>
                <p className="text-sm text-slate-400">{userData.college}</p>
              </div>
              <div className="flex flex-col items-end">
                {userData.status === 'confirmed' && <span className="text-green-400 flex items-center gap-1 text-sm font-bold"><CheckCircle size={16}/> Approved</span>}
                {userData.status === 'rejected' && <span className="text-red-400 flex items-center gap-1 text-sm font-bold"><XCircle size={16}/> Rejected</span>}
                {userData.status === 'pending' && <span className="text-yellow-400 flex items-center gap-1 text-sm font-bold"><Clock size={16}/> Pending</span>}
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-300 border-t border-slate-800 pt-4 mb-6">
              <div className="flex justify-between">
                <span>Reg Type:</span>
                <span className="capitalize text-white">{userData.reg_type}</span>
              </div>
              <div className="flex justify-between">
                <span>Events:</span>
                <span className="text-white text-right w-1/2 truncate">
                  {Array.isArray(userData.selected_events) ? userData.selected_events.join(", ") : userData.selected_events}
                </span>
              </div>
            </div>

            {userData.status === 'confirmed' ? (
              <button 
                onClick={downloadTicket}
                className="w-full bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/50 py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition-all"
              >
                <Download size={18} /> Download Entry Ticket
              </button>
            ) : (
              <div className="text-center text-xs text-slate-500 bg-slate-900 p-2 rounded">
                {userData.status === 'pending' 
                  ? "Your verification is in progress. Please check back later." 
                  : "Your registration was invalid. Please contact support."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusPage;