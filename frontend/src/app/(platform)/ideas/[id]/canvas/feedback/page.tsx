"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { fetchAPI } from "@/lib/api";

export default function CanvasFeedbackPageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-serif text-slate-600">Retrieving document...</div>}>
      <CanvasFeedbackPage />
    </Suspense>
  );
}

function CanvasFeedbackPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const version = parseInt(searchParams.get("version") || "1", 10);

  const [canvas, setCanvas] = useState<any>(null);
  const [idea, setIdea] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [canvasData, ideaData, userData] = await Promise.all([
          fetchAPI(`/api/v1/canvas/${id}/history`),
          fetchAPI(`/api/v1/ideas/${id}`),
          fetchAPI('/api/v1/users/me')
        ]);
        
        setIdea(ideaData);
        setUser(userData);
        
        const found = canvasData.find((c: any) => c.version === version);
        if (found) {
          if (!found.feedback) {
            setError("Feedback has not been generated for this document version.");
          } else {
            setCanvas(found);
          }
        } else {
          setError("Document version not found.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load document data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id, version]);

  const formatText = (text: string | null | undefined) => {
    if (!text) return null;
    return text.split('\n').map((paragraph, index) => {
      if (!paragraph.trim()) return null;
      
      if (paragraph.includes('•')) {
        const items = paragraph.split('•').map(item => item.trim()).filter(Boolean);
        return (
          <ul key={index} className="list-disc pl-6 mb-4 space-y-3">
            {items.map((item, i) => {
              const parts = item.split(/(\*\*.*?\*\*)/g);
              return (
                <li key={i} className="leading-relaxed text-justify">
                  {parts.map((part, j) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={j} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
                    }
                    return part;
                  })}
                </li>
              );
            })}
          </ul>
        );
      }

      const parts = paragraph.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={index} className="mb-4 text-justify leading-relaxed">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#e2e4e8] flex items-center justify-center font-serif">
        <p className="text-slate-500 tracking-widest uppercase text-sm">Retrieving document...</p>
      </div>
    );
  }

  if (error || !canvas) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#e2e4e8] flex flex-col items-center justify-center text-center p-8 font-serif">
        <h2 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-widest">Document Unavailable</h2>
        <p className="text-slate-600 mb-8 max-w-md">{error}</p>
        <button onClick={() => window.close()} className="px-6 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors text-sm tracking-wider uppercase cursor-pointer">
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#e2e4e8] flex flex-col overflow-y-auto print:static print:overflow-hidden print:h-auto print:bg-white print:p-0 font-serif text-slate-800">
      
      {/* Top action bar (hidden during print) */}
      <div className="shrink-0 sticky top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-white border-b border-slate-200 shadow-sm print:hidden font-sans">
        <div className="text-sm font-semibold text-slate-700 tracking-wide">
          Document Preview
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Print / Download PDF
          </button>
          <button 
            onClick={() => window.close()}
            className="px-5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 print:min-h-0 print:h-auto">
        {/* Document Container (A4 Proportions) */}
        <div className="max-w-[800px] mx-auto bg-white min-h-[1131px] p-12 sm:p-24 shadow-lg my-8 print:shadow-none print:m-0 print:p-12 print:min-h-0 relative">
        
        {/* Document Header */}
        <header className="border-b border-slate-300 pb-8 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 uppercase tracking-widest mb-10 text-center">
            Feedback Analysis
          </h1>
          
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm">
            <div>
              <p className="text-slate-500 uppercase tracking-wider text-[10px] font-bold mb-1">Idea Name</p>
              <p className="font-semibold text-slate-900">{idea?.title || "Unknown Idea"}</p>
            </div>
            <div>
              <p className="text-slate-500 uppercase tracking-wider text-[10px] font-bold mb-1">Prepared For</p>
              <p className="font-semibold text-slate-900">{user?.name || "User"}</p>
            </div>
            <div>
              <p className="text-slate-500 uppercase tracking-wider text-[10px] font-bold mb-1">Date of Generation</p>
              <p className="font-semibold text-slate-900">
                {new Date(canvas.created_at).toLocaleString(undefined, { 
                  year: 'numeric', month: 'long', day: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <p className="text-slate-500 uppercase tracking-wider text-[10px] font-bold mb-1">Business Model Canvas Reference</p>
              <p className="font-semibold text-slate-900">Version {canvas.version}</p>
            </div>
          </div>
        </header>

        {/* Explanation Section */}
        <section className="mb-12">
          <div className="bg-slate-50 border border-slate-200 p-6">
            <p className="text-sm text-slate-700 leading-relaxed italic text-justify">
              This document provides an objective evaluation of the Business Model Canvas submitted for the aforementioned project. The analysis aims to identify core strengths in the founding team's approach, uncover potential gaps in execution or market fit, and prescribe actionable recommendations to mitigate risks and accelerate validation.
            </p>
          </div>
        </section>

        {/* Document Body */}
        <div className="space-y-10">
          
          <section>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">
              I. Founder Strengths
            </h2>
            <div className="text-sm text-slate-800">
              {formatText(canvas.feedback.founder_strengths)}
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">
              II. Execution Gaps
            </h2>
            <div className="text-sm text-slate-800">
              {formatText(canvas.feedback.execution_gaps)}
            </div>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-widest border-b border-slate-200 pb-2 mb-4">
              III. Recommended Actions
            </h2>
            <div className="text-sm text-slate-800">
              {formatText(canvas.feedback.recommended_actions)}
            </div>
          </section>

        </div>

        {/* Document Footer */}
        <footer className="mt-24 pt-8 border-t border-slate-300">
          <div className="flex justify-between items-end">
            <div className="text-xs text-slate-500">
              <p>Confidential and Proprietary.</p>
              <p>Do not distribute without explicit permission.</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Verified By</p>
              <p className="text-lg font-bold text-primary tracking-tight">StartGauge System</p>
            </div>
          </div>
        </footer>

      </div>
      </div>
    </div>
  );
}
