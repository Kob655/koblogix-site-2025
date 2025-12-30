import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useStore();

  return (
    <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      {notifications.map((n) => (
        <div 
          key={n.id}
          className={`pointer-events-auto min-w-[300px] max-w-md p-4 rounded-xl shadow-2xl flex items-start gap-3 transform transition-all animate-slideUp ${
            n.type === 'success' ? 'bg-white border-l-4 border-green-500' :
            n.type === 'error' ? 'bg-white border-l-4 border-red-500' :
            'bg-white border-l-4 border-blue-500'
          }`}
        >
          <div className={`mt-0.5 ${
            n.type === 'success' ? 'text-green-500' :
            n.type === 'error' ? 'text-red-500' :
            'text-blue-500'
          }`}>
            {n.type === 'success' && <CheckCircle size={20} />}
            {n.type === 'error' && <AlertCircle size={20} />}
            {n.type === 'info' && <Info size={20} />}
          </div>
          <div className="flex-1">
            <p className="text-gray-800 text-sm font-medium leading-relaxed">{n.message}</p>
          </div>
          <button 
            onClick={() => removeNotification(n.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;