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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const configuredEmail = usableEmail(profileData.contact.email);
  const emailHref = configuredEmail ? `mailto:${profileData.contact.email}` : '#contact';
  const socialLinks = useMemo(() => [
    { name: 'GitHub', url: safeProfileUrl(profileData.contact.github), icon: Github },
    { name: 'LinkedIn', url: safeProfileUrl(profileData.contact.linkedin), icon: Linkedin },
  ].filter((item) => item.url), []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (isSubmitting || !form.reportValidity()) return;
    const data = new FormData(form);
    if (!configuredEmail) {
      setNoticeKind('info');
      setNotice('Your message is valid, but delivery is not configured yet. Please use the direct email link instead.');
      return;
    }

    setIsSubmitting(true);
    setNoticeKind('info');
    setNotice('Sending your message securely…');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(data.get('name') ?? ''),
          email: String(data.get('email') ?? ''),
          message: String(data.get('message') ?? ''),
          companyFax: String(data.get('companyFax') ?? ''),
        }),
      });
      const result = await response.json().catch(() => ({})) as { ok?: boolean };
      if (!response.ok || !result.ok) throw new Error('Contact delivery was not accepted.');
      setNoticeKind('success');
      setNotice('Thanks—your message was accepted for email delivery to Mubashir.');
      form.reset();
    } catch {
      setNoticeKind('info');
      setNotice('We could not send your message just now. Please use the direct email link to contact Mubashir.');
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="contact-detail"><span>EMAIL</span><a className="contact-email-link" href={emailHref} aria-label={`Email ${profileData.name}`}><code>{profileData.contact.email}</code><ArrowUpRight size={14} aria-hidden="true" /></a></div>
            <div className="contact-socials">
              {socialLinks.length > 0 ? socialLinks.map(({ name, url, icon: Icon }) => <a className="social-link" href={url} target="_blank" rel="noreferrer" key={name}><Icon size={16} /> {name} <ArrowUpRight size={13} /></a>) : <span className="social-placeholder">Profile links are not available.</span>}
            </div>
            {configuredEmail && <a className="button button--outline contact-email-cta" href={emailHref}><Mail size={15} /> Email Mubashir <ArrowUpRight size={13} /></a>}
          </div>
          <form className="contact-form glass-card" onSubmit={handleSubmit} aria-busy={isSubmitting}>
            <div className="form-heading"><span className="eyebrow">SEND A NOTE</span><span className="form-required"><i /> REQUIRED FIELDS</span></div>
            <div className="form-field-row">
              <div className="form-field"><label htmlFor="contact-name">Your name <span aria-hidden="true">*</span></label><input id="contact-name" name="name" type="text" placeholder="Jane Smith" autoComplete="name" minLength={2} maxLength={80} required /></div>
              <div className="form-field"><label htmlFor="contact-email">Your email <span aria-hidden="true">*</span></label><input id="contact-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" maxLength={120} required /></div>
            </div>
            <div className="form-field"><label htmlFor="contact-message">Message <span aria-hidden="true">*</span></label><textarea id="contact-message" name="message" placeholder="What would you like to talk about?" rows={5} minLength={10} maxLength={2000} required /></div>
            <div className="contact-honeypot" aria-hidden="true"><label htmlFor="contact-company-fax">Leave this field blank</label><input id="contact-company-fax" name="companyFax" type="text" tabIndex={-1} autoComplete="off" /></div>
            <div className="form-submit-row"><button className="button button--primary" type="submit" disabled={isSubmitting}><span>{isSubmitting ? 'Sending…' : 'Send message'}</span><Send size={15} aria-hidden="true" /></button><span className="form-privacy">Submissions are emailed; this site does not store them in its own database.</span></div>
            {notice && <p className={`form-notice form-notice--${noticeKind}`} role="status" aria-live="polite">{notice}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
