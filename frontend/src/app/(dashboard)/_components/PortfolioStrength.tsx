export default function PortfolioStrength() {
  return (
    <div className="group relative bg-gradient-to-br from-gray-900 via-[#1a0b38] to-[#2d1163] rounded-3xl p-6 border border-white/10 overflow-hidden shadow-2xl flex flex-col justify-between h-full min-h-[320px] transition-transform duration-500 hover:-translate-y-1">
      
      {/* 3D Background Image */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0b38]/80 via-[#2d1163]/60 to-[#12032e]/90 z-10"></div>
        <img src="/icons/icon_ideas.jpg" alt="" className="w-full h-full object-cover opacity-30 mix-blend-luminosity transform scale-125 group-hover:scale-110 transition-transform duration-1000" />
      </div>

      {/* Animated Background Orbs */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-fuchsia-500/20 blur-[40px] rounded-full pointer-events-none animate-pulse z-0" style={{ animationDuration: '4s' }}></div>
      <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-blue-500/15 blur-[50px] rounded-full pointer-events-none animate-pulse z-0" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
      
      {/* Glassmorphism inner shine */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"></div>

      <div className="relative z-20 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white/10 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/20">
              <span className="material-symbols-outlined text-white text-[14px]">speed</span>
            </div>
            <span className="font-headline-md text-[16px] text-white tracking-tight drop-shadow-sm">The Gauge</span>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white backdrop-blur-md border border-white/20 shadow-sm">Score</span>
        </div>
        
        {/* Blurred Content */}
        <div className="flex-1 flex flex-col relative">
          <div className="flex-1 flex flex-col filter blur-[8px] opacity-40 pointer-events-none select-none transition-all duration-300">
            <div className="flex flex-col mt-2 items-center relative">
              {/* Animated SVG Circular Gauge */}
              <div className="relative w-32 h-32 flex items-center justify-center filter drop-shadow-[0_0_15px_rgba(192,132,252,0.3)]">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                  <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="100, 100" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#gaugeGradient)" strokeWidth="3" strokeLinecap="round" style={{ strokeDasharray: '82, 100', transition: 'stroke-dasharray 2s cubic-bezier(0.4, 0, 0.2, 1)' }} />
                </svg>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[44px] font-headline-display text-white font-bold leading-none tracking-tighter drop-shadow-md">82</span>
                  <span className="text-[12px] font-medium text-white/50">/100</span>
                </div>
              </div>
              <h3 className="text-lg text-white font-bold mt-4 tracking-wide">Portfolio Strength</h3>
            </div>
            
            <div className="flex flex-col gap-4 mt-6">
              <p className="text-sm text-white/80 leading-relaxed text-center font-medium bg-white/5 p-3 rounded-xl backdrop-blur-md border border-white/10 shadow-inner">
                Your ideas show exceptional market fit, but need more technical validation.
              </p>
              <button className="w-full bg-white text-gray-900 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 opacity-80">
                View Breakdown
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 shadow-lg border border-white/20">
              <span className="material-symbols-outlined text-white text-[28px]">lock</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1 shadow-sm drop-shadow-md">Portfolio Score</h3>
            <p className="text-xs text-white/90 max-w-[200px] leading-relaxed mb-5 font-medium drop-shadow-md">
              Upgrade to measure the overall strength and market readiness of your ideas.
            </p>
            <button className="px-6 py-2.5 rounded-xl bg-white text-gray-900 hover:bg-gray-100 transition-colors font-bold shadow-[0_4px_14px_0_rgba(255,255,255,0.39)] flex items-center gap-2 cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
              Unlock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
