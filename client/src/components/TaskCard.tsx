import { Zap, Clock, Trash2, Edit } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'STANDBY' | 'IN_PROGRESS' | 'EXECUTED';
  dueDate: string | null;
}

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onUpdate: (task: Task) => void;
}

const priorityColors = {
  LOW: 'border-neon-green text-neon-green',
  MEDIUM: 'border-neon-yellow text-neon-yellow',
  HIGH: 'border-orange-500 text-orange-500',
  CRITICAL: 'border-neon-magenta text-neon-magenta animate-pulse',
};

const statusColors = {
  STANDBY: 'bg-gray-800',
  IN_PROGRESS: 'bg-neon-cyan/20 border-neon-cyan',
  EXECUTED: 'bg-gray-900 opacity-50',
};

export const TaskCard = ({ task, onDelete, onUpdate }: TaskCardProps) => {
  return (
    <div className={`border rounded-lg p-6 ${statusColors[task.status]} transition-all hover:border-neon-cyan`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`text-xl font-mono font-bold ${task.status === 'EXECUTED' ? 'line-through text-gray-500' : 'text-white'}`}>
            {task.title}
          </h3>
          <span className={`text-xs font-mono px-2 py-1 rounded border ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onUpdate(task)}
            className="p-2 text-neon-cyan hover:bg-neon-cyan/10 rounded"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(task.id)}
            className="p-2 text-red-500 hover:bg-red-500/10 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="text-gray-400 font-mono text-sm mb-4">{task.description}</p>
      )}
      
      <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
        <span className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          {task.status}
        </span>
        {task.dueDate && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};