import { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';

const sectionPrompts: Record<string, string[]> = {
  home: [
    'Want to know what Mubashir is building?',
    'Ask me where this journey is heading.',
    'Curious about the person behind the portfolio?',
  ],
  about: [
    'Want a quick look at Mubashir’s background?',
    'Curious how he learns by building?',
    'Ask me what drives his work.',
  ],
  skills: [
    'Which skill would you like to explore?',
    'Want to see how AI and IoT connect here?',
    'Ask me about Mubashir’s toolkit.',
  ],
  projects: [
    'Should I explain one of these projects?',
    'Want to see what he has been building?',
    'Ask me which project explores AI.',
  ],
  journey: [
    'Want to hear about Mubashir’s learning journey?',
    'Curious how competitions shaped his work?',
    'Ask me about his latest chapter.',
  ],
  coding: [
    'Want to explore his coding interests?',
    'Ask me what he is practicing.',
    'Curious about his public coding profiles?',
  ],
  resume: [
    'Want to take a closer look at his resume?',
    'I can point you to Mubashir’s experience.',
    'Ask me what the resume covers.',
  ],
  contact: [
    'Want to connect with Mubashir?',
    'I can show you the best way to reach him.',
    'Have a project idea to discuss?',
  ],
};

const sections = Object.keys(sectionPrompts);

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function getPrompt(section: string, index: number) {
  const options = sectionPrompts[section] ?? sectionPrompts.home;
  return options[index % options.length];
}

function MascotFace({ thinking }: { thinking: boolean }) {
  return (
    <svg className="portfolio-mascot-svg" viewBox="0 0 120 120" role="img" aria-label="Mubashir’s portfolio assistant mascot">
      <defs>
        <linearGradient id="mascot-shell" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#3c68d8" />
          <stop offset="1" stopColor="#263e8e" />
        </linearGradient>
        <linearGradient id="mascot-screen" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#162538" />
          <stop offset="1" stopColor="#263c51" />
        </linearGradient>
      </defs>
      <path className="mascot-ear mascot-ear--left" d="M18 48c-10-9-14-5-13 6 1 9 8 13 16 11" />
      <path className="mascot-ear mascot-ear--right" d="M102 48c10-9 14-5 13 6-1 9-8 13-16 11" />
      <rect className="mascot-shell" x="13" y="12" width="94" height="90" rx="27" fill="url(#mascot-shell)" />
      <rect className="mascot-screen" x="24" y="28" width="72" height="53" rx="16" fill="url(#mascot-screen)" />
      <circle className={`mascot-eye ${thinking ? 'mascot-eye--thinking' : ''}`} cx="45" cy="53" r="7" />
      <circle className={`mascot-eye ${thinking ? 'mascot-eye--thinking' : ''}`} cx="75" cy="53" r="7" />
      <path className={`mascot-mouth ${thinking ? 'mascot-mouth--thinking' : ''}`} d={thinking ? 'M50 68c6-3 14-3 20 0' : 'M49 66c7 7 15 7 22 0'} />
      <path className="mascot-scanline" d="M31 39h6M83 39h6M32 73h8M80 73h8" />
      <circle className="mascot-status" cx="91" cy="20" r="5" />
      <path className="mascot-base" d="M32 103h56" />
      <path className="mascot-pixel mascot-pixel--one" d="M30 91h5v5h-5zM84 87h5v5h-5z" />
    </svg>
  );
}

export default function PortfolioMascot({ onOpenChat }: { onOpenChat: (prompt: string) => void }) {
  const [section, setSection] = useState('home');
  const [promptIndex, setPromptIndex] = useState(0);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [thinking, setThinking] = useState(false);

  const prompt = useMemo(() => getPrompt(section, promptIndex), [section, promptIndex]);

  useEffect(() => {
    const targets = sections.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const nextSection = (visible.target as HTMLElement).id;
      setSection((current) => {
        if (current !== nextSection) setPromptIndex((index) => index + 1);
        return nextSection;
      });
    }, { threshold: [0.12, 0.3, 0.55], rootMargin: '-12% 0px -42% 0px' });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      const target = document.getElementById(section) ?? document.getElementById('home');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const mascotWidth = window.innerWidth < 680 ? 122 : 148;
      const left = clamp(rect.left + rect.width * 0.68, 12, window.innerWidth - mascotWidth - 12);
      const top = clamp(rect.top + Math.min(120, rect.height * 0.25), 82, window.innerHeight - 174);
      setPosition({ left, top });
    };
    updatePosition();
    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [section]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setThinking(true);
      window.setTimeout(() => setThinking(false), 900);
      setPromptIndex((index) => index + 1);
    }, 7200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <aside className="portfolio-mascot" style={{ left: position.left, top: position.top }} aria-label="Portfolio assistant mascot">
      <button className="portfolio-mascot-cloud" type="button" onClick={() => onOpenChat(prompt)} aria-label={`Ask the assistant: ${prompt}`}>
        <span className="portfolio-mascot-cloud-kicker"><Sparkles size={12} aria-hidden="true" /> {section}</span>
        <strong>{prompt}</strong>
        <span className="portfolio-mascot-cloud-tail" aria-hidden="true" />
      </button>
      <button className={`portfolio-mascot-body ${thinking ? 'is-thinking' : ''}`} type="button" onClick={() => onOpenChat(prompt)} aria-label="Open portfolio assistant">
        <span className="portfolio-mascot-status"><i /> online</span>
        <MascotFace thinking={thinking} />
        <span className="portfolio-mascot-label"><MessageCircle size={11} aria-hidden="true" /> ask me</span>
      </button>
    </aside>
  );
}
