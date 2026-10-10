import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { Avatar } from '@bible-strong/avatar-react';
import { validateAvatarDefinition, type AvatarDefinition } from '@bible-strong/avatar-core';
import strobiDefinitionJson from '../assets/strobi.avatar.json';
import '@bible-strong/avatar-react/styles.css';

const validation = validateAvatarDefinition(strobiDefinitionJson);
if (!validation.ok) throw new Error(`Invalid Strobi avatar definition: ${validation.errors[0]?.message}`);
const strobiDefinition = validation.value as AvatarDefinition;
type AnimationKey = keyof typeof strobiDefinitionJson.animations;

type MascotContext = { section: string; element: string; issue: string };
type PromptResponse = { text?: string };

const sectionPrompts: Record<string, string[]> = {
  home: ['Hi, I’m Novaa. Want to know what Mubashir is building?', 'I’m Novaa — curious where this journey is heading?', 'Want an introduction to the person behind this portfolio?'],
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

function getChatQuestion(section: string, context: MascotContext) {
  if (context.issue) return 'How should I fix the email field?';
  const specific = context.element.trim();
  if (specific && !/^(page content|.+ section)$/i.test(specific) && !/^(view|download|ask|follow|let’s|lets)\b/i.test(specific)) {
    return `Tell me about ${specific} in Mubashir’s portfolio.`;
  }
  const questions: Record<string, string> = {
    home: 'What is Mubashir building?', about: 'Tell me about Mubashir’s background.', skills: 'What skills and technologies does Mubashir work with?', projects: 'Tell me about Mubashir’s projects.', journey: 'What is Mubashir’s learning journey?', coding: 'What are Mubashir’s coding interests?', resume: 'What does Mubashir’s resume cover?', contact: 'How can I contact Mubashir?',
  };
  return questions[section] ?? questions.home;
}

function getContextFromPointer(x: number, y: number): MascotContext {
  const element = document.elementFromPoint(x, y);
  const sectionElement = element?.closest('section[id]');
  const section = sectionElement?.id && sections.includes(sectionElement.id) ? sectionElement.id : 'home';
  const interactive = element?.closest('input, textarea, select, button, a');
  const contextContainer = element?.closest('article, .glass-card, .terminal-panel, form');
  const containerHeading = contextContainer?.querySelector('h1, h2, h3, h4, strong');
  const sectionHeading = sectionElement?.querySelector('h2');
  const field = interactive instanceof HTMLElement
    ? (interactive.getAttribute('aria-label') || interactive.getAttribute('name') || interactive.textContent?.trim().slice(0, 42) || interactive.tagName.toLowerCase())
    : containerHeading?.textContent?.trim().slice(0, 60) || sectionHeading?.textContent?.trim().slice(0, 60) || `${section} section`;
  const input = element instanceof HTMLInputElement ? element : interactive instanceof HTMLInputElement ? interactive : null;
  const issue = input?.type === 'email' && input.value && !input.validity.valid ? 'The contact email field contains an invalid email address.' : '';
  return { section, element: field, issue };
}

export default function PortfolioMascot({ onOpenChat, chatOpen }: { onOpenChat: (prompt: string, question: string) => void; chatOpen: boolean }) {
  const [section, setSection] = useState('home');
  const [promptIndex, setPromptIndex] = useState(0);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [thinking, setThinking] = useState(false);
  const [handAngle, setHandAngle] = useState(0);
  const [prompt, setPrompt] = useState('Hi, I’m Novaa. Want to know what Mubashir is building?');
  const [typedPromptState, setTypedPromptState] = useState({ source: '', text: '' });
  const [isPromptTyping, setIsPromptTyping] = useState(false);
  const [pointerActive, setPointerActive] = useState(false);
  const [context, setContext] = useState<MascotContext>({ section: 'home', element: 'page content', issue: '' });
  const lastContextRef = useRef('home|page content|');
  const pointerFrameRef = useRef(0);
  const lastPointerRef = useRef({ x: -1000, y: -1000 });
  const promptRequestRef = useRef<AbortController | null>(null);
  const lastPromptRequestAtRef = useRef(0);
  const clickTimerRef = useRef<number | null>(null);

  const localPrompt = useMemo(() => getPrompt(section, promptIndex), [section, promptIndex]);
  const animation = thinking ? 'thinking' : (sectionAnimations[section] ?? 'idle');
  const typedPrompt = typedPromptState.source === prompt ? typedPromptState.text : '';

  const requestPrompt = async (nextContext: MascotContext, fallback = localPrompt) => {
    promptRequestRef.current?.abort();
    const controller = new AbortController();
    promptRequestRef.current = controller;
    let timedOut = false;
    const timeout = window.setTimeout(() => { timedOut = true; controller.abort(); }, 3500);
    setThinking(true);
    try {
      const response = await fetch('/api/mascot-prompt', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
        body: JSON.stringify({ section: nextContext.section, context: nextContext.element, issue: nextContext.issue, variation: promptIndex }),
      });
      if (!response.ok) throw new Error('Mascot prompt unavailable');
      const result = await response.json() as PromptResponse;
      if (!controller.signal.aborted) setPrompt(result.text?.trim() || fallback);
    } catch {
      if (!controller.signal.aborted || timedOut) setPrompt(fallback);
    } finally {
      window.clearTimeout(timeout);
      if (!controller.signal.aborted || timedOut) setThinking(false);
    }
  };

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const characters = Array.from(prompt);
    let characterIndex = 0;
    let timer: number | undefined;
    const showCompletePrompt = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      setTypedPromptState({ source: prompt, text: prompt });
      setIsPromptTyping(false);
    };

    if (motionPreference.matches || characters.length === 0) {
      showCompletePrompt();
      return;
    }

    setTypedPromptState({ source: prompt, text: '' });
    setIsPromptTyping(true);
    const onMotionPreferenceChange = () => {
      if (motionPreference.matches) showCompletePrompt();
    };
    motionPreference.addEventListener('change', onMotionPreferenceChange);

    const typeNextCharacter = () => {
      characterIndex += 1;
      setTypedPromptState({ source: prompt, text: characters.slice(0, characterIndex).join('') });
      if (characterIndex >= characters.length) {
        timer = undefined;
        setIsPromptTyping(false);
        return;
      }
      timer = window.setTimeout(typeNextCharacter, 28);
    };
    timer = window.setTimeout(typeNextCharacter, 18);

    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      motionPreference.removeEventListener('change', onMotionPreferenceChange);
    };
  }, [prompt]);

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
        if (current !== visible.id) {
          setPromptIndex((index) => index + 1);
          setContext((currentContext) => ({ ...currentContext, section: visible.id }));
        }
        return visible.id;
      });
      if (!pointerActive) {
        const mascotHeight = window.innerWidth < 680 ? 188 : 228;
        const mascotWidth = window.innerWidth < 680 ? 148 : 190;
        setPosition({ left: window.innerWidth - mascotWidth - 18, top: clamp(visible.rect.top + Math.min(120, visible.rect.height * .25), 82, window.innerHeight - mascotHeight - 16) });
      }
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(updateSection); };
    updateSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (frame) window.cancelAnimationFrame(frame); };
  }, [pointerActive]);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionPreferenceChange = () => {
      if (motionPreference.matches) setPointerActive(false);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || motionPreference.matches) return;
      if (pointerFrameRef.current) return;
      pointerFrameRef.current = window.requestAnimationFrame(() => {
        pointerFrameRef.current = 0;
        const hovered = document.elementFromPoint(event.clientX, event.clientY);
        if (hovered?.closest('.portfolio-mascot')) return;
        const mascotElement = document.querySelector<HTMLElement>('.portfolio-mascot');
        const mascotRect = mascotElement?.getBoundingClientRect();
        const interactionPadding = window.innerWidth < 680 ? 34 : 52;
        const insideInteractionBuffer = mascotRect
          && event.clientX >= mascotRect.left - interactionPadding
          && event.clientX <= mascotRect.right + interactionPadding
          && event.clientY >= mascotRect.top - interactionPadding
          && event.clientY <= mascotRect.bottom + interactionPadding;
        if (insideInteractionBuffer) {
          const centerX = mascotRect.left + mascotRect.width * .5;
          const centerY = mascotRect.top + mascotRect.height * .58;
          setHandAngle(clamp(Math.atan2(event.clientY - centerY, event.clientX - centerX) * 180 / Math.PI, -85, 85));
          return;
        }
        const distance = Math.hypot(event.clientX - lastPointerRef.current.x, event.clientY - lastPointerRef.current.y);
        if (distance < 28) return;
        lastPointerRef.current = { x: event.clientX, y: event.clientY };
        const nextContext = getContextFromPointer(event.clientX, event.clientY);
        const contextKey = `${nextContext.section}|${nextContext.element}|${nextContext.issue}`;
        setPointerActive(true);
        const mascotWidth = window.innerWidth < 680 ? 148 : 190;
        const mascotHeight = window.innerWidth < 680 ? 188 : 228;
        const safeLeft = Math.min(window.innerWidth - mascotWidth - 16, Math.max(16, window.innerWidth * .56));
        const left = clamp(event.clientX + 34, safeLeft, window.innerWidth - mascotWidth - 16);
        const top = clamp(event.clientY - mascotHeight * .48, 82, window.innerHeight - mascotHeight - 16);
        setPosition({ left, top });
        setHandAngle(clamp(Math.atan2(event.clientY - (top + mascotHeight * .58), event.clientX - (left + mascotWidth * .5)) * 180 / Math.PI, -85, 85));
        if (contextKey !== lastContextRef.current) {
          lastContextRef.current = contextKey;
          setContext(nextContext);
          setSection(nextContext.section);
          setPromptIndex((index) => index + 1);
        }
      });
    };
    const onInput = (event: Event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement) || input.type !== 'email') return;
      const sectionElement = input.closest('section[id]');
      const nextContext: MascotContext = {
        section: sectionElement?.id && sections.includes(sectionElement.id) ? sectionElement.id : 'contact',
        element: input.getAttribute('aria-label') || input.getAttribute('name') || 'email field',
        issue: input.value && !input.validity.valid ? 'The contact email field contains an invalid email address.' : '',
      };
      const contextKey = `${nextContext.section}|${nextContext.element}|${nextContext.issue}`;
      if (contextKey === lastContextRef.current) return;
      lastContextRef.current = contextKey;
      setContext(nextContext);
      setSection(nextContext.section);
      setPromptIndex((index) => index + 1);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('input', onInput);
    motionPreference.addEventListener('change', onMotionPreferenceChange);
    return () => { window.removeEventListener('pointermove', onPointerMove); window.removeEventListener('input', onInput); motionPreference.removeEventListener('change', onMotionPreferenceChange); if (pointerFrameRef.current) window.cancelAnimationFrame(pointerFrameRef.current); };
  }, []);

  useEffect(() => {
    if (pointerActive || context.issue) return;
    setPrompt(localPrompt);
  }, [localPrompt, pointerActive, context.issue]);

  useEffect(() => {
    if (promptIndex === 0 && context.element === 'page content' && !context.issue) return;
    const fallback = context.issue ? 'Oops — that field needs a quick check. Want help fixing it?' : localPrompt;
    let throttleTimer: number | null = null;
    const debounceTimer = window.setTimeout(() => {
      const delay = Math.max(0, 2500 - (Date.now() - lastPromptRequestAtRef.current));
      throttleTimer = window.setTimeout(() => {
        lastPromptRequestAtRef.current = Date.now();
        void requestPrompt(context, fallback);
      }, delay);
    }, 450);
    return () => {
      window.clearTimeout(debounceTimer);
      if (throttleTimer !== null) window.clearTimeout(throttleTimer);
      promptRequestRef.current?.abort();
    };
  }, [context.section, context.element, context.issue]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPromptIndex((index) => index + 1);
    }, 9000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => () => {
    if (clickTimerRef.current) window.clearTimeout(clickTimerRef.current);
  }, []);

  useEffect(() => {
    if (chatOpen) setThinking(false);
  }, [chatOpen]);

  const handleMascotClick = () => {
    setPromptIndex((index) => index + 1);
    setThinking(true);
    if (clickTimerRef.current) window.clearTimeout(clickTimerRef.current);
    clickTimerRef.current = window.setTimeout(() => {
      setThinking(false);
      onOpenChat(prompt, getChatQuestion(section, context));
    }, 220);
  };

  const handleCloudClick = () => {
    setPromptIndex((index) => index + 1);
    onOpenChat(prompt, getChatQuestion(section, context));
  };

  if (chatOpen) return null;

  return (
    <aside className={`portfolio-mascot ${pointerActive ? 'is-pointer-aware' : ''}`} style={{ left: position.left, top: position.top, '--novaa-hand-angle': `${handAngle}deg` } as CSSProperties} aria-label="Novaa, Mubashir’s AI portfolio guide">
      <button className="portfolio-mascot-cloud" type="button" onClick={handleCloudClick} aria-label={`Ask Novaa: ${prompt}`}>
        <span className="portfolio-mascot-cloud-kicker"><Sparkles size={12} aria-hidden="true" /> NOVAA · {section}</span>
        {thinking ? <span className="portfolio-mascot-thinking-text" aria-live="polite" aria-label="Novaa is thinking">thinking<span className="portfolio-mascot-thinking-dots" aria-hidden="true"><i /><i /><i /></span></span> : <><strong className="portfolio-mascot-prompt" aria-hidden="true"><span>{typedPrompt}</span>{isPromptTyping && <span className="terminal-cursor mascot-terminal-cursor" aria-hidden="true" />}</strong><span className="sr-only" aria-live="polite" aria-atomic="true">{prompt}</span></>}
        <span className="portfolio-mascot-cloud-tail" aria-hidden="true" />
      </button>
      <button className={`portfolio-mascot-body ${thinking ? 'is-thinking' : ''}`} type="button" onClick={handleMascotClick} aria-label="Open chat with Novaa, Mubashir’s AI guide">
        <span className="portfolio-mascot-status"><i /> {thinking ? 'processing' : 'Novaa online'}</span>
        <svg className="portfolio-mascot-hand portfolio-mascot-hand--left" viewBox="0 0 34 44" aria-hidden="true"><path d="M25 37c-3 3-9 3-13-1L4 28c-2-2-2-5 0-7 2-2 4-2 6 0l5 5-2-16c0-3 2-5 4-5s3 1 4 4l2 12 1-6c0-3 2-4 4-4 2 1 2 3 2 5l-1 14c0 3-1 5-4 7Z" /></svg>
        <span className="portfolio-mascot-avatar" aria-hidden="true"><Avatar definition={strobiDefinition} animation={animation} size="92" ariaLabel="Novaa AI portfolio guide avatar" /></span>
        <svg className="portfolio-mascot-hand portfolio-mascot-hand--right" viewBox="0 0 34 44" aria-hidden="true"><path d="M9 37c3 3 9 3 13-1l8-8c2-2 2-5 0-7-2-2-4-2-6 0l-5 5 2-16c0-3-2-5-4-5s-3 1-4 4L11 21l-1-6c0-3-2-4-4-4-2 1-2 3-2 5l1 14c0 3 1 5 4 7Z" /></svg>
        <span className="portfolio-mascot-label"><MessageCircle size={11} aria-hidden="true" /> click to chat</span>
      </button>
    </aside>
  );
}
