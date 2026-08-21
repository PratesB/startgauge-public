export default function SkillGapsCard() {
  return (
    <div className="bg-card-surface rounded-3xl border border-card-border p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#8247E5]/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#8247E5] text-[24px]">school</span>
          </div>
          <h2 className="text-headline-md text-on-surface">Skill Gap Recommendations</h2>
        </div>
        <span className="text-[10px] font-bold px-3 py-1 bg-surface-container rounded-full text-text-muted uppercase tracking-wider">For You</span>
      </div>
      
      {/* Blurred Content */}
      <div className="filter blur-[6px] opacity-60 pointer-events-none select-none transition-all duration-300">
        <p className="text-sm text-on-surface/70 mb-6 font-medium">
          We noticed you are building AI solutions but lack technical AI background. Here are curated resources to bridge the gap:
        </p>

        <div className="flex flex-col gap-4">
          <div className="group flex items-center gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-card-border shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-[#8247E5]/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[#8247E5] text-[24px]">code_blocks</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-on-surface">AI Fundamentals for Founders</h4>
              <p className="text-xs text-text-muted mt-1 font-medium">Coursera • 4 Weeks • Beginner</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </div>
          </div>

          <div className="group flex items-center gap-4 p-4 rounded-2xl bg-surface-container-lowest border border-card-border shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-blue-600 text-[24px]">account_balance</span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-on-surface">Fintech Regulatory Compliance</h4>
              <p className="text-xs text-text-muted mt-1 font-medium">Udemy • 12 Hours • Intermediate</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Premium Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[2px] p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-lg border border-primary/10">
          <span className="material-symbols-outlined text-primary text-[32px]">lock</span>
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-2">Curated Skill Gaps</h3>
        <p className="text-sm text-on-surface/80 max-w-sm leading-relaxed mb-6 font-medium">
          Unlock Premium to receive personalized courses and partner recommendations based on your technical shortcomings.
        </p>
        <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-yellow-950 font-extrabold transition-all duration-300 shadow-lg hover:shadow-[0_4px_15px_rgba(245,158,11,0.4)] flex items-center gap-2 cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
          Unlock Premium
        </button>
      </div>
    </div>
  );
}
