"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { AssignmentStatus, StatusBreakdownItem } from "../types";

import styles from "./Charts.module.scss";
import { CHART_COLORS, STATUS_COLORS } from "./chartTheme";
import ChartTooltip from "./ChartTooltip";

interface AssignmentStatusChartProps {
  data: StatusBreakdownItem[];
  labels: Record<AssignmentStatus, string>;
  totalLabel: string;
  total: number;
}

export default function AssignmentStatusChart({
  data,
  labels,
  totalLabel,
  total,
}: AssignmentStatusChartProps) {
  const chartData = data.map((item) => ({
    status: item.status,
    count: item.count,
    label: labels[item.status],
  }));

  return (
    <div>
      <div className={styles.donutWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="label"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={2}
              stroke={CHART_COLORS.surface}
              strokeWidth={2}
            >
              {chartData.map((entry) => (
                <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className={styles.donutCenter}>
          <span className={styles.donutTotal}>{total}</span>
          <span className={styles.donutCaption}>{totalLabel}</span>
        </div>
      </div>
      <ul className={styles.legend}>
        {chartData.map((entry) => (
          <li key={entry.status} className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ backgroundColor: STATUS_COLORS[entry.status] }}
            />
            <span className={styles.legendLabel}>{entry.label}</span>
            <span className={styles.legendValue}>{entry.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
