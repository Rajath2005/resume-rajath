import React, { useState } from 'react';
import { ResumeData, Project, Education, Certification, ContactInfo, SkillCategory } from '../types';
import { Mail, Phone, MapPin, Github, Globe, Plus, Trash2, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';

interface ResumeProps {
  data: ResumeData;
  isEditing?: boolean;
  onUpdate?: (data: ResumeData) => void;
  onCommit?: (data: ResumeData) => void;
}

// Helper Component for Editable Text
const Editable: React.FC<{
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  isEditing: boolean;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}> = ({ value, onChange, onBlur, isEditing, className = "", multiline = false, placeholder = "" }) => {
  if (!isEditing) return <span className={className}>{value}</span>;
  
  const commonClasses = `bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors rounded px-1 -mx-1 outline-none border-b-2 border-transparent focus:border-blue-400 focus:bg-white dark:focus:bg-slate-800 ${className}`;
  
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`${commonClasses} resize-y w-full min-h-[1.5em] text-inherit bg-transparent`}
        placeholder={placeholder}
        rows={3}
      />
    );
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      className={`${commonClasses} w-full text-inherit bg-transparent`}
      placeholder={placeholder}
    />
  );
};

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-[14px] font-bold uppercase tracking-wider text-[#1a365d] dark:text-blue-400 border-b-[1.5px] border-[#1a365d] dark:border-blue-400 mb-3 mt-5 pb-0.5 print:text-black print:border-black transition-colors duration-300">
    {title}
  </h2>
);

const Resume: React.FC<ResumeProps> = ({ data, isEditing = false, onUpdate, onCommit }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Helpers for updating state
  const updateData = (updates: Partial<ResumeData>, commit = false) => {
    if (!onUpdate) return;
    const newData = { ...data, ...updates };
    onUpdate(newData);
    if (commit && onCommit) onCommit(newData);
  };

  const handleBlur = () => {
    if (onCommit) onCommit(data);
  };

  const updateContact = (field: keyof ContactInfo, val: string) => {
    updateData({ contact: { ...data.contact, [field]: val } });
  };

  // Interaction Helpers
  const copyToClipboard = (text: string, fieldName: string) => {
    if (isEditing) return; // Don't copy while editing
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Education Helpers
  const updateEducation = (index: number, field: keyof Education, val: string) => {
    const newEdu = [...data.education];
    newEdu[index] = { ...newEdu[index], [field]: val };
    updateData({ education: newEdu });
  };

  const addEducation = () => {
    updateData({ education: [...data.education, { degree: "Degree Name", institution: "Institution Name", year: "Year", score: "Score" }] }, true);
  };

  const removeEducation = (index: number) => {
    updateData({ education: data.education.filter((_, i) => i !== index) }, true);
  };

  // Skills Helpers (Dynamic)
  const updateSkill = (index: number, field: keyof SkillCategory, val: string) => {
    const newSkills = [...data.skills];
    newSkills[index] = { ...newSkills[index], [field]: val };
    updateData({ skills: newSkills });
  };

  const addSkillCategory = () => {
    updateData({ skills: [...data.skills, { category: "New Category", items: "Skill 1, Skill 2" }] }, true);
  };

  const removeSkillCategory = (index: number) => {
    updateData({ skills: data.skills.filter((_, i) => i !== index) }, true);
  };

  // Project Helpers
  const updateProject = (index: number, field: keyof Project, val: string) => {
    const newProjs = [...data.projects];
    newProjs[index] = { ...newProjs[index], [field]: val };
    updateData({ projects: newProjs });
  };

  const updateProjectLink = (index: number, type: 'github' | 'live', val: string) => {
    const newProjs = [...data.projects];
    const links = newProjs[index].links || {};
    newProjs[index] = { ...newProjs[index], links: { ...links, [type]: val } };
    updateData({ projects: newProjs });
  };

  const addProject = () => {
    updateData({ projects: [...data.projects, { title: "New Project – Tech Stack", techStack: "Technologies", description: "Description..." }] }, true);
  };

  const removeProject = (index: number) => {
    updateData({ projects: data.projects.filter((_, i) => i !== index) }, true);
  };

  // Certification Helpers
  const updateCert = (index: number, field: keyof Certification, val: string) => {
    const newCerts = [...data.certifications];
    newCerts[index] = { ...newCerts[index], [field]: val };
    updateData({ certifications: newCerts });
  };

  const addCert = () => {
    updateData({ certifications: [...data.certifications, { name: "Certification Name", date: "Date" }] }, true);
  };

  const removeCert = (index: number) => {
    updateData({ certifications: data.certifications.filter((_, i) => i !== index) }, true);
  };


  return (
    <div 
      id="resume-content"
      // Responsive Classes:
      // Mobile: w-full, min-h-screen, p-5 (Full width native feel)
      // Desktop (md+): w-[210mm], min-h-[297mm], p-[10mm] (A4 Paper look)
      className="bg-white dark:bg-slate-900 shadow-none md:shadow-2xl dark:shadow-black/50 mx-auto p-5 md:p-[10mm] text-ink dark:text-gray-200 relative print:shadow-none print:mx-0 print:w-full print:p-[10mm] w-full md:w-[210mm] min-h-screen md:min-h-[297mm] group/resume transition-colors duration-300"
      style={{
        fontFamily: "'Merriweather', serif",
      }}
    >
      {/* Decorative top bar for screen only */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 print:hidden opacity-80 dark:opacity-60"></div>

      {/* Header */}
      <header className="text-center mb-6 animate-fade-in">
        <div className="text-2xl md:text-[28px] font-bold text-[#1e3a8a] dark:text-blue-300 mb-1 print:text-black uppercase tracking-wide">
          <Editable isEditing={isEditing} value={data.name} onChange={(v) => updateData({ name: v })} onBlur={handleBlur} />
        </div>
        <div className="text-sm md:text-[14px] text-gray-700 dark:text-gray-300 font-sans mb-2 print:text-black font-medium">
          <Editable isEditing={isEditing} value={data.role} onChange={(v) => updateData({ role: v })} onBlur={handleBlur} />
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs md:text-[13px] font-sans text-gray-700 dark:text-gray-400 print:text-black">
          <div 
            className={`flex items-center transition-all duration-200 group rounded px-2 py-0.5 ${!isEditing ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300' : ''}`}
            onClick={() => copyToClipboard(data.contact.email, 'email')}
            title="Click to copy email"
          >
            {copiedField === 'email' ? <CheckCircle2 size={12} className="mr-1.5 text-green-500" /> : <Mail size={12} className="mr-1.5 opacity-70 group-hover:opacity-100" />}
            <Editable isEditing={isEditing} value={data.contact.email} onChange={(v) => updateContact('email', v)} onBlur={handleBlur} className="border-b border-transparent" />
          </div>
          <span className="text-gray-400 dark:text-gray-600 hidden sm:inline">•</span>
          <div 
            className={`flex items-center transition-all duration-200 group rounded px-2 py-0.5 ${!isEditing ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300' : ''}`}
            onClick={() => copyToClipboard(data.contact.phone, 'phone')}
            title="Click to copy phone"
          >
            {copiedField === 'phone' ? <CheckCircle2 size={12} className="mr-1.5 text-green-500" /> : <Phone size={12} className="mr-1.5 opacity-70 group-hover:opacity-100" />}
            <Editable isEditing={isEditing} value={data.contact.phone} onChange={(v) => updateContact('phone', v)} onBlur={handleBlur} className="border-b border-transparent" />
          </div>
        </div>
        
        <div className="flex justify-center items-center mt-1 text-xs md:text-[13px] font-sans text-gray-600 dark:text-gray-400 print:text-black">
           <MapPin size={12} className="mr-1.5 opacity-70" />
           <Editable isEditing={isEditing} value={data.contact.location} onChange={(v) => updateContact('location', v)} onBlur={handleBlur} />
        </div>
      </header>

      <div className="text-sm md:text-[13px] leading-relaxed text-justify">
        
        {/* Career Objective */}
        <section className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <SectionTitle title="Career Objective" />
          <div className="font-sans text-gray-800 dark:text-gray-300 print:text-black">
            <Editable isEditing={isEditing} multiline value={data.objective} onChange={(v) => updateData({ objective: v })} onBlur={handleBlur} />
          </div>
        </section>

        {/* Education */}
        <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <SectionTitle title="Education" />
          <div className="space-y-3 font-sans">
            {data.education.map((edu, idx) => (
              <div key={idx} className="group relative hover:bg-gray-50/50 dark:hover:bg-gray-800/30 p-2 rounded -mx-2 transition-colors">
                 {isEditing && (
                  <button 
                    onClick={() => removeEducation(idx)} 
                    className="absolute -right-6 top-0 text-red-400 hover:text-red-600 p-1 print:hidden opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Education"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <div className="flex flex-col sm:flex-row sm:justify-between font-bold text-gray-900 dark:text-gray-100 print:text-black print:flex-row print:justify-between">
                  <Editable isEditing={isEditing} value={edu.degree} onChange={(v) => updateEducation(idx, 'degree', v)} onBlur={handleBlur} />
                  <Editable isEditing={isEditing} value={edu.year} onChange={(v) => updateEducation(idx, 'year', v)} onBlur={handleBlur} className="text-left sm:text-right print:text-right" />
                </div>
                <div className="text-gray-800 dark:text-gray-300 italic print:text-black font-serif">
                  <Editable isEditing={isEditing} value={edu.institution} onChange={(v) => updateEducation(idx, 'institution', v)} onBlur={handleBlur} />
                </div>
                <div className="text-gray-700 dark:text-gray-400 text-[12px] print:text-black">
                  <Editable isEditing={isEditing} value={edu.score} onChange={(v) => updateEducation(idx, 'score', v)} onBlur={handleBlur} />
                </div>
              </div>
            ))}
            {isEditing && (
              <button onClick={addEducation} className="w-full py-2 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex justify-center items-center gap-2 mt-2 print:hidden">
                <Plus size={14} /> Add Education
              </button>
            )}
          </div>
        </section>

        {/* Technical Skills - Now Dynamic */}
        <section className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <SectionTitle title="Technical Skills" />
          <ul className="list-disc list-outside ml-4 space-y-1.5 font-sans text-gray-800 dark:text-gray-300 print:text-black marker:text-gray-500 dark:marker:text-gray-500">
            {data.skills.map((skill, idx) => (
              <li key={idx} className="group relative hover:bg-gray-50/50 dark:hover:bg-gray-800/30 -mx-2 p-2 rounded pl-7 -ml-6 transition-all duration-200">
                 {isEditing && (
                  <button 
                    onClick={() => removeSkillCategory(idx)} 
                    className="absolute -right-6 top-0 text-red-400 hover:text-red-600 p-1 print:hidden opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Category"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <span className="font-bold text-gray-900 dark:text-gray-100 print:text-black">
                  <Editable isEditing={isEditing} value={skill.category} onChange={(v) => updateSkill(idx, 'category', v)} onBlur={handleBlur} />:
                </span>{' '}
                <Editable isEditing={isEditing} value={skill.items} onChange={(v) => updateSkill(idx, 'items', v)} onBlur={handleBlur} />
              </li>
            ))}
            {isEditing && (
              <button onClick={addSkillCategory} className="w-full py-2 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex justify-center items-center gap-2 mt-2 ml-[-1rem] w-[calc(100%+1rem)] print:hidden">
                <Plus size={14} /> Add Skill Category
              </button>
            )}
          </ul>
        </section>

        {/* Projects */}
        <section className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <SectionTitle title="Projects" />
          <div className="space-y-4 font-sans">
            {data.projects.map((proj, idx) => (
              <div key={idx} className="relative transition-all duration-200 group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 p-2 rounded -mx-2">
                 {isEditing && (
                  <button 
                    onClick={() => removeProject(idx)} 
                    className="absolute -right-6 top-0 text-red-400 hover:text-red-600 p-1 print:hidden opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Project"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <div className="flex justify-between items-baseline mb-0.5">
                  <div className="font-bold text-[13.5px] text-gray-900 dark:text-gray-100 print:text-black w-full flex items-center gap-2">
                    <Editable isEditing={isEditing} value={proj.title} onChange={(v) => updateProject(idx, 'title', v)} onBlur={handleBlur} placeholder="Project Name – Subtitle" />
                  </div>
                </div>
                <div className="italic text-[12px] text-gray-600 dark:text-gray-400 print:text-black font-serif mb-0.5">
                  <Editable isEditing={isEditing} value={proj.techStack} onChange={(v) => updateProject(idx, 'techStack', v)} onBlur={handleBlur} placeholder="Tech Stack" />
                </div>
                <div className="text-gray-800 dark:text-gray-300 mb-1 print:text-black">
                  <Editable isEditing={isEditing} multiline value={proj.description} onChange={(v) => updateProject(idx, 'description', v)} onBlur={handleBlur} placeholder="Project Description" />
                  {proj.award && (
                    <div className="font-bold text-gray-900 dark:text-gray-100 print:text-black mt-1 flex items-start gap-1">
                      <span className="font-normal text-gray-500 dark:text-gray-400 mr-1 text-xs whitespace-nowrap">[Award]</span>
                      <Editable isEditing={isEditing} value={proj.award} onChange={(v) => updateProject(idx, 'award', v)} onBlur={handleBlur} />
                    </div>
                  )}
                  {isEditing && !proj.award && (
                    <button 
                      onClick={() => updateProject(idx, 'award', 'Award Name')} 
                      className="text-[10px] text-blue-400 hover:text-blue-600 mt-1 block print:hidden"
                    >
                      + Add Award
                    </button>
                  )}
                </div>
                
                {/* Links Section for Projects */}
                <div className="flex gap-4 mt-2 text-[12px]">
                   <div className={`flex items-center text-blue-700 dark:text-blue-400 print:text-black ${!isEditing && proj.links?.github ? 'hover:underline cursor-pointer group/link' : ''}`}>
                     <Github size={10} className="mr-1 print:hidden" />
                     <span className="font-semibold text-gray-900 dark:text-gray-200 print:font-normal mr-1">GitHub:</span>
                     {isEditing ? (
                       <Editable isEditing={true} value={proj.links?.github || ''} onChange={(v) => updateProjectLink(idx, 'github', v)} onBlur={handleBlur} placeholder="username/repo" className="min-w-[100px]" />
                     ) : (
                       <a href={`https://${proj.links?.github}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                         {proj.links?.github}
                         {proj.links?.github && <ExternalLink size={8} className="ml-1 opacity-0 group-hover/link:opacity-100 transition-opacity print:hidden" />}
                       </a>
                     )}
                   </div>
                   <div className={`flex items-center text-blue-700 dark:text-blue-400 print:text-black ${!isEditing && proj.links?.live ? 'hover:underline cursor-pointer group/link' : ''}`}>
                     <Globe size={10} className="mr-1 print:hidden" />
                     <span className="font-semibold text-gray-900 dark:text-gray-200 print:font-normal mr-1">Live:</span>
                     {isEditing ? (
                       <Editable isEditing={true} value={proj.links?.live || ''} onChange={(v) => updateProjectLink(idx, 'live', v)} onBlur={handleBlur} placeholder="website.com" className="min-w-[100px]" />
                     ) : (
                       <a href={`https://${proj.links?.live}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                         {proj.links?.live}
                         {proj.links?.live && <ExternalLink size={8} className="ml-1 opacity-0 group-hover/link:opacity-100 transition-opacity print:hidden" />}
                       </a>
                     )}
                   </div>
                </div>
              </div>
            ))}
             {isEditing && (
              <button onClick={addProject} className="w-full py-2 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex justify-center items-center gap-2 mt-2 print:hidden">
                <Plus size={14} /> Add Project
              </button>
            )}
          </div>
        </section>

        {/* Certifications */}
        <section className="animate-slide-up" style={{ animationDelay: '500ms' }}>
          <SectionTitle title="Certifications & Achievements" />
          <ul className="space-y-1.5 font-sans">
            {data.certifications.map((cert, idx) => (
               <li key={idx} className="flex justify-between items-start text-gray-800 dark:text-gray-300 print:text-black group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 p-2 rounded -mx-2 relative transition-colors">
                 {isEditing && (
                  <button 
                    onClick={() => removeCert(idx)} 
                    className="absolute -right-6 top-0 text-red-400 hover:text-red-600 p-1 print:hidden opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove Certification"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                 <div className="flex flex-col sm:flex-row sm:items-start w-full">
                   <div className="flex items-start w-full">
                     <span className="mr-2 text-gray-500 dark:text-gray-500">•</span>
                     <Editable isEditing={isEditing} value={cert.name} onChange={(v) => updateCert(idx, 'name', v)} onBlur={handleBlur} className="w-full" />
                   </div>
                   <span className="text-gray-600 dark:text-gray-400 italic whitespace-nowrap ml-0 sm:ml-4 pl-4 sm:pl-0 font-serif text-[12px] print:text-black print:ml-4">
                     <Editable isEditing={isEditing} value={cert.date} onChange={(v) => updateCert(idx, 'date', v)} onBlur={handleBlur} />
                   </span>
                 </div>
               </li>
            ))}
             {isEditing && (
              <button onClick={addCert} className="w-full py-2 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex justify-center items-center gap-2 mt-2 print:hidden">
                <Plus size={14} /> Add Certificate
              </button>
            )}
          </ul>
        </section>

        {/* Additional Info */}
        <section className="animate-slide-up" style={{ animationDelay: '600ms' }}>
          <SectionTitle title="Additional Information" />
          <ul className="font-sans space-y-1 text-gray-800 dark:text-gray-300 print:text-black">
            <li><span className="font-bold text-gray-900 dark:text-gray-100 print:text-black">Languages:</span> <Editable isEditing={isEditing} value={data.languages} onChange={(v) => updateData({ languages: v })} onBlur={handleBlur} /></li>
            <li><span className="font-bold text-gray-900 dark:text-gray-100 print:text-black">Interests:</span> <Editable isEditing={isEditing} value={data.interests} onChange={(v) => updateData({ interests: v })} onBlur={handleBlur} /></li>
          </ul>
        </section>
      </div>

      {/* Footer Page Number Simulation */}
      <div className="absolute bottom-8 left-0 right-0 text-center text-[12px] text-gray-400 dark:text-gray-600 font-serif print:text-black print:bottom-4">
        1
      </div>
    </div>
  );
};

export default Resume;