import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  headerColor?: string; // CSS class for gradient
  maxWidth?: string; // Custom width class
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  headerColor = 'bg-gradient-to-r from-primary to-primary-light',
  maxWidth = 'max-w-2xl' // Default width
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-hidden">
      <div className={`relative w-full ${maxWidth} bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden animate-[fadeIn_0.3s_ease-out] flex flex-col max-h-[95vh] transition-colors duration-300`}>
        <div className={`p-6 text-white ${headerColor} flex justify-between items-center flex-shrink-0`}>
          <h3 className="text-xl md:text-2xl font-bold font-serif">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 md:p-8 overflow-y-auto flex-grow text-gray-800 dark:text-gray-100 bg-gray-50/50 dark:bg-slate-900/50 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-600">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;