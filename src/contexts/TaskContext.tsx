import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Task } from '../types/task';

// UUID生成のフォールバック
const generateId = () => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

interface TaskContextType {
  tasks: Task[];
  addTask: (title: string, description: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  activeTaskId: string | null;
  startTimer: (id: string) => void;
  stopTimer: () => void;
  activeTimeSpent: number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('line_mini_app_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load tasks:', e);
      return [];
    }
  });
  
  const [activeTaskId, setActiveTaskId] = useState<string | null>(() => {
    return localStorage.getItem('line_mini_app_active_task');
  });
  
  const [activeTimeSpent, setActiveTimeSpent] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('line_mini_app_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (activeTaskId) {
      localStorage.setItem('line_mini_app_active_task', activeTaskId);
    } else {
      localStorage.removeItem('line_mini_app_active_task');
    }
  }, [activeTaskId]);

  useEffect(() => {
    let interval: number;
    if (activeTaskId) {
      const task = tasks.find(t => t.id === activeTaskId);
      if (task) {
        setActiveTimeSpent(task.timeSpent);
        interval = window.setInterval(() => {
          setActiveTimeSpent(prev => prev + 1);
          setTasks(prevTasks => 
            prevTasks.map(t => 
              t.id === activeTaskId ? { ...t, timeSpent: t.timeSpent + 1 } : t
            )
          );
        }, 1000);
      } else {
        setActiveTaskId(null);
      }
    } else {
      setActiveTimeSpent(0);
    }
    return () => clearInterval(interval);
  }, [activeTaskId]);

  const addTask = (title: string, description: string) => {
    const newTask: Task = {
      id: generateId(),
      title,
      description,
      status: 'todo',
      timeSpent: 0,
      createdAt: Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id: string) => {
    if (activeTaskId === id) stopTimer();
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const startTimer = (id: string) => {
    if (activeTaskId === id) return;
    setActiveTaskId(id);
    updateTask(id, { status: 'in_progress' });
  };

  const stopTimer = () => {
    setActiveTaskId(null);
  };

  return (
    <TaskContext.Provider value={{
      tasks, addTask, updateTask, deleteTask,
      activeTaskId, startTimer, stopTimer, activeTimeSpent
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}