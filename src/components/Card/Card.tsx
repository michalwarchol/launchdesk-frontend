import styles from "./Card.module.scss";

export interface CardProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export default function Card({
  title,
  description,
  children,
  className,
  bodyClassName,
}: CardProps) {
  const rootClassName = [styles.card, className].filter(Boolean).join(" ");
  const innerClassName = [styles.body, bodyClassName].filter(Boolean).join(" ");

  return (
    <section className={rootClassName}>
      {title || description ? (
        <header className={styles.header}>
          {title ? <h2 className={styles.title}>{title}</h2> : null}
          {description ? <p className={styles.description}>{description}</p> : null}
        </header>
      ) : null}
      <div className={innerClassName}>{children}</div>
    </section>
  );
}
