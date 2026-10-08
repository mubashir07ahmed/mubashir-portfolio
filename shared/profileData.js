// Single editable source of truth for Mubashir Ahmed's verified profile facts.
export const profileData = {
  name: 'Mubashir Ahmed',
  role: 'B.Tech Internet of Things (IoT) Student',
  headline: 'B.Tech IoT student building intelligent and practical digital solutions.',
  intro: 'I’m passionate about Artificial Intelligence, Machine Learning, full-stack development, software engineering, IoT, and problem solving. I enjoy turning ideas into useful applications and continuously learning how technology works behind the scenes.',
  education: 'B.Tech in Internet of Things (IoT) — Expected 2029',
  institution: 'VNR Vignana Jyothi Institute of Engineering and Technology (VNR VJIET)',
  location: 'Hyderabad, Telangana, India',
  interests: [
    'Artificial Intelligence', 'Machine Learning', 'Internet of Things',
    'Full-stack development', 'Chatbot development', 'Software engineering',
    'Automation', 'Problem solving',
  ],
  languages: ['C', 'Java', 'Python', 'JavaScript'],
  technologies: ['HTML', 'CSS', 'JavaScript', 'AI APIs', 'Chatbot Development', 'Full-Stack Development', 'MySQL'],
  csTopics: [
    'Data Structures and Algorithms', 'Problem Solving', 'Object-Oriented Programming',
  ],
  profileSummary: 'Mubashir Ahmed is a B.Tech Internet of Things student at VNR VJIET who builds AI-powered and full-stack applications, explores chatbot development, and enjoys solving practical problems through software.',
  careerGoal: 'To grow as an AI/ML, full-stack, and IoT developer while building meaningful applications that solve real-world problems.',
  resumePath: '/resume/Mubashir-Ahmed-Resume.pdf',
  contact: {
    email: 'mubashir07ahmed@gmail.com',
    github: 'https://github.com/mubashir07ahmed',
    linkedin: 'https://www.linkedin.com/in/mubashir-ahmed-604145339/',
  },
  codingProfiles: {
    github: 'https://github.com/mubashir07ahmed',
    leetcode: 'https://leetcode.com/u/mubashir07ahmed/',
    hackerrank: '',
    codechef: '',
    linkedin: 'https://www.linkedin.com/in/mubashir-ahmed-604145339/',
  },
  achievements: [
    { title: 'Prompt Craft — Winner', organization: 'Indian Society for Technical Education · VNR VJIET', logo: '/logos/iste.jpg', detail: 'Winner of the Prompt Craft event organized by the ISTE student chapter.' },
    { title: 'SynthVision Hackathon — Finalist', organization: 'Krithomedh AI/ML & IoT Club · VNR VJIET', logo: '/logos/krithomedh.jpg', detail: 'Finalist in the SynthVision Hackathon, collaborating on a technology-focused solution.' },
  ],
  chat: {
    welcome: 'Hi — I’m the AI Chatbot on Mubashir’s portfolio. Ask about me, Mubashir’s work, skills, education, projects, achievements, or resume. I can also handle short everyday questions.',
    unknown: 'That information has not been added to Mubashir’s portfolio yet.',
    profileNote: 'This answer is specific to Mubashir’s profile.',
    suggestions: [
      'What is Mubashir currently studying?',
      'What projects has Mubashir built?',
      'What skills and technologies does Mubashir use?',
      'What achievements has Mubashir earned?',
      'Can I view or download Mubashir’s resume?',
      'How can I contact Mubashir?',
      'What is Mubashir practicing in Data Structures and Algorithms?',
      'What is 2 + 2?',
      'What are you?',
    ],
  },
};

export const skillGroups = [
  { title: 'Programming languages', icon: 'code', items: ['C', 'Java', 'Python', 'JavaScript'] },
  { title: 'Web development', icon: 'layers', items: ['HTML', 'CSS', 'JavaScript', 'Full-Stack Development'] },
  { title: 'AI & development', icon: 'sparkles', items: ['AI APIs', 'Chatbot Development', 'Artificial Intelligence', 'Machine Learning'] },
  { title: 'Databases & tools', icon: 'wrench', items: ['MySQL', 'Git', 'GitHub', 'APIs', 'Automation'] },
  { title: 'Computer science', icon: 'binary', items: ['Data Structures & Algorithms', 'Problem Solving', 'Object-Oriented Programming'] },
  { title: 'IoT & emerging tech', icon: 'server', items: ['Internet of Things', 'AI-powered Applications', 'Full-Stack Development', 'Automation'] },
];

export const projectPlaceholders = [
  {
    title: 'AI Full-Stack Chatbot',
    description: 'An AI-powered chatbot developed as part of the AI Full Stack Course at VNR VJIET, covering frontend, backend, API integration, and chatbot functionality.',
    categories: ['AI/ML', 'Full Stack'],
    technologies: ['AI APIs', 'JavaScript', 'Full-Stack Development', 'Chatbot Development'],
    githubUrl: '', liveDemoUrl: '', previewImage: '', placeholder: false,
  },
  {
    title: 'Local AI Question Solver',
    description: 'A local AI-powered question-solving system that extracts questions from webpages and generates and inserts answers through a local backend API and browser-side automation.',
    categories: ['AI/ML', 'Experiments'],
    technologies: ['Python', 'AI APIs', 'Backend API', 'Browser Automation'],
    githubUrl: '', liveDemoUrl: '', previewImage: '', placeholder: false,
  },
  {
    title: 'AI Answer Generator',
    description: 'An AI-powered tool that accepts question PDFs, generates structured answers, and creates clean, formatted answer PDFs for organized study material.',
    categories: ['AI/ML', 'Academic'],
    technologies: ['Python', 'PDF Processing', 'AI APIs', 'Automation'],
    githubUrl: '', liveDemoUrl: '', previewImage: '', placeholder: false,
  },
  {
    title: 'Python To-Do App',
    description: 'A practical Python application for adding, viewing, updating, and managing daily tasks through a simple task-management workflow.',
    categories: ['Academic', 'Full Stack'],
    technologies: ['Python', 'Application Development'],
    githubUrl: '', liveDemoUrl: '', previewImage: '', placeholder: false,
  },
  {
    title: 'Campus Lost & Found Match Desk',
    description: 'A full-stack platform in development for students to report, search, and match lost and found items with a practical campus experience in mind.',
    categories: ['Full Stack', 'Academic'],
    technologies: ['JavaScript', 'Full-Stack Development', 'Matching Workflows'],
    githubUrl: '', liveDemoUrl: '', previewImage: '', placeholder: false,
  },
];

export const learningJourney = [
  { title: 'B.Tech in Internet of Things (IoT)', detail: 'VNR VJIET · Expected graduation 2029', kind: 'education' },
  { title: 'Building AI-powered applications', detail: 'Developing chatbots, question solvers, answer generators, and practical automation tools.', kind: 'building' },
  { title: 'Exploring full-stack development', detail: 'Working across frontend, backend, APIs, databases, and browser-side automation.', kind: 'learning' },
  { title: 'Growing through competitions', detail: 'Prompt Craft winner and SynthVision Hackathon finalist at VNR VJIET.', kind: 'growth' },
  { title: 'Continuously improving', detail: 'Strengthening problem solving, teamwork, communication, and analytical thinking.', kind: 'exploring' },
];

export const codingInterests = [
  'Data Structures and Algorithms', 'Problem Solving', 'Object-Oriented Programming',
  'Artificial Intelligence', 'Machine Learning', 'Internet of Things',
  'Full-Stack Development', 'Chatbot Development', 'AI APIs', 'Automation',
];
