import { ArrowUpRight, Braces, Cpu, Network } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { codingInterests, profileData } from '../../shared/profileData.js';

function validProfileUrl(value: string) {
  if (!value || /your-username|your-profile|example\.com/i.test(value)) return '';
  try { const url = new URL(value); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; }
}

const groups = [
  { title: 'Problem-solving patterns', icon: Braces, values: codingInterests.slice(0, 8) },
  { title: 'Building & emerging tech', icon: Network, values: codingInterests.slice(8) },
];
const profileNames: Record<string, string> = { github: 'GitHub', leetcode: 'LeetCode', hackerrank: 'HackerRank', codechef: 'CodeChef', linkedin: 'LinkedIn' };

export default function CodingSection() {
  const visibleProfiles = Object.entries(profileData.codingProfiles).filter(([, url]) => validProfileUrl(url));
  return (
    <section className="coding-section page-section" id="coding" aria-labelledby="coding-title">
      <div className="page-container section-layout">
        <SectionHeading number="05" eyebrow="WHAT I LIKE TO EXPLORE" title="Thinking in systems." description="A frequent coder focused on Data Structures and Algorithms, problem solving, and intelligent products." />
        <div className="coding-content">
          <div className="coding-groups">
            {groups.map(({ title, icon: Icon, values }, index) => <article className="coding-group glass-card" key={title}>
              <div className="coding-group-heading"><span className="coding-icon"><Icon size={19} /></span><span className="eyebrow">{index === 0 ? '01 — FOUNDATIONS' : '02 — FRONTIERS'}</span></div>
              <h3>{title}</h3>
              <div className="coding-chip-list">{values.map((value) => <span className="coding-chip" key={value}>{value}</span>)}</div>
            </article>)}
          </div>
          <div className="profile-links-row">
            <div className="profile-links-label"><Cpu size={16} /><span>CODING PROFILES</span><small>Frequent coder · DSA practice</small></div>
            {visibleProfiles.length > 0 ? <div className="profile-links">{visibleProfiles.map(([key, value]) => <a href={validProfileUrl(value)} target="_blank" rel="noreferrer" key={key}><img src={`/logos/${key}.svg`} alt="" aria-hidden="true" />{profileNames[key]} <ArrowUpRight size={14} /></a>)}</div> : <p className="profiles-empty">Profile links have not been added yet.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
