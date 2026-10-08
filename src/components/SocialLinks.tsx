import { ArrowUpRight } from 'lucide-react';

export default function SocialLinks({ links }: { links: { name: string; url: string }[] }) {
  return <div className="footer-socials">{links.map((link) => { const logo = link.name === 'GitHub' ? '/logos/github.svg' : link.name === 'LinkedIn' ? '/logos/linkedin.svg' : ''; return <a href={link.url} key={link.name} target="_blank" rel="noreferrer" aria-label={`${link.name} profile`}>{logo ? <img src={logo} alt="" aria-hidden="true" /> : <span>{link.name}</span>}<ArrowUpRight className="footer-link-arrow" size={11} /></a>; })}</div>;
}
