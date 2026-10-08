import { codingInterests, learningJourney, projectPlaceholders, profileData, skillGroups } from './profileData.js';

const unknown = () => ({ text: profileData.chat.unknown });
const profileText = (text) => `${text} ${profileData.chat.profileNote}`;
const lower = (rawMessage) => String(rawMessage ?? '').trim().toLowerCase();
const includesAny = (question, terms) => terms.some((term) => question.includes(term));
const assistantRoleTerms = ['what are you', 'who are you', 'what is your name', 'what is your role', 'what is this chatbot', 'what is your purpose', 'what can you do', 'how can you help', 'what do you do', 'why are you here', 'are you an ai', 'are you a chatbot', 'tell me about yourself'];
const greetingPattern = /^(?:h+i+|h+e+y+|h+e+l+o+|hiya|good morning|good afternoon|good evening|how are you|how's it going|how is it going|what's up|thanks|thank you)(?:[!?,.\s].*)?$/;
const testPattern = /^(?:test|testing|tst|just testing|check|checking)(?:[!?,.\s].*)?$/;
const validLinks = Object.entries(profileData.codingProfiles)
  .filter(([, url]) => typeof url === 'string' && url.startsWith('https://'));
const knownPageTerms = [
  ...projectPlaceholders.map((item) => item.title),
  ...skillGroups.map((item) => item.title),
  ...learningJourney.map((item) => item.title),
  ...profileData.achievements.flatMap((item) => [item.title, item.organization]),
  profileData.institution,
].map((term) => term.toLowerCase()).filter((term) => term.length > 3);

export function isProfileQuestion(rawMessage) {
  const question = lower(rawMessage);
  if (!question) return true;
  if (greetingPattern.test(question) || testPattern.test(question)) return true;
  const namesMubashir = /\b(?:mohammed|mubashir|ahmed)\b/.test(question);
  const pageContext = includesAny(question, [
    'portfolio', 'on this page', 'on the website', 'this website', 'site section', 'navigation',
    'about section', 'skills section', 'skill group', 'programming languages', 'projects section', 'learning journey', 'coding profile', 'coding interests', 'ai assistant', 'chatbot', 'provider',
    'github', 'linkedin', 'leetcode', 'hackerrank', 'codechef', 'vnr', 'vjiet',
    'prompt craft', 'synthvision', 'krithomedh', 'question solver', 'answer generator', 'lost and found',
    'to-do app', 'full-stack chatbot',
  ]) || knownPageTerms.some((term) => question.includes(term));
  return namesMubashir
    || pageContext
    || includesAny(question, assistantRoleTerms)
    || /\b(?:my|your|his|her)\s+(?:profile|resume|cv|skills?|projects?|work|background|interests?|intrests?|hobbies|education|career|goals?|experience|contact details?|achievements?|links?)\b/.test(question)
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

  if (greetingPattern.test(question)) {
    if (/^(?:thanks|thank you)/.test(question)) return { text: 'You’re welcome! Ask me anything about Mubashir’s portfolio, projects, skills, education, or resume.' };
    return { text: 'Hello! I’m Mubashir’s portfolio assistant. Ask me about his projects, skills, education, achievements, or resume.' };
  }

  if (testPattern.test(question)) {
    return { text: 'I’m working. Try asking about Mubashir’s projects, skills, education, achievements, or resume.' };
  }

  if (includesAny(question, assistantRoleTerms)) {
    return { text: profileText('I’m the AI Chatbot on Mubashir Ahmed’s portfolio. I can help visitors, recruiters, and companies explore all of the information presented on this page, including his education, skills, projects, learning journey, achievements, coding profiles, contact details, and resume.') };
  }

  if (includesAny(question, ['what makes this portfolio different', 'why this portfolio', 'how does this portfolio work', 'what is special about this portfolio'])) {
    return { text: profileText('The portfolio is designed to feel like a clear, honest record of Mubashir’s progress. It combines a readable editorial interface, project details, a terminal-style profile panel, a shared source of truth for the content, and an assistant that can explain the same information without inventing personal facts.') };
  }

  if (includesAny(question, ['how does the chatbot work', 'how does the ai assistant work', 'does the chatbot need an api key', 'without an api key'])) {
    return { text: profileText('The assistant first uses local portfolio knowledge for Mubashir’s education, projects, skills, achievements, resume, and contact details. If a server-side provider is configured, it can also answer short open-ended questions. Without a provider key, the portfolio still works and uses a concise local fallback.') };
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

  if (/synthvision/.test(question)) {
    return { text: profileText('SynthVision was an AI/ML and IoT hackathon at VNR VJIET where Mubashir was a finalist.') };
  }

  if (/krithomedh/.test(question)) {
    return { text: profileText('Krithomedh is the AI/ML and IoT Club at VNR VJIET associated with the SynthVision Hackathon, where Mubashir was a finalist.') };
  }

  if (/prompt craft/.test(question)) {
    return { text: profileText('Prompt Craft was an ISTE student chapter event at VNR VJIET where Mubashir was a winner.') };
  }

  if (/achievement|award|winner|finalist|prompt craft|synthvision/.test(question)) {
    return { text: profileText(profileData.achievements.map((item) => `${item.title} at ${item.organization}. ${item.detail}`).join(' ')) };
  }

  if (/project|portfolio work|built|worked on|application|app|solver|generator|lost and found|to-do/.test(question) || projectPlaceholders.some((item) => question.includes(item.title.toLowerCase()))) {
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

  if (/interest|intrest|focus|passion|area/.test(question)) {
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
  return { text: profileData.chat.scopeMessage };
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
