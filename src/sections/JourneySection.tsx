import { ArrowRight, CircleDot, GraduationCap, Sparkles } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { learningJourney, profileData } from '../../shared/profileData.js';

export default function JourneySection() {
  return (
    <section className="journey-section page-section" id="journey" aria-labelledby="journey-title">
      <div className="page-container section-layout journey-layout">
        <SectionHeading number="04" eyebrow="EXPERIENCE & LEARNING" title="My learning journey." description="A snapshot of what I’m studying, practicing, building, and exploring right now." />
        <div className="journey-content">
          <div className="journey-callout glass-card"><span className="journey-callout-icon"><img src="/logos/vnr-vjiet.png" alt="VNR VJIET logo" /></span><div><p className="eyebrow">CURRENT CHAPTER</p><h3>B.Tech in Internet of Things (IoT)</h3><p>Studying at VNR Vignana Jyothi Institute of Engineering and Technology, expected graduation 2029.</p></div><span className="current-tag"><i /> Current</span></div>
          <ol className="journey-timeline">
            {learningJourney.slice(1).map((item, index) => <li className="journey-item" key={item.title}>
              <span className="journey-point" aria-hidden="true">{index === 3 ? <Sparkles size={14} /> : <CircleDot size={14} />}</span>
              <div className="journey-item-copy"><span className="journey-step">STEP 0{index + 1} <ArrowRight size={12} /></span><h3>{item.title}</h3><p>{item.detail}</p></div>
            </li>)}
          </ol>
          <div className="achievements-panel glass-card"><p className="eyebrow">ACHIEVEMENTS</p><div className="achievement-list">{profileData.achievements.map((achievement) => <article key={achievement.title}><img className="achievement-logo" src={achievement.logo} alt={`${achievement.organization} logo`} /><div><strong>{achievement.title}</strong><span>{achievement.organization}</span><p>{achievement.detail}</p></div></article>)}</div></div>
        </div>
      </div>
    </section>
  );
}
