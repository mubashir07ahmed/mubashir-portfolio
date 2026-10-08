import { Binary, BrainCircuit, Code2, Layers3, ServerCog, Wrench } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import { skillGroups } from '../../shared/profileData.js';

const icons = { code: Code2, layers: Layers3, server: ServerCog, wrench: Wrench, binary: Binary, sparkles: BrainCircuit };
const learningStages = ['Core foundations', 'Building interfaces', 'Connecting systems', 'Automating workflows', 'Practicing patterns', 'Exploring applied AI'];

export default function SkillsSection() {
  return (
    <section className="skills-section page-section" id="skills" aria-labelledby="skills-title">
      <div className="page-container section-layout">
        <SectionHeading number="02" eyebrow="THE TOOLKIT" title="Skills in progress." description="A working toolkit built through coursework, practice, experimentation, and making things." />
        <div className="skills-grid">
          {skillGroups.map((group, index) => {
            const Icon = icons[group.icon as keyof typeof icons];
            return <article className="skill-card glass-card" key={group.title}>
              <div className="skill-card-heading"><span className="skill-icon"><Icon size={18} /></span><span className="skill-card-index">0{index + 1} / 06</span></div>
              <h3>{group.title}</h3>
              <p className="skill-card-stage"><span />{learningStages[index]}</p>
              <div className="skill-chip-list">{group.items.map((item) => <span className="skill-chip" key={item}>{item}</span>)}</div>
            </article>;
          })}
        </div>
        <div className="skills-summary" aria-label="Skills summary">
          <span><strong>{skillGroups.length}</strong> learning domains</span>
          <span><strong>{skillGroups.reduce((total, group) => total + group.items.length, 0)}</strong> working topics</span>
          <span><strong>01</strong> honest rule: no inflated ratings</span>
        </div>
        <p className="section-footnote"><span className="footnote-line" /> Listed technologies reflect current learning and experience; no proficiency ratings are implied.</p>
      </div>
    </section>
  );
}
