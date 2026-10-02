import { useState } from 'react';
import { Map, BarChart3, Calculator, ClipboardList, Zap, BadgeCheck, LayoutDashboard } from 'lucide-react';
import BrandMark from '@/components/BrandMark';
import Header from '@/components/Header';
import StatsBar from '@/components/StatsBar';
import ClusterMap from '@/components/ClusterMap';
import BenchmarkChart from '@/components/BenchmarkChart';
import KeyMetricCalculator from '@/components/KeyMetricCalculator';
import BatchDataForm from '@/components/BatchDataForm';
import ActionEngine from '@/components/ActionEngine';
import VerificationScreen from '@/components/VerificationScreen';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

type TabId = 'overview' | 'map' | 'benchmark' | 'calculator' | 'batch' | 'actions' | 'verification';

interface Tab {
  id: TabId;
  label: string;
  icon: typeof Map;
  roles: UserRole[];
}

const TABS: Tab[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, roles: ['owner', 'tech', 'admin'] },
  { id: 'map', label: 'Cluster Map', icon: Map, roles: ['owner', 'tech', 'admin'] },
  { id: 'benchmark', label: 'Benchmarking', icon: BarChart3, roles: ['owner', 'admin'] },
  { id: 'calculator', label: 'Calculator', icon: Calculator, roles: ['owner', 'tech', 'admin'] },
  { id: 'batch', label: 'Batch Entry', icon: ClipboardList, roles: ['tech', 'owner'] },
  { id: 'actions', label: 'Action Engine', icon: Zap, roles: ['owner', 'tech', 'admin'] },
  { id: 'verification', label: 'Verification', icon: BadgeCheck, roles: ['owner', 'tech', 'admin'] },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  if (!user) return null;

  const availableTabs = TABS.filter((t) => t.roles.includes(user.role));

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <StatsBar />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2"><ClusterMap /></div>
              <div><KeyMetricCalculator /></div>
            </div>
            <ActionEngine />
          </div>
        );
      case 'map':
        return <ClusterMap />;
      case 'benchmark':
        return <BenchmarkChart />;
      case 'calculator':
        return <KeyMetricCalculator />;
      case 'batch':
        return <BatchDataForm />;
      case 'actions':
        return <ActionEngine />;
      case 'verification':
        return <VerificationScreen />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-shell min-h-screen">
      <Header />

      {/* Tab navigation */}
      <nav className="ui-navigation sticky top-16 z-30 bg-sand-100/80 backdrop-blur-md border-b border-sand-300/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5">
            {availableTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-button flex items-center gap-2 whitespace-nowrap ${isActive ? 'tab-button-active' : 'tab-button-inactive'}`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

     

      {/* Main content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div key={activeTab} className="animate-fade-in">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-sand-300/50 mt-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BrandMark size="sm" className="ring-1 ring-flare/40" />
              <span className="text-sm font-bold text-charcoal">UrjaSutra</span>
              <span className="text-xs text-charcoal-muted">Energy & Maintenance Intelligence Platform</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-charcoal-muted">
              <span>Kolhapur Foundry Cluster · 5 Units</span>
              <span>Edge Gateway v2.4</span>
              <span className="text-signal font-medium">● Online</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
