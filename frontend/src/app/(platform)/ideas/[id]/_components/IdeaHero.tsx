"use client";

import React from "react";

interface Idea {
  id: string;
  title: string;
  description: string;
  country: string;
  team_background: string | null;
  created_at: string;
  updated_at?: string;
}

interface IdeaHeroProps {
  idea: Idea;
  isEditing: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  editForm: {
    title: string;
    description: string;
    team_background: string;
    use_my_saved_background: boolean;
  };
  handleEditChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  setIsEditing: (val: boolean) => void;
  handleDelete: () => void;
}

export function IdeaHero({
  idea,
  isEditing,
  isSaving,
  isDeleting,
  editForm,
  handleEditChange,
  handleSaveEdit,
  handleCancelEdit,
  setIsEditing,
  handleDelete
}: IdeaHeroProps) {
  return (
    <div className="flex flex-col">
      {isEditing ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <input 
              type="text" 
              name="title"
              value={editForm.title}
              onChange={handleEditChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-3xl sm:text-4xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Idea Title"
            />
            <div className="flex items-center gap-2 shrink-0 sm:mt-1">
              <button 
                onClick={handleCancelEdit}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold text-[13px] hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-semibold text-[13px] hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
          <textarea 
            name="description"
            value={editForm.description}
            onChange={handleEditChange}
            rows={6}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[15px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y"
            placeholder="Describe your idea..."
          ></textarea>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
            <div className="flex items-start gap-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-[1.2] break-words">
                {idea.title}
              </h1>
              <div className="flex items-center gap-1 shrink-0 sm:mt-1.5 opacity-60 hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-8 h-8 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center justify-center cursor-pointer"
                  title="Edit Idea"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-8 h-8 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
                  title="Delete Idea"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    {isDeleting ? 'hourglass_empty' : 'delete'}
                  </span>
                </button>
              </div>
            </div>

            <div className="mt-1 sm:mt-1.5 flex shrink-0 items-center justify-center">
              <img src="https://flagcdn.com/fi.svg" alt="Finland" className="h-8 sm:h-10 w-auto object-contain rounded-[4px] shadow-sm border border-slate-100" />
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-8">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>calendar_today</span>
              <span>Created: {new Date(idea.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'})}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>update</span>
              <span>Updated: {new Date(idea.updated_at || idea.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit'})}</span>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar-minimal">
            <p className="text-slate-500 text-[16px] leading-relaxed whitespace-pre-wrap break-words text-justify">
              {idea.description}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
