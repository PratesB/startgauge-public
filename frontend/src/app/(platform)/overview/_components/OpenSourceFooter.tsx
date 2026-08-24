export default function OpenSourceFooter() {
  return (
    <div className="bg-slate-50/50 rounded-2xl p-8 md:p-10 border border-slate-100 flex flex-col md:flex-row gap-10 items-center mt-12">
      <div className="flex-1">
        <h4 className="text-[16px] font-medium text-slate-900 mb-3">Open Source Demo Project</h4>
        <p className="text-[14px] text-slate-600 leading-relaxed text-justify">
          This entire demo environment is open-source. You can clone the repository directly from <a href="https://github.com/PratesB/startgauge-public" target="_blank" rel="noopener noreferrer" className="text-slate-900 font-medium hover:text-primary transition-colors underline underline-offset-4">GitHub</a> to testing, explore the code, and evaluate the architecture.
        </p>
      </div>
      <div className="w-full md:w-auto bg-white border border-slate-200 rounded-xl p-5 shadow-sm font-mono text-[13px] text-slate-600 shrink-0">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
        </div>
        <div className="flex gap-2"><span className="text-slate-400">$</span> <span className="text-slate-800">git clone https://github.com/PratesB/startgauge-public.git</span></div>
        <div className="flex gap-2 mt-1"><span className="text-slate-400">$</span> <span className="text-slate-800">cd startgauge-public</span></div>
        <div className="flex gap-2 mt-1"><span className="text-slate-400">$</span> <span className="text-slate-800">docker-compose up -d</span></div>
      </div>
    </div>
  );
}
