export default function MetricsGrid({ stats, loading }: { stats: { ideas: number; canvases: number; feedbacks: number }, loading: boolean }) {
  return (
    <div className="flex flex-col gap-16">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      
        {/* Card 1: Total Ideas */}
        <div className="group relative bg-card-surface rounded-2xl p-4 border border-card-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between h-[160px]">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img src="/icons/icon_ideas.jpg" alt="" className="w-full h-full object-cover opacity-20 mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-label-sm text-text-muted font-medium">Overview</p>
              <p className="text-body-md text-on-surface font-semibold">Total Ideas</p>
            </div>
          </div>
          <div className="relative z-10 mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-[40px] font-headline-display text-on-surface leading-none">
                {loading ? "-" : stats.ideas}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-primary">
              <span className="text-label-sm font-medium">Recorded</span>
            </div>
          </div>
        </div>

        {/* Card 2: Canvas */}
        <div className="group relative bg-card-surface rounded-2xl p-4 border border-card-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between h-[160px]">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img src="/icons/icon_canvas_3d.jpg" alt="" className="w-full h-full object-cover opacity-20 mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-label-sm text-text-muted font-medium">Output</p>
              <p className="text-body-md text-on-surface font-semibold">Validation Canvas</p>
            </div>
          </div>
          <div className="relative z-10 mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-[40px] font-headline-display text-on-surface leading-none">
                {loading ? "-" : stats.canvases}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-secondary">
              <span className="text-label-sm font-medium">Generated</span>
            </div>
          </div>
        </div>

        {/* Card 3: Feedback */}
        <div className="group relative bg-card-surface rounded-2xl p-4 border border-card-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between h-[160px]">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img src="/icons/icon_feedbacks_3d.jpg" alt="" className="w-full h-full object-cover opacity-20 mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-label-sm text-text-muted font-medium">Output</p>
              <p className="text-body-md text-on-surface font-semibold">Feedbacks Analysis</p>
            </div>
          </div>
          <div className="relative z-10 mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-[40px] font-headline-display text-on-surface leading-none">
                {loading ? "-" : stats.feedbacks}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[#b08111]">
              <span className="text-label-sm font-medium">Received</span>
            </div>
          </div>
        </div>

        {/* Card 4: Target Markets */}
        <div className="group relative bg-card-surface rounded-2xl p-4 border border-card-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between h-[160px]">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img src="/icons/icon_reach.jpg" alt="" className="w-full h-full object-cover opacity-20 mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-label-sm text-text-muted font-medium">Reach</p>
              <p className="text-body-md text-on-surface font-semibold">Target Markets</p>
            </div>
          </div>
          <div className="relative z-10 mt-1">
            <div className="flex items-center">
              <div className="relative z-30 flex flex-col items-center group/flag" title="Finland (Active)">
                <img src="https://flagcdn.com/fi.svg" alt="Finland" className="w-10 h-10 rounded-full object-cover shadow-sm transition-transform hover:scale-110 cursor-help border-2 border-white bg-white" />
              </div>
              <div className="relative z-20 -ml-3 group flex items-center justify-center cursor-help" title="Premium Feature">
                <img src="https://flagcdn.com/br.svg" alt="Brazil" className="w-9 h-9 rounded-full object-cover shadow-sm border-2 border-white opacity-40 grayscale" />
                <span className="absolute material-symbols-outlined text-[16px] text-text-muted">lock</span>
              </div>
              <div className="relative z-10 -ml-3 group flex items-center justify-center cursor-help" title="Premium Feature">
                <img src="https://flagcdn.com/us.svg" alt="United States" className="w-9 h-9 rounded-full object-cover shadow-sm border-2 border-white opacity-40 grayscale" />
                <span className="absolute material-symbols-outlined text-[16px] text-text-muted">lock</span>
              </div>
              <div className="relative z-0 -ml-3 group flex items-center justify-center cursor-help" title="Premium Feature">
                <img src="https://flagcdn.com/pt.svg" alt="Portugal" className="w-9 h-9 rounded-full object-cover shadow-sm border-2 border-white opacity-40 grayscale" />
                <span className="absolute material-symbols-outlined text-[16px] text-text-muted">lock</span>
              </div>
            </div>
            <div className="mt-2 text-blue-600 truncate whitespace-nowrap">
              <span className="text-label-sm font-medium">1 Active <span className="text-text-muted font-normal text-[10px] ml-1">(Unlock More)</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Upsell Banner */}
      <div className="group relative w-full flex-1 bg-gradient-to-r from-gray-900 via-[#1a0b38] to-[#2d1163] rounded-2xl border border-white/10 overflow-hidden shadow-lg flex flex-col justify-center p-6 sm:p-8">
        
        {/* 3D Background Image */}
        <div className="absolute right-0 top-0 bottom-0 w-2/3 sm:w-1/2 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a0b38] via-transparent to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#2d1163]/50 to-transparent z-10"></div>
          <img src="/icons/icon_reach.jpg" alt="" className="w-full h-full object-cover opacity-30 mix-blend-luminosity transform scale-125 group-hover:scale-110 transition-transform duration-1000" />
        </div>
        
        <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
          <div className="flex flex-col max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[#F3BA2F] text-[18px]">workspace_premium</span>
              <span className="text-[#F3BA2F] font-bold tracking-widest uppercase text-[11px]">StartGauge Pro</span>
            </div>
            <h4 className="text-2xl sm:text-[28px] font-headline-display text-white mb-2 leading-tight">
              Unlock Global Markets
            </h4>
            <p className="text-white/70 text-sm leading-relaxed">
              Run deep market analysis in USA, Brazil, Japan and more. Get unlimited validations and pinpoint your perfect audience.
            </p>
          </div>
          
          <button className="shrink-0 bg-white hover:bg-gray-50 text-gray-900 text-sm font-bold px-8 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] flex items-center gap-2 hover:-translate-y-1 duration-300">
            Upgrade Now
            <span className="material-symbols-outlined text-[18px] transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
