import React, { useState } from 'react';
import { TransitProvider, useTransit } from './context/TransitContext';
import { Navbar } from './components/Navbar';
import { LiveAlertBanner } from './components/Common/LiveAlertBanner';
import { LiveTransitMap } from './components/Map/LiveTransitMap';
import { BusScheduleList } from './components/Passenger/BusScheduleList';
import { TicketBookingModal } from './components/Passenger/TicketBookingModal';
import { DigitalTicketCard } from './components/Passenger/DigitalTicketCard';
import { DriverConsole } from './components/Driver/DriverConsole';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { 
  Bus, 
  MapPin, 
  Ticket, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Compass, 
  CheckCircle, 
  Sparkles 
} from 'lucide-react';

function MainLayout() {
  const { activePortal, buses, routes, tickets, isLoading } = useTransit();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedBusForBooking, setSelectedBusForBooking] = useState(null);

  const handleOpenBooking = (bus = null) => {
    setSelectedBusForBooking(bus);
    setBookingModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#080B11] flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/40 animate-bounce mb-4 border border-cyan-400/40">
          <Bus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Connecting to SmartBus Network...
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-mono">
          Synchronizing GPS Telemetry & Active Fleets
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#080B11] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Alert Header Banner */}
      <LiveAlertBanner />

      {/* Top Main Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* PASSENGER PORTAL */}
        {activePortal === 'passenger' && (
          <div className="space-y-6">
            
            {/* Quick Metrics & Action Banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              <div className="md:col-span-3 glass-panel rounded-2xl p-5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold border border-cyan-500/30">
                      LIVE GPS MAP ACTIVE
                    </span>
                    <span className="text-xs text-slate-400">• Real-Time Bus Radar</span>
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight">
                    Track Commute, View Live ETAs & Instant QR Passes
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Select a vehicle on the interactive radar map to inspect speed, driver rating and upcoming stops.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenBooking()}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-xl shadow-cyan-500/25 transition-all hover:scale-[1.02] whitespace-nowrap cursor-pointer"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Book Digital Ticket</span>
                </button>
              </div>

              <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-center">
                <span className="text-xs font-semibold text-slate-400 uppercase">Live Fleet Status</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-cyan-400 font-mono">{buses.length}</span>
                  <span className="text-xs text-slate-300">Buses Tracking</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{routes.length} Active Corridors</span>
                </div>
              </div>

            </div>

            {/* Split Screen: Interactive Radar Map (Left 7 cols) & Bus Schedule List (Right 5 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <span>Real-time Geographical Radar Map</span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    Auto-updates every 2s
                  </span>
                </div>
                
                <LiveTransitMap
                  onBookTicket={(bus) => handleOpenBooking(bus)}
                  onSelectBus={(bus) => console.log('Selected bus', bus)}
                />
              </div>

              <div className="lg:col-span-5">
                <BusScheduleList
                  onBookBus={(bus) => handleOpenBooking(bus)}
                  onSelectBus={(bus) => console.log('Selected bus from list', bus)}
                />
              </div>

            </div>

            {/* My Active Digital Boarding Passes */}
            {tickets.length > 0 && (
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-cyan-400" />
                      <span>My Digital QR Transit Passes</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Scannable electronic tickets issued for your recent bookings
                    </p>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 font-bold border border-cyan-500/30">
                    {tickets.length} Active Pass(es)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tickets.map((ticket) => (
                    <DigitalTicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* DRIVER TELEMETRY HUD */}
        {activePortal === 'driver' && <DriverConsole />}

        {/* FLEET ADMIN COMMAND */}
        {activePortal === 'admin' && <AdminDashboard />}

      </main>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <TicketBookingModal
          initialBus={selectedBusForBooking}
          onClose={() => setBookingModalOpen(false)}
          onBookingSuccess={(ticket) => {
            console.log('Booked ticket:', ticket);
          }}
        />
      )}

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-6 mt-12 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Bus className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">SmartBus Transit Network System</span>
            <span>• Full-Stack React + Node.js</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>PORT: 5000 (API) / 5173 (CLIENT)</span>
            <span className="text-emerald-400 font-bold">WEBSOCKET: CONNECTED</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export function App() {
  return (
    <TransitProvider>
      <MainLayout />
    </TransitProvider>
  );
}

export default App;
