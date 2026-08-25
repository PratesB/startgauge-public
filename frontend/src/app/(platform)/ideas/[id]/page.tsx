"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import { IdeaHero } from "./_components/IdeaHero";
import { TeamBackground } from "./_components/TeamBackground";
import { CanvasHistory } from "./_components/CanvasHistory";
import { useTaskContext } from "../../_components/TaskContext";

interface Idea {
  id: string;
  title: string;
  description: string;
  country: string;
  team_background: string | null;
  created_at: string;
  updated_at?: string;
}

export default function IdeaDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [canvases, setCanvases] = useState<any[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);

  const { addTask, isGeneratingForIdea, completedTasks, clearCompletedTaskFlag } = useTaskContext();
  const isGeneratingCanvas = isGeneratingForIdea(id, "canvas");
  const isGeneratingFeedback = isGeneratingForIdea(id, "feedback");

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    team_background: "",
    use_my_saved_background: false,
  });

  // Delete State
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadIdea() {
      try {
        const data = await fetchAPI(`/api/v1/ideas/${id}`);
        setIdea(data);
        setEditForm({
          title: data.title,
          description: data.description,
          team_background: data.team_background || "",
          use_my_saved_background: false,
        });

        try {
          const historyData = await fetchAPI(`/api/v1/canvas/${id}/history`);
          setCanvases(historyData || []);
        } catch (e) {
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

  useEffect(() => {
    if (idea) {
      setEditForm({
        title: idea.title,
        description: idea.description,
        team_background: idea.team_background || "",
        use_my_saved_background: false,
      });
    }
  }, [idea]);

  // Listen for task completion to refresh canvas history
  useEffect(() => {
    const completedTask = completedTasks.find((t: any) => t.ideaId === id);
    if (completedTask) {
      // Re-fetch history
      fetchAPI(`/api/v1/canvas/${id}/history`)
        .then(data => setCanvases(data || []))
        .catch(() => {});
      
      clearCompletedTaskFlag(completedTask.taskId);
    }
  }, [completedTasks, id, clearCompletedTaskFlag]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setEditForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGenerateCanvas = async () => {
    if (!idea) return;
    setAiError(null);
    try {
      const response = await fetchAPI(`/api/v1/ai/generate-canvas/${id}`, {
        method: "POST"
      });
      addTask({ taskId: response.task_id, type: "canvas", ideaId: id, ideaTitle: idea.title });
    } catch (err: any) {
      console.error("Failed to generate canvas:", err);
      setAiError(err.message || "Failed to start canvas generation. Please try again later.");
    }
  };

  const handleGenerateFeedbackForVersion = async (canvasId: string) => {
    if (!idea) return;
    setAiError(null);
    try {
      const response = await fetchAPI(`/api/v1/ai/generate-feedback/${canvasId}`, {
        method: "POST"
      });
      addTask({ taskId: response.task_id, type: "feedback", ideaId: id, ideaTitle: idea.title, canvasId });
    } catch (err: any) {
      console.error("Failed to generate feedback:", err);
      setAiError(err.message || "Failed to start feedback generation. Please try again later.");
    }
  };

  const handleSaveEdit = async () => {
    setIsSaving(true);
    try {
      const updatedIdea = await fetchAPI(`/api/v1/ideas/${id}`, {
        method: "PATCH",
        body: JSON.stringify(editForm),
      });
      setIdea(updatedIdea);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update idea:", err);
      alert("Failed to update idea.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (idea) {
      setEditForm({
        title: idea.title,
        description: idea.description,
        team_background: idea.team_background || "",
        use_my_saved_background: false,
      });
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this idea? This action cannot be undone.")) return;
    setIsDeleting(true);
    try {
      await fetchAPI(`/api/v1/ideas/${id}`, {
        method: "DELETE",
      });
      router.push("/ideas");
    } catch (err) {
      console.error("Failed to delete idea:", err);
      alert("Failed to delete idea.");
      setIsDeleting(false);
    }
  };

  // Canvas Delete State
  const [deletingCanvasId, setDeletingCanvasId] = useState<string | null>(null);

  const handleDeleteCanvas = async (canvasId: string) => {
    if (!window.confirm("Are you sure you want to delete this canvas version? This action cannot be undone.")) return;
    setDeletingCanvasId(canvasId);
    try {
      await fetchAPI(`/api/v1/canvas/${canvasId}`, {
        method: "DELETE",
      });
      setCanvases(prev => prev.filter(c => c.id !== canvasId));
    } catch (err) {
      console.error("Failed to delete canvas:", err);
      alert("Failed to delete canvas.");
    } finally {
      setDeletingCanvasId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 text-[14px] font-medium">Loading Idea...</p>
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
        <span className="material-symbols-outlined text-[48px] text-slate-300 mb-4">error</span>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Idea Not Found</h2>
        <p className="text-slate-500 text-[14px] mb-6">{error || "We couldn't find the idea you're looking for."}</p>
        <button onClick={() => router.push("/ideas")} className="px-5 py-2.5 bg-slate-900 rounded-lg text-white font-medium text-[13px] hover:bg-slate-800 transition-colors">
          Back to Ideas
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-[calc(100vh-4rem)] pt-4 pb-32">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-10 lg:gap-16">
          <div className="flex flex-col gap-10 lg:gap-16">
            
            <IdeaHero 
              idea={idea}
              isEditing={isEditing}
              isSaving={isSaving}
              isDeleting={isDeleting}
              editForm={editForm}
              handleEditChange={handleEditChange}
              handleSaveEdit={handleSaveEdit}
              handleCancelEdit={handleCancelEdit}
              setIsEditing={setIsEditing}
              handleDelete={handleDelete}
            />

            <TeamBackground 
              idea={idea}
              isEditing={isEditing}
              editForm={editForm}
              handleEditChange={handleEditChange}
            />

            <CanvasHistory 
              ideaId={id}
              canvases={canvases}
              isGeneratingCanvas={isGeneratingCanvas}
              isGeneratingFeedback={isGeneratingFeedback}
              deletingCanvasId={deletingCanvasId}
              aiError={aiError}
              handleGenerateCanvas={handleGenerateCanvas}
              handleGenerateFeedbackForVersion={handleGenerateFeedbackForVersion}
              handleDeleteCanvas={handleDeleteCanvas}
            />

          </div>
        </div>
      </div>
    </div>
  );
}
