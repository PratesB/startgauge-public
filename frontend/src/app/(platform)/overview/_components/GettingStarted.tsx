import Link from "next/link";

export default function GettingStarted() {
  return (
    <div>
      <p className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase mb-8 border-b border-slate-100 pb-4">Getting Started</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="border-t-2 border-slate-900 pt-6">
          <span className="text-[11px] font-bold text-slate-400 block mb-3 uppercase tracking-wider">Step 1</span>
          <h4 className="text-[16px] font-medium text-slate-900 mb-2">Submit Idea</h4>
          <p className="text-[14px] text-slate-500 leading-relaxed text-justify">Navigate to "New Idea" and provide your Idea Title, a Description of your idea, and your Team Background. The Target Market is pre-set to Finland for this demo.</p>
        </div>
        
        <div className="border-t-2 border-slate-200 pt-6">
          <span className="text-[11px] font-bold text-slate-400 block mb-3 uppercase tracking-wider">Step 2</span>
          <h4 className="text-[16px] font-medium text-slate-900 mb-2">Generate Canvas</h4>
          <p className="text-[14px] text-slate-500 leading-relaxed text-justify">On the Idea page, click to generate the Canvas. Our <strong className="text-slate-700 font-semibold">Research Agent</strong> first creates a contextual report, and then our <strong className="text-slate-700 font-semibold">Business Agent</strong> uses it to construct your Business Model Canvas. You can freely edit the generated blocks and view past versions.</p>
        </div>
        
        <div className="border-t-2 border-slate-200 pt-6">
          <span className="text-[11px] font-bold text-slate-400 block mb-3 uppercase tracking-wider">Step 3</span>
          <h4 className="text-[16px] font-medium text-slate-900 mb-2">Review Feedback</h4>
          <p className="text-[14px] text-slate-500 leading-relaxed text-justify">Once a canvas is created, the option to request feedback unlocks on the same page. You can request a new analysis for every canvas version you edit. Our <strong className="text-slate-700 font-semibold">Feedback Agent</strong> will analyze your canvas against your team's background to identify execution gaps, highlight founder strengths, and provide actionable recommendations.</p>
        </div>
      </div>
      
      <div className="mt-16 flex flex-col items-center justify-center border-t border-slate-100 pt-10">
        <Link 
          href="/ideas/new" 
          className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-slate-900 hover:bg-slate-800 text-white text-[15px] font-medium rounded-full transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5"
        >
          Start Testing the Platform
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
