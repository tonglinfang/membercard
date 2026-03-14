import { useState } from 'react';
import { X } from 'lucide-react';
import { useTasks } from '../contexts/TaskContext';
import { Button } from './Button';
import { Field } from './Field';

export function AddTaskModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title, description);
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">新しいタスクを追加</h2>
          <button onClick={onClose} className="p-2 text-gray-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field
            label="タスク名"
            value={title}
            onChange={setTitle}
            placeholder="例: 会議の準備"
            required
          />
          <Field
            label="説明 (任意)"
            value={description}
            onChange={setDescription}
            placeholder="詳細を入力してください"
            multiline
            rows={2}
          />

          <div className="flex gap-3 mt-4">
            <Button variant="secondary" fullWidth onClick={onClose}>キャンセル</Button>
            <Button variant="primary" fullWidth type="submit" disabled={!title.trim()}>保存</Button>
          </div>
        </form>
      </div>
    </div>
  );
}