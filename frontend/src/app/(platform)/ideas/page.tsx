"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAPI } from "@/lib/api";
import IdeasTable from "./_components/IdeasTable";
import IdeaMetrics from "./_components/IdeaMetrics";

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadIdeas() {
      try {
        const data = await fetchAPI("/api/v1/ideas/");
        setIdeas(data);
      } catch (err) {
        console.error("Failed to fetch ideas", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadIdeas();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-text-muted font-medium animate-pulse">Loading your ideas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
        <span className="material-symbols-outlined text-[48px] text-error-red mb-4">error</span>
        <h2 className="text-xl font-bold text-on-surface mb-2">Failed to load ideas</h2>
        <p className="text-text-muted">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto pb-16 animate-fade-in font-sans">
      {/* Header */}
      <div className="pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-light text-slate-900 tracking-tight leading-tight">
            My Ideas
          </h1>
        </div>
        <Link 
          href="/ideas/new"
          className="group relative overflow-hidden inline-flex items-center justify-center px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[13px] font-medium rounded-full transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 mb-1"
        >
          <span className="absolute top-0 -left-[100%] w-[120%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-[100%] transition-all duration-700 ease-in-out" />
          <span className="relative z-10 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">add</span>
            New Idea
          </span>
        </Link>
      </div>

      {/* Content */}
      {ideas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-slate-200 rounded-2xl bg-white relative overflow-hidden">
          <div className="w-16 h-16 mb-5 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100">
            <span className="material-symbols-outlined text-[32px] text-slate-300">lightbulb</span>
          </div>
          <h3 className="text-[18px] font-medium text-slate-900 mb-2">No ideas yet</h3>
          <p className="text-[14px] text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
            Every great startup starts with a single idea. Create your first idea and let our AI validate your market, build your canvas, and find your gaps.
          </p>
          <Link 
            href="/ideas/new"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 text-[14px] font-medium shadow-sm hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create First Idea
          </Link>
        </div>
      ) : (
        <>
          <IdeaMetrics ideas={ideas} />
          <IdeasTable ideas={ideas} />
        </>
      )}
    </div>
  );
}
