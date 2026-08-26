import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { StatCard } from '../Common/StatCard';
import { AlertBroadcaster } from './AlertBroadcaster';
import { AnalyticsCharts } from './AnalyticsCharts';
import { 
  Bus, 
  Users, 
  AlertTriangle, 
  DollarSign, 
  Leaf, 
  Plus, 
  Trash2, 
  Edit, 
  ShieldCheck, 
  CheckCircle, 
  X, 
  Zap 
} from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    buses, 
    routes, 
    analytics, 
    updateBusStatus, 
    addNewBus, 
    deleteBus 
  } = useTransit();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newRegNumber, setNewRegNumber] = useState('');
  const [newRouteId, setNewRouteId] = useState(routes[0]?.id || 'route-101');
  const [newModel, setNewModel] = useState('Volvo 7900 Electric Eco');
  const [newCapacity, setNewCapacity] = useState(50);
  const [newDriverName, setNewDriverName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddBusSubmit = async (e) => {
    e.preventDefault();
    if (!newRegNumber || !newDriverName) return;

    setIsSubmitting(true);
    try {
      await addNewBus({
        regNumber: newRegNumber,
        routeId: newRouteId,
        model: newModel,
        capacity: newCapacity,
        driverName: newDriverName
      });
      setAddModalOpen(false);
      setNewRegNumber('');
      setNewDriverName('');
    } catch (err) {
      alert('Failed to add bus: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (busId, newStatus) => {
    await updateBusStatus(busId, { status: newStatus });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Fleet Command Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-400" />
            <span>Transit Fleet Operations Command</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time telemetry, vehicle health, dispatch scheduling & broadcasts
          </p>
        </div>

        <button
          onClick={() => setAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-950/50 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Deploy New Bus</span>
        </button>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Vehicles"
          value={`${analytics?.activeBuses || buses.length} / ${buses.length}`}
          subtitle="Fleet Ready"
          icon={Bus}
          color="cyan"
          trend="+100%"
        />
        <StatCard
          title="On-Board Pax"
          value={`${analytics?.totalPassengers || 150}`}
          subtitle={`${analytics?.fleetOccupancyPercent || 68}% Capacity`}
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${analytics?.totalRevenue || '4,850'}`}
          subtitle="Direct Fare Collection"
          icon={DollarSign}
          color="purple"
          trend="+12.8%"
        />
        <StatCard
          title="CO2 Emissions Saved"
          value={`${analytics?.carbonSavedKg || '1,240'} kg`}
          subtitle="Green Clean EV Transit"
          icon={Leaf}
          color="emerald"
        />
      </div>

      {/* Two-Column Middle Section: Fleet Table & Live Broadcaster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bus Fleet Table (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Bus className="w-4 h-4 text-cyan-400" />
                <span>Vehicle Fleet Roster & Dispatch Status</span>
              </h4>
              <span className="text-xs font-mono text-slate-400">
                {buses.length} Registered Units
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400 font-semibold">
                    <th className="pb-3">Vehicle</th>
                    <th className="pb-3">Route</th>
                    <th className="pb-3">Driver</th>
                    <th className="pb-3">Live Status</th>
                    <th className="pb-3">Load</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {buses.map((bus) => {
                    const route = routes.find(r => r.id === bus.routeId);

                    return (
                      <tr key={bus.id} className="hover:bg-white/5 transition-colors">
                        {/* Vehicle */}
                        <td className="py-3 font-mono font-bold text-white">
                          <div>{bus.regNumber}</div>
                          <span className="text-[10px] text-slate-400 font-sans font-normal">{bus.model.split(' ')[0]}</span>
                        </td>

                        {/* Route */}
                        <td className="py-3">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold"
                            style={{
                              backgroundColor: `${route?.color || '#38bdf8'}25`,
                              color: route?.color || '#38bdf8'
                            }}
                          >
                            {route?.number || 'LINE'}
                          </span>
                        </td>

                        {/* Driver */}
                        <td className="py-3 text-slate-200">
                          {bus.driver?.name || 'Assigned'}
                        </td>

                        {/* Status Switcher Dropdown */}
                        <td className="py-3">
                          <select
                            value={bus.status}
                            onChange={(e) => handleStatusChange(bus.id, e.target.value)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border focus:outline-none cursor-pointer ${
                              bus.status === 'EMERGENCY'
                                ? 'bg-rose-950 text-rose-300 border-rose-500/50'
                                : bus.status === 'DELAYED'
                                ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                                : bus.status === 'MAINTENANCE'
                                ? 'bg-slate-900 text-slate-400 border-slate-700'
                                : 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                            }`}
                          >
                            <option value="ACTIVE" className="bg-slate-900 text-white">ACTIVE</option>
                            <option value="DELAYED" className="bg-slate-900 text-white">DELAYED</option>
                            <option value="MAINTENANCE" className="bg-slate-900 text-white">MAINTENANCE</option>
                            <option value="EMERGENCY" className="bg-slate-900 text-white">EMERGENCY</option>
                          </select>
                        </td>

                        {/* Load */}
                        <td className="py-3 font-mono text-slate-300">
                          {bus.currentPassengers}/{bus.capacity}
                        </td>

                        {/* Actions */}
                        <td className="py-3 text-right">
                          <button
                            onClick={() => deleteBus(bus.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Decommission Bus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Live Alert Broadcaster Center (1 col) */}
        <AlertBroadcaster />
      </div>

      {/* Analytics & Performance Charts */}
      <AnalyticsCharts />

      {/* Deploy Bus Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl glass-panel border border-white/10 p-6 shadow-2xl animate-in zoom-in-95">
            <button
              onClick={() => setAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Bus className="w-5 h-5 text-purple-400" />
              <span>Deploy New Smart Vehicle</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Register and commission a new vehicle into the live tracking network
            </p>

            <form onSubmit={handleAddBusSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DL-05-SB-4499"
                  value={newRegNumber}
                  onChange={(e) => setNewRegNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Assigned Route
                </label>
                <select
                  value={newRouteId}
                  onChange={(e) => setNewRouteId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.number} - {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Vehicle Model
                  </label>
                  <select
                    value={newModel}
                    onChange={(e) => setNewModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Volvo 7900 Electric Eco">Volvo 7900 EV</option>
                    <option value="BYD K9 Pure Electric">BYD K9 Electric</option>
                    <option value="Scania Citywide LF Smart">Scania Citywide</option>
                    <option value="Tata Starbus EV Urban">Tata Starbus EV</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="90"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Designated Pilot / Driver Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={newDriverName}
                  onChange={(e) => setNewDriverName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-purple-950/50 cursor-pointer"
                >
                  {isSubmitting ? 'Deploying...' : 'Commission Bus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
