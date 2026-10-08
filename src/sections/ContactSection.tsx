import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowUpRight, Github, Linkedin, Mail, Send } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { profileData } from '../../shared/profileData.js';

function safeProfileUrl(value: string) {
  if (!value || /your-username|your-profile|example\.com/i.test(value)) return '';
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; }
}
function usableEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !/your-email|example\.com/i.test(value);
}

export default function ContactSection() {
  const [notice, setNotice] = useState('');
  const [noticeKind, setNoticeKind] = useState<'success' | 'info'>('info');
  const configuredEmail = usableEmail(profileData.contact.email);
  const socialLinks = useMemo(() => [
    { name: 'GitHub', url: safeProfileUrl(profileData.contact.github), icon: Github },
    { name: 'LinkedIn', url: safeProfileUrl(profileData.contact.linkedin), icon: Linkedin },
  ].filter((item) => item.url), []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    if (!configuredEmail) {
      setNoticeKind('info');
      setNotice('Your message is valid, but message delivery is not configured yet. Add a real email in shared/profileData.js to open a ready-to-send email draft.');
      return;
    }
    const subject = encodeURIComponent(`Portfolio message from ${String(data.get('name'))}`);
    const body = encodeURIComponent(`From: ${String(data.get('name'))} (${String(data.get('email'))})\n\n${String(data.get('message'))}`);
    setNoticeKind('success');
    setNotice('Opening your email app with a prepared message. You can review and send it there.');
    window.location.href = `mailto:${profileData.contact.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="contact-section page-section" id="contact" aria-labelledby="contact-title">
      <div className="page-container section-layout">
        <SectionHeading number="07" eyebrow="LET’S CONNECT" title="Good ideas start with a conversation." description="Have a project idea, collaboration thought, internship lead, or learning resource to share? I’d be glad to hear from you." />
        <div className="contact-layout">
          <div className="contact-aside">
            <div className="contact-aside-mark"><Mail size={22} /></div>
            <h3>Let’s make something useful.</h3>
            <p>Whether you want to discuss a project, share feedback, or simply connect around AI, IoT, and software, email is the best place to start.</p>
            <div className="contact-detail"><span>EMAIL</span><code>{profileData.contact.email}</code></div>
            <div className="contact-socials">
              {socialLinks.length > 0 ? socialLinks.map(({ name, url, icon: Icon }) => <a className="social-link" href={url} target="_blank" rel="noreferrer" key={name}><Icon size={16} /> {name} <ArrowUpRight size={13} /></a>) : <span className="social-placeholder">Profile links are not available.</span>}
            </div>
          </div>
          <form className="contact-form glass-card" onSubmit={handleSubmit}>
            <div className="form-heading"><span className="eyebrow">SEND A NOTE</span><span className="form-required"><i /> REQUIRED FIELDS</span></div>
            <div className="form-field-row">
              <div className="form-field"><label htmlFor="contact-name">Your name <span aria-hidden="true">*</span></label><input id="contact-name" name="name" type="text" placeholder="Jane Smith" autoComplete="name" minLength={2} maxLength={80} required /></div>
              <div className="form-field"><label htmlFor="contact-email">Your email <span aria-hidden="true">*</span></label><input id="contact-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" maxLength={120} required /></div>
            </div>
            <div className="form-field"><label htmlFor="contact-message">Message <span aria-hidden="true">*</span></label><textarea id="contact-message" name="message" placeholder="What would you like to talk about?" rows={5} minLength={10} maxLength={2000} required /></div>
            <div className="form-submit-row"><button className="button button--primary" type="submit">Send message <Send size={15} /></button><span className="form-privacy">No message is stored by this demo.</span></div>
            {notice && <p className={`form-notice form-notice--${noticeKind}`} role="status">{notice}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
