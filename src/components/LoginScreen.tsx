import { useState } from 'react';
import { Factory, Wrench, Building2, ArrowRight, ShieldCheck, TrendingDown } from 'lucide-react';
import BrandMark from '@/components/BrandMark';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

const demoRoles: { role: UserRole; email: string; password: string; label: string; icon: typeof Factory; desc: string }[] = [
  { role: 'owner', email: 'owner@foundry.com', password: 'owner123', label: 'Factory Owner', icon: Factory, desc: 'Full dashboard & savings tracking' },
  { role: 'tech', email: 'tech@foundry.com', password: 'tech123', label: 'Maintenance Technician', icon: Wrench, desc: 'Batch entry & action verification' },
  { role: 'admin', email: 'admin@kolhapurcluster.com', password: 'admin123', label: 'Cluster Admin', icon: Building2, desc: 'Benchmarking across all units' },
];

export default function LoginScreen() {
  const { login, loginAsRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(email, password)) {
      setError('Invalid credentials. Try a demo login below.');
    }
  };

  const handleDemoLogin = (role: UserRole, em: string, pw: string) => {
    setEmail(em);
    setPassword(pw);
    setError('');
    loginAsRole(role);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.pexels.com/photos/6804258/pexels-photo-6804258.jpeg?auto=compress&cs=tinysrgb&h=650&w=940)`,
        }}
      />
      <div className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm" />

      {/* Floating accent shapes */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-flare/10 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal/10 rounded-full blur-3xl animate-pulse-soft" />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <BrandMark size="lg" className="ring-2 ring-flare/60 shadow-lg" />
            <span className="text-3xl font-bold text-white tracking-tight">UrjaSutra</span>
          </div>
          <p className="text-sand-200 text-sm font-medium">Energy & Maintenance Intelligence for MSME Foundries</p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-bold text-charcoal mb-1">Sign in to your dashboard</h2>
          <p className="text-charcoal-muted text-sm mb-6">Access real-time energy metrics and action insights</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@foundry.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            {error && (
              <div className="bg-crimson/10 text-crimson text-sm rounded-lg px-4 py-2.5 animate-fade-in">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-sand-300" />
            <span className="text-xs text-charcoal-muted font-medium">Quick Demo Access</span>
            <div className="flex-1 h-px bg-sand-300" />
          </div>

          {/* Demo role buttons */}
          <div className="space-y-2.5">
            {demoRoles.map(({ role, email: em, password: pw, label, icon: Icon, desc }) => (
              <button
                key={role}
                onClick={() => handleDemoLogin(role, em, pw)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-sand-300/50 hover:bg-white hover:shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] text-left group"
              >
                <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center group-hover:bg-teal/20 transition-colors">
                  <Icon className="w-5 h-5 text-teal" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-charcoal">{label}</p>
                  <p className="text-xs text-charcoal-muted">{desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-charcoal-muted group-hover:text-teal group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-6 text-sand-200">
          <div className="flex items-center gap-1.5 text-xs">
            <ShieldCheck className="w-4 h-4" /> Secure Edge Sync
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <TrendingDown className="w-4 h-4" /> Avg 12% Energy Savings
          </div>
        </div>
      </div>
    </div>
  );
}
