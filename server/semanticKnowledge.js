import { codingInterests, learningJourney, projectPlaceholders, profileData, skillGroups } from '../shared/profileData.js';

const list = (values) => values.join(', ');

export const portfolioKnowledge = [
  {
    id: 'identity',
    text: `${profileData.name} is ${profileData.role}. ${profileData.headline} ${profileData.profileSummary}`,
    answer: `${profileData.name} is a ${profileData.role.toLowerCase()} based in ${profileData.location}. ${profileData.intro}`,
  },
  {
    id: 'education',
    text: `${profileData.name} is studying ${profileData.education} at ${profileData.institution} in ${profileData.location}. He is a second-year IoT student with an expected graduation year of 2029.`,
    answer: `${profileData.name} is pursuing ${profileData.education} at ${profileData.institution} in ${profileData.location}.`,
  },
  {
    id: 'interests',
    text: `${profileData.name} is interested in ${list(profileData.interests)}. He enjoys building practical applications that combine intelligent systems, full-stack development, IoT, automation, and problem solving.`,
    answer: `His main interests include ${list(profileData.interests)}.`,
  },
  {
    id: 'building-interests',
    text: `What kinds of things does ${profileData.name} enjoy building? He enjoys building AI-powered applications, full-stack applications, chatbots, question solvers, answer generators, automation tools, and practical IoT experiences that turn ideas into useful workflows.`,
    answer: `He enjoys building AI-powered, full-stack, chatbot, automation, and IoT applications that turn ideas into useful workflows.`,
  },
  {
    id: 'programming-languages',
    text: `${profileData.name} works with these programming languages: ${list(profileData.languages)}.`,
    answer: `His programming languages include ${list(profileData.languages)}.`,
  },
  {
    id: 'technologies',
    text: `${profileData.name} uses these technologies: ${list(profileData.technologies)}.`,
    answer: `His technologies include ${list(profileData.technologies)}.`,
  },
  {
    id: 'computer-science',
    text: `His computer science topics include ${list(profileData.csTopics)} and the coding interests shown on the portfolio include ${list(codingInterests)}.`,
    answer: `The portfolio highlights ${list(profileData.csTopics)} along with ${list(codingInterests)}.`,
  },
  ...skillGroups.map((group) => ({
    id: `skills-${group.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    text: `${group.title} skills: ${list(group.items)}.`,
    answer: `${group.title}: ${list(group.items)}.`,
  })),
  ...projectPlaceholders.map((project) => ({
    id: `project-${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    text: `${project.title}. ${project.description} Categories: ${list(project.categories)}. Technologies: ${list(project.technologies)}.`,
    answer: `${project.title}: ${project.description} Technologies include ${list(project.technologies)}.`,
  })),
  ...learningJourney.map((item) => ({
    id: `journey-${item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    text: `${item.title}. ${item.detail}`,
    answer: `${item.title}: ${item.detail}.`,
  })),
  ...profileData.achievements.map((achievement) => ({
    id: `achievement-${achievement.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    text: `${achievement.title}. ${achievement.organization}. ${achievement.detail}`,
    answer: `${achievement.title} at ${achievement.organization}. ${achievement.detail}`,
  })),
  {
    id: 'competitions',
    text: `${profileData.name} has competition achievements and events: he was a winner at Prompt Craft through the ISTE student chapter and a finalist at the SynthVision Hackathon through the Krithomedh AI/ML and IoT Club at VNR VJIET.`,
    answer: `He was a Prompt Craft winner and a SynthVision Hackathon finalist at VNR VJIET.`,
  },
  {
    id: 'career-goal',
    text: `What is ${profileData.name}'s main goal, future goal, or career goal? ${profileData.careerGoal}`,
    answer: profileData.careerGoal,
  },
  {
    id: 'profile-summary',
    text: profileData.profileSummary,
    answer: profileData.profileSummary,
  },
  {
    id: 'contact',
    text: `Mubashir's contact details are email ${profileData.contact.email}, GitHub ${profileData.contact.github}, and LinkedIn ${profileData.contact.linkedin}.`,
    answer: `You can contact Mubashir at ${profileData.contact.email}. His GitHub is ${profileData.contact.github} and his LinkedIn is ${profileData.contact.linkedin}.`,
    actions: [
      { label: 'Go to contact form', href: '#contact' },
      { label: 'GitHub', href: profileData.contact.github },
      { label: 'LinkedIn', href: profileData.contact.linkedin },
    ],
  },
  {
    id: 'coding-profiles',
    text: `Mubashir's public coding profiles include GitHub ${profileData.codingProfiles.github}, LeetCode ${profileData.codingProfiles.leetcode}, and LinkedIn ${profileData.codingProfiles.linkedin}.`,
    answer: `His active public profiles include GitHub, LeetCode, and LinkedIn.`,
  },
  {
    id: 'resume',
    text: `Mubashir's resume covers his IoT education, skills, projects, achievements, and profile links. The resume file is available at ${profileData.resumePath}.`,
    answer: `Mubashir’s resume covers his IoT education, skills, projects, achievements, and profile links.`,
    actions: [
      { label: 'Scroll to resume', href: '#resume' },
      { label: 'View PDF', href: profileData.resumePath },
      { label: 'Download PDF', href: profileData.resumePath },
    ],
  },
  {
    id: 'website',
    text: 'This portfolio website contains the Home, About, Skills, Projects, learning journey, Coding, Resume, Contact, public profile links, and AI Chatbot sections. It uses a readable editorial interface and a terminal-style profile panel.',
    answer: 'This is Mubashir Ahmed’s personal portfolio. It presents his education, skills, projects, learning journey, achievements, resume, contact links, and AI assistant.',
  },
  {
    id: 'assistant',
    text: 'The AI assistant on this portfolio explains Mubashir’s verified profile, projects, skills, education, achievements, resume, contact details, and website content.',
    answer: 'I’m the AI assistant on Mubashir’s portfolio. I can help you explore his education, projects, skills, achievements, resume, contact details, and this website.',
  },
  {
    id: 'headline',
    text: `${profileData.name} is a second-year B.Tech IoT student building intelligent and practical digital solutions.`,
    answer: profileData.headline,
  },
  {
    id: 'personal-introduction',
    text: `${profileData.name} enjoys taking an idea, understanding how it works behind the scenes, and turning it into a useful software or IoT experience. ${profileData.intro}`,
    answer: profileData.intro,
  },
  {
    id: 'location',
    text: `${profileData.name} is based in ${profileData.location}.`,
    answer: `Mubashir is based in ${profileData.location}.`,
  },
  {
    id: 'learning-style',
    text: `${profileData.name} learns by building practical applications, understanding technology behind the scenes, experimenting with AI and full-stack workflows, and continuously improving problem solving, communication, teamwork, and analytical thinking.`,
    answer: 'Mubashir learns by building practical applications, exploring how technology works behind the scenes, and improving through projects and collaboration.',
  },
  {
    id: 'developer-direction',
    text: `${profileData.name} is growing toward AI/ML development, full-stack development, IoT development, software engineering, automation, and practical intelligent applications.`,
    answer: profileData.careerGoal,
  },
  {
    id: 'github-profile',
    text: `Mubashir's GitHub profile is ${profileData.codingProfiles.github}. His GitHub is the public place to explore his code and software work.`,
    answer: `Mubashir’s GitHub profile is ${profileData.codingProfiles.github}.`,
  },
  {
    id: 'leetcode-profile',
    text: `Mubashir's LeetCode profile is ${profileData.codingProfiles.leetcode}. It is the public coding profile associated with his problem-solving practice.`,
    answer: `Mubashir’s LeetCode profile is ${profileData.codingProfiles.leetcode}.`,
  },
  {
    id: 'public-links',
    text: `Mubashir's public links include GitHub, LeetCode, and LinkedIn. HackerRank and CodeChef links are not currently added to the portfolio.`,
    answer: 'The portfolio currently lists public GitHub, LeetCode, and LinkedIn profiles. HackerRank and CodeChef links have not been added.',
  },
  {
    id: 'portfolio-content',
    text: 'The portfolio content covers Mubashir Ahmed’s background, education, skills, projects, learning journey, coding interests, achievements, resume, contact details, public profile links, and AI assistant.',
    answer: 'The portfolio brings together Mubashir’s background, education, skills, projects, learning journey, achievements, resume, contact details, and public profiles.',
  },
  {
    id: 'offline-semantic-assistant',
    text: 'When no API provider is configured, the portfolio assistant uses exact local answers and a local all-MiniLM-L6-v2 semantic search index over verified personal knowledge documents. It understands paraphrased portfolio questions without inventing facts.',
    answer: 'Without an API provider, the assistant uses local verified portfolio answers and semantic search to understand paraphrased questions.',
  },
];
