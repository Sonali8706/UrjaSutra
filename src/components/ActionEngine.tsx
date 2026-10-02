import { Droplets, Wind, Power, ArrowRight, IndianRupee, Wrench, ShieldCheck, Gauge, TrendingUp } from 'lucide-react';
import { ACTIONS } from '@/data';
import type { ActionItem } from '@/types';

const iconMap: Record<string, typeof Droplets> = {
  mold: Droplets,
  compressor: Wind,
  blower: Power,
};

const priorityColors: Record<number, { bg: string; border: string; text: string; label: string }> = {
  1: { bg: 'bg-flare/8', border: 'border-flare/30', text: 'text-flare', label: 'Priority 1' },
  2: { bg: 'bg-flare/5', border: 'border-flare/20', text: 'text-flare', label: 'Priority 2' },
  3: { bg: 'bg-flare/3', border: 'border-flare/15', text: 'text-flare', label: 'Priority 3' },
};

const effortColors: Record<string, string> = {
  Low: 'text-signal',
  Medium: 'text-cadmium',
  High: 'text-crimson',
};

const riskColors: Record<string, string> = {
  None: 'text-signal',
  Low: 'text-signal',
  Medium: 'text-cadmium',
  High: 'text-crimson',
};

function ActionCard({ action, index }: { action: ActionItem; index: number }) {
  const Icon = iconMap[action.icon] || Gauge;
  const colors = priorityColors[action.priority];

  return (
    <div
      className={`glass-card p-5 tilt-card border-2 ${colors.border} relative overflow-hidden group cursor-pointer animate-slide-up`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Priority ribbon */}
      <div className={`absolute top-0 left-0 px-3 py-1 text-xs font-bold ${colors.text} ${colors.bg} rounded-br-xl`}>
        {colors.label}
      </div>

      <div className="mt-6">
        {/* Icon + category */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center group-hover:bg-teal/20 group-hover:scale-110 transition-all duration-300">
            <Icon className="w-5 h-5 text-teal" />
          </div>
          <div>
            <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wide">{action.category}</span>
            <p className="text-xs text-charcoal-muted">Foundry {action.foundryId}</p>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-charcoal leading-snug mb-3 text-balance">
          {action.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-charcoal-muted leading-relaxed mb-4">
          {action.description}
        </p>

        {/* Saving */}
        <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-signal/5 border border-signal/20">
          <TrendingUp className="w-4 h-4 text-signal" />
          <div>
            <p className="text-xs text-charcoal-muted">Estimated Saving</p>
            <p className="text-lg font-bold text-signal flex items-center">
              <IndianRupee className="w-4 h-4" />{action.savingPerMonth.toLocaleString()}<span className="text-xs font-normal text-charcoal-muted ml-1">/mo</span>
            </p>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="glass-panel p-2.5 text-center">
            <Wrench className="w-3.5 h-3.5 text-charcoal-muted mx-auto mb-1" />
            <p className="text-xs text-charcoal-muted">Effort</p>
            <p className={`text-xs font-bold ${effortColors[action.effort]}`}>{action.effort}</p>
          </div>
          <div className="glass-panel p-2.5 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-charcoal-muted mx-auto mb-1" />
            <p className="text-xs text-charcoal-muted">Risk</p>
            <p className={`text-xs font-bold ${riskColors[action.risk]}`}>{action.risk}</p>
          </div>
          <div className="glass-panel p-2.5 text-center">
            <Gauge className="w-3.5 h-3.5 text-charcoal-muted mx-auto mb-1" />
            <p className="text-xs text-charcoal-muted">Confidence</p>
            <p className="text-xs font-bold text-teal">{action.confidence}%</p>
          </div>
        </div>

        {/* Confidence bar */}
        <div className="mb-3">
          <div className="h-1.5 bg-sand-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal rounded-full transition-all duration-500"
              style={{ width: `${action.confidence}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal/10 text-teal font-semibold text-sm hover:bg-teal hover:text-white transition-all duration-200 group-hover:gap-3">
          Assign Action <ArrowRight className="w-4 h-4 transition-all" />
        </button>
      </div>
    </div>
  );
}

export default function ActionEngine() {
  const totalSavings = ACTIONS.reduce((sum, a) => sum + a.savingPerMonth, 0);

  return (
    <div>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h3 className="text-lg font-bold text-charcoal">Action Engine — Top 3 Prioritized Actions</h3>
          <p className="text-sm text-charcoal-muted">AI-ranked recommendations based on sensor data and yield analysis</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-charcoal-muted">Total Potential Savings</p>
          <p className="text-xl font-bold text-signal flex items-center justify-end">
            <IndianRupee className="w-4 h-4" />{totalSavings.toLocaleString()}<span className="text-xs font-normal text-charcoal-muted ml-1">/mo</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {ACTIONS.sort((a, b) => a.priority - b.priority).map((action, idx) => (
          <ActionCard key={action.id} action={action} index={idx} />
        ))}
      </div>
    </div>
  );
}
