import React, { useState, useEffect } from 'react';
import { useTransit } from '../context/TransitContext';
import { 
  Bus, 
  MapPin, 
  Gauge, 
  ShieldCheck, 
  Radio, 
  Wifi, 
  WifiOff, 
  Clock, 
  Ticket, 
  SlidersHorizontal 
} from 'lucide-react';

export const Navbar = () => {
  const { 
    activePortal, 
    setActivePortal, 
    isConnected, 
    routes, 
    selectedRouteId, 
    setSelectedRouteId,
    alerts,
    tickets
  } = useTransit();

  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePortal('passenger')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-400/40">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                  SmartBus
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Intelligent Transit & Fleet Command
              </p>
            </div>
          </div>

          {/* Portal Switcher Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-white/10">
            <button
              onClick={() => setActivePortal('passenger')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePortal === 'passenger'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Passenger</span>
              {tickets.length > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-bold">
                  {tickets.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActivePortal('driver')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePortal === 'driver'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Gauge className="w-4 h-4" />
              <span>Driver HUD</span>
            </button>

            <button
              onClick={() => setActivePortal('admin')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activePortal === 'admin'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Fleet Admin</span>
              {alerts.length > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold">
                  {alerts.length}
                </span>
              )}
            </button>
          </div>

          {/* Right Controls (Route Filter, Connection & Live Clock) */}
          <div className="flex items-center gap-3">
            {/* Route Filter Dropdown */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/70 border border-white/10 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={selectedRouteId}
                onChange={(e) => setSelectedRouteId(e.target.value)}
                className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-900 text-slate-100">All Active Routes</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id} className="bg-slate-900 text-slate-100">
                    {r.number} - {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Live Sync Status Pill */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border ${
                isConnected
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                  : 'bg-cyan-950/70 border-cyan-500/40 text-cyan-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'}`} />
              <span className="hidden sm:inline font-semibold">{isConnected ? 'LIVE (WS)' : 'LIVE (CLOUD)'}</span>
            </div>

            {/* System Clock */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/60 border border-white/5 text-slate-300 text-xs font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentTime}</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
