import styles from "./Card.module.scss";

export interface CardProps {
  title?: string;
  description?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  children?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  /** When set, the heading becomes the focus target after a view change. */
  headingRef?: React.Ref<HTMLHeadingElement>;
}

const HEADINGS = { 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "h5", 6: "h6" } as const;

export default function Card({
  title,
  description,
  headingLevel = 2,
  children,
  className,
  bodyClassName,
  headingRef,
}: CardProps) {
  const rootClassName = [styles.card, className].filter(Boolean).join(" ");
  const innerClassName = [styles.body, bodyClassName].filter(Boolean).join(" ");
  const Heading = HEADINGS[headingLevel];

  return (
    <section className={rootClassName}>
      {title || description ? (
        <header className={styles.header}>
          {title ? (
            <Heading
              ref={headingRef}
              className={styles.title}
              tabIndex={headingRef ? -1 : undefined}
            >
              {title}
            </Heading>
          ) : null}
          {description ? <p className={styles.description}>{description}</p> : null}
        </header>
      ) : null}
      <div className={innerClassName}>{children}</div>
    </section>
  );
}
