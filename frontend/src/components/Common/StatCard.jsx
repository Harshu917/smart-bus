import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'cyan' }) => {
  const colorMap = {
    cyan: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10 shadow-cyan-500/10',
    emerald: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 shadow-emerald-500/10',
    amber: 'border-amber-500/30 text-amber-400 bg-amber-500/10 shadow-amber-500/10',
    purple: 'border-purple-500/30 text-purple-400 bg-purple-500/10 shadow-purple-500/10',
    rose: 'border-rose-500/30 text-rose-400 bg-rose-500/10 shadow-rose-500/10'
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border relative overflow-hidden transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-white tracking-tight font-mono">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              {trend && (
                <span className={trend.startsWith('+') ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                  {trend}
                </span>
              )}
              <span>{subtitle}</span>
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${colorMap[color] || colorMap.cyan}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {/* Subtle bottom gradient glow */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none bg-current text-white" />
    </div>
  );
};
