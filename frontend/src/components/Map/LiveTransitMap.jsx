import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTransit } from '../../context/TransitContext';
import { Bus, Users, Zap, Compass, MapPin, Battery, Clock, ArrowRight } from 'lucide-react';

// Component to handle pan and zoom when a bus or stop is selected
function MapFocusController({ selectedBus, selectedStop }) {
  const map = useMap();

  useEffect(() => {
    if (selectedBus) {
      map.flyTo([selectedBus.lat, selectedBus.lng], 15, { duration: 1.2 });
    } else if (selectedStop) {
      map.flyTo([selectedStop.lat, selectedStop.lng], 15, { duration: 1.2 });
    }
  }, [selectedBus, selectedStop, map]);

  return null;
}

// Custom Leaflet DivIcon for Moving Bus
const createBusIcon = (bus, routeColor = '#38bdf8', isSelected = false) => {
  const isEmergency = bus.status === 'EMERGENCY';
  const isDelayed = bus.status === 'DELAYED';
  const occupancyPercent = Math.round(((bus.currentPassengers || 0) / (bus.capacity || 50)) * 100);

  const statusColor = isEmergency
    ? '#f43f5e'
    : isDelayed
    ? '#f59e0b'
    : routeColor;

  const html = `
    <div style="position: relative; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;">
      <!-- Glowing outer ripple -->
      <div style="position: absolute; inset: 0; border-radius: 9999px; background: ${statusColor}; opacity: ${isSelected ? '0.4' : '0.2'}; filter: blur(4px); ${isEmergency ? 'animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;' : ''}"></div>
      
      <!-- Main Bus Pill -->
      <div style="
        position: relative;
        background: #0f172a;
        border: 2px solid ${statusColor};
        border-radius: 12px;
        padding: 4px 6px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.7), 0 0 15px ${statusColor}66;
        display: flex;
        align-items: center;
        gap: 4px;
        color: white;
        font-family: 'Plus Jakarta Sans', sans-serif;
      ">
        <!-- Rotated Direction Pointer -->
        <div style="
          width: 18px; 
          height: 18px; 
          border-radius: 6px; 
          background: ${statusColor}; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          transform: rotate(${bus.heading || 0}deg);
          transition: transform 0.8s ease-in-out;
        ">
          <svg style="width: 12px; height: 12px; fill: white;" viewBox="0 0 24 24">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
          </svg>
        </div>

        <!-- Registration & Speed -->
        <div style="display: flex; flex-direction: column; line-height: 1;">
          <span style="font-size: 9px; font-weight: 800; color: #f8fafc; font-family: monospace;">${bus.regNumber.split('-').slice(-2).join('-')}</span>
          <span style="font-size: 8px; font-weight: 600; color: #94a3b8;">${bus.speed} km/h</span>
        </div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-bus-marker',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -20]
  });
};

// Custom Leaflet DivIcon for Bus Stops
const createStopIcon = (stop, isSelected = false) => {
  const html = `
    <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
      <div style="position: absolute; inset: 2px; border-radius: 9999px; background: rgba(56, 189, 248, 0.2); border: 1px solid rgba(56, 189, 248, 0.5);"></div>
      <div style="
        width: 18px; 
        height: 18px; 
        border-radius: 9999px; 
        background: #0284c7; 
        border: 2px solid #ffffff; 
        display: flex; 
        align-items: center; 
        justify-content: center;
        box-shadow: 0 0 10px rgba(56, 189, 248, 0.8);
      ">
        <div style="width: 6px; height: 6px; border-radius: 9999px; background: #ffffff;"></div>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-stop-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

export const LiveTransitMap = ({ onSelectBus, onBookTicket }) => {
  const { 
    filteredBuses, 
    routes, 
    stops, 
    selectedBusId, 
    setSelectedBusId,
    selectedStopId, 
    setSelectedStopId 
  } = useTransit();

  const selectedBus = useMemo(() => {
    return filteredBuses.find(b => b.id === selectedBusId);
  }, [filteredBuses, selectedBusId]);

  const selectedStop = useMemo(() => {
    return stops.find(s => s.id === selectedStopId);
  }, [stops, selectedStopId]);

  // Center coordinates (Delhi Metro / City Hub area)
  const defaultCenter = [28.6139, 77.2090];

  return (
    <div className="relative w-full h-[550px] lg:h-[620px] rounded-2xl overflow-hidden border border-white/10 glass-panel shadow-2xl">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full dark-tiles z-10"
      >
        <MapFocusController selectedBus={selectedBus} selectedStop={selectedStop} />

        {/* Dark Mode OpenStreetMap Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Render Route Paths (Polylines) */}
        {routes.map((route) => {
          const positions = (route.waypoints || []).map(wp => [wp.lat, wp.lng]);
          if (positions.length < 2) return null;

          return (
            <React.Fragment key={route.id}>
              {/* Outer soft glow line */}
              <Polyline
                positions={positions}
                pathOptions={{
                  color: route.color || '#38bdf8',
                  weight: 8,
                  opacity: 0.25,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
              {/* Inner crisp line */}
              <Polyline
                positions={positions}
                pathOptions={{
                  color: route.color || '#38bdf8',
                  weight: 4,
                  opacity: 0.85,
                  dashArray: '8, 8',
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              >
                <Tooltip sticky className="bg-slate-900 text-slate-100 text-xs font-semibold rounded px-2 py-1 border border-white/10">
                  {route.number}: {route.name}
                </Tooltip>
              </Polyline>
            </React.Fragment>
          );
        })}

        {/* Render Bus Stop Markers */}
        {stops.map((stop) => {
          return (
            <Marker
              key={stop.id}
              position={[stop.lat, stop.lng]}
              icon={createStopIcon(stop, selectedStopId === stop.id)}
              eventHandlers={{
                click: () => {
                  setSelectedStopId(stop.id);
                  setSelectedBusId(null);
                }
              }}
            >
              <Popup>
                <div className="p-1 min-w-[220px]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white leading-tight">{stop.name}</h4>
                      <span className="text-[10px] font-mono text-cyan-400 font-semibold">{stop.code} • {stop.zone} Zone</span>
                    </div>
                  </div>

                  <div className="my-2 border-t border-white/10 pt-2">
                    <p className="text-[11px] text-slate-300 font-semibold mb-1">Station Facilities:</p>
                    <div className="flex flex-wrap gap-1">
                      {stop.facilities?.map((f, i) => (
                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-200">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Render Live Moving Buses */}
        {filteredBuses.map((bus) => {
          const route = routes.find(r => r.id === bus.routeId);
          const routeColor = route?.color || '#38bdf8';
          const isSelected = selectedBusId === bus.id;
          const nextStop = stops.find(s => s.id === bus.nextStopId);
          const occupancyPercent = Math.round(((bus.currentPassengers || 0) / (bus.capacity || 50)) * 100);

          return (
            <Marker
              key={bus.id}
              position={[bus.lat, bus.lng]}
              icon={createBusIcon(bus, routeColor, isSelected)}
              eventHandlers={{
                click: () => {
                  setSelectedBusId(bus.id);
                  if (onSelectBus) onSelectBus(bus);
                }
              }}
            >
              <Popup>
                <div className="p-2 min-w-[260px] text-slate-100 font-sans">
                  {/* Bus Header */}
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-white/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded" style={{ backgroundColor: `${routeColor}33`, color: routeColor, border: `1px solid ${routeColor}66` }}>
                          {route?.number || 'TRANSIT'}
                        </span>
                        <span className="font-mono text-xs font-bold text-white">{bus.regNumber}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">{bus.model}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      bus.status === 'EMERGENCY' ? 'bg-rose-500 text-white animate-pulse' :
                      bus.status === 'DELAYED' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {bus.status}
                    </span>
                  </div>

                  {/* Telemetry Stats */}
                  <div className="grid grid-cols-2 gap-2 my-2.5 text-xs">
                    <div className="p-2 rounded-lg bg-slate-900/80 border border-white/5">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                        <Zap className="w-3 h-3 text-cyan-400" />
                        <span>Live Speed</span>
                      </div>
                      <span className="font-mono text-sm font-bold text-white">{bus.speed} km/h</span>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-900/80 border border-white/5">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                        <Users className="w-3 h-3 text-emerald-400" />
                        <span>Occupancy</span>
                      </div>
                      <span className="font-mono text-sm font-bold text-white">{occupancyPercent}% ({bus.currentPassengers}/{bus.capacity})</span>
                    </div>
                  </div>

                  {/* Next Stop Info */}
                  <div className="p-2 rounded-lg bg-slate-900/60 border border-white/5 text-xs mb-3">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Next Stop</span>
                      <span className="text-cyan-400 font-mono font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ~{Math.round(bus.etaNextStopSec / 60)} min
                      </span>
                    </div>
                    <p className="font-semibold text-slate-200 mt-0.5 truncate">{nextStop?.name || 'En Route'}</p>
                  </div>

                  {/* Driver & Action */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="text-[10px] text-slate-400">
                      Pilot: <span className="text-slate-200 font-semibold">{bus.driver?.name || 'Assigned Driver'}</span>
                    </div>
                    {onBookTicket && (
                      <button
                        onClick={() => onBookTicket(bus)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center gap-1 shadow-md shadow-cyan-900/50 transition-all cursor-pointer"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Overlay Badges */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="glass-panel px-3 py-1.5 rounded-xl border border-white/10 text-xs flex items-center gap-2 pointer-events-auto shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-bold text-white">{filteredBuses.length}</span>
          <span className="text-slate-400">Active Buses Live</span>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
        <div className="glass-panel px-3 py-2 rounded-xl border border-white/10 text-[11px] text-slate-300 flex items-center gap-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Normal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span>Delayed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Emergency SOS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
