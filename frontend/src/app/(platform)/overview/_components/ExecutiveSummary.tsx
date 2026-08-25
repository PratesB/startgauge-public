export default function ExecutiveSummary() {
  return (
    <div className="prose prose-slate max-w-none">
      <p className="text-[18px] text-slate-600 leading-relaxed font-light text-justify">
        StartGauge was created to solve a critical problem for founders and product teams: bridging the gap between a creative vision and a rigorous execution plan. Traditional validation is often expensive and highly bureaucratic.
      </p>
      <p className="text-[18px] text-slate-600 leading-relaxed font-light mt-6 text-justify">
        Think of our platform as your strategic partner. While the full StartGauge suite generates 7 different business canvases, geoeconomic analyses, and legislative mapping, <strong>this specific demo environment</strong> focuses exclusively on two core deliverables: generating a comprehensive <strong>Business Model Canvas</strong> and its respective <strong>Feedback Analysis</strong>.
      </p>
      <div className="mt-8">
        <a 
          href="https://pratesdev.com/startgauge" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center text-[13px] font-semibold text-slate-900 hover:text-primary transition-colors border-b border-slate-900 hover:border-primary pb-0.5"
        >
          Visit public project &rarr;
        </a>
      </div>
    </div>
  );
}
