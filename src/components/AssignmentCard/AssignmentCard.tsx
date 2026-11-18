import Link from "next/link";

import styles from "./AssignmentCard.module.scss";

export interface AssignmentCardProps {
  href: string;
  name: string;
  description: string;
  dueDateLabel: string;
  dueDate: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

const HEADINGS = { 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "h5", 6: "h6" } as const;

export default function AssignmentCard({
  href,
  name,
  description,
  dueDateLabel,
  dueDate,
  headingLevel = 2,
}: AssignmentCardProps) {
  const Heading = HEADINGS[headingLevel];

  return (
    <Link href={href} className={styles.card}>
      <Heading className={styles.name}>{name}</Heading>
      <p className={styles.description}>{description}</p>
      <p className={styles.dueDate}>
        <span className={styles.dueDateLabel}>{dueDateLabel}</span>
        <span>{dueDate}</span>
      </p>
    </Link>
  );
}
