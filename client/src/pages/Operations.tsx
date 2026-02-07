import { useEffect, useState } from 'react';
import { Plus, Activity } from 'lucide-react';
import { Header } from '../components/Header';
import { TaskCard } from '../components/TaskCard';
import { CreateTaskModal } from '../components/CreateTaskModal'; // ADD THIS
import api from '../api/axios';

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'STANDBY' | 'IN_PROGRESS' | 'EXECUTED';
  dueDate: string | null;
}

export const Operations = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'STANDBY' | 'IN_PROGRESS' | 'EXECUTED'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false); // ADD THIS

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.operations);
    } catch (error) {
      console.error('Failed to fetch operations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to terminate operation');
    }
  };

  const handleUpdate = async (task: Task) => {
    const newStatus = task.status === 'STANDBY' ? 'IN_PROGRESS' : 
                      task.status === 'IN_PROGRESS' ? 'EXECUTED' : 'STANDBY';
    try {
      await api.put(`/tasks/${task.id}`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update operation');
    }
  };

  const filteredTasks = filter === 'ALL' ? tasks : tasks.filter(t => t.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-neon-cyan font-mono text-xl cursor-blink">
          LOADING OPERATIONS...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void p-8">
      <Header />
      
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {['ALL', 'STANDBY', 'IN_PROGRESS', 'EXECUTED'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`p-4 border rounded-lg font-mono text-sm ${
              filter === status 
                ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan' 
                : 'border-gray-800 text-gray-500 hover:border-gray-600'
            }`}
          >
            <Activity className="w-4 h-4 mb-2" />
            {status === 'ALL' ? 'ALL OPS' : status}
            <div className="text-2xl font-bold mt-1">
              {status === 'ALL' ? tasks.length : tasks.filter(t => t.status === status).length}
            </div>
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-mono text-white">ACTIVE OPERATIONS</h2>
        <button 
          onClick={() => setIsModalOpen(true)} // ADD onClick
          className="flex items-center gap-2 px-4 py-2 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan rounded hover:bg-neon-cyan/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          NEW OPERATION
        </button>
      </div>

      {/* Task Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 border border-gray-800 rounded-lg">
          <p className="text-gray-500 font-mono">NO OPERATIONS DETECTED</p>
          <p className="text-gray-600 font-mono text-xs mt-2">Initialize new task protocol</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}

      {/* ADD MODAL HERE */}
      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onTaskCreated={fetchTasks}
      />
    </div>
  );
};