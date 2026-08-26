import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { BarChart3, TrendingUp, Leaf, Award, Activity } from 'lucide-react';

export const AnalyticsCharts = () => {
  const { analytics, routes, buses } = useTransit();

  const hourlyData = analytics?.hourlyTraffic || [
    { hour: '06:00', passengers: 45, onTimeRate: 98 },
    { hour: '08:00', passengers: 180, onTimeRate: 92 },
    { hour: '10:00', passengers: 140, onTimeRate: 95 },
    { hour: '12:00', passengers: 95, onTimeRate: 97 },
    { hour: '14:00', passengers: 110, onTimeRate: 96 },
    { hour: '17:00', passengers: 210, onTimeRate: 89 },
    { hour: '19:00', passengers: 165, onTimeRate: 91 },
    { hour: '21:00', passengers: 75, onTimeRate: 99 }
  ];

  const maxPax = Math.max(...hourlyData.map(d => d.passengers), 220);

  return (
    <div className="space-y-6">
      
      {/* Hourly Ridership Bar Chart */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">
              Hourly Passenger Demand & Peak Curves
            </h4>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md">
            <TrendingUp className="w-3 h-3" />
            +18.4% vs last week
          </span>
        </div>

        {/* CSS/SVG Responsive Bar Chart */}
        <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-2">
          {hourlyData.map((item, idx) => {
            const heightPct = Math.round((item.passengers / maxPax) * 100);
            const isPeak = item.passengers >= 180;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative">
                {/* Tooltip Hover */}
                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-[10px] text-slate-100 px-2 py-0.5 rounded shadow border border-white/10 font-mono whitespace-nowrap pointer-events-none z-10">
                  {item.passengers} Commuters ({item.onTimeRate}% On-Time)
                </div>

                <div className="w-full max-w-[28px] bg-slate-800 rounded-t-lg overflow-hidden flex items-end h-full">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-700 ${
                      isPeak
                        ? 'bg-gradient-to-t from-cyan-600 via-sky-500 to-cyan-300 shadow-lg shadow-cyan-500/30'
                        : 'bg-gradient-to-t from-slate-700 to-slate-500 group-hover:from-cyan-700 group-hover:to-cyan-500'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>

                <span className="text-[10px] font-mono text-slate-400">
                  {item.hour}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Route Efficiency Breakdown Table */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10">
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" />
          <span>Route Fleet Efficiency & Passenger Density</span>
        </h4>

        <div className="space-y-3">
          {routes.map((route) => {
            const routeBuses = buses.filter(b => b.routeId === route.id);
            const totalPax = routeBuses.reduce((s, b) => s + b.currentPassengers, 0);

            return (
              <div key={route.id} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="w-2.5 h-8 rounded-full"
                    style={{ backgroundColor: route.color || '#38bdf8' }}
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {route.number} — {route.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {route.category} • {route.schedule?.frequencyMins || 12} min frequency
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Active Vehicles</span>
                    <span className="text-xs font-mono font-bold text-white">{routeBuses.length} Buses</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Current Pax</span>
                    <span className="text-xs font-mono font-bold text-cyan-300">{totalPax} on board</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Efficiency</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">96.8%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
