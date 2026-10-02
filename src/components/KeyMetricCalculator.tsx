import { useState } from 'react';
import { Calculator, Zap, Percent, TrendingDown, AlertTriangle, ArrowRight } from 'lucide-react';
import { PEER_MEDIAN } from '@/data';

export default function KeyMetricCalculator() {
  const [totalKWh, setTotalKWh] = useState(84000);
  const [tonnesMelted, setTonnesMelted] = useState(120);
  const [acceptedTonnes, setAcceptedTonnes] = useState(81.6);

  const yieldPct = tonnesMelted > 0 ? (acceptedTonnes / tonnesMelted) * 100 : 0;
  const energyPerGoodTonne = acceptedTonnes > 0 ? Math.round(totalKWh / acceptedTonnes) : 0;
  const rejectedTonnes = Math.max(0, tonnesMelted - acceptedTonnes);
  const energyOnRejected = Math.round(totalKWh * (rejectedTonnes / Math.max(tonnesMelted, 0.01)));
  const vsPeer = energyPerGoodTonne - PEER_MEDIAN;
  const costPerKWh = 8; // ₹8 per kWh approximate industrial rate

  const sliderClass = "w-full h-2 bg-sand-300 rounded-lg appearance-none cursor-pointer accent-teal";

  return (
    <div className="ui-calculator glass-card p-6 tilt-card">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-teal" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-charcoal">Key Metric Calculator</h3>
          <p className="text-sm text-charcoal-muted">Adjust sliders to see real-time energy impact</p>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-5">
        {/* Total Energy */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-charcoal flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-flare" /> Total Energy Consumed
            </label>
            <span className="text-sm font-bold text-charcoal font-mono">{totalKWh.toLocaleString()} kWh</span>
          </div>
          <input
            type="range"
            min={10000}
            max={150000}
            step={1000}
            value={totalKWh}
            onChange={(e) => setTotalKWh(Number(e.target.value))}
            className={sliderClass}
          />
          <div className="flex justify-between text-xs text-charcoal-muted mt-1">
            <span>10,000</span><span>150,000 kWh</span>
          </div>
        </div>

        {/* Tonnes Melted */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-charcoal flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-teal" /> Tonnes Melted
            </label>
            <span className="text-sm font-bold text-charcoal font-mono">{tonnesMelted} t</span>
          </div>
          <input
            type="range"
            min={10}
            max={250}
            step={1}
            value={tonnesMelted}
            onChange={(e) => setTonnesMelted(Number(e.target.value))}
            className={sliderClass}
          />
          <div className="flex justify-between text-xs text-charcoal-muted mt-1">
            <span>10</span><span>250 t</span>
          </div>
        </div>

        {/* Accepted Tonnes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-charcoal flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-signal" /> Accepted Castings
            </label>
            <span className="text-sm font-bold text-charcoal font-mono">{acceptedTonnes.toFixed(1)} t</span>
          </div>
          <input
            type="range"
            min={0}
            max={tonnesMelted}
            step={0.1}
            value={Math.min(acceptedTonnes, tonnesMelted)}
            onChange={(e) => setAcceptedTonnes(Number(e.target.value))}
            className={sliderClass}
          />
          <div className="flex justify-between text-xs text-charcoal-muted mt-1">
            <span>0</span><span>{tonnesMelted} t</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {/* Yield */}
        <div className="glass-panel p-4">
          <p className="text-xs text-charcoal-muted font-medium mb-1">Yield %</p>
          <p className={`text-2xl font-bold font-mono ${yieldPct < 70 ? 'text-crimson' : yieldPct < 78 ? 'text-cadmium' : 'text-signal'}`}>
            {yieldPct.toFixed(1)}%
          </p>
          <p className="text-xs text-charcoal-muted mt-1">Accepted ÷ Melted</p>
        </div>

        {/* Energy per good tonne */}
        <div className="glass-panel p-4">
          <p className="text-xs text-charcoal-muted font-medium mb-1">kWh / Good Tonne</p>
          <p className={`text-2xl font-bold font-mono ${energyPerGoodTonne > 1050 ? 'text-crimson' : energyPerGoodTonne > PEER_MEDIAN ? 'text-cadmium' : 'text-signal'}`}>
            {energyPerGoodTonne.toLocaleString()}
          </p>
          <p className="text-xs text-charcoal-muted mt-1">Total kWh ÷ Accepted t</p>
        </div>
      </div>

      {/* Energy waste widget */}
      <div className="mt-3 p-4 rounded-xl bg-gradient-to-br from-crimson/5 to-flare/5 border border-crimson/20">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-crimson" />
          <p className="text-sm font-semibold text-charcoal">Energy Wasted on Rejected Castings</p>
        </div>
        <div className="flex items-end gap-4">
          <div>
            <p className="text-xs text-charcoal-muted">Rejected Tonnes</p>
            <p className="text-lg font-bold text-crimson font-mono">{rejectedTonnes.toFixed(1)} t</p>
          </div>
          <div className="w-px h-10 bg-sand-300" />
          <div>
            <p className="text-xs text-charcoal-muted">Energy Wasted</p>
            <p className="text-lg font-bold text-crimson font-mono">{energyOnRejected.toLocaleString()} kWh</p>
          </div>
          <div className="w-px h-10 bg-sand-300" />
          <div>
            <p className="text-xs text-charcoal-muted">Cost Wasted</p>
            <p className="text-lg font-bold text-crimson font-mono">₹{(energyOnRejected * costPerKWh).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Peer comparison */}
      <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-white/50">
        <div className="flex items-center gap-2">
          <span className="text-sm text-charcoal-muted">vs. Peer Median ({PEER_MEDIAN})</span>
        </div>
        <div className={`flex items-center gap-1.5 font-semibold text-sm ${vsPeer > 0 ? 'text-crimson' : 'text-signal'}`}>
          {vsPeer > 0 ? '+' : ''}{vsPeer} kWh/t
          <ArrowRight className={`w-4 h-4 ${vsPeer > 0 ? 'rotate-0' : 'rotate-180'}`} />
        </div>
      </div>
    </div>
  );
}
