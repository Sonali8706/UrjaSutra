import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Factory, X, TrendingDown, Zap, Gauge, AlertTriangle, CheckCircle2, ZoomIn, ZoomOut, LocateFixed, Filter, Layers } from 'lucide-react';
import { FOUNDRY_DATA } from '@/data';
import type { Foundry } from '@/types';

const statusColors: Record<Foundry['status'], string> = {
  optimal: '#00A859',
  warning: '#FF6B00',
  critical: '#D92626',
};

const statusBg: Record<Foundry['status'], string> = {
  optimal: 'bg-signal',
  warning: 'bg-flare',
  critical: 'bg-crimson',
};

type FilterMode = 'all' | 'highRisk' | 'topPerformers';

const filterLabels: Record<FilterMode, string> = {
  all: 'All Foundries',
  highRisk: 'High Risk / Yield Loss',
  topPerformers: 'Top Performers',
};

export default function ClusterMap({ onSelectFoundry }: { onSelectFoundry?: (id: string) => void }) {
  const [hovered, setHovered] = useState<Foundry | null>(null);
  const [selected, setSelected] = useState<Foundry | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });
  const [mapRect, setMapRect] = useState<DOMRect | null>(null);

  const activeFoundry = hovered || selected;

  useLayoutEffect(() => {
    if (!activeFoundry || !mapRef.current) return;
    setMapRect(mapRef.current.getBoundingClientRect());
  }, [activeFoundry]);

  useEffect(() => {
    const update = () => {
      if (mapRef.current) setMapRect(mapRef.current.getBoundingClientRect());
    };
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, []);

  const mapBounds = {
    minLat: 16.68,
    maxLat: 16.74,
    minLng: 74.22,
    maxLng: 74.29,
  };

  const project = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
    const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return { x, y };
  };

  const matchesFilter = (f: Foundry): boolean => {
    if (filterMode === 'all') return true;
    if (filterMode === 'highRisk') return f.status === 'critical' || f.status === 'warning';
    if (filterMode === 'topPerformers') return f.status === 'optimal';
    return true;
  };

  const visibleFoundries = FOUNDRY_DATA.filter(matchesFilter);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 2));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.75));
  const handleRecenter = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('[data-pin]')) return;
    isPanning.current = true;
    panStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning.current) return;
    setPan({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
  };
  const handleMouseUp = () => { isPanning.current = false; };

  const cycleFilter = () => {
    setFilterMode((prev) => prev === 'all' ? 'highRisk' : prev === 'highRisk' ? 'topPerformers' : 'all');
  };

  return (
    <div className="ui-map glass-card p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-charcoal">Cluster Map — Kolhapur Foundry Belt</h3>
          <p className="text-sm text-charcoal-muted">5 foundries tracked · Real-time edge sensor data</p>
        </div>
      </div>

      {/* Map viewport */}
      <div
        ref={mapRef}
        className="relative w-full aspect-[16/10] rounded-xl overflow-hidden border border-sand-300/50 cursor-grab active:cursor-grabbing select-none"
        style={{
          background: '#17261e',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { handleMouseUp(); setHovered(null); }}
      >
        {/* Zoomable / pannable map layer */}
        <div
          className="absolute inset-0 origin-center transition-transform duration-200"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          {/* Topographic grid */}
                    {/* Satellite background — same bounds as existing pins */}
          <img
            src={
              'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export' +
              '?bbox=74.22,16.68,74.29,16.74' +
              '&bboxSR=4326' +
              '&imageSR=4326' +
              '&size=1400,1200' +
              '&format=jpg' +
              '&transparent=false' +
              '&f=image'
            }
            alt=""
            aria-hidden="true"
            draggable={false}
            className="absolute inset-0 h-full w-full pointer-events-none"
            style={{ objectFit: 'fill' }}
          />

          {/* Foundry pins with radar rings */}
          {FOUNDRY_DATA.map((f) => {
            const { x, y } = project(f.lat, f.lng);
            const isActive = activeFoundry?.id === f.id;
            const isVisible = visibleFoundries.some((vf) => vf.id === f.id);
            const isCritical = f.status === 'critical';

            return (
              <div key={f.id}>
                {/* Radar pulse rings */}
                {isVisible && (
                  <div
                    className="absolute pointer-events-none"
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    {/* Outer expanding ring */}
                    <div
                      className="absolute rounded-full animate-ping"
                      style={{
                        width: '48px',
                        height: '48px',
                        left: '-24px',
                        top: '-24px',
                        border: `2px solid ${statusColors[f.status]}`,
                        opacity: isCritical ? 0.5 : 0.25,
                      }}
                    />
                    {/* Inner pulse ring */}
                    <div
                      className="absolute rounded-full"
                      style={{
                        width: '36px',
                        height: '36px',
                        left: '-18px',
                        top: '-18px',
                        border: `1.5px solid ${statusColors[f.status]}`,
                        opacity: 0.2,
                        animation: 'pulseSoft 2s ease-in-out infinite',
                      }}
                    />
                    {/* Critical warning ring */}
                    {isCritical && (
                      <div
                        className="absolute rounded-full"
                        style={{
                          width: '56px',
                          height: '56px',
                          left: '-28px',
                          top: '-28px',
                          border: '2px dashed #D92626',
                          opacity: 0.35,
                          animation: 'spin 8s linear infinite',
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Pin button */}
                <button
                  data-pin="true"
                  className="absolute rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: isActive ? '38px' : '30px',
                    height: isActive ? '38px' : '30px',
                    backgroundColor: statusColors[f.status],
                    boxShadow: isActive
                      ? `0 6px 20px ${statusColors[f.status]}60, 0 0 0 3px white`
                      : `0 4px 12px ${statusColors[f.status]}40`,
                    zIndex: isActive ? 20 : 10,
                    opacity: isVisible ? 1 : 0.25,
                    filter: isVisible ? 'none' : 'grayscale(0.7)',
                    pointerEvents: isVisible ? 'auto' : 'none',
                  }}
                  onMouseEnter={(e) => { e.stopPropagation(); setHovered(f); }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(selected?.id === f.id ? null : f);
                    onSelectFoundry?.(f.id);
                  }}
                >
                  <span className="text-white font-bold text-xs">{f.id}</span>
                </button>

                {/* Pin label */}
                <div
                  className="absolute text-[11px] font-semibold pointer-events-none transition-all duration-200 whitespace-nowrap"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, calc(-100% - 14px))',
                    color: '#1C2321',
                    opacity: isActive ? 1 : (isVisible ? 0.65 : 0.2),
                    zIndex: 11,
                  }}
                >
                  <span className="bg-white/70 backdrop-blur-sm px-1.5 py-0.5 rounded">{f.name}</span>
                </div>
              </div>
            );
          })}
        </div>
                  {/* Satellite imagery attribution */}
        <div
          className="absolute bottom-1 right-1 z-40 max-w-[55%] rounded bg-white/90 px-2 py-1 text-[9px] leading-tight text-slate-700"
          onMouseDown={(e) => e.stopPropagation()}
        >
          Imagery: Esri &amp; imagery contributors ·{' '}
          <a
            href="https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Sources &amp; terms
          </a>
        </div>
        {/* === TOOLTIP IS RENDERED VIA PORTAL (see below, outside overflow-hidden) === */}

        {/* === MAP CONTROLS (top-right) === */}
        <div className="absolute top-3 right-3 z-40 flex flex-col gap-2">
          {/* Zoom controls */}
          <div className="glass-card p-1 flex flex-col gap-0.5 shadow-card">
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-charcoal hover:bg-sand-200 transition-all active:scale-90"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <div className="h-px bg-sand-300/50 mx-1" />
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-charcoal hover:bg-sand-200 transition-all active:scale-90"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Recenter */}
          <button
            onClick={handleRecenter}
            className="w-10 h-10 glass-card flex items-center justify-center text-teal hover:bg-teal hover:text-white transition-all active:scale-90 shadow-card"
            title="Recenter Map"
          >
            <LocateFixed className="w-4 h-4" />
          </button>
        </div>

        {/* === FILTER TOGGLE (top-left) === */}
        <div className="absolute top-3 left-3 z-40">
          <button
            onClick={cycleFilter}
            className="glass-card flex items-center gap-2 px-3 py-2 shadow-card hover:shadow-glass-hover transition-all active:scale-95"
          >
            <Filter className="w-4 h-4 text-teal" />
            <span className="text-xs font-semibold text-charcoal">{filterLabels[filterMode]}</span>
            <div className="flex gap-1 ml-1">
              {(['all', 'highRisk', 'topPerformers'] as FilterMode[]).map((mode) => (
                <div
                  key={mode}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${filterMode === mode ? 'bg-teal w-3' : 'bg-sand-400'}`}
                />
              ))}
            </div>
          </button>
        </div>

        {/* Zoom level indicator */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 glass-panel px-2.5 py-1 text-xs text-charcoal-muted font-mono pointer-events-none">
          {(zoom * 100).toFixed(0)}%
        </div>

        {/* === MAP LEGEND (bottom-left) === */}
        <div className="absolute bottom-3 left-3 z-40">
          <div className="glass-card p-3 shadow-card">
            <p className="text-[10px] font-bold text-charcoal-muted uppercase tracking-wider mb-2 flex items-center gap-1">
              <Layers className="w-3 h-3" /> Pin Legend
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-signal shadow-sm" />
                <span className="text-xs text-charcoal font-medium">Good Yield</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-flare shadow-sm" />
                <span className="text-xs text-charcoal font-medium">Compressor / Idle Issue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-crimson shadow-sm relative">
                  <div className="absolute inset-0 rounded-full border border-crimson animate-ping opacity-50" />
                </div>
                <span className="text-xs text-charcoal font-medium">Critical Yield Loss</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map attribution */}
        <div className="absolute bottom-3 right-3 z-30 text-[10px] text-charcoal-muted/60 pointer-events-none">
          Kolhapur, Maharashtra · 16.69°N 74.24°E
        </div>
      </div>

      {/* === PORTAL TOOLTIP — rendered at document body, never clipped === */}
      {activeFoundry && mapRect && createPortal(
        (() => {
          const { x, y } = project(activeFoundry.lat, activeFoundry.lng);
          const popupW = 288;
          const popupH = 230;
          const pinScreenX = mapRect.left + (x / 100) * mapRect.width;
          const pinScreenY = mapRect.top + (y / 100) * mapRect.height;

          const spaceAbove = pinScreenY - popupH - 22;
          const placeBelow = spaceAbove < 8;
          const offsetY = placeBelow ? 22 : -22;

          let left = pinScreenX - popupW / 2;
          if (left < 8) left = 8;
          if (left + popupW > window.innerWidth - 8) left = window.innerWidth - popupW - 8;

          const triangleLeft = pinScreenX - left;

          return (
            <div
              className="fixed z-[9999] pointer-events-none"
              style={{
                left: `${left}px`,
                top: `${placeBelow ? pinScreenY + offsetY : pinScreenY + offsetY - popupH}px`,
                width: `${popupW}px`,
                opacity: 1,
                transition: 'opacity 180ms ease',
              }}
            >
              {/* Pointer triangle */}
              <div
                className="flex justify-center"
                style={{
                  transform: placeBelow ? 'none' : 'translateY(100%)',
                  marginBottom: placeBelow ? '-6px' : '0',
                  marginTop: placeBelow ? '0' : '-6px',
                }}
              >
                <div
                  className="w-3 h-3 rotate-45 bg-white/80"
                  style={{
                    border: placeBelow
                      ? '1px solid rgba(218,208,198,0.6)'
                      : '1px solid rgba(218,208,198,0.6)',
                    borderLeft: 'none',
                    borderBottom: placeBelow ? 'none' : '1px solid rgba(218,208,198,0.6)',
                    borderTop: placeBelow ? '1px solid rgba(218,208,198,0.6)' : 'none',
                    borderRight: placeBelow ? '1px solid rgba(218,208,198,0.6)' : 'none',
                    marginLeft: `${triangleLeft - 6}px`,
                  }}
                />
              </div>
              <div
                className="glass-card p-4 shadow-glass-hover"
                style={{ width: `${popupW}px` }}
              >
                <div className="flex items-start gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg ${statusBg[activeFoundry.status]} flex items-center justify-center shrink-0`}>
                    <Factory className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-charcoal text-sm">{activeFoundry.name}</p>
                    <p className="text-xs text-charcoal-muted truncate">{activeFoundry.issue}</p>
                  </div>
                  {selected?.id === activeFoundry.id && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelected(null); }}
                      className="pointer-events-auto text-charcoal-muted hover:text-charcoal transition-colors shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="glass-panel p-2.5">
                    <div className="flex items-center gap-1 text-xs text-charcoal-muted mb-0.5">
                      <Zap className="w-3 h-3" /> Total kWh
                    </div>
                    <p className="text-sm font-bold text-charcoal">{activeFoundry.totalKWh.toLocaleString()}</p>
                  </div>
                  <div className="glass-panel p-2.5">
                    <div className="flex items-center gap-1 text-xs text-charcoal-muted mb-0.5">
                      <Gauge className="w-3 h-3" /> Tonnes Melted
                    </div>
                    <p className="text-sm font-bold text-charcoal">{activeFoundry.tonnesMelted} t</p>
                  </div>
                  <div className="glass-panel p-2.5">
                    <div className="flex items-center gap-1 text-xs text-charcoal-muted mb-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Yield
                    </div>
                    <p className={`text-sm font-bold ${activeFoundry.yieldPct < 75 ? 'text-crimson' : activeFoundry.yieldPct < 80 ? 'text-cadmium' : 'text-signal'}`}>
                      {activeFoundry.yieldPct}%
                    </p>
                  </div>
                  <div className="glass-panel p-2.5">
                    <div className="flex items-center gap-1 text-xs text-charcoal-muted mb-0.5">
                      <TrendingDown className="w-3 h-3" /> kWh/Good Tonne
                    </div>
                    <p className={`text-sm font-bold ${activeFoundry.energyPerGoodTonne > 1050 ? 'text-crimson' : activeFoundry.energyPerGoodTonne > 1000 ? 'text-cadmium' : 'text-signal'}`}>
                      {activeFoundry.energyPerGoodTonne}
                    </p>
                  </div>
                </div>

                {activeFoundry.status === 'critical' && (
                  <div className="mt-3 flex items-center gap-1.5 bg-crimson/10 rounded-lg px-3 py-2 text-xs text-crimson font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" /> High rejection rate — priority action recommended
                  </div>
                )}
              </div>
            </div>
          );
        })(),
        document.body
      )}
    </div>
  );
}
