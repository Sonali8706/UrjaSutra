import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend, Cell } from 'recharts';
import { PEER_MEDIAN, FOUNDRY_DATA } from '@/data';
import { Info } from 'lucide-react';
import { useState } from 'react';

export default function BenchmarkChart() {
  const [showFurnace, setShowFurnace] = useState(true);
  const [showUrjaSutra, setShowUrjaSutra] = useState(true);

  const chartData = FOUNDRY_DATA.map((f) => ({
    name: f.name,
    furnace: f.kWhPerTonneMelted,
    urjaSutra: f.energyPerGoodTonne,
    status: f.status,
  }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; color: string; payload?: { name: string; furnace: number; urjaSutra: number; status: string } }[] }) => {
    if (!active || !payload?.length) return null;
    const foundryName = payload[0]?.payload?.name ?? '';
    const furnace = payload[0]?.payload?.furnace ?? 0;
    const urjaSutra = payload[0]?.payload?.urjaSutra ?? 0;
    return (
      <div className="glass-card p-3 shadow-glass-hover">
        <p className="font-bold text-charcoal text-sm mb-2">{foundryName}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }} />
            <span className="text-charcoal-muted">{entry.name === 'furnace' ? 'Furnace View' : 'UrjaSutra View'}:</span>
            <span className="font-semibold text-charcoal">{entry.value} kWh/t</span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-sand-300/50 text-xs text-charcoal-muted">
          Gap: <span className="font-semibold text-flare">{urjaSutra - furnace} kWh/t</span>
        </div>
      </div>
    );
  };

  return (
    <div className="ui-benchmark glass-card p-6">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-lg font-bold text-charcoal">Comparative Benchmark — Furnace vs. UrjaSutra View</h3>
          <p className="text-sm text-charcoal-muted">Furnace-only kWh/t melted vs. true kWh per good tonne · Peer median at {PEER_MEDIAN} kWh/good tonne</p>
        </div>
      </div>

      {/* Toggle legend */}
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setShowFurnace(!showFurnace)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${showFurnace ? 'bg-teal/10 text-teal' : 'bg-sand-200 text-charcoal-muted'}`}
        >
          <div className={`w-3 h-3 rounded ${showFurnace ? 'bg-teal' : 'bg-sand-400'}`} /> Furnace-Only View
        </button>
        <button
          onClick={() => setShowUrjaSutra(!showUrjaSutra)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${showUrjaSutra ? 'bg-flare/10 text-flare' : 'bg-sand-200 text-charcoal-muted'}`}
        >
          <div className={`w-3 h-3 rounded ${showUrjaSutra ? 'bg-flare' : 'bg-sand-400'}`} /> UrjaSutra View
        </button>
        <div className="flex items-center gap-1.5 text-xs text-charcoal-muted ml-auto">
          <Info className="w-3.5 h-3.5" /> Foundry D appears normal in furnace view but is worst cluster-wide
        </div>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E0D5C5" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#5A6360', fontSize: 13, fontWeight: 600 }} axisLine={{ stroke: '#D2C3AD' }} />
          <YAxis tick={{ fill: '#5A6360', fontSize: 12 }} axisLine={{ stroke: '#D2C3AD' }} label={{ value: 'kWh / tonne', angle: -90, position: 'insideLeft', fill: '#5A6360', fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(218, 208, 198, 0.2)' }} />
          {showFurnace && <Bar dataKey="furnace" name="furnace" fill="#0D7C85" radius={[6, 6, 0, 0]} maxBarSize={48} />}
          {showUrjaSutra && (
            <Bar dataKey="urjaSutra" name="urjaSutra" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={entry.status === 'critical' ? '#D92626' : entry.status === 'optimal' ? '#00A859' : '#FF6B00'} />
              ))}
            </Bar>
          )}
          <ReferenceLine
            y={PEER_MEDIAN}
            stroke="#8A7762"
            strokeWidth={2}
            strokeDasharray="6 4"
            label={{ value: `Peer Median: ${PEER_MEDIAN}`, position: 'right', fill: '#8A7762', fontSize: 11, fontWeight: 600 }}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Insight callout for Foundry D */}
      <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-crimson/5 border border-crimson/20">
        <div className="w-8 h-8 rounded-lg bg-crimson/10 flex items-center justify-center shrink-0">
          <Info className="w-4 h-4 text-crimson" />
        </div>
        <div>
          <p className="text-sm font-semibold text-charcoal">Foundry D — The Hidden Waste Problem</p>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Furnace view shows <strong className="text-charcoal">700 kWh/t</strong> — looks average. But with only <strong className="text-crimson">68% yield</strong>,
            the true energy cost is <strong className="text-crimson">1,103 kWh/good tonne</strong> — the worst in the cluster. The gap is pure waste on rejected castings.
          </p>
        </div>
      </div>
    </div>
  );
}
