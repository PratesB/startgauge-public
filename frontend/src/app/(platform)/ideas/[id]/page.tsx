"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchAPI } from "@/lib/api";

interface Idea {
  id: string;
  title: string;
  description: string;
  country: string;
  team_background: string | null;
  created_at: string;
  updated_at?: string;
}

const getFlagUrl = (countryName: string) => {
  const map: Record<string, string> = {
    'Finland': 'fi',
    'Brazil': 'br',
    'United States': 'us',
    'UK': 'gb',
    'Germany': 'de'
  };
  const code = map[countryName] || 'fi';
  return `https://flagcdn.com/${code}.svg`;
};

export default function IdeaDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [canvases, setCanvases] = useState<any[]>([]);
  const isCanvasGenerated = canvases.length > 0;
  const [isGeneratingCanvas, setIsGeneratingCanvas] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

  useEffect(() => {
    async function loadIdea() {
      try {
        const data = await fetchAPI(`/api/v1/ideas/${id}`);
        setIdea(data);

        try {
          const historyData = await fetchAPI(`/api/v1/canvas/${id}/history`);
          setCanvases(historyData || []);
        } catch (e) {
          // If 404 or error, canvas doesn't exist yet
          setCanvases([]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load idea");
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadIdea();
    }
  }, [id]);

  const handleGenerateCanvas = async () => {
    setIsGeneratingCanvas(true);
    try {
      const newCanvas = await fetchAPI(`/api/v1/ai/generate-canvas/${id}`, {
        method: "POST"
      });
      setCanvases(prev => [newCanvas, ...prev]);
    } catch (err) {
      console.error("Failed to generate canvas:", err);
    } finally {
      setIsGeneratingCanvas(false);
    }
  };

  const handleGenerateFeedbackForVersion = async (canvasId: string) => {
    setIsGeneratingFeedback(true);
    try {
      const newFeedback = await fetchAPI(`/api/v1/ai/generate-feedback/${canvasId}`, {
        method: "POST"
      });
      setCanvases(prev => prev.map(c => c.id === canvasId ? { ...c, feedback: newFeedback } : c));
    } catch (err) {
      console.error("Failed to generate feedback:", err);
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-text-muted font-medium animate-pulse">Loading Idea Context...</p>
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
        <span className="material-symbols-outlined text-[64px] text-error-red/80 mb-6">error_outline</span>
        <h2 className="text-2xl font-bold text-on-surface mb-2">Idea Not Found</h2>
        <p className="text-text-muted mb-8">{error || "We couldn't find the idea you're looking for. It may have been deleted or doesn't exist."}</p>
        <Link href="/ideas" className="px-6 py-3 bg-surface-container rounded-xl text-primary font-bold hover:bg-surface-variant transition-colors">
          Back to Ideas
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-20 relative px-4 sm:px-6 lg:px-8">

      {/* Page Background Effects (Mesh Gradients) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute top-[30%] left-0 w-[500px] h-[500px] bg-accent-yellow/10 blur-[90px] rounded-full -translate-x-1/3"></div>
        {/* Subtle dot pattern background */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      </div>

      {/* Main Page Flow */}
      <div className="relative z-10 flex flex-col pt-8">

        {/* Header Title */}
        <div className="border-b border-card-border/60 pb-6 mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tight leading-[1.2]">
            {idea.title}
          </h1>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Main Content (Left Column - 8/12) */}
          <div className="lg:col-span-8 flex flex-col space-y-10">

            {/* The Concept Section */}
            <div className="relative pl-5 border-l-[3px] border-amber-500/50">
              <h2 className="text-xs font-bold text-on-surface flex items-center gap-2 mb-3 uppercase tracking-widest opacity-90">
                <div className="w-6 h-6 rounded-md bg-amber-500/15 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-500 text-[14px]">lightbulb</span>
                </div>
                The Concept
              </h2>
              <p className="text-text-muted text-[15px] leading-relaxed whitespace-pre-wrap">
                {idea.description}
              </p>
            </div>

            {/* Team Expertise Section */}
            <div className="relative pl-5 border-l-[3px] border-emerald-500/50">
              <h2 className="text-xs font-bold text-on-surface flex items-center gap-2 mb-3 uppercase tracking-widest opacity-90">
                <div className="w-6 h-6 rounded-md bg-emerald-500/15 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-500 text-[14px]">engineering</span>
                </div>
                Team Background
              </h2>
              {idea.team_background ? (
                <div className="bg-gradient-to-br from-white to-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
                  <p className="relative z-10 text-text-muted text-[15px] leading-relaxed whitespace-pre-wrap">
                    {idea.team_background}
                  </p>
                </div>
              ) : (
                <div className="bg-surface-variant/30 border border-card-border/50 border-dashed rounded-2xl p-5 flex items-center gap-3">
                  <span className="material-symbols-outlined text-text-muted/40 text-[20px]">group_off</span>
                  <p className="text-text-muted/60 text-sm font-medium">No team background provided.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (Right Column - 4/12) */}
          <div className="lg:col-span-4">
            <div className="bg-gradient-to-b from-white to-primary/5 border border-primary/10 rounded-2xl p-5 shadow-[0_4px_20px_rgba(109,59,215,0.05)] space-y-4 sticky top-24">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-widest border-b border-card-border/60 pb-3 mb-4">Properties</h3>

              {/* Target Market */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text-muted">Market</span>
                <div className="flex items-center gap-2 bg-surface-variant/40 px-2.5 py-1.5 rounded-md border border-card-border/50" title={`Target Market: ${idea.country}`}>
                  <img src={getFlagUrl(idea.country)} alt={idea.country} className="w-3.5 h-auto rounded-[2px] shadow-[0_1px_2px_rgba(0,0,0,0.1)]" />
                  <span className="text-xs font-bold text-on-surface tracking-wide">{idea.country}</span>
                </div>
              </div>

              {/* Created At */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-medium text-text-muted">Created</span>
                <div className="flex items-center gap-1.5 text-on-surface">
                  <span className="material-symbols-outlined text-[14px] text-text-muted">calendar_today</span>
                  <span className="text-xs font-semibold">
                    {new Date(idea.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Updated At */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-medium text-text-muted">Last Update</span>
                <div className="flex items-center gap-1.5 text-on-surface">
                  <span className="material-symbols-outlined text-[14px] text-text-muted">update</span>
                  <span className="text-xs font-semibold">
                    {new Date(idea.updated_at || idea.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>


      {!isCanvasGenerated ? (
        <div className="mt-16 bg-card-surface border border-card-border rounded-3xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(109,59,215,0.08)] transition-all duration-500 flex flex-col items-center justify-center min-h-[300px] text-center max-w-4xl mx-auto">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <img src="/icons/icon_canvas_3d.jpg" alt="" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-b from-card-surface/10 via-card-surface/60 to-card-surface"></div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors z-0"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="text-2xl font-black text-on-surface mb-3 tracking-tight">
              Business Model Canvas
            </h2>
            <p className="text-text-muted text-sm mb-8 leading-relaxed max-w-sm">
              Generate a full 9-block Lean Canvas using our intelligent system to validate your core business hypotheses, customer segments, and unfair advantages.
            </p>
          </div>

          <div className="relative z-10 flex justify-center w-full">
            <button
              onClick={handleGenerateCanvas}
              disabled={isGeneratingCanvas}
              className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm
                ${isGeneratingCanvas
                  ? 'bg-primary/15 text-primary cursor-not-allowed shadow-none border border-primary/20'
                  : 'bg-gradient-to-r from-primary to-[#8247E5] text-white shadow-[0_4px_15px_rgba(109,59,215,0.3)] hover:shadow-[0_8px_25px_rgba(109,59,215,0.5)] hover:-translate-y-0.5 cursor-pointer'
                }`}
            >
              {isGeneratingCanvas ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
                  Generating...
                </>
              ) : (
                <>
                  Generate Business Model Canvas
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-16">
          <h2 className="text-xl font-extrabold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">history</span>
            Canvas History
          </h2>
          <div className="flex flex-col gap-4">
            {canvases.map((canvasItem) => (
              <div 
                key={canvasItem.id} 
                className="group relative bg-white border border-slate-200 hover:border-primary/40 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-5 overflow-hidden"
              >
                {/* Background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                {/* Left side: Version & Date */}
                <div className="flex items-center gap-5 relative z-10">
                  {/* Version Badge */}
                  <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-inner group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-0.5">Ver</span>
                      <span className="text-xl font-black text-slate-700 leading-none group-hover:text-primary transition-colors">{canvasItem.version}</span>
                    </div>
                  </div>
                  
                  {/* Date info */}
                  <div>
                    <h3 className="text-base font-bold text-slate-800 mb-1">Business Model Canvas</h3>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                      <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                      {new Date(canvasItem.created_at).toLocaleDateString(undefined, { 
                        year: 'numeric', month: 'short', day: 'numeric', 
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>

                {/* Right side: Actions */}
                <div className="flex items-center gap-2 relative z-10 w-full sm:w-auto">
                  {canvasItem.feedback ? (
                    <a
                      href={`/ideas/${id}/canvas/feedback?version=${canvasItem.version}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors border border-emerald-200/50 shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      View Feedback
                    </a>
                  ) : (
                    <button
                      onClick={() => handleGenerateFeedbackForVersion(canvasItem.id)}
                      disabled={isGeneratingFeedback}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition-colors border border-orange-200/50 shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      {isGeneratingFeedback ? (
                        <span className="material-symbols-outlined animate-spin text-[14px]">refresh</span>
                      ) : (
                        <span className="material-symbols-outlined text-[14px]">magic_button</span>
                      )}
                      Generate Feedback
                    </button>
                  )}
                  
                  <a
                    href={`/ideas/${id}/canvas?version=${canvasItem.version}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    Open Canvas
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
