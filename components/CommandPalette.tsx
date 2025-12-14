import React, { useEffect, useState } from 'react';
import { Search, Printer, Share2, Moon, Sun, Download, Mail, X, Command } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  actions: {
    toggleTheme: () => void;
    print: () => void;
    share: () => void;
    downloadJson: () => void;
    email: () => void;
    isDark: boolean;
  };
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, actions }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allCommands = [
    { id: 'print', icon: <Printer size={18} />, label: 'Print Resume / Save as PDF', action: actions.print, shortcut: 'Ctrl+P' },
    { id: 'theme', icon: actions.isDark ? <Sun size={18} /> : <Moon size={18} />, label: `Switch to ${actions.isDark ? 'Light' : 'Dark'} Mode`, action: actions.toggleTheme, shortcut: 'Ctrl+T' },
    { id: 'share', icon: <Share2 size={18} />, label: 'Share Resume Link', action: actions.share, shortcut: 'Ctrl+S' },
    { id: 'json', icon: <Download size={18} />, label: 'Export Data as JSON', action: actions.downloadJson, shortcut: 'Ctrl+E' },
    { id: 'email', icon: <Mail size={18} />, label: 'Send Email', action: actions.email, shortcut: '' },
  ];

  const filteredCommands = allCommands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4"
      onClick={(e) => { if(e.target === e.currentTarget) onClose(); }}
    >
      <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity" aria-hidden="true" />
      
      <div className="w-full max-w-xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden ring-1 ring-black/5 dark:ring-white/10 relative transform transition-all animate-fade-in">
        <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-slate-700">
          <Search className="w-5 h-5 text-gray-400" />
          <input 
            autoFocus
            type="text"
            className="flex-1 bg-transparent border-0 outline-none px-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 font-sans"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
            }}
          />
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <X size={18} />
          </button>
        </div>
        
        <div className="max-h-[300px] overflow-y-auto py-2">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
              No results found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => (
              <button
                key={cmd.id}
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors text-sm ${
                  idx === selectedIndex 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                }`}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className={`${idx === selectedIndex ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
                  {cmd.icon}
                </div>
                <span className="flex-1 font-medium">{cmd.label}</span>
                {cmd.shortcut && (
                  <span className="text-xs text-gray-400 font-mono bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                    {cmd.shortcut}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
        
        <div className="bg-gray-50 dark:bg-slate-900/50 px-4 py-2 text-xs text-gray-400 dark:text-gray-500 flex justify-between items-center border-t border-gray-100 dark:border-slate-700">
          <div className="flex gap-3">
             <span><kbd className="font-mono bg-gray-200 dark:bg-slate-700 rounded px-1">↑</kbd> <kbd className="font-mono bg-gray-200 dark:bg-slate-700 rounded px-1">↓</kbd> to navigate</span>
             <span><kbd className="font-mono bg-gray-200 dark:bg-slate-700 rounded px-1">↵</kbd> to select</span>
          </div>
          <div className="flex items-center gap-1">
             <Command size={10} /> <span>Commands</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;