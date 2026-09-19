"use client";

import styles from "./ChartTooltip.module.scss";

interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}

export default function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className={styles.tooltip}>
      {label !== undefined && label !== "" ? <span className={styles.label}>{label}</span> : null}
      <ul className={styles.list}>
        {payload.map((entry, index) => (
          <li key={index} className={styles.row}>
            <span className={styles.dot} style={{ backgroundColor: entry.color }} />
            <span className={styles.name}>{entry.name}</span>
            <span className={styles.value}>{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
