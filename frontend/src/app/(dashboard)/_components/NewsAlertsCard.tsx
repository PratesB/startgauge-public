export default function NewsAlertsCard() {
  return (
    <div className="bg-card-surface rounded-3xl border border-card-border p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col relative overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-secondary text-[24px]">newspaper</span>
        </div>
        <h2 className="text-headline-md text-on-surface">News & Regulatory Alerts</h2>
      </div>
      
      {/* Blurred Content */}
      <div className="flex flex-col gap-5 filter blur-[6px] opacity-60 pointer-events-none select-none transition-all duration-300">
        {/* Legislation Alert */}
        <div className="p-5 rounded-2xl bg-error-red/5 border border-error-red/20 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-error-red"></div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-error-red/10 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="material-symbols-outlined text-error-red text-[20px]">gavel</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-bold text-error-red">Legislative Change (Brazil)</h4>
                <span className="text-[10px] font-bold px-2 py-1 bg-error-red text-white rounded-full uppercase tracking-wider shadow-sm">Critical</span>
              </div>
              <p className="text-sm text-on-surface font-bold mb-1.5">New Open Finance regulations taking effect</p>
              <p className="text-xs text-on-surface/70 leading-relaxed font-medium">
                The central bank has updated data-sharing protocols. This directly impacts your "EduTech Wallet" idea. You must ensure compliance by Q3 2026.
              </p>
            </div>
          </div>
        </div>

        {/* News Item */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-card-border shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="material-symbols-outlined text-primary text-[20px]">article</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-on-surface mb-1">Stripe acquires stablecoin startup</h4>
              <p className="text-xs text-on-surface/70 leading-relaxed mb-3 font-medium">
                Major movement in the Fintech space. Competitors in the crypto-payments niche might face massive consolidation.
              </p>
              <div className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-lg transition-colors">
                Read full article <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Premium Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[2px] p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-lg border border-primary/10">
          <span className="material-symbols-outlined text-primary text-[32px]">lock</span>
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-2">Real-time Regulatory Alerts</h3>
        <p className="text-sm text-on-surface/80 max-w-sm leading-relaxed mb-6 font-medium">
          Upgrade to Premium to get automated tracking of legislation and news that directly impact your active ideas.
        </p>
        <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-yellow-950 font-extrabold transition-all duration-300 shadow-lg hover:shadow-[0_4px_15px_rgba(245,158,11,0.4)] flex items-center gap-2 cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
          Unlock Premium
        </button>
      </div>
    </div>
  );
}
