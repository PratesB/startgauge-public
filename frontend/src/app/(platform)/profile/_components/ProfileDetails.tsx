"use client";

import React from "react";

interface ProfileDetailsProps {
  profileForm: {
    name: string;
    email: string;
    professional_background: string;
  };
  isSavingProfile: boolean;
  handleProfileChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSaveProfile: (e: React.SyntheticEvent) => void;
}

export function ProfileDetails({
  profileForm,
  isSavingProfile,
  handleProfileChange,
  handleSaveProfile
}: ProfileDetailsProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">person</span>
        Profile Details
      </h2>
      <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Name</label>
            <input 
              type="text" 
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[15px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Email</label>
            <input 
              type="email" 
              name="email"
              value={profileForm.email}
              onChange={handleProfileChange}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[15px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Global Professional Background</label>
          <p className="text-[13px] text-slate-500 mb-1">
            Save your team's unfair advantages here to easily inject them into any new idea you create.
          </p>
          <textarea 
            name="professional_background"
            value={profileForm.professional_background}
            onChange={handleProfileChange}
            rows={4}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[15px] text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y"
            placeholder="E.g., 10 years experience in fintech, Ph.D. in AI..."
          ></textarea>
        </div>
        <div className="flex justify-end mt-2">
          <button 
            type="submit"
            disabled={isSavingProfile}
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-[14px] hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isSavingProfile ? (
              <><span className="material-symbols-outlined text-[18px] animate-spin">sync</span> Saving...</>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
