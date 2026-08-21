"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAPI } from "@/lib/api";
import IdeasTable from "./_components/IdeasTable";

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
    <div className="flex flex-col w-full gap-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-display text-on-surface">My Ideas</h1>
          <p className="text-body-md text-text-muted mt-2">Manage and validate your ideas.</p>
        </div>
        <Link 
          href="/ideas/new"
          className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-[#8247E5] text-white font-bold shadow-[0_4px_15px_rgba(109,59,215,0.3)] hover:shadow-[0_8px_25px_rgba(109,59,215,0.5)] transition-all duration-300 hover:-translate-y-0.5"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Idea
        </Link>
      </div>

      {/* Content */}
      {ideas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-card-border/60 rounded-3xl bg-surface-container-lowest/30 relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 w-24 h-24 mb-6 opacity-50 mix-blend-luminosity">
            <img src="/icons/icon_ideas.jpg" alt="Empty Ideas" className="w-full h-full object-cover rounded-full shadow-inner" />
          </div>
          <h3 className="relative z-10 text-2xl font-bold text-on-surface mb-3">No ideas yet</h3>
          <p className="relative z-10 text-text-muted max-w-md mx-auto mb-10 leading-relaxed font-medium">
            Every great startup starts with a single idea. Create your first idea and let our AI validate your market, build your canvas, and find your gaps.
          </p>
          <Link 
            href="/ideas/new"
            className="relative z-10 group inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-[#1a1528] to-[#0f0a18] border border-primary/30 text-white font-bold shadow-[0_8px_25px_rgba(109,59,215,0.2)] hover:shadow-[0_8px_30px_rgba(109,59,215,0.5)] hover:border-primary/80 transition-all duration-500 hover:-translate-y-1"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:rotate-90 transition-transform duration-500">add</span>
            Create Your First Idea
          </Link>
        </div>
      ) : (
        <IdeasTable ideas={ideas} />
      )}
    </div>
  );
}
