import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, ReferenceArea, Area, ComposedChart,
} from 'recharts';
import { BadgeCheck, Camera, Plus, TrendingDown, Activity, X, Upload } from 'lucide-react';
import { VERIFICATION_DATA, FOUNDRY_DATA } from '@/data';
import type { VerificationPoint } from '@/types';

const PRE_REPAIR = 1096;
const POST_REPAIR = 1043;

export default function VerificationScreen() {
  const [data, setData] = useState<{ week: number; label: string; energyPerGoodTonne: number; event?: string }[]>(VERIFICATION_DATA);
  const [showModal, setShowModal] = useState(false);
  const [repairLabel, setRepairLabel] = useState('');
  const [newTarget, setNewTarget] = useState(1040);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  const foundryD = FOUNDRY_DATA.find((f) => f.id === 'D')!;

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: { label: string; energyPerGoodTonne: number; event?: string } }[] }) => {
    if (!active || !payload?.length) return null;
    const point = payload[0].payload;
    return (
      <div className="glass-card p-3 shadow-glass-hover">
        <p className="font-bold text-charcoal text-sm">{point.label}</p>
        <p className="text-xs text-charcoal-muted">
          Energy: <span className="font-semibold text-charcoal">{point.energyPerGoodTonne} kWh/good tonne</span>
        </p>
        {point.event && (
          <p className="text-xs text-flare font-semibold mt-1 flex items-center gap-1">
            <Activity className="w-3 h-3" /> {point.event}
          </p>
        )}
      </div>
    );
  };

  const handleAddRepair = () => {
    if (!repairLabel.trim()) return;
    const lastWeek = data[data.length - 1]?.week || 10;
    const newPoints: { week: number; label: string; energyPerGoodTonne: number; event?: string }[] = [
      { week: lastWeek + 1, label: `Week ${lastWeek + 1}`, energyPerGoodTonne: data[data.length - 1].energyPerGoodTonne - 15, event: repairLabel },
      { week: lastWeek + 2, label: `Week ${lastWeek + 2}`, energyPerGoodTonne: newTarget + 8 },
      { week: lastWeek + 3, label: `Week ${lastWeek + 3}`, energyPerGoodTonne: newTarget },
    ];
    setData([...data, ...newPoints]);
    setShowModal(false);
    setRepairLabel('');
    setUploadedPhoto(null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setUploadedPhoto(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="ui-verification glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-signal/10 flex items-center justify-center">
            <BadgeCheck className="w-5 h-5 text-signal" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-charcoal">Closed-Loop Verification — Foundry D</h3>
            <p className="text-sm text-charcoal-muted">Before & after impact tracking with repair event markers</p>
          </div>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Verify New Action
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="glass-panel p-4">
          <p className="text-xs text-charcoal-muted font-medium mb-1">Pre-Repair</p>
          <p className="text-2xl font-bold text-crimson font-mono">{PRE_REPAIR}</p>
          <p className="text-xs text-charcoal-muted">kWh / good tonne</p>
        </div>
        <div className="glass-panel p-4">
          <p className="text-xs text-charcoal-muted font-medium mb-1">Verified Post-Repair</p>
          <p className="text-2xl font-bold text-signal font-mono">{POST_REPAIR}</p>
          <p className="text-xs text-charcoal-muted">kWh / good tonne</p>
        </div>
        <div className="glass-panel p-4 bg-signal/5 border-signal/20">
          <p className="text-xs text-charcoal-muted font-medium mb-1">Verified Savings</p>
          <p className="text-2xl font-bold text-signal font-mono flex items-center">
            <TrendingDown className="w-5 h-5" /> {PRE_REPAIR - POST_REPAIR}
          </p>
          <p className="text-xs text-charcoal-muted">kWh / good tonne (5.1% ↓)</p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0D7C85" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#0D7C85" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0D5C5" vertical={false} />
          <XAxis dataKey="label" tick={{ fill: '#5A6360', fontSize: 11 }} axisLine={{ stroke: '#D2C3AD' }} angle={-20} textAnchor="end" height={60} />
          <YAxis
            domain={[1000, 1120]}
            tick={{ fill: '#5A6360', fontSize: 12 }}
            axisLine={{ stroke: '#D2C3AD' }}
            label={{ value: 'kWh / good tonne', angle: -90, position: 'insideLeft', fill: '#5A6360', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Pre-repair zone */}
          <ReferenceArea x1="Week 1" x2="Week 7" fill="#D92626" fillOpacity={0.04} />
          {/* Post-repair zone */}
          <ReferenceArea x1="Week 7" x2={data[data.length - 1]?.label} fill="#00A859" fillOpacity={0.05} />

          <Area type="monotone" dataKey="energyPerGoodTonne" stroke="none" fill="url(#energyGradient)" />
          <Line
            type="monotone"
            dataKey="energyPerGoodTonne"
            stroke="#0D7C85"
            strokeWidth={3}
            dot={{ fill: '#0D7C85', r: 4 }}
            activeDot={{ r: 6, fill: '#0D7C85' }}
          />

          {/* Repair event reference line */}
          <ReferenceLine
            x="Week 7"
            stroke="#FF6B00"
            strokeWidth={2}
            strokeDasharray="6 4"
            label={{ value: '↓ Mold Quality Fix', position: 'top', fill: '#FF6B00', fontSize: 11, fontWeight: 600 }}
          />
          {/* Pre-repair reference */}
          <ReferenceLine y={PRE_REPAIR} stroke="#D92626" strokeWidth={1.5} strokeDasharray="4 4" opacity={0.5}
            label={{ value: `Pre: ${PRE_REPAIR}`, position: 'insideTopLeft', fill: '#D92626', fontSize: 10 }} />
          {/* Post-repair reference */}
          <ReferenceLine y={POST_REPAIR} stroke="#00A859" strokeWidth={1.5} strokeDasharray="4 4" opacity={0.5}
            label={{ value: `Post: ${POST_REPAIR}`, position: 'insideBottomLeft', fill: '#00A859', fontSize: 10 }} />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Timeline labels */}
      <div className="flex items-center justify-between mt-4 px-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-crimson/30" />
          <span className="text-xs text-charcoal-muted font-medium">Pre-Repair Period</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-flare/40" />
          <span className="text-xs text-charcoal-muted font-medium">Repair Event Logged</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-signal/30" />
          <span className="text-xs text-charcoal-muted font-medium">Verified Post-Repair</span>
        </div>
      </div>

      {/* Foundry D context */}
      <div className="mt-5 p-4 rounded-xl bg-white/40 border border-sand-300/40 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-crimson/10 flex items-center justify-center shrink-0">
          <Activity className="w-4 h-4 text-crimson" />
        </div>
        <p className="text-xs text-charcoal-muted">
          <strong className="text-charcoal">Foundry D</strong> — {foundryD.tonnesMelted}t melted at {foundryD.kWhPerTonneMelted} kWh/t. With 68% yield, the hidden cost was
          {' '}<strong className="text-crimson">1,103 kWh/good tonne</strong>. Post mold quality fix, yield improved to 74%, bringing verified energy down to
          {' '}<strong className="text-signal">{POST_REPAIR} kWh/good tonne</strong>.
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="glass-card p-6 w-full max-w-md shadow-glass-hover animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-lg font-bold text-charcoal">Log New Repair Verification</h4>
              <button onClick={() => setShowModal(false)} className="text-charcoal-muted hover:text-charcoal transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Repair Description</label>
                <input
                  type="text"
                  value={repairLabel}
                  onChange={(e) => setRepairLabel(e.target.value)}
                  placeholder="e.g., Compressor leak repaired"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Target Energy (kWh/good tonne)</label>
                <input
                  type="range"
                  min={950}
                  max={1100}
                  step={1}
                  value={newTarget}
                  onChange={(e) => setNewTarget(Number(e.target.value))}
                  className="w-full h-2 bg-sand-300 rounded-lg appearance-none cursor-pointer accent-teal"
                />
                <p className="text-sm font-bold text-charcoal mt-1 font-mono">{newTarget} kWh/t</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1.5">Upload Repair Photo</label>
                <label className="flex items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-sand-300 hover:border-teal hover:bg-teal/5 cursor-pointer transition-all">
                  {uploadedPhoto ? (
                    <img src={uploadedPhoto} alt="Repair" className="max-h-32 rounded-lg" />
                  ) : (
                    <>
                      <Camera className="w-5 h-5 text-charcoal-muted" />
                      <span className="text-sm text-charcoal-muted">Click to upload photo</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>

              <button onClick={handleAddRepair} disabled={!repairLabel.trim()} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                <Upload className="w-4 h-4" /> Log & Update Graph
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
