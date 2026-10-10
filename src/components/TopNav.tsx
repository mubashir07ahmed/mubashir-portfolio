import { useEffect, useState } from 'react';
import { Briefcase, Code2, FileText, FolderOpen, Home, Layers, Mail, MessageCircle, UserRound } from 'lucide-react';

type TopNavProps = { onChatOpen: () => void };
const navItems = [
  { label: 'Home', href: '#home', icon: Home },
  { label: 'About', href: '#about', icon: UserRound },
  { label: 'Skills', href: '#skills', icon: Layers },
  { label: 'Projects', href: '#projects', icon: FolderOpen },
  { label: 'Experience', href: '#journey', icon: Briefcase },
  { label: 'Coding', href: '#coding', icon: Code2 },
  { label: 'Resume', href: '#resume', icon: FileText },
  { label: 'Contact', href: '#contact', icon: Mail },
];

export default function TopNav({ onChatOpen }: TopNavProps) {
  const [activeHref, setActiveHref] = useState('#home');

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.href.slice(1)))
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
    <header className="site-header site-header--dock">
      <nav id="primary-navigation" className="primary-nav" aria-label="Primary navigation">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = activeHref === href;
          return (
            <a
              key={href}
              className={isActive ? 'is-active' : undefined}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
              href={href}
              title={label}
            >
              <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
              <span>{label}</span>
            </a>
          );
        })}
      </nav>
      <button className="dock-chat-button" type="button" aria-label="Ask Novaa about Mubashir" title="Ask Novaa" onClick={onChatOpen}>
        <MessageCircle size={16} aria-hidden="true" />
      </button>
    </header>
  );
}
