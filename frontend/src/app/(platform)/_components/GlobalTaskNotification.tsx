"use client";

import React from "react";
import Link from "next/link";
import { useTaskContext } from "./TaskContext";

export function GlobalTaskNotification() {
  const { activeTasks, finishedTasks, dismissFinishedTask } = useTaskContext();

  if (activeTasks.length === 0 && finishedTasks.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {activeTasks.map(task => (
        <div key={task.taskId} className="bg-white rounded-xl shadow-lg border border-slate-200 p-4 w-80 flex items-start gap-4 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="mt-1 flex-shrink-0">
            <span className="material-symbols-outlined animate-spin text-primary">sync</span>
          </div>
          <div className="flex flex-col">
            <h4 className="text-sm font-bold text-slate-900">
              Generating {task.type === "canvas" ? "Business Model Canvas" : "Feedback"}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1" title={task.ideaTitle}>
              for idea: <span className="font-semibold">{task.ideaTitle}</span>
            </p>
          </div>
        </div>
      ))}

      {finishedTasks.map(({ task, status, message }) => (
        <div key={`finished-${task.taskId}`} className={`bg-white rounded-xl shadow-lg border p-4 w-80 flex items-start gap-4 animate-in slide-in-from-bottom-5 fade-in duration-300 relative ${status === 'success' ? 'border-emerald-200' : 'border-red-200'}`}>
          <button 
            onClick={() => dismissFinishedTask(task.taskId)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
          
          <div className="mt-1 flex-shrink-0">
            <span className={`material-symbols-outlined ${status === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
              {status === 'success' ? 'check_circle' : 'error'}
            </span>
          </div>
          <div className="flex flex-col pr-4">
            <h4 className="text-sm font-bold text-slate-900">
              {status === 'success' ? (task.type === "canvas" ? "Canvas Ready!" : "Feedback Ready!") : "Generation Failed"}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1" title={task.ideaTitle}>
              for idea: <span className="font-semibold">{task.ideaTitle}</span>
            </p>
            {status === 'error' && message && (
              <p className="text-xs text-red-500 mt-1 line-clamp-2">{message}</p>
            )}
            {status === 'success' && (
              <Link 
                href={`/ideas/${task.ideaId}`}
                onClick={() => dismissFinishedTask(task.taskId)}
                className="mt-2 text-[12px] font-bold text-primary hover:text-primary/80 flex items-center gap-1"
              >
                View Idea <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
