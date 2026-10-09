import { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { Avatar } from '@bible-strong/avatar-react';
import { validateAvatarDefinition, type AvatarDefinition } from '@bible-strong/avatar-core';
import strobiDefinitionJson from '../assets/strobi.avatar.json';
import '@bible-strong/avatar-react/styles.css';

const validation = validateAvatarDefinition(strobiDefinitionJson);
if (!validation.ok) throw new Error(`Invalid Strobi avatar definition: ${validation.errors[0]?.message}`);
const strobiDefinition = validation.value as AvatarDefinition;
type AnimationKey = keyof typeof strobiDefinitionJson.animations;

const sectionPrompts: Record<string, string[]> = {
  home: ['Want to know what Mubashir is building?', 'Ask me where this journey is heading.', 'Curious about the person behind the portfolio?'],
  about: ['Want a quick look at Mubashir’s background?', 'Curious how he learns by building?', 'Ask me what drives his work.'],
  skills: ['Which skill would you like to explore?', 'Want to see how AI and IoT connect here?', 'Ask me about Mubashir’s toolkit.'],
  projects: ['Should I explain one of these projects?', 'Want to see what he has been building?', 'Ask me which project explores AI.'],
  journey: ['Want to hear about Mubashir’s learning journey?', 'Curious how competitions shaped his work?', 'Ask me about his latest chapter.'],
  coding: ['Want to explore his coding interests?', 'Ask me what he is practicing.', 'Curious about his public coding profiles?'],
  resume: ['Want to take a closer look at his resume?', 'I can point you to Mubashir’s experience.', 'Ask me what the resume covers.'],
  contact: ['Want to connect with Mubashir?', 'I can show you the best way to reach him.', 'Have a project idea to discuss?'],
};

const sections = Object.keys(sectionPrompts);
const sectionAnimations: Record<string, AnimationKey> = {
  home: 'idle', about: 'listening', skills: 'working', projects: 'curious', journey: 'searching', coding: 'thinking', resume: 'proud', contact: 'happy',
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function getPrompt(section: string, index: number) {
  const options = sectionPrompts[section] ?? sectionPrompts.home;
  return options[index % options.length];
}

export default function PortfolioMascot({ onOpenChat, chatOpen }: { onOpenChat: (prompt: string) => void; chatOpen: boolean }) {
  const [section, setSection] = useState('home');
  const [promptIndex, setPromptIndex] = useState(0);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [thinking, setThinking] = useState(false);
  const [prompt, setPrompt] = useState('Want to know what Mubashir is building?');

  const localPrompt = useMemo(() => getPrompt(section, promptIndex), [section, promptIndex]);
  const animation = thinking ? 'thinking' : (sectionAnimations[section] ?? 'idle');

  useEffect(() => {
    let frame = 0;
    const updateSection = () => {
      frame = 0;
      const viewportCenter = window.innerHeight * 0.42;
      const visible = sections.map((id) => document.getElementById(id)).filter(Boolean).map((element) => {
        const rect = (element as HTMLElement).getBoundingClientRect();
        const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
        return { id: (element as HTMLElement).id, rect, visibleHeight, distance: Math.abs(rect.top + Math.min(rect.height * .35, 240) - viewportCenter) };
      }).filter((item) => item.visibleHeight > 20).sort((a, b) => b.visibleHeight - a.visibleHeight || a.distance - b.distance)[0];
      if (!visible) return;
      setSection((current) => {
        if (current !== visible.id) setPromptIndex((index) => index + 1);
        return visible.id;
      });
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(updateSection); };
    updateSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (frame) window.cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setThinking(true);
    fetch('/api/mascot-prompt', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ section }) })
      .then((response) => response.ok ? response.json() as Promise<{ text?: string }> : Promise.reject(new Error('Mascot prompt unavailable')))
      .then((result) => { if (!cancelled) setPrompt(result.text?.trim() || localPrompt); })
      .catch(() => { if (!cancelled) setPrompt(localPrompt); })
      .finally(() => { if (!cancelled) setThinking(false); });
    return () => { cancelled = true; };
  }, [section, promptIndex, localPrompt]);

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
      window.setTimeout(() => setThinking(false), 1400);
      setPromptIndex((index) => index + 1);
    }, 7200);
    return () => window.clearInterval(timer);
  }, []);

  if (chatOpen) return null;

  return (
    <aside className="portfolio-mascot" style={{ left: position.left, top: position.top }} aria-label="Portfolio assistant mascot">
      <button className="portfolio-mascot-cloud" type="button" onClick={() => onOpenChat(prompt)} aria-label={`Ask the assistant: ${prompt}`}>
        <span className="portfolio-mascot-cloud-kicker"><Sparkles size={12} aria-hidden="true" /> {section}</span>
        <strong>{prompt}</strong>
        <span className="portfolio-mascot-cloud-tail" aria-hidden="true" />
      </button>
      <button className={`portfolio-mascot-body ${thinking ? 'is-thinking' : ''}`} type="button" onClick={() => onOpenChat(prompt)} aria-label="Open portfolio assistant">
        <span className="portfolio-mascot-status"><i /> online</span>
        <svg className="portfolio-mascot-hand portfolio-mascot-hand--left" viewBox="0 0 34 44" aria-hidden="true"><path d="M25 37c-3 3-9 3-13-1L4 28c-2-2-2-5 0-7 2-2 4-2 6 0l5 5-2-16c0-3 2-5 4-5s3 1 4 4l2 12 1-6c0-3 2-4 4-4 2 1 2 3 2 5l-1 14c0 3-1 5-4 7Z" /></svg>
        <span className="portfolio-mascot-avatar" aria-hidden="true">
          <Avatar definition={strobiDefinition} animation={animation} size="92" ariaLabel="Strobi portfolio assistant avatar" />
        </span>
        <svg className="portfolio-mascot-hand portfolio-mascot-hand--right" viewBox="0 0 34 44" aria-hidden="true"><path d="M9 37c3 3 9 3 13-1l8-8c2-2 2-5 0-7-2-2-4-2-6 0l-5 5 2-16c0-3-2-5-4-5s-3 1-4 4L11 21l-1-6c0-3-2-4-4-4-2 1-2 3-2 5l1 14c0 3 1 5 4 7Z" /></svg>
        <span className="portfolio-mascot-label"><MessageCircle size={11} aria-hidden="true" /> ask me</span>
      </button>
    </aside>
  );
}
