import { ArrowDown, ArrowDownToLine, ArrowRight, Bot } from 'lucide-react';
import { profileData } from '../../shared/profileData.js';
import TerminalPanel from '../components/TerminalPanel';

export default function HeroSection({ onChatOpen }: { onChatOpen: () => void }) {
  return (
    <section className="hero-section page-section" id="home" aria-labelledby="hero-title">
      <div className="hero-grid page-container">
        <div className="hero-copy">
          <div className="hero-status"><span className="status-dot" /> Currently learning, building & exploring</div>
          <p className="eyebrow hero-eyebrow">{profileData.role}</p>
          <h1 id="hero-title">Hi, I’m <span>Mubashir<br className="desktop-break" /> Ahmed</span></h1>
          <p className="hero-headline">{profileData.headline}</p>
          <p className="hero-description">{profileData.intro}</p>
          <div className="hero-actions">
            <a className="button button--primary" href="#projects">View my projects <ArrowRight size={17} /></a>
            <a className="button button--outline" href={profileData.resumePath} target="_blank" rel="noreferrer" download><ArrowDownToLine size={16} /> Download resume</a>
            <button className="button button--quiet" type="button" onClick={onChatOpen}><Bot size={17} /> Ask my AI assistant</button>
          </div>
          <div className="hero-badges" aria-label="Areas of focus">
            <span><i /> AI/ML enthusiast</span><span><i /> Full-stack developer</span><span><i /> Problem solver</span>
          </div>
          <a className="scroll-cue" href="#about"><span>SCROLL TO EXPLORE</span><ArrowDown size={14} /></a>
        </div>

        <div className="hero-visual-wrap">
          <TerminalPanel />
          <div className="hero-visual-note"><span>01 / PROFILE</span><span>Editable portfolio data</span></div>
        </div>
      </div>
      <div className="hero-bottom-line page-container"><span>01 / PROFILE</span><span>SOFTWARE · LEARNING · PROBLEM SOLVING</span><span>SCROLL <ArrowDown size={12} /></span></div>
    </section>
  );
}
