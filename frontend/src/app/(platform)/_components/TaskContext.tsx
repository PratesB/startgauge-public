"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { fetchAPI } from "@/lib/api";

export type TaskType = "canvas" | "feedback";

export interface ActiveTask {
  taskId: string;
  type: TaskType;
  ideaId: string;
  ideaTitle: string;
  canvasId?: string; // only for feedback
}

export interface FinishedTask {
  task: ActiveTask;
  status: "success" | "error";
  message?: string;
}

interface TaskContextType {
  activeTasks: ActiveTask[];
  completedTasks: ActiveTask[]; // to notify components that a task finished
  finishedTasks: FinishedTask[]; // to show in the global notification until dismissed
  addTask: (task: ActiveTask) => void;
  removeCompletedTask: (taskId: string) => void;
  clearCompletedTaskFlag: (taskId: string) => void;
  dismissFinishedTask: (taskId: string) => void;
  isGeneratingForIdea: (ideaId: string, type?: TaskType) => boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [activeTasks, setActiveTasks] = useState<ActiveTask[]>([]);
  const [completedTasks, setCompletedTasks] = useState<ActiveTask[]>([]);
  const [finishedTasks, setFinishedTasks] = useState<FinishedTask[]>([]);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("startgauge_active_tasks");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setActiveTasks(parsed);
      } catch (e) {
        console.error("Failed to parse active tasks from localStorage", e);
      }
    }
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem("startgauge_active_tasks", JSON.stringify(activeTasks));
  }, [activeTasks]);

  const addTask = useCallback((task: ActiveTask) => {
    setActiveTasks(prev => {
      // prevent duplicates
      if (prev.find(t => t.taskId === task.taskId)) return prev;
      return [...prev, task];
    });
  }, []);

  const removeCompletedTask = useCallback((taskId: string) => {
    setActiveTasks(prev => prev.filter(t => t.taskId !== taskId));
  }, []);

  const clearCompletedTaskFlag = useCallback((taskId: string) => {
    setCompletedTasks(prev => prev.filter(t => t.taskId !== taskId));
  }, []);

  const dismissFinishedTask = useCallback((taskId: string) => {
    setFinishedTasks(prev => prev.filter(t => t.task.taskId !== taskId));
  }, []);

  const isGeneratingForIdea = useCallback((ideaId: string, type?: TaskType) => {
    return activeTasks.some(t => t.ideaId === ideaId && (!type || t.type === type));
  }, [activeTasks]);

  // Polling mechanism
  useEffect(() => {
    if (activeTasks.length === 0) return;

    const interval = setInterval(async () => {
      // Check status of all active tasks
      for (const task of activeTasks) {
        try {
          const res = await fetchAPI(`/api/v1/ai/status/${task.taskId}`);
          if (res.status === "SUCCESS" || res.status === "FAILURE") {
            // Task finished (either good or bad)
            removeCompletedTask(task.taskId);
            if (res.status === "SUCCESS") {
                setCompletedTasks(prev => [...prev, task]);
                setFinishedTasks(prev => [...prev, { task, status: "success" }]);
            } else {
                setFinishedTasks(prev => [...prev, { task, status: "error", message: res.error }]);
            }
          }
        } catch (err) {
          console.error("Failed to poll task status", err);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeTasks, removeCompletedTask]);

  return (
    <TaskContext.Provider value={{ activeTasks, completedTasks, finishedTasks, addTask, removeCompletedTask, clearCompletedTaskFlag, dismissFinishedTask, isGeneratingForIdea }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}
