import { useEffect, useState } from 'react';
import { ArrowUpRight, Github, Linkedin, MessageCircle } from 'lucide-react';
import { profileData } from '../shared/profileData.js';
import TopNav from './components/TopNav';
import ChatWidget from './components/ChatWidget';
import PortfolioMascot from './components/PortfolioMascot';
import SocialLinks from './components/SocialLinks';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import ProjectsSection from './sections/ProjectsSection';
import JourneySection from './sections/JourneySection';
import CodingSection from './sections/CodingSection';
import ResumeSection from './sections/ResumeSection';
import ContactSection from './sections/ContactSection';

function validProfileUrl(value: string) {
  if (!value || /your-username|your-profile|example\.com/i.test(value)) return '';
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; }
}

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [mascotPrompt, setMascotPrompt] = useState('');
  useEffect(() => {
    const revealSelector = [
      '.page-section:not(.hero-section) .section-heading',
      '.page-section:not(.hero-section) .section-layout > :last-child',
      '.highlight-card', '.skill-card', '.project-card', '.journey-item',
      '.coding-group', '.profile-links-row', '.resume-panel', '.contact-aside', '.contact-form',
    ].join(',');
    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));
    elements.forEach((element) => element.classList.add('scroll-reveal'));
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -12% 0px' });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  const footerLinks = [
    { name: 'GitHub', url: validProfileUrl(profileData.contact.github) },
    { name: 'LinkedIn', url: validProfileUrl(profileData.contact.linkedin) },
  ].filter((link) => link.url);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <TopNav onChatOpen={() => setChatOpen(true)} />
      <main id="main-content" className="mx-auto w-full">
        <HeroSection onChatOpen={() => setChatOpen(true)} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <JourneySection />
        <CodingSection />
        <ResumeSection />
        <ContactSection />
      </main>
      <footer className="site-footer">
        <div className="page-container footer-top">
          <a className="brand footer-brand" href="#home" aria-label="Back to the top">
            <span className="brand-mark" aria-hidden="true"><span>MA</span><i /></span>
            <span className="brand-copy"><strong>{profileData.name}</strong><small>AI · IOT · BUILDING · LEARNING</small></span>
          </a>
          <p className="footer-manifesto">Building, learning, and exploring the future of intelligent software.</p>
          <div className="footer-actions"><a href={profileData.resumePath} target="_blank" rel="noreferrer">Resume <ArrowUpRight size={14} /></a><button type="button" onClick={() => setChatOpen(true)}><MessageCircle size={14} /> Ask AI Chatbot</button></div>
        </div>
        <div className="page-container footer-bottom">
          <span>© {new Date().getFullYear()} {profileData.name}</span>
          <span className="footer-built">Built with React and curiosity.</span>
          {footerLinks.length > 0 ? <SocialLinks links={footerLinks} /> : <div className="footer-placeholder-links"><Github size={14} /><Linkedin size={14} /><span>Social links coming when configured</span></div>}
        </div>
      </footer>
      <PortfolioMascot onOpenChat={(prompt) => { setMascotPrompt(prompt); setChatOpen(true); }} />
      <ChatWidget open={chatOpen} onOpenChange={setChatOpen} initialPrompt={mascotPrompt} showLauncher={false} />
    </div>
  );
}
