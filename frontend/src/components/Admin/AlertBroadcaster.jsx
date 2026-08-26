import React, { useState } from 'react';
import { useTransit } from '../../context/TransitContext';
import { Radio, Send, AlertTriangle, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const AlertBroadcaster = () => {
  const { routes, broadcastAlert } = useTransit();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('INFO'); // INFO, WARNING, EMERGENCY, DELAY
  const [priority, setPriority] = useState('HIGH');
  const [affectedRouteId, setAffectedRouteId] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!title || !message) return;

    setIsSending(true);
    try {
      await broadcastAlert({
        title,
        message,
        type,
        priority,
        affectedRouteId: affectedRouteId || null
      });

      setSentSuccess(true);
      setTitle('');
      setMessage('');
      setTimeout(() => setSentSuccess(false), 3000);
    } catch (err) {
      alert('Failed to send broadcast: ' + err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Live Broadcast Center
              </h4>
              <p className="text-xs text-slate-400">
                Push instant announcements to all connected passengers
              </p>
            </div>
          </div>

          {sentSuccess && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Broadcast Sent!
            </span>
          )}
        </div>

        <form onSubmit={handleBroadcast} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Alert Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="INFO">Information Notice</option>
                <option value="WARNING">Traffic / Delay Warning</option>
                <option value="DELAY">Schedule Delay</option>
                <option value="EMERGENCY">Emergency Directive</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Affected Corridor (Optional)
              </label>
              <select
                value={affectedRouteId}
                onChange={(e) => setAffectedRouteId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
              >
                <option value="">All City Network</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.number} - {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Headline Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Metro Line 101 Running Frequency Increased"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Broadcast Message Content
            </label>
            <textarea
              required
              rows={2}
              placeholder="Describe the update, reroute, or delay in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-950/50 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isSending ? 'Transmitting...' : 'Dispatch Live Broadcast'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
