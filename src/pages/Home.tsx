import { useState } from 'react';
import { Plus, ListTodo, History, CheckCircle2 } from 'lucide-react';
import { UserHeader } from '../components/UserHeader';
import { BottomBar } from '../components/BottomBar';
import { Button } from '../components/Button';
import { useLiff } from '../hooks/useLiff';
import { useTasks } from '../contexts/TaskContext';
import { TaskItem } from '../components/TaskItem';
import { AddTaskModal } from '../components/AddTaskModal';

export default function Home() {
  const { profile } = useLiff();
  const { tasks } = useTasks();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'done'>('all');

  const filteredTasks = activeTab === 'all' 
    ? tasks.filter(t => t.status !== 'done') 
    : tasks.filter(t => t.status === 'done');

  return (
    <div className="flex flex-col h-full">
      {profile && <UserHeader profile={profile} />}

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-gray-200 rounded-xl">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'all' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
            }`}
          >
            <ListTodo className="w-4 h-4" />
            実行中
          </button>
          <button
            onClick={() => setActiveTab('done')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'done' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
            }`}
          >
            <History className="w-4 h-4" />
            完了済み
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
              <CheckCircle2 className="w-16 h-16 mb-4" />
              <p className="font-medium">タスクがありません</p>
            </div>
          )}
        </div>
      </div>

      <BottomBar>
        <Button fullWidth onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-5 h-5" />
          新しいタスクを追加
        </Button>
      </BottomBar>

      <AddTaskModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}