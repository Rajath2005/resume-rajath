import React, { useState, useEffect } from 'react';
import { Lock, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AuthDialog: React.FC<AuthDialogProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnimate(true);
      // Reset state when opening
      setPassword('');
      setError(false);
    } else {
      setTimeout(() => setAnimate(false), 200);
    }
  }, [isOpen]);

  if (!isOpen && !animate) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple verification - In a real app, this would verify hash against backend
    if (password === 'admin123') { 
      onSuccess();
    } else {
      setError(true);
      // Shake animation trigger could go here
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-black/40 backdrop-blur-sm opacity-100' : 'bg-transparent opacity-0 pointer-events-none'}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className={`bg-white p-8 rounded-2xl shadow-2xl w-full max-w-[360px] mx-4 relative transform transition-all duration-300 ease-out ${isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'}`}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-300 hover:text-gray-500 transition-colors p-1 rounded-full hover:bg-gray-50"
        >
          <X size={20} />
        </button>
        
        <div className="flex flex-col items-center mb-6">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${error ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600'}`}>
            {error ? <Lock size={24} /> : <ShieldCheck size={28} />}
          </div>
          <h3 className="text-xl font-bold text-gray-900 font-serif tracking-tight">Admin Authentication</h3>
          <p className="text-sm text-gray-500 text-center mt-2 leading-relaxed">
            Please enter the secure access code to enable editing mode.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="relative group">
            <input
              type="password"
              autoFocus={isOpen}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter Access Code"
              className={`w-full px-4 py-3.5 rounded-xl border outline-none transition-all duration-200 font-sans text-sm ${
                error 
                  ? 'border-red-300 bg-red-50/50 focus:border-red-500 text-red-900 placeholder-red-300' 
                  : 'border-gray-200 bg-gray-50/50 focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(59,130,246,0.1)]'
              }`}
            />
          </div>
          
          <div className={`overflow-hidden transition-all duration-300 ${error ? 'max-h-8 mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
            <p className="text-red-500 text-xs font-medium flex items-center justify-center">
              Incorrect access code provided.
            </p>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-[#1a365d] hover:bg-[#25467a] active:scale-[0.98] text-white py-3.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10"
          >
            Unlock Editor <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthDialog;