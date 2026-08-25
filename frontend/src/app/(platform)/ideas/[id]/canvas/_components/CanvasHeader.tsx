"use client";

import { Canvas } from "../page";

interface CanvasHeaderProps {
  canvas: Canvas;
  user: any;
  isEditing: boolean;
  isSaving: boolean;
  setIsEditing: (val: boolean) => void;
  setEditedCanvas: (val: Partial<Canvas>) => void;
  handleSave: () => void;
}

export function CanvasHeader({
  canvas,
  user,
  isEditing,
  isSaving,
  setIsEditing,
  setEditedCanvas,
  handleSave
}: CanvasHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 shrink-0">
      <div>
        <h1 className="text-2xl font-extrabold text-on-surface flex items-center gap-3">
          Business Model Canvas
        </h1>
        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs font-medium text-slate-500">
          <span className="uppercase tracking-widest font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">Version {canvas.version}</span>
          <span>•</span>
          <span>Created by {user?.name || "User"}</span>
          <span>•</span>
          <span>{new Date(canvas.created_at).toLocaleString(undefined, { 
            year: 'numeric', month: 'short', day: 'numeric', 
            hour: '2-digit', minute: '2-digit'
          })}</span>
        </div>
      </div>

      {/* Print-only Watermark */}
      <div className="hidden print:flex flex-col items-end text-slate-400 opacity-90 text-[10px] font-semibold tracking-widest uppercase mt-2">
        <span>Generated using</span>
        <span className="text-primary font-black flex items-center gap-1 text-[13px] tracking-normal mt-0.5">
          StartGauge
        </span>
      </div>

      <div className="flex items-center gap-4 print:hidden">
        {isEditing ? (
          <>
            <button 
              onClick={() => {
                setIsEditing(false);
                setEditedCanvas(canvas);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-[12px] font-semibold transition-all shadow-sm cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 border border-emerald-500 text-white text-[12px] font-semibold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? (
                <span className="material-symbols-outlined animate-spin" style={{ fontSize: '14px' }}>refresh</span>
              ) : (
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>save</span>
              )}
              Save as new version
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 border border-blue-600 hover:bg-blue-700 text-white text-[12px] font-semibold transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-white" style={{ fontSize: '14px' }}>edit</span>
              Edit Canvas
            </button>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-800 hover:bg-slate-900 text-white text-[12px] font-semibold transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-white" style={{ fontSize: '14px' }}>print</span>
              Print / Save PDF
            </button>
          </>
        )}
      </div>
    </div>
  );
}
