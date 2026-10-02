import { useState } from 'react';
import { MapPin, Wifi, ChevronDown, LogOut, Factory, Wrench, Building2 } from 'lucide-react';
import BrandMark from '@/components/BrandMark';
import { useAuth, roleLabels } from '@/context/AuthContext';
import type { UserRole } from '@/types';

const roleIcons: Record<UserRole, typeof Factory> = {
  owner: Factory,
  tech: Wrench,
  admin: Building2,
};

export default function Header() {
  const { user, logout, switchRole } = useAuth();
  const [clusterOpen, setClusterOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  if (!user) return null;

  const RoleIcon = roleIcons[user.role];

  return (
    <header className="ui-header sticky top-0 z-40 bg-white/75 backdrop-blur-md border-b border-teal/20 shadow-[0_4px_20px_rgba(13,124,133,0.08)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <BrandMark size="md" className="ring-2 ring-flare/40" />
            <div>
              <span className="text-lg font-bold text-charcoal tracking-tight">UrjaSutra</span>
              <span className="hidden sm:inline ml-2 text-xs font-semibold text-flare">v2.4</span>
            </div>
          </div>

          {/* Center: Cluster Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setClusterOpen(!clusterOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 border border-sand-300/50 hover:bg-white hover:shadow-sm transition-all duration-200"
            >
              <MapPin className="w-4 h-4 text-teal" />
              <span className="text-sm font-medium text-charcoal">Kolhapur Foundry Cluster</span>
              <span className="badge bg-signal/15 text-signal">5 Units Active</span>
              <ChevronDown className={`w-4 h-4 text-charcoal-muted transition-transform ${clusterOpen ? 'rotate-180' : ''}`} />
            </button>
            {clusterOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setClusterOpen(false)} />
                <div className="absolute top-full mt-2 left-0 w-72 glass-card p-3 z-20 animate-scale-in">
                  <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wide mb-2 px-2">Active Clusters</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-teal/10 cursor-pointer">
                      <span className="text-sm font-medium text-charcoal">Kolhapur Foundry Cluster</span>
                      <span className="badge bg-signal/15 text-signal">5</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-sand-200 cursor-pointer opacity-60">
                      <span className="text-sm font-medium text-charcoal">Coimbatore Cluster</span>
                      <span className="badge bg-sand-300 text-charcoal-muted">8</span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-sand-200 cursor-pointer opacity-60">
                      <span className="text-sm font-medium text-charcoal">Rajkot Cluster</span>
                      <span className="badge bg-sand-300 text-charcoal-muted">12</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right: Status + Profile */}
          <div className="flex items-center gap-3">
            {/* Status indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-signal/10">
              <div className="relative">
                <div className="w-2 h-2 bg-signal rounded-full" />
                <div className="absolute inset-0 w-2 h-2 bg-signal rounded-full animate-ping opacity-75" />
              </div>
              <div className="text-xs">
                <span className="font-semibold text-signal">System Online</span>
                <span className="text-charcoal-muted ml-1.5">Edge synced 2m ago</span>
              </div>
              <Wifi className="w-3.5 h-3.5 text-signal" />
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 border border-sand-300/50 hover:bg-white hover:shadow-sm transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-teal flex items-center justify-center">
                  <RoleIcon className="w-4 h-4 text-white" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-semibold text-charcoal leading-tight">{user.name}</p>
                  <p className="text-xs text-charcoal-muted leading-tight">{roleLabels[user.role]}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-charcoal-muted transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute top-full mt-2 right-0 w-64 glass-card p-3 z-20 animate-scale-in">
                    <div className="flex items-center gap-3 px-2 py-2 mb-2 border-b border-sand-300/50 pb-3">
                      <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center">
                        <RoleIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-charcoal">{user.name}</p>
                        <p className="text-xs text-charcoal-muted">{user.email}</p>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wide mb-1.5 px-2">Switch Role</p>
                    <div className="space-y-1 mb-2">
                      {(Object.keys(roleIcons) as UserRole[]).map((r) => {
                        const RIcon = roleIcons[r];
                        return (
                          <button
                            key={r}
                            onClick={() => { switchRole(r); setProfileOpen(false); }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${user.role === r ? 'bg-teal/10 text-teal font-semibold' : 'hover:bg-sand-200 text-charcoal'}`}
                          >
                            <RIcon className="w-4 h-4" />
                            {roleLabels[r]}
                            {user.role === r && <span className="ml-auto text-xs">●</span>}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-crimson hover:bg-crimson/10 transition-all"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
