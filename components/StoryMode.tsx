import React, { useEffect, useRef, useState } from 'react';
import { ResumeData } from '../types';
import { ChevronRight, SkipForward, ArrowRight, User, BookOpen, Code, Layers, Mail } from 'lucide-react';

interface StoryModeProps {
  data: ResumeData;
  onExit: () => void;
}

const StoryMode: React.FC<StoryModeProps> = ({ data, onExit }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const lastScrollY = useRef(0);
  const walkTimeout = useRef<number | null>(null);

  // Chapters configuration for the timeline
  const chapters = [
    { id: 0, title: "Origin", start: 0, end: 15 },
    { id: 1, title: "Education", start: 15, end: 35 },
    { id: 2, title: "Arsenal", start: 35, end: 55 },
    { id: 3, title: "Creations", start: 55, end: 85 },
    { id: 4, title: "Horizon", start: 85, end: 100 },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const newProgress = Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100));
      
      setProgress(newProgress);
      
      // Determine active chapter
      const currentChapter = chapters.find(c => newProgress >= c.start && newProgress < c.end) || chapters[chapters.length - 1];
      setActiveChapter(currentChapter.id);

      // Walking animation logic
      const delta = Math.abs(currentScroll - lastScrollY.current);
      if (delta > 2) {
        setIsWalking(true);
        if (walkTimeout.current) clearTimeout(walkTimeout.current);
        walkTimeout.current = window.setTimeout(() => setIsWalking(false), 150);
      }
      lastScrollY.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate horizontal translation based on scroll progress
  // We want the world to move left as we scroll down
  const worldTranslateX = -(progress * 25); // Multiplier adjusts world length

  return (
    <div ref={containerRef} className="relative w-full bg-slate-900 text-white overflow-hidden" style={{ height: '600vh' }}>
      
      {/* Fixed Viewport */}
      <div className="fixed inset-0 overflow-hidden">
        
        {/* Dynamic Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 transition-colors duration-1000" />
        
        {/* Stars / Particles - Parallax Layer 1 */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ transform: `translateX(${worldTranslateX * 0.1}vw)` }}
        >
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                top: `${Math.random() * 60}%`,
                left: `${i * 10}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                opacity: Math.random(),
              }}
            />
          ))}
        </div>

        {/* The World Container */}
        <div 
          className="absolute inset-0 flex items-center transition-transform duration-100 ease-out will-change-transform"
          style={{ transform: `translateX(${worldTranslateX}vw)` }}
        >
          {/* --- CHAPTER 1: INTRO --- */}
          <section className="w-[100vw] h-full flex flex-col justify-center items-center flex-shrink-0 px-10 relative">
            <div className="text-center space-y-4 animate-fade-in">
              <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-mono mb-4 border border-blue-500/30">
                Start Scroll to Begin
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white font-serif">
                {data.name}
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 font-light max-w-2xl mx-auto">
                {data.role}
              </p>
              <div className="pt-8 opacity-60 text-sm font-mono animate-bounce">
                Scroll Down ↓
              </div>
            </div>
            {/* Objective floating nearby */}
            <div className="absolute right-[-20vw] top-[30%] w-[400px] bg-slate-800/50 backdrop-blur-md p-6 rounded-xl border border-slate-700">
               <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2"><User size={16}/> Mission Objective</h3>
               <p className="text-slate-300 text-sm leading-relaxed">
                 {data.objective}
               </p>
            </div>
          </section>

          {/* --- CHAPTER 2: EDUCATION --- */}
          <section className="w-[150vw] h-full flex items-center flex-shrink-0 relative">
            <div className="absolute top-[20%] left-10 text-6xl font-bold text-slate-800 pointer-events-none select-none uppercase tracking-widest opacity-50">
              Journey
            </div>
            <div className="flex gap-[40vw] pl-20 items-end h-[60%] border-b border-slate-700/50 w-full pb-0 relative">
               {/* Timeline Line */}
               <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
               
               {data.education.map((edu, idx) => (
                 <div key={idx} className="relative group w-[300px]">
                    {/* Milestone Marker */}
                    <div className="absolute -bottom-[5px] left-0 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] z-10"></div>
                    <div className="absolute -bottom-[30px] left-0 text-xs font-mono text-blue-400">{edu.year}</div>
                    
                    {/* Content Card */}
                    <div className="mb-8 p-5 bg-slate-800/80 hover:bg-slate-800 border-l-2 border-blue-500 backdrop-blur-sm transition-all hover:-translate-y-2 duration-300 rounded-r-lg">
                      <h3 className="font-bold text-lg text-white">{edu.degree}</h3>
                      <p className="text-blue-300 text-sm mt-1">{edu.institution}</p>
                      <p className="text-slate-400 text-xs mt-2">{edu.score}</p>
                    </div>
                 </div>
               ))}
            </div>
          </section>

          {/* --- CHAPTER 3: SKILLS --- */}
          <section className="w-[150vw] h-full flex items-center flex-shrink-0 relative">
             <div className="absolute top-[15%] left-20">
                <h2 className="text-4xl font-serif text-slate-200 flex items-center gap-3">
                  <BookOpen className="text-amber-400" /> The Arsenal
                </h2>
             </div>
             
             <div className="flex flex-wrap gap-10 pl-[30vw] items-center justify-center h-full w-full">
                {data.skills.map((skill, idx) => (
                  <div key={idx} 
                       className="relative p-6 bg-slate-800/40 rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-all duration-500 hover:bg-slate-800/80 group w-[280px]"
                       style={{ marginTop: `${(idx % 2) * 50}px` }} // Staggered layout
                  >
                     <div className="absolute -top-3 -left-3 w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700 group-hover:border-amber-500 transition-colors">
                        <span className="text-amber-500 text-xs font-bold">0{idx+1}</span>
                     </div>
                     <h3 className="font-bold text-amber-100 mb-3">{skill.category}</h3>
                     <div className="flex flex-wrap gap-2">
                       {skill.items.split(',').map((item, i) => (
                         <span key={i} className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300 group-hover:text-white transition-colors">
                           {item.trim()}
                         </span>
                       ))}
                     </div>
                  </div>
                ))}
             </div>
          </section>

          {/* --- CHAPTER 4: PROJECTS --- */}
          <section className="w-[250vw] h-full flex items-center flex-shrink-0 relative bg-gradient-to-r from-transparent via-slate-900/50 to-transparent">
             <div className="absolute top-[20%] left-20">
                <h2 className="text-4xl font-serif text-slate-200 flex items-center gap-3">
                  <Code className="text-emerald-400" /> Major Creations
                </h2>
             </div>

             <div className="flex gap-[20vw] pl-[40vw] items-center">
                {data.projects.map((proj, idx) => (
                  <div key={idx} className="w-[450px] relative group perspective-1000">
                     <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500"></div>
                     <div className="relative bg-slate-900 border border-slate-700 p-8 rounded-xl shadow-2xl transform group-hover:rotate-y-2 transition-transform duration-500">
                        <div className="flex justify-between items-start mb-4">
                           <h3 className="text-2xl font-bold text-emerald-100">{proj.title}</h3>
                           <Layers size={20} className="text-emerald-500" />
                        </div>
                        <p className="text-emerald-400/80 text-sm font-mono mb-4">{proj.techStack}</p>
                        <p className="text-slate-300 text-sm leading-relaxed mb-6">
                          {proj.description}
                        </p>
                        {proj.award && (
                          <div className="mb-4 px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-200 text-xs flex items-center gap-2">
                            <span>🏆</span> {proj.award}
                          </div>
                        )}
                        <div className="flex gap-4 border-t border-slate-800 pt-4">
                           {proj.links?.github && (
                             <span className="text-xs text-slate-400 flex items-center gap-1 hover:text-white cursor-pointer">
                               Github <ArrowRight size={10} />
                             </span>
                           )}
                           {proj.links?.live && (
                             <span className="text-xs text-emerald-400 flex items-center gap-1 hover:text-emerald-200 cursor-pointer">
                               Live Demo <ArrowRight size={10} />
                             </span>
                           )}
                        </div>
                     </div>
                     {/* "Hologram" connection line to floor */}
                     <div className="absolute top-full left-1/2 w-px h-[200px] bg-gradient-to-b from-slate-700 to-transparent"></div>
                  </div>
                ))}
             </div>
          </section>

          {/* --- CHAPTER 5: OUTRO --- */}
          <section className="w-[100vw] h-full flex flex-col justify-center items-center flex-shrink-0 relative">
             <div className="text-center space-y-6 max-w-2xl px-4 animate-fade-in">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                   <Mail size={32} className="text-white" />
                </div>
                <h2 className="text-5xl font-bold font-serif">The Horizon Awaits</h2>
                <p className="text-xl text-slate-400">
                  You've seen the journey. Now let's build the future together.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                   <button 
                     onClick={onExit}
                     className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 justify-center"
                   >
                     View Full Resume PDF <ChevronRight size={18} />
                   </button>
                   <a 
                     href={`mailto:${data.contact.email}`}
                     className="px-8 py-4 bg-slate-800 text-white border border-slate-700 rounded-full font-bold hover:bg-slate-700 transition-colors"
                   >
                     Contact Me
                   </a>
                </div>
                
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 text-left bg-slate-800/50 p-6 rounded-lg border border-slate-700/50 max-w-lg mx-auto">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-700 rounded-full"><Mail size={14} /></div>
                      <span className="text-sm text-slate-300">{data.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-700 rounded-full"><User size={14} /></div>
                      <span className="text-sm text-slate-300">{data.contact.location}</span>
                    </div>
                </div>
             </div>
          </section>

        </div>

        {/* --- THE CHARACTER --- */}
        <div 
          className="absolute bottom-[20%] left-[50%] md:left-[15%] transform -translate-x-1/2 z-20 pointer-events-none transition-all duration-300"
          style={{ 
             // Minor parallax for character to make it feel like it's traversing
             transform: `translateX(${progress * 2}px) translateY(${isWalking ? '-5px' : '0'})` 
          }}
        >
          {/* Simple CSS Geometric Character */}
          <div className={`relative transition-transform duration-200 ${isWalking ? 'scale-105' : 'scale-100'}`}>
            {/* Body Aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-500/20 blur-xl rounded-full"></div>
            
            {/* Robot Head */}
            <div className="w-12 h-10 bg-slate-200 rounded-xl relative shadow-lg z-10 flex items-center justify-center border-b-4 border-slate-300">
               {/* Eyes */}
               <div className="flex gap-2">
                 <div className={`w-2 h-2 bg-blue-500 rounded-full ${isWalking ? 'animate-pulse' : ''}`}></div>
                 <div className={`w-2 h-2 bg-blue-500 rounded-full ${isWalking ? 'animate-pulse' : ''}`}></div>
               </div>
               {/* Antenna */}
               <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1 h-3 bg-slate-400"></div>
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
            </div>
            
            {/* Robot Body */}
            <div className="w-8 h-10 bg-slate-300 mx-auto -mt-1 rounded-b-lg relative z-0">
               <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-400/50 rounded-full"></div>
            </div>
            
            {/* Legs (Animated via CSS classes in style tag below) */}
            <div className="flex justify-center gap-2 -mt-1">
               <div className={`w-2 h-4 bg-slate-400 rounded-b-full transition-all ${isWalking ? 'h-3 translate-y-1' : 'h-4'}`}></div>
               <div className={`w-2 h-4 bg-slate-400 rounded-b-full transition-all ${isWalking ? 'h-4 -translate-y-1' : 'h-3'}`}></div>
            </div>
          </div>
        </div>

        {/* --- FLOOR --- */}
        <div className="absolute bottom-[10%] left-0 right-0 h-px bg-slate-700 shadow-[0_0_20px_rgba(59,130,246,0.3)]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-gradient-to-t from-slate-900 to-transparent"></div>

        {/* --- HUD / UI --- */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-50">
           {/* Chapter Indicator */}
           <div className="flex gap-2">
              {chapters.map((c) => (
                <div 
                  key={c.id} 
                  className={`h-1 rounded-full transition-all duration-500 ${activeChapter === c.id ? 'w-8 bg-blue-500' : 'w-2 bg-slate-700'}`}
                ></div>
              ))}
              <span className="ml-2 text-xs font-mono text-slate-500 uppercase">
                {chapters[activeChapter].title}
              </span>
           </div>

           {/* Controls */}
           <button 
             onClick={onExit}
             className="group flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-full text-xs font-bold hover:bg-white hover:text-black transition-all"
           >
             <span>SKIP STORY</span>
             <SkipForward size={14} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
        
        <div className="absolute bottom-6 left-6 text-[10px] text-slate-600 font-mono hidden md:block">
           POS: {Math.round(progress)}% | VEL: {isWalking ? 'MOVING' : 'IDLE'} | MODE: NARRATIVE
        </div>

      </div>
    </div>
  );
};

export default StoryMode;