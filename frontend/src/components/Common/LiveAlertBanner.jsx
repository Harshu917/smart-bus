import React from 'react';
import { useTransit } from '../../context/TransitContext';
import { AlertTriangle, Info, Bell, X, ShieldAlert } from 'lucide-react';

export const LiveAlertBanner = () => {
  const { activeNotification, dismissNotification, alerts } = useTransit();

  const currentAlert = activeNotification || (alerts && alerts[0]);

  if (!currentAlert) return null;

  const isEmergency = currentAlert.type === 'EMERGENCY' || currentAlert.priority === 'CRITICAL';
  const isWarning = currentAlert.type === 'WARNING';

  return (
    <div
      className={`relative w-full px-4 py-3 border-b flex items-center justify-between transition-all duration-300 ${
        isEmergency
          ? 'bg-rose-950/80 border-rose-500/50 text-rose-200 shadow-lg shadow-rose-950/50 animate-pulse'
          : isWarning
          ? 'bg-amber-950/80 border-amber-500/50 text-amber-200'
          : 'bg-cyan-950/70 border-cyan-500/40 text-cyan-200'
      }`}
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              isEmergency
                ? 'bg-rose-500/20 text-rose-400'
                : isWarning
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-cyan-500/20 text-cyan-400'
            }`}
          >
            {isEmergency ? (
              <ShieldAlert className="w-5 h-5 animate-bounce" />
            ) : isWarning ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/10">
                {currentAlert.type || 'SYSTEM'}
              </span>
              <span className="text-sm font-semibold text-white">
                {currentAlert.title}
              </span>
            </div>
            <p className="text-xs opacity-90 mt-0.5 line-clamp-1">
              {currentAlert.message}
            </p>
          </div>
        </div>

        {activeNotification && (
          <button
            onClick={dismissNotification}
            className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Dismiss Alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
