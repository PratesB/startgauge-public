"use client";

import React from "react";

interface Idea {
  id: string;
  team_background: string | null;
}

interface TeamBackgroundProps {
  idea: Idea;
  isEditing: boolean;
  editForm: {
    team_background: string;
    use_my_saved_background: boolean;
  };
  handleEditChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function TeamBackground({
  idea,
  isEditing,
  editForm,
  handleEditChange
}: TeamBackgroundProps) {
  return (
    <div className="flex flex-col">
      <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-6">
        Team Background
      </span>

      <div className="w-full">
        {isEditing ? (
          <div className="flex flex-col gap-4">
            <div className="relative">
              <textarea 
                name="team_background"
                value={editForm.team_background}
                onChange={handleEditChange}
                disabled={editForm.use_my_saved_background}
                rows={5}
                placeholder="Any specific unfair advantages?"
                className={`w-full border rounded-xl px-4 py-3 text-[14px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y ${editForm.use_my_saved_background ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-50 border-slate-200'}`}
              ></textarea>
              
              {editForm.use_my_saved_background && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-xl bg-white/50 backdrop-blur-sm">
                  <span className="bg-primary/10 px-3 py-1.5 rounded-lg text-[12px] font-bold text-primary flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">how_to_reg</span>
                    Using Global Profile
                  </span>
                </div>
              )}
            </div>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  name="use_my_saved_background"
                  checked={editForm.use_my_saved_background}
                  onChange={handleEditChange}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary transition-colors"></div>
              </div>
              <span className="text-[14px] font-medium text-slate-600 group-hover:text-primary transition-colors">
                Use my saved Global Profile
              </span>
            </label>
          </div>
        ) : (
          idea.team_background ? (
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar-minimal">
              <div className="relative bg-slate-50/80 px-6 sm:px-8 py-6 rounded-2xl border-l-[4px] border-slate-300">
                <span className="material-symbols-outlined absolute top-4 right-6 text-[48px] text-slate-200/50 pointer-events-none hidden sm:block">format_quote</span>
                <p className="relative z-10 text-slate-700 text-[16px] leading-relaxed whitespace-pre-wrap break-words text-justify">
                  {idea.team_background}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/50 px-6 sm:px-8 py-6 rounded-2xl border-l-[4px] border-slate-200">
              <p className="text-slate-400 text-[15px] font-medium italic">
                No team background provided.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
