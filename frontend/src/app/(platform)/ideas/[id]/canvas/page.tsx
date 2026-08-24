"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { fetchAPI } from "@/lib/api";

interface Canvas {
  id: string;
  idea_id: string;
  version: number;
  created_at: string;
  customer_segments: string | null;
  value_propositions: string | null;
  channels: string | null;
  customer_relationships: string | null;
  revenue_streams: string | null;
  key_resources: string | null;
  key_activities: string | null;
  key_partnerships: string | null;
  cost_structure: string | null;
}

export default function CanvasPageWrapper() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading canvas...</div>}>
      <CanvasPage />
    </Suspense>
  );
}

function CanvasPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const version = parseInt(searchParams.get("version") || "1", 10);

  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedCanvas, setEditedCanvas] = useState<Partial<Canvas>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [canvasData, userData] = await Promise.all([
          fetchAPI(`/api/v1/canvas/${id}/history`),
          fetchAPI('/api/v1/users/me')
        ]);
        setUser(userData);
        const found = canvasData.find((c: Canvas) => c.version === version);
        if (found) {
          setCanvas(found);
          setEditedCanvas(found);
        } else {
          setError("Canvas version not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load canvas");
      } finally {
        setLoading(false);
      }
    };
    if (id && version) {
      loadData();
    }
  }, [id, version]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const newCanvas = await fetchAPI(`/api/v1/canvas/${id}`, {
        method: "POST",
        body: JSON.stringify(editedCanvas)
      });
      setIsEditing(false);
      // Navigate to the newly created version
      router.push(`/ideas/${id}/canvas?version=${newCanvas.version}`);
    } catch (err: any) {
      alert("Failed to save canvas: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-deep">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !canvas) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-deep">
        <div className="text-center">
          <span className="material-symbols-outlined text-[48px] text-error-red mb-4">error</span>
          <h3 className="text-xl font-bold text-on-surface mb-2">Error</h3>
          <p className="text-text-muted">{error || "Not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#fcfcfa] p-6 flex flex-col font-body-md text-sm overflow-y-auto print:static print:overflow-visible print:bg-white print:p-0" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-extrabold text-on-surface flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[28px]">schema</span>
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
                className="px-4 py-2 rounded-lg text-sm font-bold text-text-muted hover:bg-surface-variant transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? (
                  <span className="material-symbols-outlined animate-spin text-[16px]">refresh</span>
                ) : (
                  <span className="material-symbols-outlined text-[16px]">save</span>
                )}
                Save as new version
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer transform hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined text-[12px]">edit</span>
                Edit Canvas
              </button>
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer transform hover:-translate-y-0.5"
              >
                <span className="material-symbols-outlined text-[12px]">print</span>
                Print / Save PDF
              </button>
            </>
          )}
        </div>
      </div>

      {/* Canvas Grid Area - Takes up remaining vertical space */}
      <div className="flex-1 flex flex-col gap-4 min-h-[600px] min-w-[1000px] print:h-auto print:overflow-visible">
        
        {/* Top Row: 5 Columns */}
        <div className="grid grid-cols-5 gap-4 flex-[3] print:h-auto print:overflow-visible">
          <CanvasBlock 
            title="Key Partnerships" 
            value={isEditing ? editedCanvas.key_partnerships : canvas.key_partnerships}
            isEditing={isEditing}
            onChange={(v) => setEditedCanvas({...editedCanvas, key_partnerships: v})}
            colorClass="bg-blue-100/80 border-blue-300"
            icon="handshake"
          />
          <div className="flex flex-col gap-4 h-full min-h-0 print:h-auto print:overflow-visible">
            <CanvasBlock 
              title="Key Activities" 
              value={isEditing ? editedCanvas.key_activities : canvas.key_activities}
              isEditing={isEditing}
              onChange={(v) => setEditedCanvas({...editedCanvas, key_activities: v})}
              colorClass="bg-blue-100/80 border-blue-300"
              icon="manufacturing"
            />
            <CanvasBlock 
              title="Key Resources" 
              value={isEditing ? editedCanvas.key_resources : canvas.key_resources}
              isEditing={isEditing}
              onChange={(v) => setEditedCanvas({...editedCanvas, key_resources: v})}
              colorClass="bg-blue-100/80 border-blue-300"
              icon="diamond"
            />
          </div>
          <CanvasBlock 
            title="Value Propositions" 
            value={isEditing ? editedCanvas.value_propositions : canvas.value_propositions}
            isEditing={isEditing}
            onChange={(v) => setEditedCanvas({...editedCanvas, value_propositions: v})}
            colorClass="bg-rose-100/80 border-rose-300"
            icon="featured_play_list"
          />
          <div className="flex flex-col gap-4 h-full min-h-0 print:h-auto print:overflow-visible">
            <CanvasBlock 
              title="Customer Relationships" 
              value={isEditing ? editedCanvas.customer_relationships : canvas.customer_relationships}
              isEditing={isEditing}
              onChange={(v) => setEditedCanvas({...editedCanvas, customer_relationships: v})}
              colorClass="bg-emerald-100/80 border-emerald-300"
              icon="favorite"
            />
            <CanvasBlock 
              title="Channels" 
              value={isEditing ? editedCanvas.channels : canvas.channels}
              isEditing={isEditing}
              onChange={(v) => setEditedCanvas({...editedCanvas, channels: v})}
              colorClass="bg-emerald-100/80 border-emerald-300"
              icon="local_shipping"
            />
          </div>
          <CanvasBlock 
            title="Customer Segments" 
            value={isEditing ? editedCanvas.customer_segments : canvas.customer_segments}
            isEditing={isEditing}
            onChange={(v) => setEditedCanvas({...editedCanvas, customer_segments: v})}
            colorClass="bg-emerald-100/80 border-emerald-300"
            icon="groups"
          />
        </div>

        {/* Bottom Row: 2 Columns */}
        <div className="grid grid-cols-2 gap-4 flex-[1.5] print:h-auto print:overflow-visible">
          <CanvasBlock 
            title="Cost Structure" 
            value={isEditing ? editedCanvas.cost_structure : canvas.cost_structure}
            isEditing={isEditing}
            onChange={(v) => setEditedCanvas({...editedCanvas, cost_structure: v})}
            colorClass="bg-amber-100/80 border-amber-300"
            icon="payments"
          />
          <CanvasBlock 
            title="Revenue Streams" 
            value={isEditing ? editedCanvas.revenue_streams : canvas.revenue_streams}
            isEditing={isEditing}
            onChange={(v) => setEditedCanvas({...editedCanvas, revenue_streams: v})}
            colorClass="bg-amber-100/80 border-amber-300"
            icon="account_balance_wallet"
          />
        </div>
      </div>
    </div>
  );
}

// Read-only/Editable Canvas Block
function CanvasBlock({ 
  title, 
  value, 
  isEditing,
  onChange,
  colorClass, 
  icon 
}: { 
  title: string; 
  value: string | null | undefined; 
  isEditing?: boolean;
  onChange?: (v: string) => void;
  colorClass: string;
  icon: string;
}) {
  return (
    <div className={`flex-1 min-h-0 h-full rounded-xl border-2 p-4 flex flex-col ${colorClass} shadow-sm overflow-hidden print:h-auto print:overflow-visible`}>
      <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-3 shrink-0">
        <span className="material-symbols-outlined text-[16px] opacity-80">{icon}</span>
        {title}
      </h3>
      {isEditing ? (
        <textarea
          value={value || ""}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 min-h-0 w-full bg-white/70 border border-slate-300 rounded-lg p-2 text-slate-900 font-body-md text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder={`Enter ${title}...`}
        />
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto text-slate-900 font-body-md text-sm leading-relaxed pr-2 whitespace-pre-wrap print:overflow-visible">
          {value ? value.replace(/\s+(?=\d+\.\s)/g, '\n\n') : <span className="text-slate-500 italic">Not defined</span>}
        </div>
      )}
    </div>
  );
}
