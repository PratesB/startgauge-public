"use client";

import React from "react";

interface ChangePasswordProps {
  passwordForm: {
    old_password: string;
    new_password: string;
    confirm_password: string;
  };
  isSavingPassword: boolean;
  passwordError: string;
  handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSavePassword: (e: React.SyntheticEvent) => void;
}

export function ChangePassword({
  passwordForm,
  isSavingPassword,
  passwordError,
  handlePasswordChange,
  handleSavePassword
}: ChangePasswordProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-slate-700">lock</span>
        Change Password
      </h2>
      <form onSubmit={handleSavePassword} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Current Password</label>
          <input 
            type="password" 
            name="old_password"
            value={passwordForm.old_password}
            onChange={handlePasswordChange}
            required
            className="w-full sm:w-1/2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[15px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">New Password</label>
            <input 
              type="password" 
              name="new_password"
              value={passwordForm.new_password}
              onChange={handlePasswordChange}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[15px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Confirm New Password</label>
            <input 
              type="password" 
              name="confirm_password"
              value={passwordForm.confirm_password}
              onChange={handlePasswordChange}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[15px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>
        {passwordError && (
          <div className="text-red-500 text-[13px] font-medium flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">error</span>
            {passwordError}
          </div>
        )}
        <div className="flex justify-end mt-2">
          <button 
            type="submit"
            disabled={isSavingPassword}
            className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-[14px] hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {isSavingPassword ? (
              <><span className="material-symbols-outlined text-[18px] animate-spin">sync</span> Updating...</>
            ) : (
              'Update Password'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
