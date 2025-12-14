import React, { useState } from 'react';
import { Printer, Share2, Check, Lock, Unlock, FileJson, RotateCcw, Undo2, Redo2, Moon, Sun, Command, Play } from 'lucide-react';

interface ToolbarProps {
  isEditing: boolean;
  onToggleEditing: () => void;
  onReset: () => void;
  onExport: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenCommandPalette: () => void;
  onPlayStory: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  isEditing, 
  onToggleEditing, 
  onReset, 
  onExport, 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo,
  isDark,
  onToggleTheme,
  onOpenCommandPalette,
  onPlayStory
}) => {
  const [copied, setCopied] = useState(false);
  const [exported, setExported] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: document.title,
      text: 'Check out this professional interactive resume.',
      url: window.location.href,
    };

    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        const url = new URL(window.location.href);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            throw new Error("Invalid protocol for sharing");
        }
        await navigator.share(shareData);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.warn("Share failed, falling back to clipboard:", err);
        await copyToClipboard();
      }
    } else {
      await copyToClipboard();
    }
  };

  const handleExport = () => {
    onExport();
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 max-w-[90vw] overflow-x-auto scrollbar-hide flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-200 dark:border-slate-700 z-50 print:hidden transition-all duration-300">
      
      {/* Story Mode Action */}
      <button 
        onClick={onPlayStory}
        className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors tooltip group relative flex-shrink-0"
        aria-label="Play Story Mode"
      >
        <Play size={18} fill="currentColor" />
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Play Story</span>
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-slate-600 mx-1 flex-shrink-0"></div>

      {/* View Mode Actions */}
      <button 
        onClick={handlePrint}
        className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition-colors tooltip group relative flex-shrink-0"
        aria-label="Print Resume"
      >
        <Printer size={18} />
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Print PDF</span>
      </button>

      <button 
        onClick={handleShare}
        className="p-3 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors relative group flex-shrink-0"
        aria-label="Share Link"
      >
        {copied ? <Check size={18} /> : <Share2 size={18} />}
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {copied ? "Link Copied!" : "Share Resume"}
        </span>
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-slate-600 mx-1 flex-shrink-0"></div>
      
      {/* Theme & Command */}
      <button 
        onClick={onToggleTheme}
        className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-yellow-400 transition-colors relative group flex-shrink-0"
      >
        {isDark ? <Sun size={18} /> : <Moon size={18} />}
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      </button>

      <button 
        onClick={onOpenCommandPalette}
        className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition-colors relative group hidden sm:block flex-shrink-0"
        title="Command Palette (Cmd+K)"
      >
        <Command size={18} />
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Cmd+K
        </span>
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-slate-600 mx-1 hidden sm:block flex-shrink-0"></div>

      {/* Admin Actions */}
      {isEditing && (
        <>
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 rounded-full px-1 flex-shrink-0">
             <button 
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-2 rounded-full transition-colors relative group ${!canUndo ? 'text-gray-300 dark:text-slate-500 cursor-not-allowed' : 'hover:bg-white dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 hover:text-black shadow-sm'}`}
              title="Undo"
            >
              <Undo2 size={16} />
            </button>
             <button 
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-2 rounded-full transition-colors relative group ${!canRedo ? 'text-gray-300 dark:text-slate-500 cursor-not-allowed' : 'hover:bg-white dark:hover:bg-slate-600 text-gray-700 dark:text-gray-200 hover:text-black shadow-sm'}`}
              title="Redo"
            >
              <Redo2 size={16} />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-slate-600 mx-1 flex-shrink-0"></div>

          <button 
            onClick={onReset}
            className="p-3 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors group relative flex-shrink-0"
            title="Reset to Default"
          >
            <RotateCcw size={18} />
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Reset Data</span>
          </button>
          
          <button 
            onClick={handleExport}
            className="p-3 rounded-full hover:bg-green-50 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 transition-colors group relative flex-shrink-0"
            title="Copy Data JSON"
          >
            {exported ? <Check size={18} /> : <FileJson size={18} />}
            <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {exported ? "JSON Copied!" : "Copy JSON"}
            </span>
          </button>
        </>
      )}

      <button 
        onClick={onToggleEditing}
        className={`p-3 rounded-full transition-colors group relative flex-shrink-0 ${isEditing ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 hover:bg-amber-200' : 'hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
        aria-label="Toggle Editor"
      >
        {isEditing ? <Unlock size={18} /> : <Lock size={18} />}
        <span className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 dark:bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {isEditing ? "Editor Active" : "Enable Editor"}
        </span>
      </button>

    </div>
  );
};

export default Toolbar;