"use client";

interface CanvasHistoryProps {
  ideaId: string;
  canvases: any[];
  isGeneratingCanvas: boolean;
  isGeneratingFeedback: boolean;
  handleGenerateCanvas: () => void;
  handleGenerateFeedbackForVersion: (canvasId: string) => void;
}

export function CanvasHistory({
  ideaId,
  canvases,
  isGeneratingCanvas,
  isGeneratingFeedback,
  handleGenerateCanvas,
  handleGenerateFeedbackForVersion
}: CanvasHistoryProps) {
  const isCanvasGenerated = canvases.length > 0;

  return (
    <div className="flex flex-col mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[20px] font-bold text-slate-900">
          Canvas History
        </h2>
        {isCanvasGenerated && (
          <button
            onClick={handleGenerateCanvas}
            disabled={isGeneratingCanvas}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 text-amber-950 text-[13px] font-bold hover:bg-amber-500 hover:shadow-lg hover:shadow-amber-400/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              {isGeneratingCanvas ? 'sync' : 'add'}
            </span>
            {isGeneratingCanvas ? 'Generating...' : 'New Version'}
          </button>
        )}
      </div>

      {!isCanvasGenerated ? (
        <div className="w-full bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/50 rounded-[32px] p-10 sm:p-12 border border-indigo-100/50 flex flex-col items-center text-center relative overflow-hidden shadow-sm group">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-100/40 blur-3xl transition-transform duration-700 group-hover:scale-110"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-violet-100/40 blur-3xl transition-transform duration-700 group-hover:scale-110"></div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">
            No Business Model Canvas Generated Yet
          </h3>
          
          <p className="text-slate-500 text-[14px] leading-relaxed max-w-md mb-8 relative z-10">
            Take the next step! Let our system analyze the details of your idea to build a professional Business Model Canvas.
          </p>
          
          <button
            onClick={handleGenerateCanvas}
            disabled={isGeneratingCanvas}
            className={`relative z-10 flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-[14px] transition-all duration-300 cursor-pointer ${
              isGeneratingCanvas 
                ? 'bg-slate-100 text-slate-400 shadow-none' 
                : 'bg-primary text-white hover:bg-primary/90 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30 animate-pulse'
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              {isGeneratingCanvas ? 'sync' : 'auto_awesome'}
            </span>
            {isGeneratingCanvas ? 'Generating Canvas...' : 'Generate Business Model Canvas'}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {canvases.map((canvasItem) => (
            <div 
              key={canvasItem.id} 
              className="group relative overflow-hidden border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/40 rounded-[24px] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-100 group-hover:bg-primary transition-colors duration-500"></div>

              <a 
                href={`/ideas/${ideaId}/canvas?version=${canvasItem.version}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 relative z-10 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <div className="flex flex-col items-center justify-center">
                    <span className="block text-[9px] font-bold text-slate-400 group-hover:text-primary/60 transition-colors duration-300 uppercase tracking-widest -mb-1">Version</span>
                    <span className="block text-[20px] font-black text-slate-800 group-hover:text-primary transition-colors duration-300 tracking-tighter leading-none">{canvasItem.version}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-900 group-hover:text-primary transition-colors duration-300 flex items-center gap-2">
                    Business Model Canvas
                    {canvasItem.feedback && (
                       <span className="flex items-center justify-center w-2 h-2 rounded-full bg-emerald-400 shadow-sm" title="Feedback available"></span>
                    )}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 mt-1.5">
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>event</span>
                    {new Date(canvasItem.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-2 relative z-10 w-full sm:w-auto">
                {canvasItem.feedback ? (
                  <a
                    href={`/ideas/${ideaId}/canvas/feedback?version=${canvasItem.version}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none text-center px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 text-[12px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>reviews</span>
                    View Feedback
                  </a>
                ) : (
                  <button
                    onClick={() => handleGenerateFeedbackForVersion(canvasItem.id)}
                    disabled={isGeneratingFeedback}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg border text-[12px] font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 cursor-pointer ${
                      isGeneratingFeedback 
                        ? 'bg-slate-50 border-slate-200 text-slate-600'
                        : 'bg-teal-100 border-teal-300 text-teal-800 hover:bg-teal-200 animate-pulse shadow-sm shadow-teal-200'
                    }`}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>{isGeneratingFeedback ? 'sync' : 'auto_awesome'}</span>
                    {isGeneratingFeedback ? 'Analyzing...' : 'Get Feedback'}
                  </button>
                )}
                <a
                  href={`/ideas/${ideaId}/canvas?version=${canvasItem.version}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none text-center px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 text-[12px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Open Canvas
                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>arrow_outward</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
