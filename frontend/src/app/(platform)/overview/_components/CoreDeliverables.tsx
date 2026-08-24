export default function CoreDeliverables() {
  return (
    <div>
      <p className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-8 border-b border-slate-100 pb-4">Core Deliverables</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-12">
        {/* 01: Canvas */}
        <div className="relative z-10">
          <div className="absolute -top-10 -left-6 text-[140px] font-black text-slate-100 leading-none select-none -z-10 tracking-tighter">01</div>
          <h3 className="text-xl font-medium text-slate-900 mb-3 pt-6">Business Model Canvas</h3>
          <p className="text-[15px] text-slate-600 leading-relaxed mb-6 text-justify">
            A visual blueprint of your business model, mapping out your value proposition and financial viability. It distills complex ideas into actionable blocks, forcing teams to align on core value.
          </p>
          <ul className="space-y-3 text-[14px] text-slate-500">
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Interactive editing</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Version history</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Export to PDF</li>
          </ul>
        </div>

        {/* 02: Feedback */}
        <div className="relative z-10">
          <div className="absolute -top-10 -left-6 text-[140px] font-black text-slate-100 leading-none select-none -z-10 tracking-tighter">02</div>
          <h3 className="text-xl font-medium text-slate-900 mb-3 pt-6">Feedback Analysis</h3>
          <p className="text-[15px] text-slate-600 leading-relaxed mb-6 text-justify">
            An objective, data-backed evaluation generated directly from your Business Model Canvas to stress-test your hypotheses. It identifies highlight founder strengths, execution gaps and provides actionable recommendations before any capital is deployed.
          </p>
          <ul className="space-y-3 text-[14px] text-slate-500">
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Risk mitigation strategy</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Founder strengths mapping</li>
            <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div> Iterative executive reports</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
