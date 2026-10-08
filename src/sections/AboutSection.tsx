import { BrainCircuit, Code2, GraduationCap, MoveUpRight, Sparkles } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';

const highlights = [
  { icon: BrainCircuit, title: 'AI & Machine Learning', copy: 'Exploring intelligent systems and emerging AI experiences.' },
  { icon: Code2, title: 'Full-Stack Development', copy: 'Connecting responsive interfaces with useful backend services.' },
  { icon: GraduationCap, title: 'Data Structures & Algorithms', copy: 'Practicing core concepts and strengthening problem solving.' },
  { icon: Sparkles, title: 'Continuous Learning', copy: 'Building, reflecting, and improving one project at a time.' },
];

export default function AboutSection() {
  return (
    <section className="about-section page-section" id="about" aria-labelledby="about-title">
      <div className="page-container section-layout">
        <SectionHeading number="01" eyebrow="A LITTLE ABOUT ME" title="Curiosity, made practical." description="I’m drawn to the ideas behind the interface—and to the process of turning those ideas into something useful." />
        <div className="about-content">
          <div className="about-copy">
            <p className="lead-copy">I’m <strong>Mubashir Ahmed</strong>, a B.Tech Internet of Things (IoT) student at VNR VJIET with a strong interest in Artificial Intelligence, Machine Learning, software development, and problem solving.</p>
            <p>I enjoy building practical applications that bring AI together with full-stack development, chatbot systems, APIs, and automation. I’m especially interested in understanding how technologies work behind the scenes, then turning a promising idea into a working project.</p>
            <p>I work with C, Java, Python, HTML, CSS, JavaScript, AI APIs, chatbot development, full-stack development, and MySQL. Alongside building, I actively practice data structures, algorithms, problem solving, and object-oriented programming.</p>
            <p>My goal is to grow as an AI/ML, full-stack, and IoT developer while building meaningful applications that solve real-world problems.</p>
            <a className="text-link about-link" href="#journey">Follow my learning journey <MoveUpRight size={15} /></a>
          </div>
          <div className="highlight-grid">
            {highlights.map(({ icon: Icon, title, copy }, index) => <article className="highlight-card glass-card" key={title}>
              <span className="highlight-index">0{index + 1}</span>
              <span className="highlight-icon"><Icon size={19} /></span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>)}
          </div>
        </div>
      </div>
    </section>
  );
}
