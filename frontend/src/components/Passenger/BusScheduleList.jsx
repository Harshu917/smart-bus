import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { 
  Bus, 
  Users, 
  Zap, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Ticket, 
  Search, 
  BatteryCharging 
} from 'lucide-react';

export const BusScheduleList = ({ onBookBus, onSelectBus }) => {
  const { filteredBuses, routes, stops, selectedBusId, setSelectedBusId } = useTransit();
  const [searchTerm, setSearchTerm] = useState('');

  const displayBuses = filteredBuses.filter((b) => {
    const route = routes.find(r => r.id === b.routeId);
    const text = `${b.regNumber} ${b.model} ${route?.number || ''} ${route?.name || ''}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col h-full">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bus className="w-5 h-5 text-cyan-400" />
            <span>Live Fleet Rosters & ETAs</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time tracking of running buses with capacity and next stops
          </p>
        </div>

        {/* Quick Search Input */}
        <div className="relative min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search bus, route, model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      {/* Bus Cards List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[480px]">
        {displayBuses.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            <Bus className="w-10 h-10 mx-auto mb-2 opacity-30 text-cyan-400" />
            <p>No active buses found matching your filter.</p>
          </div>
        ) : (
          displayBuses.map((bus) => {
            const route = routes.find((r) => r.id === bus.routeId);
            const nextStop = stops.find((s) => s.id === bus.nextStopId);
            const isSelected = selectedBusId === bus.id;
            const occupancyPct = Math.round(((bus.currentPassengers || 0) / (bus.capacity || 50)) * 100);

            // Crowd occupancy color & badge
            const isFull = occupancyPct >= 85;
            const isModerate = occupancyPct >= 50 && occupancyPct < 85;
            const crowdLabel = isFull ? 'High Demand' : isModerate ? 'Moderate' : 'Seats Available';
            const crowdColor = isFull ? 'text-rose-400 bg-rose-500/10' : isModerate ? 'text-amber-400 bg-amber-500/10' : 'text-emerald-400 bg-emerald-500/10';

            return (
              <div
                key={bus.id}
                onClick={() => {
                  setSelectedBusId(bus.id);
                  if (onSelectBus) onSelectBus(bus);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-400/60 shadow-lg shadow-cyan-950/50 scale-[1.01]'
                    : 'bg-slate-900/60 border-white/5 hover:border-white/20 hover:bg-slate-800/40'
                }`}
              >
                {/* Top Row: Route Pill, Reg Number, Status */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded-lg text-xs font-bold font-mono tracking-wide"
                      style={{
                        backgroundColor: `${route?.color || '#38bdf8'}25`,
                        color: route?.color || '#38bdf8',
                        border: `1px solid ${route?.color || '#38bdf8'}50`
                      }}
                    >
                      {route?.number || 'TRANSIT'}
                    </span>
                    <span className="font-mono text-xs font-bold text-white tracking-wider">
                      {bus.regNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${crowdColor}`}>
                      {crowdLabel}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        bus.status === 'EMERGENCY'
                          ? 'bg-rose-500 text-white animate-pulse'
                          : bus.status === 'DELAYED'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {bus.status}
                    </span>
                  </div>
                </div>

                {/* Middle Row: Route Name & Vehicle Model */}
                <div className="mb-3">
                  <p className="text-xs font-semibold text-slate-200 truncate">
                    {route?.name || 'Standard Transit Corridor'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {bus.model} • Driver: <span className="text-slate-300 font-medium">{bus.driver?.name}</span>
                  </p>
                </div>

                {/* Telemetry Progress Grid */}
                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-black/30 border border-white/5 text-xs mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Next Stop</span>
                    <span className="font-semibold text-cyan-300 truncate block text-[11px]">
                      {nextStop?.name || 'Central Terminal'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Live ETA</span>
                    <span className="font-mono font-bold text-white text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      ~{Math.round(bus.etaNextStopSec / 60)} min
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Live Speed</span>
                    <span className="font-mono font-bold text-slate-200 text-[11px] flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-400" />
                      {bus.speed} km/h
                    </span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      Passenger Load
                    </span>
                    <span className="font-mono text-slate-200">
                      {bus.currentPassengers} / {bus.capacity} seats ({occupancyPct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull ? 'bg-rose-500' : isModerate ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${Math.min(100, occupancyPct)}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Battery: {bus.telemetry?.batteryPercent || 85}%</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onBookBus) onBookBus(bus);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5 transition-all hover:border-cyan-400 cursor-pointer"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Book Ticket</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
