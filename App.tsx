import React, { useEffect, useState } from 'react';
import Resume from './components/Resume';
import Toolbar from './components/Toolbar';
import AuthDialog from './components/AuthDialog';
import CommandPalette from './components/CommandPalette';
import StoryMode from './components/StoryMode';
import { resumeData as defaultResumeData } from './data';
import { ResumeData, SkillCategory } from './types';
import { useHistory } from './hooks/useHistory';

const STORAGE_KEY = 'resume_data_v2_1'; 
const THEME_KEY = 'resume_theme_preference';
const MODE_KEY = 'resume_view_mode';

type ViewMode = 'story' | 'resume';

const App: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('story');

  // Initialize history hook
  const { state: data, set: setData, push: pushData, undo, redo, canUndo, canRedo, reset } = useHistory<ResumeData>(defaultResumeData);

  // Load Initial Data & Theme
  useEffect(() => {
    // Theme Loading
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'admin') {
      setIsAuthModalOpen(true);
    }

    // Default to story mode unless explicitly set to resume in session, but user asked for story first always
    // So we basically initialize to 'story' which is the default useState value.
    // However, if we want to persist user choice within a session, we could check sessionStorage.
    // For now, adhering to "while site opens story mode should open first" implies hard default.

    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Migration logic
        if (parsed.skills && !Array.isArray(parsed.skills)) {
          const newSkills: SkillCategory[] = [
             { category: "Programming Languages", items: parsed.skills.languages || "" },
             { category: "Web Development", items: parsed.skills.web || "" },
             { category: "Core Competencies", items: parsed.skills.core || "" },
             { category: "Development Tools", items: parsed.skills.devTools || "" },
             { category: "Design Tools", items: parsed.skills.designTools || "" },
             { category: "Operating Systems", items: parsed.skills.os || "" }
          ];
          parsed.skills = newSkills;
        }
        reset(parsed);
      } catch (e) {
        console.error("Failed to load saved resume data", e);
      }
    }
    
    setLoaded(true);
  }, [reset]);

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Command Palette: Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      
      // Save/Export: Cmd+S (prevent save page, trigger share)
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleShare(); 
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save to LocalStorage whenever data changes
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, loaded]);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newVal = !prev;
      if (newVal) {
        document.documentElement.classList.add('dark');
        localStorage.setItem(THEME_KEY, 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(THEME_KEY, 'light');
      }
      return newVal;
    });
  };

  const handleToggleEditing = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      if (isAuthenticated) {
        setIsEditing(true);
      } else {
        setIsAuthModalOpen(true);
      }
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setIsEditing(true);
    setIsAuthModalOpen(false);
  };

  const handleUpdate = (newData: ResumeData) => {
    setData(newData); 
  };

  const handleCommit = (newData: ResumeData) => {
    pushData(newData); 
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all changes? This cannot be undone.')) {
      reset(defaultResumeData);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleExport = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
         await navigator.share({
           title: 'Resume',
           url: window.location.href
         })
      } catch (e) {
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  const handleEmail = () => {
    window.location.href = `mailto:${data.contact.email}`;
  }

  // Switch to Resume Mode
  const exitStoryMode = () => {
    // Reset scroll when switching
    window.scrollTo(0, 0);
    setViewMode('resume');
  };

  // Switch to Story Mode
  const enterStoryMode = () => {
    window.scrollTo(0, 0);
    setViewMode('story');
  };

  if (viewMode === 'story') {
    return <StoryMode data={data} onExit={exitStoryMode} />;
  }

  return (
    <div className="min-h-screen bg-[#e6e9ef] dark:bg-[#0f172a] flex flex-col items-center py-0 md:py-8 print:bg-white print:py-0 print:block transition-colors duration-300">
      
      <main 
        className={`transform transition-all duration-700 ease-out origin-top w-full md:w-auto ${loaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'} print:transform-none print:opacity-100`}
      >
        <Resume 
          data={data} 
          isEditing={isEditing} 
          onUpdate={handleUpdate} 
          onCommit={handleCommit}
        />
      </main>

      <Toolbar 
        isEditing={isEditing}
        onToggleEditing={handleToggleEditing}
        onReset={handleReset}
        onExport={handleExport}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onPlayStory={enterStoryMode}
      />

      <AuthDialog 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={handleAuthSuccess}
      />

      <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        actions={{
          toggleTheme,
          print: () => window.print(),
          share: handleShare,
          downloadJson: handleExport,
          email: handleEmail,
          isDark
        }}
      />
      
      <footer className="mt-8 text-center text-gray-500 dark:text-gray-400 text-xs font-sans print:hidden mb-24 transition-colors hidden md:block">
        <p>Interactive Web Resume • Developed with React & Tailwind</p>
        <div className="mt-2 flex gap-2 justify-center">
          <span className="bg-gray-200 dark:bg-slate-800 px-2 py-1 rounded text-[10px] font-mono">Ctrl+P to Print</span>
          <span className="bg-gray-200 dark:bg-slate-800 px-2 py-1 rounded text-[10px] font-mono">Ctrl+K for Commands</span>
        </div>
        {isEditing && (
          <div className="mt-3 text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/20 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-100 dark:border-amber-900/30 text-[11px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Editor Mode Active
          </div>
        )}
      </footer>
    </div>
  );
};

export default App;