import Link from "next/link";

import styles from "./AssignmentCard.module.scss";

export interface AssignmentCardProps {
  href: string;
  name: string;
  description: string;
  dueDateLabel: string;
  dueDate: string;
}

export default function AssignmentCard({
  href,
  name,
  description,
  dueDateLabel,
  dueDate,
}: AssignmentCardProps) {
  return (
    <Link href={href} className={styles.card}>
      <h2 className={styles.name}>{name}</h2>
      <p className={styles.description}>{description}</p>
      <p className={styles.dueDate}>
        <span className={styles.dueDateLabel}>{dueDateLabel}</span>
        <span>{dueDate}</span>
      </p>
    </Link>
  );
}
