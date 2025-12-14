import { ResumeData } from './types';

export const resumeData: ResumeData = {
  name: "RAJATH KIRAN A",
  role: "Computer Science & Engineering Student",
  contact: {
    email: "rajathajeru@gmail.com",
    phone: "+91-7483975463",
    location: "Ganesh Nilaya, Ajeru Malya House, Punacha, DK – 574243"
  },
  objective: "Aspiring Computer Science Engineer with strong foundation in Data Structures & Algorithms and full-stack web development. Passionate about creating innovative solutions through UI/UX design and modern web technologies. Seeking opportunities to contribute to impactful projects whilst continuously enhancing technical expertise.",
  education: [
    {
      degree: "Bachelor of Engineering in Computer Science & Engineering",
      institution: "Vivekananda College of Engineering & Technology, Puttur, Karnataka",
      year: "2023 – 2027",
      score: "Current CGPA: 8.8/10.0"
    },
    {
      degree: "Pre-University Course (Science)",
      institution: "Narendra PU College, Puttur",
      year: "2023",
      score: "Percentage: 93.33%"
    },
    {
      degree: "Secondary School Leaving Certificate",
      institution: "Morarji Desai School, Macchina",
      year: "2021",
      score: "Percentage: 98.08%"
    }
  ],
  skills: [
    { category: "Programming Languages", items: "C, C++, Java, JavaScript" },
    { category: "Web Development", items: "HTML5, CSS3, React.js, RESTful APIs, Responsive Design" },
    { category: "Core Competencies", items: "Data Structures & Algorithms, Object-Oriented Programming, UI/UX Design" },
    { category: "Development Tools", items: "Git/GitHub, VS Code, Postman, Netlify, Supabase" },
    { category: "Design Tools", items: "Figma, Canva" },
    { category: "Operating Systems", items: "Linux, Windows" }
  ],
  projects: [
    {
      title: "MediQ – Comprehensive Healthcare Application",
      techStack: "React.js, Supabase, REST APIs",
      description: "Developed a full-featured healthcare platform with appointment booking system, real-time hospital locator using geolocation APIs, secure file upload functionality, emergency contact management, and QR code-based medicine scanning feature."
    },
    {
      title: "Englisho – Interactive English Learning Platform for Children",
      techStack: "HTML, CSS, JavaScript",
      description: "Created an engaging educational platform featuring interactive quizzes, text-to-speech functionality, and language conversion tools.",
      award: "Winner at I² CONNECT-2K24, IEEE VCET Student Competition."
    },
    {
      title: "TextUtils – Advanced Text Processing Tool",
      techStack: "React.js",
      description: "Built a comprehensive text manipulation application with case conversion, word/character counting, text-to-speech integration, and dark mode functionality.",
      links: {
        github: "github.com/Rajath2005/textutils.io",
        live: "rajath2005.github.io/textutils.io"
      }
    },
    {
      title: "Portfolio Website",
      techStack: "HTML, CSS, JavaScript",
      description: "Designed and developed a responsive personal portfolio showcasing technical skills and project implementations.",
      links: {
        live: "rajathkiran.netlify.app"
      }
    }
  ],
  certifications: [
    { name: "Data Structures & Algorithms – Infosys Springboard", date: "May 2025" },
    { name: "Responsive Web Design Certification – freeCodeCamp", date: "February 2025" },
    { name: "Elements of Artificial Intelligence – University of Helsinki", date: "January 2025" },
    { name: "Programming in C++ – Infosys Springboard", date: "November 2024" },
    { name: "Linux for Beginners – Infosys Springboard", date: "September 2024" },
    { name: "Winner – I² CONNECT-2K24, IEEE VCET Student Competition", date: "May 2024" }
  ],
  languages: "English, Hindi, Kannada, Konkani",
  interests: "Problem Solving, UI/UX Design, Open Source Contribution, Competitive Programming"
};