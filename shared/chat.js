import { codingInterests, learningJourney, projectPlaceholders, profileData, skillGroups } from './profileData.js';

const unknown = () => ({ text: profileData.chat.unknown });
const profileText = (text) => `${text} ${profileData.chat.profileNote}`;
const lower = (rawMessage) => String(rawMessage ?? '').trim().toLowerCase();
const includesAny = (question, terms) => terms.some((term) => question.includes(term));
const validLinks = Object.entries(profileData.codingProfiles)
  .filter(([, url]) => typeof url === 'string' && url.startsWith('https://'));

export function isProfileQuestion(rawMessage) {
  const question = lower(rawMessage);
  if (!question) return true;
  const namesMubashir = /\b(?:mohammed|mubashir|ahmed)\b/.test(question);
  const pageContext = includesAny(question, [
    'portfolio', 'on this page', 'on the website', 'this website', 'site section', 'navigation',
    'about section', 'skills section', 'skill group', 'programming languages', 'projects section', 'learning journey', 'coding profile', 'coding interests',
    'github', 'linkedin', 'leetcode', 'hackerrank', 'codechef', 'vnr', 'vjiet',
    'prompt craft', 'synthvision', 'question solver', 'answer generator', 'lost and found',
    'to-do app', 'full-stack chatbot',
  ]);
  return namesMubashir
    || pageContext
    || /\b(?:what are you|who are you|what is your name|what can you do|how can you help|what do you do|are you (?:an? )?(?:ai|chatbot)|tell me about yourself)\b/.test(question)
    || /\b(?:my|your|his|her)\s+(?:profile|resume|cv|skills?|projects?|work|background|interests?|hobbies|education|career|goals?|experience|contact details?|achievements?|links?)\b/.test(question)
    || /\b(?:who is|tell me about)\s+(?:him|he|mubashir|ahmed|the developer)\b/.test(question)
    || /\b(?:view|download|open|see)\s+(?:the\s+)?(?:resume|cv)\b/.test(question);
}

function projectAnswer(question) {
  const project = projectPlaceholders.find((item) => {
    const title = item.title.toLowerCase();
    return question.includes(title) || title.split(/\s+/).filter((word) => word.length > 3).some((word) => question.includes(word));
  });
  if (project) {
    return profileText(`${project.title}: ${project.description} Technologies include ${project.technologies.join(', ')}.`);
  }
  return profileText(projectPlaceholders.map((item) => `${item.title} — ${item.description}`).join(' '));
}

function skillsAnswer(question) {
  const group = skillGroups.find((item) => question.includes(item.title.toLowerCase().replace('&', 'and')) || question.includes(item.title.toLowerCase()));
  if (group) return profileText(`${group.title}: ${group.items.join(', ')}.`);
  return profileText(`The portfolio groups his skills into ${skillGroups.map((item) => `${item.title} (${item.items.join(', ')})`).join('; ')}.`);
}

export function getProfileAnswer(rawMessage) {
  const question = lower(rawMessage);
  if (!question) return unknown();

  if (includesAny(question, ['what are you', 'who are you', 'what is your name', 'what can you do', 'how can you help', 'what do you do', 'are you an ai', 'are you a chatbot', 'tell me about yourself'])) {
    return { text: profileText('I’m the AI Chatbot on Mubashir Ahmed’s portfolio. I can help visitors, recruiters, and companies explore all of the information presented on this page, including his education, skills, projects, learning journey, achievements, coding profiles, contact details, and resume.') };
  }

  if (/resume|cv|curriculum vitae/.test(question)) {
    return {
      text: profileText('Mubashir’s resume gives a brief overview of his IoT education, skills, projects, achievements, and profile links.'),
      actions: [
        { label: 'Scroll to resume', href: '#resume' },
        { label: 'View PDF', href: profileData.resumePath },
        { label: 'Download PDF', href: profileData.resumePath },
      ],
    };
  }

  if (/contact|email|reach|message|connect/.test(question)) {
    return {
      text: profileText(`You can reach Mubashir at ${profileData.contact.email}. His public profiles are GitHub and LinkedIn.`),
      actions: [
        { label: 'Go to contact form', href: '#contact' },
        { label: 'GitHub', href: profileData.contact.github },
        { label: 'LinkedIn', href: profileData.contact.linkedin },
      ],
    };
  }

  if (includesAny(question, ['github', 'linkedin', 'leetcode', 'hackerrank', 'codechef']) && includesAny(question, ['link', 'profile', 'url', 'account', 'where', 'social', 'coding'])) {
    const links = validLinks.map(([name, url]) => `${name[0].toUpperCase()}${name.slice(1)}: ${url}`).join('; ');
    return { text: profileText(`The portfolio lists these active profile links: ${links}.`) };
  }

  if (/achievement|award|winner|finalist|prompt craft|synthvision/.test(question)) {
    return { text: profileText(profileData.achievements.map((item) => `${item.title} at ${item.organization}. ${item.detail}`).join(' ')) };
  }

  if (/project|portfolio work|built|worked on|application|app|solver|generator|lost and found|to-do/.test(question)) {
    return { text: projectAnswer(question) };
  }

  if (/skill group|category|categories|toolkit|technology|technologies|tool|stack|skill|language|database|frontend|backend|programming|ai and development|computer science|emerging tech/.test(question)) {
    return { text: skillsAnswer(question) };
  }

  if (/journey|timeline|currently|current chapter|learning|studying|course|education|student|study|degree|college|university|2nd year|second year|iot|vnr|vjiet/.test(question)) {
    return { text: profileText(`${profileData.name} is currently pursuing ${profileData.education} at ${profileData.institution}. The learning journey also covers ${learningJourney.slice(1).map((item) => `${item.title.toLowerCase()}: ${item.detail}`).join('; ')}.`) };
  }

  if (/data structure|algorithm|dsa|coding practice|practice|problem solving/.test(question)) {
    return { text: profileText(`The coding interests shown on the page include ${codingInterests.join(', ')}.`) };
  }

  if (/interest|focus|passion|area/.test(question)) {
    return { text: profileText(`His main interests include ${profileData.interests.join(', ')}.`) };
  }

  if (/where|location|located|based/.test(question)) {
    return { text: profileText(`Mubashir is based in ${profileData.location}.`) };
  }

  if (/about|overview|summary|background|who is/.test(question)) {
    return { text: profileText(profileData.profileSummary) };
  }

  if (/section|page|website|navigation|menu/.test(question)) {
    return { text: profileText('The page includes Home, About, Skills, Projects, Experience and learning journey, Coding, Resume, Contact, social profile links, and the AI Chatbot.') };
  }

  return unknown();
}

export function getSimpleAnswer(rawMessage) {
  const question = lower(rawMessage);
  if (/^(?:h+i+|h+e+y+|hello+|good morning|good afternoon|good evening|thanks+|thank you)\b/.test(question)) return { text: 'Hi there! I’m happy to help. You can ask about Mubashir, ask me about myself, or explore any information on this portfolio page.' };
  if (/\b(?:how are you|how is it going|how are things)\b/.test(question)) return { text: 'I’m doing well and ready to help you explore Mubashir’s portfolio.' };
  if (/\b(?:tell me a joke|make me laugh)\b/.test(question)) return { text: 'Why do programmers prefer dark mode? Because light attracts bugs.' };
  if (/\b(?:what are you|who are you|what is this|tell me about yourself)\b/.test(question)) return { text: 'I’m the AI Chatbot on Mubashir Ahmed’s portfolio. I can explain his profile and answer short everyday or technical questions.' };
  if (/\b(?:what can you do|how can you help|what are your capabilities)\b/.test(question)) return { text: 'I can answer questions about every section of Mubashir’s portfolio, including education, skills, projects, achievements, coding profiles, contact details, and resume, plus short everyday or technical questions.' };
  if (/\bwhat is (?:ai|artificial intelligence)\b/.test(question)) return { text: 'AI is the field of building systems that can recognize patterns, make decisions, or generate useful outputs.' };
  if (/\bwhat is (?:machine learning|ml)\b/.test(question)) return { text: 'Machine learning is a way to build systems that learn patterns from data to make predictions or decisions.' };
  if (/\bwhat is react\b/.test(question)) return { text: 'React is a JavaScript library for building interfaces from reusable components.' };
  if (/\bwhat is python\b/.test(question)) return { text: 'Python is a readable general-purpose programming language used for software, automation, data, and AI.' };
  if (/\bwhat is git\b/.test(question)) return { text: 'Git is a version-control tool that records code changes and supports branches and collaboration.' };
  if (/\bwhat is an? api\b/.test(question)) return { text: 'An API is a defined way for software systems to communicate and exchange data.' };
  if (/\bwhat is (?:a )?(?:website|web site)\b/.test(question)) return { text: 'A website is a collection of pages and features that people access through a web browser.' };
  if (/\bwhat is (?:the )?internet\b/.test(question)) return { text: 'The internet is a global network that lets computers and devices communicate and share information.' };
  if (/\bwhat is (?:a )?database\b/.test(question)) return { text: 'A database stores and organizes information so software can save, find, and update it.' };
  if (/\bwhat is (?:iot|internet of things)\b/.test(question)) return { text: 'The Internet of Things connects physical devices and sensors so they can collect and exchange data.' };
  const arithmetic = question.replace(/[?=]/g, '').replace(/^(?:(?:can you|please)\s+)?(?:what is|calculate|solve)\s+/, '').match(/^(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)$/);
  if (arithmetic) {
    const left = Number(arithmetic[1]);
    const right = Number(arithmetic[3]);
    const result = arithmetic[2] === '+' ? left + right : arithmetic[2] === '-' ? left - right : arithmetic[2] === '*' ? left * right : right === 0 ? null : left / right;
    return { text: result === null ? 'That calculation is not defined.' : `The answer is ${Number.isInteger(result) ? result : Number(result.toFixed(4))}.` };
  }
  return { text: 'I’m focused on Mubashir’s profile and portfolio, plus simple questions. Ask about any page section, education, skills, projects, learning journey, achievements, coding profiles, contact details, or resume.' };
}

export function isRestrictedGeneralQuestion(rawMessage) {
  const question = lower(rawMessage);
  const programming = /\b(?:program(?:ming|mer)?|code|coding|debug|syntax|algorithm|data structure|javascript|typescript|python|java|c\+\+|react|node(?:\.js)?|sql|html|css|api|framework|function|class|variable|loop|recursion|binary search|leetcode|compile|runtime|git)\b/;
  const generalKnowledge = /\b(?:capital of|president of|prime minister of|population of|history of|geography|geographic|who invented|who discovered|when was|where is|which country|world war|currency of|famous person|general knowledge|trivia|news|latest election|stock price|weather forecast|scientific fact)\b/;
  return programming.test(question) || generalKnowledge.test(question);
}

export function getLocalAnswer(rawMessage) {
  return isProfileQuestion(rawMessage) ? getProfileAnswer(rawMessage) : getSimpleAnswer(rawMessage);
}
