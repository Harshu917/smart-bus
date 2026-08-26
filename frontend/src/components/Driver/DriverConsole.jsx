import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { 
  Gauge, 
  Users, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  DoorClosed, 
  DoorOpen, 
  AlertTriangle, 
  Compass, 
  CheckCircle2, 
  ChevronRight, 
  Plus, 
  Minus, 
  Battery, 
  Thermometer 
} from 'lucide-react';
import { api } from '../../services/api';

export const DriverConsole = () => {
  const { buses, routes, stops, triggerEmergencySOS } = useTransit();
  const [selectedBusId, setSelectedBusId] = useState(buses[0]?.id || 'bus-101');
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [sosReason, setSosReason] = useState('Medical emergency on board');
  const [doorOpen, setDoorOpen] = useState(false);

  const bus = buses.find(b => b.id === selectedBusId) || buses[0];
  const route = routes.find(r => r.id === bus?.routeId);
  const nextStop = stops.find(s => s.id === bus?.nextStopId);
  const routeStops = route ? route.stops.map(sid => stops.find(s => s.id === sid)).filter(Boolean) : [];

  const handlePassengerChange = async (delta) => {
    if (!bus) return;
    try {
      await api.updatePassengerCount(bus.id, delta);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendSOS = () => {
    if (bus) {
      triggerEmergencySOS(bus.id, sosReason);
      setSosModalOpen(false);
    }
  };

  if (!bus) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p>No active bus selected for driver HUD.</p>
      </div>
    );
  }

  const occupancyPercent = Math.round(((bus.currentPassengers || 0) / (bus.capacity || 50)) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Driver Bar: Bus Selector & Shift Info */}
      <div className="glass-panel rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-white">
                Driver Telemetry Console
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE SHIFT
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Pilot: <span className="text-slate-200 font-semibold">{bus.driver?.name}</span> • {bus.driver?.badge}
            </p>
          </div>
        </div>

        {/* Vehicle Switcher */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs text-slate-400 font-semibold whitespace-nowrap">
            Assigned Vehicle:
          </label>
          <select
            value={selectedBusId}
            onChange={(e) => setSelectedBusId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 font-mono font-bold focus:outline-none focus:border-emerald-500 w-full sm:w-auto"
          >
            {buses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.regNumber} ({b.model.split(' ')[0]}) - {b.status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main HUD Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Speedometer & Live Telemetry Gauge */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1">
              <Compass className="w-4 h-4 text-cyan-400" />
              Heading: {bus.heading || 0}°
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              GPS LOCK: 3D RTK
            </span>
          </div>

          {/* Glowing Speedometer Ring */}
          <div className="relative my-4 w-48 h-48 rounded-full border-4 border-slate-800 flex items-center justify-center shadow-inner">
            <div 
              className="absolute inset-0 rounded-full border-4 border-cyan-400 opacity-75 blur-[2px]"
              style={{
                clipPath: `polygon(50% 50%, 0 0, ${Math.min(100, (bus.speed / 80) * 100)}% 0)`
              }}
            />
            
            <div className="flex flex-col items-center justify-center">
              <span className="text-5xl font-black text-white font-mono tracking-tight">
                {bus.speed}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                KM / H
              </span>
              <span className="text-[10px] text-emerald-400 font-mono mt-1">
                Speed Limit: 60 km/h
              </span>
            </div>
          </div>

          {/* Vehicle Sub-Telemetry */}
          <div className="w-full grid grid-cols-2 gap-3 mt-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center gap-2.5">
              <Battery className="w-5 h-5 text-emerald-400" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block">Battery Level</span>
                <span className="font-bold text-white font-mono">{bus.telemetry?.batteryPercent || 86}%</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center gap-2.5">
              <Thermometer className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block">Cabin Temp</span>
                <span className="font-bold text-white font-mono">{bus.telemetry?.indoorTempC || 22.5}°C</span>
              </div>
            </div>
          </div>
        </div>

        {/* Passenger Load Counter & Doors Control */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Passenger Load Control</span>
              </h4>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                occupancyPercent > 85 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {occupancyPercent}% Capacity
              </span>
            </div>

            {/* Big Passenger Counter Display */}
            <div className="p-5 rounded-xl bg-slate-900/90 border border-white/5 text-center">
              <span className="text-4xl font-extrabold text-white font-mono">
                {bus.currentPassengers}
              </span>
              <span className="text-xs text-slate-400 block mt-1">
                Seats Occupied out of {bus.capacity} Maximum
              </span>

              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={() => handlePassengerChange(-1)}
                  className="w-12 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center border border-white/10 shadow-md transition-all active:scale-95 cursor-pointer"
                  title="Passenger Alighting"
                >
                  <Minus className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => handlePassengerChange(1)}
                  className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold flex items-center justify-center shadow-lg shadow-cyan-900/50 transition-all active:scale-95 cursor-pointer"
                  title="Passenger Boarding"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Door Status Switcher */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${doorOpen ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-300'}`}>
                {doorOpen ? <DoorOpen className="w-5 h-5" /> : <DoorClosed className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Transit Doors: {doorOpen ? 'OPEN' : 'CLOSED & SECURED'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {doorOpen ? 'Boarding in Progress' : 'Safe to Accelerate'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setDoorOpen(!doorOpen)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                doorOpen
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950/50'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              {doorOpen ? 'Close Doors' : 'Open Doors'}
            </button>
          </div>
        </div>

        {/* Emergency SOS Trigger & Route Milestone Progress */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-6">
          <div>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Next Stop Milestone</span>
            </h4>

            {/* Next Stop Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-cyan-950/30 border border-cyan-500/30">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] text-cyan-400 font-mono uppercase font-bold">Upcoming Station</span>
                  <h5 className="font-bold text-base text-white mt-0.5">
                    {nextStop?.name || 'Central Grand Station'}
                  </h5>
                  <span className="text-xs text-slate-400">{nextStop?.code} • {nextStop?.zone} Zone</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">ETA</span>
                  <span className="text-lg font-extrabold text-cyan-300 font-mono">
                    ~{Math.round(bus.etaNextStopSec / 60)} min
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Route Progression Checklist */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 block">Route Sequence:</span>
            <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1">
              {routeStops.map((st, idx) => {
                const isPassed = idx < bus.currentStopIndex;
                const isCurrent = idx === bus.currentStopIndex;

                return (
                  <div
                    key={st.id}
                    className={`px-3 py-1.5 rounded-lg text-xs flex items-center justify-between border ${
                      isCurrent
                        ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-200 font-bold'
                        : isPassed
                        ? 'bg-slate-900/40 border-white/5 text-slate-400 line-through'
                        : 'bg-slate-900/60 border-white/5 text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[10px] opacity-70">#{idx + 1}</span>
                      <span>{st.name}</span>
                    </span>
                    {isCurrent && <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-400 text-slate-950 font-mono">CURRENT</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Emergency SOS Action Button */}
          <button
            onClick={() => setSosModalOpen(true)}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-rose-950/60 border border-rose-400/30 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <ShieldAlert className="w-5 h-5 animate-pulse" />
            <span>DISPATCH EMERGENCY SOS</span>
          </button>
        </div>

      </div>

      {/* SOS Confirmation Modal */}
      {sosModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl glass-panel border border-rose-500/40 p-6 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
              <ShieldAlert className="w-7 h-7 animate-bounce" />
            </div>

            <h3 className="text-lg font-bold text-center text-white mb-1">
              Confirm Emergency SOS Broadcast
            </h3>
            <p className="text-xs text-center text-slate-300 mb-4">
              This will immediately sound emergency sirens at Fleet Command and display alerts on all passenger apps.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Reason / Emergency Type
              </label>
              <select
                value={sosReason}
                onChange={(e) => setSosReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
              >
                <option value="Medical emergency on board">Medical emergency on board</option>
                <option value="Vehicle mechanical breakdown / engine failure">Vehicle mechanical breakdown</option>
                <option value="Traffic collision / road blockage">Traffic collision</option>
                <option value="Security / passenger disturbance">Security disturbance</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSosModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs border border-white/10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendSOS}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-950/60 cursor-pointer"
              >
                Confirm SOS
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
