export default function InvestorMatchesCard() {
  return (
    <div className="bg-card-surface rounded-3xl border border-card-border p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-blue-600 text-[24px]">handshake</span>
        </div>
        <h2 className="text-headline-md text-on-surface">Investor Matches</h2>
      </div>
      
      {/* Blurred Content */}
      <div className="space-y-4 filter blur-[6px] opacity-60 pointer-events-none select-none transition-all duration-300">
        <div className="flex items-center justify-between p-4 border border-card-border rounded-xl bg-surface-container-lowest">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20"></div>
            <div>
              <div className="w-32 h-4 bg-gray-300 rounded mb-2"></div>
              <div className="w-40 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="w-20 h-8 bg-gray-200 rounded-full"></div>
        </div>
        <div className="flex items-center justify-between p-4 border border-card-border rounded-xl bg-surface-container-lowest">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500/20"></div>
            <div>
              <div className="w-28 h-4 bg-gray-300 rounded mb-2"></div>
              <div className="w-36 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="w-20 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Premium Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 backdrop-blur-[2px] p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-lg border border-primary/10">
          <span className="material-symbols-outlined text-primary text-[32px]">lock</span>
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-2">Connect with Investors</h3>
        <p className="text-sm text-on-surface/80 max-w-sm leading-relaxed mb-6 font-medium">
          Upgrade to Premium to cross-reference your validated ideas with our active investor database.
        </p>
        <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-yellow-950 font-extrabold transition-all duration-300 shadow-lg hover:shadow-[0_4px_15px_rgba(245,158,11,0.4)] flex items-center gap-2 cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
          Unlock Premium
        </button>
      </div>
    </div>
  );
}
