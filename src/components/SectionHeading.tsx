type SectionHeadingProps = {
  number: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'right';
};

const titleIds: Record<string, string> = {
  '01': 'about-title', '02': 'skills-title', '03': 'projects-title', '04': 'journey-title',
  '05': 'coding-title', '06': 'resume-title', '07': 'contact-title',
};

export default function SectionHeading({ number, eyebrow, title, description, align = 'left' }: SectionHeadingProps) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      <div className="section-index"><span>{number}</span><i /></div>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={titleIds[number] ?? `section-title-${number}`}>{title}</h2>
      {description && <p className="section-intro">{description}</p>}
    </div>
  );
}
