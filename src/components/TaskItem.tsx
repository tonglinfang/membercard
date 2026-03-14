import { Play, Square, Trash2, CheckCircle, Circle } from 'lucide-react';
import type { Task } from '../types/task';
import { useTasks } from '../contexts/TaskContext';
import { formatTime } from '../utils/format';

export function TaskItem({ task }: { task: Task }) {
  const { startTimer, stopTimer, activeTaskId, updateTask, deleteTask, activeTimeSpent } = useTasks();
  
  const isActive = activeTaskId === task.id;
  const displayTime = isActive ? activeTimeSpent : task.timeSpent;

  return (
    <div className={`p-4 rounded-2xl bg-white shadow-sm border ${isActive ? 'border-line ring-1 ring-line' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => updateTask(task.id, { status: task.status === 'done' ? 'todo' : 'done' })}
              className="text-gray-400 active:scale-90 transition-transform"
            >
              {task.status === 'done' ? (
                <CheckCircle className="w-5 h-5 text-line" />
              ) : (
                <Circle className="w-5 h-5" />
              )}
            </button>
            <h3 className={`font-bold ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
              {task.title}
            </h3>
          </div>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1 ml-7">{task.description}</p>
          )}
        </div>
        
        <button 
          onClick={() => deleteTask(task.id)}
          className="text-gray-300 hover:text-red-500 p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between ml-7">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 uppercase tracking-wider">経過時間</span>
          <span className={`text-xl font-mono font-bold ${isActive ? 'text-line' : 'text-gray-600'}`}>
            {formatTime(displayTime)}
          </span>
        </div>

        <div className="flex gap-2">
          {isActive ? (
            <button
              onClick={stopTimer}
              className="bg-gray-800 text-white p-3 rounded-xl active:scale-95 transition-transform"
            >
              <Square className="w-5 h-5 fill-current" />
            </button>
          ) : (
            <button
              onClick={() => startTimer(task.id)}
              disabled={task.status === 'done'}
              className="bg-line text-white p-3 rounded-xl active:scale-95 transition-transform disabled:opacity-30"
            >
              <Play className="w-5 h-5 fill-current" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}