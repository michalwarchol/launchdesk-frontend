import styles from "./ProgressBar.module.scss";

export interface ProgressBarProps {
  value: number;
  label: string;
  className?: string;
}

export default function ProgressBar({ value, label, className }: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, value));
  const percent = Math.round(clamped * 100);
  const percentLabel = `${percent}%`;

  return (
    <div
      className={[styles.track, className].filter(Boolean).join(" ")}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
    >
      <div className={styles.fill} style={{ width: `${percent}%` }} />
      <span className={styles.label} aria-hidden="true">
        {percentLabel}
      </span>
      <span
        className={styles.labelFilled}
        aria-hidden="true"
        style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
      >
        {percentLabel}
      </span>
    </div>
  );
}
