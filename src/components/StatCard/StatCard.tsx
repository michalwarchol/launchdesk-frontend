import styles from "./StatCard.module.scss";

export type StatCardTone = "default" | "danger" | "success";

export interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  tone?: StatCardTone;
  className?: string;
}

export default function StatCard({
  label,
  value,
  hint,
  tone = "default",
  className,
}: StatCardProps) {
  const rootClassName = [styles.card, styles[tone], className].filter(Boolean).join(" ");

  return (
    <div className={rootClassName}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      {hint ? <span className={styles.hint}>{hint}</span> : null}
    </div>
  );
}
