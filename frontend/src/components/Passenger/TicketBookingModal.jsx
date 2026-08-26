import React, { useState, useEffect } from 'react';
import { useTransit } from '../../context/TransitContext';
import confetti from 'canvas-confetti';
import { 
  X, 
  Ticket, 
  MapPin, 
  ArrowRight, 
  Users, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

export const TicketBookingModal = ({ initialBus, onClose, onBookingSuccess }) => {
  const { routes, stops, bookTicket } = useTransit();

  const [selectedRouteId, setSelectedRouteId] = useState(initialBus?.routeId || routes[0]?.id || 'route-101');
  const [passengerName, setPassengerName] = useState('');
  const [passengerPhone, setPassengerPhone] = useState('');
  const [originStopId, setOriginStopId] = useState('');
  const [destinationStopId, setDestinationStopId] = useState('');
  const [seatCount, setSeatCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedTicket, setBookedTicket] = useState(null);

  const currentRoute = routes.find(r => r.id === selectedRouteId) || routes[0];
  const routeStops = currentRoute ? currentRoute.stops.map(id => stops.find(s => s.id === id)).filter(Boolean) : [];

  useEffect(() => {
    if (routeStops.length >= 2) {
      setOriginStopId(routeStops[0].id);
      setDestinationStopId(routeStops[routeStops.length - 1].id);
    }
  }, [selectedRouteId]);

  // Calculate Fare
  const calculateFare = () => {
    if (!currentRoute || !originStopId || !destinationStopId) return 25;
    const originIdx = currentRoute.stops.indexOf(originStopId);
    const destIdx = currentRoute.stops.indexOf(destinationStopId);
    const hops = Math.max(1, Math.abs(destIdx - originIdx));
    const singleFare = (currentRoute.fareBase || 20) + (hops * (currentRoute.farePerKm || 3) * 2.5);
    return Math.round(singleFare * seatCount);
  };

  const totalFare = calculateFare();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passengerName.trim()) {
      alert('Please enter passenger name');
      return;
    }
    if (originStopId === destinationStopId) {
      alert('Origin and destination stops must be different');
      return;
    }

    setIsSubmitting(true);
    try {
      const ticket = await bookTicket({
        passengerName,
        passengerPhone,
        routeId: selectedRouteId,
        busId: initialBus?.id || null,
        originStopId,
        destinationStopId,
        seatCount,
        fareTotal: totalFare
      });

      // Trigger Celebration Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setBookedTicket(ticket);
      if (onBookingSuccess) onBookingSuccess(ticket);
    } catch (err) {
      alert('Error creating booking: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl glass-panel border border-white/10 p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!bookedTicket ? (
          <div>
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  Instant Transit Pass Booking
                </h3>
                <p className="text-xs text-slate-400">
                  Select your route, boarding station and secure seat pass
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Route Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Transit Line / Corridor
                </label>
                <select
                  value={selectedRouteId}
                  onChange={(e) => setSelectedRouteId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.number} - {r.name} ({r.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Station From / To Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Origin Stop</span>
                  </label>
                  <select
                    value={originStopId}
                    onChange={(e) => setOriginStopId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    {routeStops.map((stop) => (
                      <option key={stop.id} value={stop.id}>
                        {stop.name} ({stop.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>Destination Stop</span>
                  </label>
                  <select
                    value={destinationStopId}
                    onChange={(e) => setDestinationStopId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    {routeStops.map((stop) => (
                      <option key={stop.id} value={stop.id}>
                        {stop.name} ({stop.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Passenger Info & Seat Count */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Passenger Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Taylor"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Seats
                  </label>
                  <div className="flex items-center rounded-xl bg-slate-900 border border-white/10 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
                      className="px-3 py-2 text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center text-xs font-mono font-bold text-white">
                      {seatCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSeatCount(Math.min(6, seatCount + 1))}
                      className="px-3 py-2 text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Passenger Phone Optional */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mobile Number (for SMS QR Code Pass)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 00000"
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Fare Summary Breakdown */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/20 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block">Total Calculated Fare</span>
                  <span className="text-xs font-medium text-cyan-300">
                    {seatCount} Pass • All Taxes Included
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-white font-mono">
                    ₹{totalFare}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>{isSubmitting ? 'Processing Pass...' : `Confirm & Issue Pass (₹${totalFare})`}</span>
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="text-center py-4">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              Ticket Booked Successfully!
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Your digital boarding pass with scannable QR Code is ready.
            </p>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 text-left mb-5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Pass ID:</span>
                <span className="font-mono font-bold text-cyan-400">{bookedTicket.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Passenger:</span>
                <span className="font-semibold text-white">{bookedTicket.passengerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Seats / Amount:</span>
                <span className="font-mono text-white">{bookedTicket.seatCount} Seat(s) • ₹{bookedTicket.fareTotal}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-900/50 cursor-pointer"
              >
                View My Passes
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
