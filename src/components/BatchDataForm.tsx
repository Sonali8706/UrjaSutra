import { useState, useEffect } from 'react';
import { ClipboardList, Save, CloudUpload, Trash2, CheckCircle2, Clock, X } from 'lucide-react';
import type { BatchEntry } from '@/types';

const STORAGE_KEY = 'urjasutra_batch_queue';

const FURNACE_OPTIONS = ['Furnace-1', 'Furnace-2', 'Furnace-3'];
const SHIFT_OPTIONS = ['Shift A (06:00–14:00)', 'Shift B (14:00–22:00)', 'Shift C (22:00–06:00)'];
const DOWNTIME_REASONS = [
  'No downtime',
  'Power outage',
  'Mold defect — sand quality',
  'Compressor failure',
  'Furnace lining repair',
  'Machine breakdown',
  'Material shortage',
  'Other',
];

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function BatchDataForm() {
  const [form, setForm] = useState({
    date: todayStr(),
    shift: SHIFT_OPTIONS[0],
    furnaceId: FURNACE_OPTIONS[0],
    tonnesMelted: '',
    acceptedTonnes: '',
    rejectedTonnes: '',
    kwhReading: '',
    downtimeReason: DOWNTIME_REASONS[0],
  });
  const [queue, setQueue] = useState<BatchEntry[]>([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setQueue(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  }, [queue]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const melted = parseFloat(form.tonnesMelted) || 0;
    const accepted = parseFloat(form.acceptedTonnes) || 0;
    const rejected = parseFloat(form.rejectedTonnes) || 0;
    const kwh = parseFloat(form.kwhReading) || 0;

    if (melted <= 0 || kwh <= 0) {
      showToast('Please enter valid tonnes melted and kWh reading');
      return;
    }

    const entry: BatchEntry = {
      id: `batch-${Date.now()}`,
      timestamp: Date.now(),
      date: form.date,
      shift: form.shift,
      furnaceId: form.furnaceId,
      tonnesMelted: melted,
      acceptedTonnes: accepted,
      rejectedTonnes: rejected,
      kwhReading: kwh,
      downtimeReason: form.downtimeReason,
      synced: false,
    };

    setQueue([...queue, entry]);
    setForm({ ...form, tonnesMelted: '', acceptedTonnes: '', rejectedTonnes: '', kwhReading: '' });
    showToast('Saved to local sync queue');
  };

  const handleSync = () => {
    setQueue(queue.map((e) => ({ ...e, synced: true })));
    showToast('All entries synced to cloud');
  };

  const handleClearSynced = () => {
    setQueue(queue.filter((e) => !e.synced));
  };

  const handleDelete = (id: string) => {
    setQueue(queue.filter((e) => e.id !== id));
  };

  const pendingCount = queue.filter((e) => !e.synced).length;

  const inputClass = "input-field";

  return (
    <div className="ui-batch glass-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-teal" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-charcoal">Batch Data Input</h3>
            <p className="text-sm text-charcoal-muted">1-minute operator entry per shift</p>
          </div>
        </div>

        {/* Sync indicator */}
        <div className="flex items-center gap-2">
          {pendingCount > 0 ? (
            <span className="badge bg-cadmium/20 text-charcoal">
              <Clock className="w-3 h-3" /> Sync Queue: {pendingCount} pending
            </span>
          ) : (
            <span className="badge bg-signal/15 text-signal">
              <CheckCircle2 className="w-3 h-3" /> All synced
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Shift</label>
            <select value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value })} className={inputClass}>
              {SHIFT_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Furnace ID</label>
            <select value={form.furnaceId} onChange={(e) => setForm({ ...form, furnaceId: e.target.value })} className={inputClass}>
              {FURNACE_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Downtime Reason</label>
            <select value={form.downtimeReason} onChange={(e) => setForm({ ...form, downtimeReason: e.target.value })} className={inputClass}>
              {DOWNTIME_REASONS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Tonnes Melted</label>
            <input type="number" step="0.1" min="0" placeholder="0.0" value={form.tonnesMelted}
              onChange={(e) => setForm({ ...form, tonnesMelted: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Accepted Tonnes</label>
            <input type="number" step="0.1" min="0" placeholder="0.0" value={form.acceptedTonnes}
              onChange={(e) => setForm({ ...form, acceptedTonnes: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Rejected Tonnes</label>
            <input type="number" step="0.1" min="0" placeholder="0.0" value={form.rejectedTonnes}
              onChange={(e) => setForm({ ...form, rejectedTonnes: e.target.value })} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1.5">kWh Reading</label>
          <input type="number" step="1" min="0" placeholder="0" value={form.kwhReading}
            onChange={(e) => setForm({ ...form, kwhReading: e.target.value })} className={inputClass} />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-secondary flex items-center gap-2 flex-1 justify-center">
            <Save className="w-4 h-4" /> Save (Offline)
          </button>
          <button type="button" onClick={handleSync} disabled={pendingCount === 0}
            className="btn-primary flex items-center gap-2 flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed">
            <CloudUpload className="w-4 h-4" /> Sync Now
          </button>
        </div>
      </form>

      {/* Queue entries */}
      {queue.length > 0 && (
        <div className="mt-5 pt-5 border-t border-sand-300/50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-charcoal">Sync Queue ({queue.length} entries)</p>
            {queue.some((e) => e.synced) && (
              <button onClick={handleClearSynced} className="text-xs text-charcoal-muted hover:text-crimson flex items-center gap-1 transition-colors">
                <Trash2 className="w-3 h-3" /> Clear synced
              </button>
            )}
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {queue.map((entry) => (
              <div key={entry.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/50 border border-sand-300/40 animate-fade-in">
                <div className={`w-2 h-2 rounded-full ${entry.synced ? 'bg-signal' : 'bg-cadmium'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-charcoal truncate">
                    {entry.furnaceId} · {entry.date} · {entry.shift.split(' ')[0]} {entry.shift.split(' ')[1]}
                  </p>
                  <p className="text-xs text-charcoal-muted">
                    {entry.tonnesMelted}t melted · {entry.acceptedTonnes}t accepted · {entry.kwhReading.toLocaleString()} kWh
                  </p>
                </div>
                {entry.synced ? (
                  <CheckCircle2 className="w-4 h-4 text-signal shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-cadmium shrink-0" />
                )}
                <button onClick={() => handleDelete(entry.id)} className="text-charcoal-muted hover:text-crimson transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass-card px-5 py-3 shadow-glass-hover animate-slide-up">
          <p className="text-sm font-medium text-charcoal">{toast}</p>
        </div>
      )}
    </div>
  );
}
