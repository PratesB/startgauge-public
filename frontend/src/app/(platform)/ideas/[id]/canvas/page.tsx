"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { fetchAPI } from "@/lib/api";

export interface Canvas {
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
import { CanvasHeader } from "./_components/CanvasHeader";
import { CanvasGrid } from "./_components/CanvasGrid";

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
      
      <CanvasHeader
        canvas={canvas}
        user={user}
        isEditing={isEditing}
        isSaving={isSaving}
        setIsEditing={setIsEditing}
        setEditedCanvas={setEditedCanvas}
        handleSave={handleSave}
      />

      <CanvasGrid
        canvas={canvas}
        editedCanvas={editedCanvas}
        isEditing={isEditing}
        setEditedCanvas={setEditedCanvas}
      />

    </div>
  );
}
