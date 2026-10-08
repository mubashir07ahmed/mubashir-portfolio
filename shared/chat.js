import { profileData } from './profileData.js';

const unknown = () => ({ text: profileData.chat.unknown });
const profileText = (text) => `${text} ${profileData.chat.profileNote}`;

export function isProfileQuestion(rawMessage) {
  const question = String(rawMessage ?? '').trim().toLowerCase();
  if (!question) return true;
  const namesMubashir = /\b(?:mohammed|mubashir|ahmed)\b/.test(question);
  return namesMubashir
    || /\b(?:what are you|who are you|what is your name|what can you do|how can you help|what do you do|are you (?:an? )?(?:ai|chatbot)|tell me about yourself)\b/.test(question)
    || /\b(?:my|your|his|her)\s+(?:profile|resume|cv|skills?|projects?|work|background|interests?|hobbies|education|career|goals?|experience|contact details?)\b/.test(question)
    || /\b(?:who is|tell me about)\s+(?:him|he|mubashir|ahmed|the developer)\b/.test(question)
    || /\b(?:view|download|open|see)\s+(?:the\s+)?(?:resume|cv)\b/.test(question);
}

export function getProfileAnswer(rawMessage) {
  const question = String(rawMessage ?? '').trim().toLowerCase();
  if (!question) return unknown();

  if (/\b(?:what are you|who are you|what is your name|what can you do|how can you help|what do you do|are you (?:an? )?(?:ai|chatbot)|tell me about yourself)\b/.test(question)) {
    return { text: profileText('I’m the AI Chatbot on Mubashir Ahmed’s portfolio. I can explain Mubashir’s profile and help visitors, recruiters, and companies learn about his work.') };
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
    return { text: profileText(`You can reach Mubashir at ${profileData.contact.email}.`), action: { label: 'Go to contact form', href: '#contact' } };
  }

  if (/achievement|award|winner|finalist|prompt craft|synthvision/.test(question)) {
    return { text: profileText(profileData.achievements.map((item) => `${item.title} at ${item.organization}`).join('; ') + '.') };
  }

  if (/project|portfolio work|built|worked on/.test(question)) {
    return { text: profileText('Mubashir has built an AI full-stack chatbot, a local AI question solver, an AI answer generator, and a Python To-Do app. He is also developing a campus lost-and-found matching platform.') };
  }

  if (/career|goal|future|aspir/.test(question)) return { text: profileText(profileData.careerGoal) };
  if (/interest|focus|passion|area/.test(question)) return { text: profileText(`His main interests include ${profileData.interests.join(', ')}.`) };
  if (/data structure|algorithm|dsa|coding practice|practice|problem solving/.test(question)) return { text: profileText(`He practices ${profileData.csTopics.join(', ')}.`) };
  if (/react|node|flask|rest api|technology|technologies|tool|stack|know|skill|language|database/.test(question)) return { text: profileText(`His current toolkit includes ${profileData.languages.join(', ')}, ${profileData.technologies.join(', ')}, and ${profileData.csTopics.join(', ')}.`) };
  if (/who|name|about|education|student|study|degree|college|university|iot/.test(question)) return { text: profileText(`${profileData.name} is a ${profileData.role} at ${profileData.institution}.`) };

  return unknown();
}

export function getSimpleAnswer(rawMessage) {
  const question = String(rawMessage ?? '').trim().toLowerCase();
  if (/^(?:h+i+|h+e+y+|hello+|good morning|good afternoon|good evening|thanks+|thank you)\b/.test(question)) return { text: 'Hi there! I’m happy to help. You can ask about Mubashir, ask me about myself, or try a short everyday question.' };
  if (/\b(?:how are you|how is it going|how are things)\b/.test(question)) return { text: 'I’m doing well and ready to help you learn about Mubashir or answer a short question.' };
  if (/\b(?:tell me a joke|make me laugh)\b/.test(question)) return { text: 'Why do programmers prefer dark mode? Because light attracts bugs.' };
  if (/\b(?:what are you|who are you|what is this|tell me about yourself)\b/.test(question)) return { text: 'I’m the AI Chatbot on Mubashir Ahmed’s portfolio. I can explain his profile and answer short everyday or technical questions.' };
  if (/\b(?:what can you do|how can you help|what are your capabilities)\b/.test(question)) return { text: 'I can answer questions about Mubashir’s education, skills, projects, achievements, coding, contact details, and resume, plus short everyday or technical questions.' };
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
  return { text: 'I’m focused on Mubashir’s profile and simple questions only. Ask about his education, skills, projects, achievements, coding, contact details, or resume.' };
}

export function isRestrictedGeneralQuestion(rawMessage) {
  const question = String(rawMessage ?? '').trim().toLowerCase();
  const programming = /\b(?:program(?:ming|mer)?|code|coding|debug|syntax|algorithm|data structure|javascript|typescript|python|java|c\+\+|react|node(?:\.js)?|sql|html|css|api|framework|function|class|variable|loop|recursion|binary search|leetcode|compile|runtime|git)\b/;
  const generalKnowledge = /\b(?:capital of|president of|prime minister of|population of|history of|geography|geographic|who invented|who discovered|when was|where is|which country|world war|currency of|famous person|general knowledge|trivia|news|latest election|stock price|weather forecast|scientific fact)\b/;
  return programming.test(question) || generalKnowledge.test(question);
}

export function getLocalAnswer(rawMessage) {
  return isProfileQuestion(rawMessage) ? getProfileAnswer(rawMessage) : getSimpleAnswer(rawMessage);
}
