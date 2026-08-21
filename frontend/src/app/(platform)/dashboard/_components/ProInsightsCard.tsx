export default function ProInsightsCard() {
  return (
    <div className="bg-card-surface rounded-3xl border border-card-border p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[24px]">radar</span>
        </div>
        <h2 className="text-headline-md text-on-surface">Market Radar</h2>
      </div>
      
      {/* Blurred Content */}
      <div className="flex-1 flex flex-col justify-center gap-4 filter blur-[6px] opacity-60 pointer-events-none select-none transition-all duration-300">
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-card-border flex items-start gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 w-1 h-full bg-secondary"></div>
          <span className="material-symbols-outlined text-secondary mt-0.5">trending_up</span>
          <div>
            <h4 className="text-sm font-bold text-on-surface">Fintech Demand Surge</h4>
            <p className="text-sm text-text-muted mt-1 leading-relaxed">
              2 of your ideas are in Fintech. Market analysis shows a 12% growth in B2B financial APIs this quarter.
            </p>
          </div>
        </div>
        
        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 flex items-start gap-4 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 w-1 h-full bg-amber-500"></div>
          <span className="material-symbols-outlined text-amber-500 mt-0.5">warning</span>
          <div>
            <h4 className="text-sm font-bold text-on-surface">High Competition Warning</h4>
            <p className="text-sm text-text-muted mt-1 leading-relaxed">
              "Uber for Pets" faces extreme saturation. Consider pivoting to a B2B SaaS model for pet clinics to stand out.
            </p>
          </div>
        </div>
      </div>
      
      {/* Premium Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[2px] p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-lg border border-primary/10">
          <span className="material-symbols-outlined text-primary text-[32px]">lock</span>
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-2">Pro Insights</h3>
        <p className="text-sm text-on-surface/80 max-w-sm leading-relaxed mb-6 font-medium">
          Unlock Premium to cross-reference your ideas with real-time reports from Google Trends and Crunchbase.
        </p>
        <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-yellow-950 font-extrabold transition-all duration-300 shadow-lg hover:shadow-[0_4px_15px_rgba(245,158,11,0.4)] flex items-center gap-2 cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
          Unlock Premium
        </button>
      </div>
    </div>
  );
}
