import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { 
  Ticket, 
  MapPin, 
  ArrowRight, 
  CheckCircle, 
  QrCode, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Download, 
  Share2 
} from 'lucide-react';
import { api } from '../../services/api';

export const DigitalTicketCard = ({ ticket }) => {
  const { routes, stops } = useTransit();
  const [isValidating, setIsValidating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(ticket.status || 'CONFIRMED');

  const route = routes.find(r => r.id === ticket.routeId);
  const originStop = stops.find(s => s.id === ticket.originStopId);
  const destStop = stops.find(s => s.id === ticket.destinationStopId);

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const res = await api.validateTicket(ticket.id);
      if (res.success) {
        setCurrentStatus('VALIDATED');
      }
    } catch (err) {
      console.error('Validation failed', err);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="relative rounded-2xl glass-panel border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 hover:border-cyan-500/40">
      
      {/* Top Header Strip */}
      <div className="px-5 py-3 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
            <Ticket className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono text-xs font-bold text-white tracking-wider">{ticket.id}</span>
            <span className="text-[10px] text-slate-400 block font-sans">Official Transit Boarding Pass</span>
          </div>
        </div>

        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
          currentStatus === 'VALIDATED'
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
        }`}>
          {currentStatus}
        </span>
      </div>

      {/* Main Ticket Body */}
      <div className="p-5 space-y-4">
        
        {/* Route Details */}
        <div className="flex items-center justify-between">
          <div>
            <span
              className="text-[11px] font-extrabold px-2 py-0.5 rounded"
              style={{
                backgroundColor: `${route?.color || '#38bdf8'}20`,
                color: route?.color || '#38bdf8'
              }}
            >
              {route?.number || 'LINE'}
            </span>
            <h4 className="font-bold text-sm text-white mt-1">
              {route?.name || 'Metropolitan Line'}
            </h4>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Total Fare</span>
            <span className="text-xl font-extrabold text-white font-mono">₹{ticket.fareTotal}</span>
          </div>
        </div>

        {/* Origin to Destination Pathway */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between">
          <div className="flex-1">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-cyan-400" />
              From
            </span>
            <p className="font-bold text-xs text-white mt-0.5 truncate">
              {originStop?.name || 'Origin Station'}
            </p>
            <span className="text-[10px] font-mono text-cyan-400">{originStop?.code || 'ORG'}</span>
          </div>

          <div className="px-3 flex flex-col items-center justify-center">
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="text-[9px] text-slate-400 font-mono mt-0.5">DIRECT</span>
          </div>

          <div className="flex-1 text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-end gap-1">
              <MapPin className="w-3 h-3 text-rose-400" />
              To
            </span>
            <p className="font-bold text-xs text-white mt-0.5 truncate">
              {destStop?.name || 'Destination Station'}
            </p>
            <span className="text-[10px] font-mono text-rose-400">{destStop?.code || 'DST'}</span>
          </div>
        </div>

        {/* Passenger & Seats info */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Passenger</span>
            <span className="font-semibold text-slate-200">{ticket.passengerName}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Seats Reserved</span>
            <span className="font-semibold text-slate-200 font-mono">{ticket.seatCount} Person(s)</span>
          </div>
        </div>

        {/* Decorative Scannable QR Pass Section */}
        <div className="relative pt-3 border-t border-dashed border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* SVG Generative QR Code Box */}
            <div className="w-16 h-16 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md">
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current">
                {/* QR Pattern Representation */}
                <rect x="0" y="0" width="30" height="30" fill="#000" />
                <rect x="5" y="5" width="20" height="20" fill="#fff" />
                <rect x="10" y="10" width="10" height="10" fill="#000" />
                
                <rect x="70" y="0" width="30" height="30" fill="#000" />
                <rect x="75" y="5" width="20" height="20" fill="#fff" />
                <rect x="80" y="10" width="10" height="10" fill="#000" />

                <rect x="0" y="70" width="30" height="30" fill="#000" />
                <rect x="5" y="75" width="20" height="20" fill="#fff" />
                <rect x="10" y="80" width="10" height="10" fill="#000" />

                <rect x="38" y="10" width="8" height="15" fill="#000" />
                <rect x="50" y="25" width="14" height="8" fill="#000" />
                <rect x="35" y="45" width="30" height="12" fill="#000" />
                <rect x="40" y="65" width="18" height="10" fill="#000" />
                <rect x="70" y="50" width="15" height="20" fill="#000" />
                <rect x="75" y="75" width="20" height="15" fill="#000" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">SCAN AT TURNSTILE</span>
              <span className="text-xs font-semibold text-slate-200">Contactless NFC / QR</span>
              <p className="text-[10px] text-slate-400 mt-0.5">Valid for today only</p>
            </div>
          </div>

          {currentStatus !== 'VALIDATED' ? (
            <button
              onClick={handleValidate}
              disabled={isValidating}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer"
            >
              {isValidating ? 'Scanning...' : 'Simulate Scan'}
            </button>
          ) : (
            <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
              <CheckCircle className="w-4 h-4" />
              <span>Checked-In</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
