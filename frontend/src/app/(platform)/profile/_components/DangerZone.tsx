"use client";

import React from "react";

interface DangerZoneProps {
  isDeleting: boolean;
  handleDeleteAccount: () => void;
}

export function DangerZone({ isDeleting, handleDeleteAccount }: DangerZoneProps) {
  return (
    <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 sm:p-8">
      <h2 className="text-xl font-bold text-red-700 mb-2 flex items-center gap-2">
        <span className="material-symbols-outlined">warning</span>
        Danger Zone
      </h2>
      <p className="text-red-900/70 text-[14px] mb-6 max-w-xl">
        Permanently delete your account and all associated data, including your Ideas, Canvases, and Feedbacks. This action cannot be undone.
      </p>
      <button 
        onClick={handleDeleteAccount}
        disabled={isDeleting}
        className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-[14px] hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-sm shadow-red-200"
      >
        {isDeleting ? (
          <><span className="material-symbols-outlined text-[18px] animate-spin">sync</span> Deleting...</>
        ) : (
          <><span className="material-symbols-outlined text-[18px]">delete_forever</span> Delete Account</>
        )}
      </button>
    </div>
  );
}
