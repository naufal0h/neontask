import { Terminal, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuthStore();

  return (
    <header className="border-b border-gray-800 pb-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Terminal className="w-8 h-8 text-neon-cyan" />
          <div>
            <h1 className="text-4xl font-mono font-bold text-white tracking-tighter">
              NEON<span className="text-neon-cyan">TASK</span>
            </h1>
            <p className="text-gray-500 font-mono text-xs">SECURE TASK MANAGEMENT PROTOCOL v1.0.4</p>
          </div>
        </div>
        
        {isAuthenticated && (
          <div className="flex items-center gap-4">
            <span className="text-neon-cyan font-mono text-sm">
              @{user?.handle}
            </span>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              DISCONNECT
            </button>
          </div>
        )}
      </div>
    </header>
  );
};