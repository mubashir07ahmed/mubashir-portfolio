import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent, ReactNode } from 'react';
import { ChevronDown, Send, Terminal, User, X } from 'lucide-react';
import { profileData } from '../../shared/profileData.js';
import { getLocalAnswer, isProfileQuestion } from '../../shared/chat.js';

type ChatAction = { label: string; href: string };
type ChatMessage = { id: number; role: 'assistant' | 'user'; text: string; action?: ChatAction; actions?: ChatAction[]; scope?: 'profile' | 'general' };
type ChatResponse = { text?: string; action?: ChatAction; actions?: ChatAction[]; fallbackUsed?: boolean; scope?: 'profile' | 'general' };

const welcomeMessage: ChatMessage = { id: 0, role: 'assistant', text: profileData.chat.welcome };

function renderInline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('__') && part.endsWith('__')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>;
    if (part.startsWith('*') && part.endsWith('*')) return <em key={index}>{part.slice(1, -1)}</em>;
    return part;
  });
}

function AssistantMessageText({ text }: { text: string }) {
  const lines = text.split(/\r?\n/);
  const blocks: Array<{ type: 'paragraph' | 'heading' | 'ul' | 'ol'; lines: string[] }> = [];
  let paragraph: string[] = [];
  const flushParagraph = () => {
    if (paragraph.length) { blocks.push({ type: 'paragraph', lines: [paragraph.join(' ')] }); paragraph = []; }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) { flushParagraph(); continue; }
    const heading = trimmed.match(/^#{1,4}\s+(.+)$/);
    if (heading) { flushParagraph(); blocks.push({ type: 'heading', lines: [heading[1]] }); continue; }
    const bullet = trimmed.match(/^[-*•]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      const last = blocks.at(-1);
      if (last?.type === 'ul') last.lines.push(bullet[1]);
      else blocks.push({ type: 'ul', lines: [bullet[1]] });
      continue;
    }
    const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      const last = blocks.at(-1);
      if (last?.type === 'ol') last.lines.push(ordered[1]);
      else blocks.push({ type: 'ol', lines: [ordered[1]] });
      continue;
    }
    paragraph.push(trimmed);
  }
  flushParagraph();

  return <div className="chat-rich-text">
    {blocks.map((block, index) => {
      if (block.type === 'heading') return <h4 key={index}>{renderInline(block.lines[0])}</h4>;
      if (block.type === 'ul') return <ul key={index}>{block.lines.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}</ul>;
      if (block.type === 'ol') return <ol key={index}>{block.lines.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}</ol>;
      return <p key={index}>{renderInline(block.lines[0])}</p>;
    })}
  </div>;
}

export default function ChatWidget({ open, onOpenChange, initialPrompt, autoSendInitial = false, showLauncher = true }: { open: boolean; onOpenChange: (open: boolean) => void; initialPrompt?: string; autoSendInitial?: boolean; showLauncher?: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [localMode, setLocalMode] = useState(false);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const autoSentPromptRef = useRef('');

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 100);
    else if (wasOpenRef.current) launcherRef.current?.focus();
    wasOpenRef.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onOpenChange(false); }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, showAllSuggestions]);

  const sendMessage = async (event?: FormEvent, suggested?: string) => {
    event?.preventDefault();
    const question = (suggested ?? input).trim();
    if (!question || loading) return;
    const history = messages.filter((message) => message.id !== 0 && message.scope !== 'profile').slice(-8).map(({ role, text }) => ({ role, content: text }));
    const userMessageId = Date.now();
    setInput('');
    setMessages((current) => [...current, { id: userMessageId, role: 'user', text: question }]);
    setLoading(true);
    setLocalMode(false);

    let response: ChatResponse;
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 16_000);
      let result: Response;
      try {
        result = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: question, history }),
          signal: controller.signal,
        });
      } finally {
        window.clearTimeout(timeout);
      }
      if (!result.ok) throw new Error('Chat service is unavailable.');
      response = await result.json() as ChatResponse;
      if (!response.text) throw new Error('The chat response was empty.');
      setLocalMode(Boolean(response.fallbackUsed));
    } catch {
      response = { ...getLocalAnswer(question), scope: isProfileQuestion(question) ? 'profile' : 'general' };
      setLocalMode(true);
    }

    const scope = response.scope ?? 'general';
    const assistantText = response.text ?? profileData.chat.unknown;
    setMessages((current) => [
      ...current.map((message) => message.id === userMessageId ? { ...message, scope } : message),
      {
        id: Date.now() + 1,
        role: 'assistant',
        text: assistantText,
        action: response.action,
        actions: response.actions,
        scope,
      },
    ]);
    setLoading(false);
  };

  useEffect(() => {
    if (!open) {
      autoSentPromptRef.current = '';
      return;
    }
    if (!initialPrompt) return;
    setInput(initialPrompt);
    if (!autoSendInitial || autoSentPromptRef.current === initialPrompt) return;
    autoSentPromptRef.current = initialPrompt;
    const timer = window.setTimeout(() => void sendMessage(undefined, initialPrompt), 120);
    return () => window.clearTimeout(timer);
  }, [open, initialPrompt, autoSendInitial]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  };

  const visibleSuggestions = showAllSuggestions
    ? profileData.chat.suggestions
    : profileData.chat.suggestions.slice(0, 3);

  return (
    <>
      {open && <section id="portfolio-chat-panel" className="chat-panel" role="dialog" aria-modal="false" aria-labelledby="chat-panel-title" aria-describedby="chat-panel-description">
        <p id="chat-panel-description" className="sr-only">Novaa is Mubashir Ahmed’s AI portfolio guide. Ask about Mubashir’s verified background, projects, skills, and learning journey.</p>
        <div className="chat-header">
          <div className="chat-avatar" aria-hidden="true"><Terminal size={18} /></div>
          <div className="chat-header-copy">
            <span className="chat-header-kicker">NOVAA · MUBASHIR AHMED</span>
            <strong id="chat-panel-title">Novaa</strong>
            <span className="chat-header-subtitle">AI guide to Mubashir</span>
          </div>
          <div className="chat-header-actions">
            <button className="chat-icon-button chat-minimize-desktop" type="button" aria-label="Minimize chat" title="Minimize" onClick={() => onOpenChange(false)}><ChevronDown size={19} /></button>
            <button className="chat-icon-button chat-close-mobile" type="button" aria-label="Close chat" title="Close" onClick={() => onOpenChange(false)}><X size={17} /></button>
          </div>
        </div>

        <div className="chat-log" ref={logRef} role="log" aria-live="polite" aria-relevant="additions text" aria-label="Chat messages">
          {messages.map((message, index) => {
            const isWelcome = messages.length === 1 && index === 0 && message.role === 'assistant';
            if (isWelcome) {
              return (
                <div className="chat-welcome-card" key={message.id}>
                  <div className="chat-welcome-icon" aria-hidden="true"><Terminal size={15} /></div>
                  <p className="chat-welcome-kicker">HI THERE!</p>
                  <p className="chat-welcome-prompt">I can help you with</p>
                  <p className="chat-welcome-copy">{message.text}</p>
                </div>
              );
            }

            return (
              <div className={`chat-message chat-message--${message.role}`} key={message.id}>
                {message.role === 'assistant' && <span className="chat-message-avatar" aria-hidden="true"><Terminal size={14} /></span>}
                <div className="chat-bubble">
                  {message.role === 'assistant' ? <AssistantMessageText text={message.text} /> : <p>{message.text}</p>}
                  {(message.actions ?? (message.action ? [message.action] : [])).map((action) => <a className="chat-action-link" href={action.href} target={action.label.startsWith('View') ? '_blank' : undefined} rel={action.label.startsWith('View') ? 'noreferrer' : undefined} download={action.label.startsWith('Download') ? true : undefined} key={`${message.id}-${action.label}`}>{action.label} <span aria-hidden="true">↗</span></a>)}
                </div>
                {message.role === 'user' && <span className="chat-message-avatar chat-message-avatar--user" aria-hidden="true"><User size={14} /></span>}
              </div>
            );
          })}

          {messages.length === 1 && <div className="chat-suggestions" aria-label="Suggested questions">
            <div className="chat-suggestions-heading">
              <span>Try asking</span>
              <button className="chat-suggestions-toggle" type="button" aria-label={showAllSuggestions ? 'Show fewer questions' : 'Show more questions'} aria-expanded={showAllSuggestions} aria-controls="chat-suggestion-list" onClick={() => setShowAllSuggestions((visible) => !visible)}>
                {showAllSuggestions ? 'Less' : 'More'} <ChevronDown size={14} aria-hidden="true" />
              </button>
            </div>
            <div className="chat-suggestions-list" id="chat-suggestion-list">
              {visibleSuggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => void sendMessage(undefined, suggestion)} disabled={loading}>{suggestion}</button>)}
            </div>
          </div>}

          {loading && <div className="chat-message chat-message--assistant"><span className="chat-message-avatar" aria-hidden="true"><Terminal size={14} /></span><div className="chat-bubble chat-typing" role="status" aria-label="Assistant is thinking"><span className="chat-fluid-loader" aria-hidden="true"><i /><i /><i /></span><span className="chat-thinking-text">thinking…</span></div></div>}
        </div>

        {localMode && <div className="chat-mode-note">AI offline · local reply used.</div>}

        <form className="chat-compose" onSubmit={(event) => void sendMessage(event)}>
          <label className="sr-only" htmlFor="chat-input">Write a message</label>
          <input ref={inputRef} id="chat-input" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} maxLength={500} placeholder="Write a message…" autoComplete="off" />
          <button type="submit" aria-label="Send message" disabled={loading || !input.trim()}><Send size={17} /></button>
        </form>
      </section>}

      {showLauncher && <button ref={launcherRef} className={`chat-launcher ${open ? 'is-open' : ''}`} type="button" aria-label={open ? 'Close Novaa chat' : 'Ask Novaa about Mubashir'} aria-expanded={open} aria-controls={open ? 'portfolio-chat-panel' : undefined} onClick={() => onOpenChange(!open)}>
        <span className="chat-launcher-mark" aria-hidden="true">{open ? <X size={18} /> : <Terminal size={19} />}</span>
        <span className="chat-launcher-copy" aria-hidden="true">
          <strong>{open ? 'Close Novaa' : 'Ask Novaa'}</strong>
          <small>{open ? 'terminal mode' : 'AI guide to Mubashir'}</small>
        </span>
      </button>}
    </>
  );
}
