import { useEffect, useState } from 'react';
import { profileData } from '../../shared/profileData.js';

type TerminalTone = 'command' | 'mint' | 'violet' | 'cyan' | 'amber' | 'coral';
type TerminalEntry = { command: string; output: string; tone: Exclude<TerminalTone, 'command'> };
type TerminalLine = { prompt?: string; text: string; tone: TerminalTone };

const slug = profileData.name.toLowerCase().replace(/\s+/g, '-');
const compactEducation = profileData.education
  .replace('B.Tech in Internet of Things (IoT)', 'B.Tech IoT')
  .split('—')[0]
  .trim();
const compactInterests = profileData.interests
  .slice(0, 5)
  .map((interest) => interest
    .replace('Artificial Intelligence', 'AI')
    .replace('Machine Learning', 'ML')
    .replace('Generative AI', 'GenAI')
    .replace('Full-stack development', 'Full-stack'))
  .join(' · ');
const languages = profileData.languages.join(' · ');
const tools = profileData.technologies.slice(0, 4).join(' · ');
const focus = profileData.headline.replace(/^B\.Tech IoT Student\s*/i, '').replace(/\.$/, '');

const terminalEntries: TerminalEntry[] = [
  { command: 'whoami', output: `${slug} · ${compactEducation}`, tone: 'mint' },
  { command: 'cat interests.txt', output: compactInterests, tone: 'violet' },
  { command: 'ls ./languages', output: languages, tone: 'cyan' },
  { command: 'ls ./toolkit', output: tools, tone: 'amber' },
  { command: 'cat current-focus.txt', output: focus, tone: 'coral' },
];

const terminalLines: TerminalLine[] = terminalEntries.flatMap((entry): TerminalLine[] => [
  { prompt: '$', text: entry.command, tone: 'command' },
  { text: entry.output, tone: entry.tone },
]);

export default function TerminalPanel() {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(query.matches);
    updatePreference();
    query.addEventListener('change', updatePreference);
    return () => query.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      const finalIndex = terminalLines.length - 1;
      setLineIndex(finalIndex);
      setCharIndex(terminalLines[finalIndex].text.length);
      return;
    }

    const current = terminalLines[lineIndex];
    const isComplete = charIndex >= current.text.length;
    const delay = isComplete ? (lineIndex === terminalLines.length - 1 ? 2300 : 170) : 27;
    const timer = window.setTimeout(() => {
      if (!isComplete) {
        setCharIndex((currentIndex) => currentIndex + 1);
      } else if (lineIndex < terminalLines.length - 1) {
        setLineIndex((currentLine) => currentLine + 1);
        setCharIndex(0);
      } else {
        setLineIndex(0);
        setCharIndex(0);
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [lineIndex, charIndex, reducedMotion]);

  return (
    <section className="terminal-panel" aria-labelledby="terminal-title">
      <div className="terminal-titlebar">
        <div className="terminal-window-controls" aria-hidden="true">
          <i className="terminal-window-dot terminal-window-dot--coral" />
          <i className="terminal-window-dot terminal-window-dot--amber" />
          <i className="terminal-window-dot terminal-window-dot--mint" />
        </div>
        <span className="terminal-window-title" id="terminal-title">mubashir@portfolio: ~</span>
        <span className="terminal-mode">PROFILE DATA</span>
      </div>
      <div className="terminal-body" aria-live="off">
        {terminalEntries.map((entry, index) => {
          const commandIndex = index * 2;
          const outputIndex = commandIndex + 1;
          if (commandIndex > lineIndex) return null;

          const commandIsCurrent = lineIndex === commandIndex;
          const outputIsVisible = outputIndex <= lineIndex;
          const outputIsCurrent = lineIndex === outputIndex;
          const commandText = commandIsCurrent && !reducedMotion
            ? entry.command.slice(0, charIndex)
            : entry.command;
          const outputText = outputIsCurrent && !reducedMotion
            ? entry.output.slice(0, charIndex)
            : entry.output;

          return (
            <div className="terminal-entry" key={entry.command}>
              <div className="terminal-row terminal-row--command">
                <span className="terminal-prompt" aria-hidden="true">$</span>
                <span className="terminal-text">{commandText}</span>
                {commandIsCurrent && !reducedMotion && <i className="terminal-cursor" aria-hidden="true" />}
              </div>
              {outputIsVisible && (
                <div className={`terminal-row terminal-row--output terminal-row--${entry.tone}`}>
                  <span className="terminal-text">{outputText}</span>
                  {outputIsCurrent && !reducedMotion && <i className="terminal-cursor" aria-hidden="true" />}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="terminal-footer"><span>PROFILE.DAT</span><span>FACTS FROM THE PORTFOLIO</span></div>
    </section>
  );
}
