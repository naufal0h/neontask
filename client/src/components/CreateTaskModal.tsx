import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import api from '../api/axios';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

export const CreateTaskModal = ({ isOpen, onClose, onTaskCreated }: CreateTaskModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/tasks', {
        title,
        description: description || null,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setDueDate('');
      
      onTaskCreated();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'FAILED TO CREATE OPERATION');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-lg border border-neon-cyan rounded-lg bg-void-light p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-mono text-neon-cyan">INITIALIZE NEW OPERATION</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-red-500 text-red-500 font-mono text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-500 font-mono text-xs mb-1">OPERATION TITLE *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-void border border-gray-700 rounded p-3 text-white font-mono focus:border-neon-cyan focus:outline-none"
              placeholder="Enter mission objective"
              required
            />
          </div>

          <div>
            <label className="block text-gray-500 font-mono text-xs mb-1">DESCRIPTION</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-void border border-gray-700 rounded p-3 text-white font-mono focus:border-neon-cyan focus:outline-none h-24"
              placeholder="Briefing details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-500 font-mono text-xs mb-1">PRIORITY LEVEL</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-void border border-gray-700 rounded p-3 text-white font-mono focus:border-neon-cyan focus:outline-none"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-500 font-mono text-xs mb-1">DUE DATE</label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-void border border-gray-700 rounded p-3 text-white font-mono focus:border-neon-cyan focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-700 text-gray-400 font-mono rounded hover:border-gray-500 transition-all"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading || !title}
              className="flex-1 py-3 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan font-mono rounded hover:bg-neon-cyan/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'PROCESSING...' : <><Plus className="w-4 h-4" /> CREATE</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};