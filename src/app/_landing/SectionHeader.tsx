import shared from "./landing.module.scss";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  titleId: string;
  subtitle?: string;
}

export default function SectionHeader({ eyebrow, title, titleId, subtitle }: SectionHeaderProps) {
  return (
    <header className={shared.sectionHeader}>
      <span className={shared.eyebrow}>{eyebrow}</span>
      <h2 id={titleId} className={shared.title}>
        {title}
      </h2>
      {subtitle ? <p className={shared.subtitle}>{subtitle}</p> : null}
    </header>
  );
}
