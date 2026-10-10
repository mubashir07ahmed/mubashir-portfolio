import { useEffect, useRef, useState } from 'react';

export function shouldShowPortfolioIntro() {
  if (typeof window === 'undefined') return false;
  return true;
}

export default function PortfolioIntro({ onComplete }: { onComplete: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const isLeaving = useRef(false);
  const autoTimer = useRef<number | null>(null);
  const exitTimer = useRef<number | null>(null);

  const finishIntro = () => {
    if (isLeaving.current) return;
    isLeaving.current = true;
    setLeaving(true);
    if (autoTimer.current !== null) window.clearTimeout(autoTimer.current);
    exitTimer.current = window.setTimeout(() => {
      onComplete();
    }, 460);
  };

  useEffect(() => {
    autoTimer.current = window.setTimeout(finishIntro, 2_650);
    return () => {
      if (autoTimer.current !== null) window.clearTimeout(autoTimer.current);
      if (exitTimer.current !== null) window.clearTimeout(exitTimer.current);
    };
  }, []);

  return (
    <div
      className={`portfolio-intro${leaving ? ' is-leaving' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="portfolio-intro-title"
      tabIndex={-1}
      autoFocus
    >
      <div className="portfolio-intro-orbit portfolio-intro-orbit--outer" aria-hidden="true" />
      <div className="portfolio-intro-orbit portfolio-intro-orbit--inner" aria-hidden="true" />

      <div className="portfolio-intro-content">
        <div className="portfolio-intro-brand"><span className="portfolio-intro-mark">MA</span><span>MUBASHIR AHMED <i /></span></div>
        <p className="portfolio-intro-kicker"><span aria-hidden="true">✳</span> PORTFOLIO · 01</p>
        <h1 id="portfolio-intro-title" aria-label="Hello there!">
          <span className="portfolio-intro-letters" aria-hidden="true">
            {Array.from('Hello there!').map((character, index) => (
              <span className="portfolio-intro-letter" style={{ animationDelay: `${0.16 + index * 0.045}s` }} key={`${character}-${index}`}>
                {character === ' ' ? '\u00a0' : character}
              </span>
            ))}
          </span>
        </h1>
        <p className="portfolio-intro-subtitle">I’m Mubashir — welcome to my portfolio.</p>
        <div className="portfolio-intro-progress" aria-hidden="true"><span /></div>
        <p className="portfolio-intro-status"><i /> OPENING PROFILE</p>
      </div>
      <div className="portfolio-intro-coordinate" aria-hidden="true">AI · IOT · BUILDING · LEARNING</div>
    </div>
  );
}
