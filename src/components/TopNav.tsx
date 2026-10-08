import { useEffect, useState } from 'react';
import { ArrowDownToLine, Menu, MessageCircle, X } from 'lucide-react';
import { profileData } from '../../shared/profileData.js';

type TopNavProps = { onChatOpen: () => void };
const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#journey' },
  { label: 'Coding', href: '#coding' },
  { label: 'Resume', href: '#resume' },
  { label: 'Contact', href: '#contact' },
];

export default function TopNav({ onChatOpen }: TopNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState('#home');
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const sections = ['home', ...navItems.map((item) => item.href.slice(1))]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveHref(`#${visible.target.id}`);
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0.05, 0.2, 0.5] });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Mubashir Ahmed, home" onClick={closeMenu}>
        <span className="brand-mark" aria-hidden="true"><span>MA</span><i /></span>
        <span className="brand-copy"><strong>Mubashir Ahmed</strong><small>AI · IOT · LEARNING</small></span>
      </a>
      <button className="mobile-menu-toggle icon-button" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen((open) => !open)}>
        {menuOpen ? <X size={21} /> : <Menu size={21} />}
      </button>
      <nav id="primary-navigation" className={`primary-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Primary navigation">
        {navItems.map((item) => <a key={item.href} className={activeHref === item.href ? 'is-active' : undefined} aria-current={activeHref === item.href ? 'page' : undefined} href={item.href} onClick={closeMenu}>{item.label}</a>)}
        <div className="nav-mobile-actions">
          <a className="button button--outline button--small" href={profileData.resumePath} target="_blank" rel="noreferrer">View resume</a>
          <button className="button button--primary button--small" type="button" onClick={() => { closeMenu(); onChatOpen(); }}><MessageCircle size={15} /> Ask AI Chatbot</button>
        </div>
      </nav>
      <div className="header-actions">
        <button className="header-chat icon-button" type="button" aria-label="Open AI Chatbot" onClick={onChatOpen}><MessageCircle size={17} /></button>
        <a className="button button--primary button--small header-resume" href={profileData.resumePath} target="_blank" rel="noreferrer">
          <ArrowDownToLine size={15} /> Resume
        </a>
        <a className="button button--outline button--small header-connect" href="#contact">Let’s connect <span aria-hidden="true">↗</span></a>
      </div>
    </header>
  );
}
