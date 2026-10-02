import { Zap, TrendingDown, Factory, IndianRupee, AlertTriangle, Activity } from 'lucide-react';
import { FOUNDRY_DATA, PEER_MEDIAN } from '@/data';

export default function StatsBar() {
  const totalKWh = FOUNDRY_DATA.reduce((s, f) => s + f.totalKWh, 0);
  const totalMelted = FOUNDRY_DATA.reduce((s, f) => s + f.tonnesMelted, 0);
  const avgYield = (FOUNDRY_DATA.reduce((s, f) => s + f.yieldPct, 0) / FOUNDRY_DATA.length).toFixed(1);
  const avgEnergy = Math.round(FOUNDRY_DATA.reduce((s, f) => s + f.energyPerGoodTonne, 0) / FOUNDRY_DATA.length);
  const criticalCount = FOUNDRY_DATA.filter((f) => f.status === 'critical').length;

  const stats = [
    { label: 'Total Energy', value: totalKWh.toLocaleString(), unit: 'kWh', icon: Zap, color: 'text-flare', bg: 'bg-flare/10' },
    { label: 'Tonnes Melted', value: totalMelted.toString(), unit: 'tonnes', icon: Factory, color: 'text-teal', bg: 'bg-teal/10' },
    { label: 'Avg Yield', value: avgYield, unit: '%', icon: TrendingDown, color: avgYield < '75' ? 'text-crimson' : 'text-signal', bg: 'bg-signal/10' },
    { label: 'Avg kWh/Good Tonne', value: avgEnergy.toString(), unit: 'kWh/t', icon: Activity, color: avgEnergy > PEER_MEDIAN ? 'text-cadmium' : 'text-signal', bg: 'bg-cadmium/10' },
    { label: 'Critical Alerts', value: criticalCount.toString(), unit: 'foundries', icon: AlertTriangle, color: 'text-crimson', bg: 'bg-crimson/10' },
  ];

  return (
    <div className="ui-metrics relative grid grid-cols-2 md:grid-cols-5 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="glass-card p-4 group hover:tilt-card transition-all">
            <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-xs text-charcoal-muted font-medium">{stat.label}</p>
            <p className="text-xl font-bold text-charcoal font-mono">
              {stat.value}<span className="text-xs font-normal text-charcoal-muted ml-1">{stat.unit}</span>
            </p>
          </div>
        );
      })}
    </div>
  );
}
