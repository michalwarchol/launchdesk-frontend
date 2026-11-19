"use client";

import { useId } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { MonthlyActivityItem } from "../types";

import styles from "./Charts.module.scss";
import { AXIS_TICK, CHART_COLORS } from "./chartTheme";
import ChartTooltip from "./ChartTooltip";

interface AssignmentActivityChartProps {
  data: MonthlyActivityItem[];
  title: string;
  monthLabel: string;
  createdLabel: string;
  completedLabel: string;
}

export default function AssignmentActivityChart({
  data,
  title,
  monthLabel,
  createdLabel,
  completedLabel,
}: AssignmentActivityChartProps) {
  const patternId = `completed-hatch-${useId().replace(/:/g, "")}`;
  const chartData = data.map((item) => ({
    monthKey: item.monthKey,
    month: item.monthLabel,
    created: item.created,
    completed: item.completed,
  }));

  return (
    <figure className={styles.figure}>
      <figcaption className={styles.visuallyHidden}>{title}</figcaption>
      <div className={styles.chartContainer} aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            accessibilityLayer={false}
            barGap={4}
            barCategoryGap="20%"
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <defs>
              <pattern
                id={patternId}
                width="6"
                height="6"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <rect width="6" height="6" fill={CHART_COLORS.success} />
                <line x1="0" y1="0" x2="0" y2="6" stroke={CHART_COLORS.surface} strokeWidth="2" />
              </pattern>
            </defs>
            <CartesianGrid stroke={CHART_COLORS.border} vertical={false} />
            <XAxis dataKey="month" tick={AXIS_TICK} tickLine={false} axisLine={false} />
            <YAxis
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              width={36}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: CHART_COLORS.border }} />
            <Bar
              dataKey="created"
              name={createdLabel}
              fill={CHART_COLORS.primary}
              radius={[3, 3, 0, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="completed"
              name={completedLabel}
              fill={`url(#${patternId})`}
              radius={[3, 3, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.visuallyHidden}>
        <table>
          <caption>{title}</caption>
          <thead>
            <tr>
              <th scope="col">{monthLabel}</th>
              <th scope="col">{createdLabel}</th>
              <th scope="col">{completedLabel}</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item) => (
              <tr key={item.monthKey}>
                <th scope="row">{item.month}</th>
                <td>{item.created}</td>
                <td>{item.completed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className={styles.legend}>
        <li className={styles.legendItem}>
          <span className={styles.legendDot} style={{ backgroundColor: CHART_COLORS.primary }} />
          <span className={styles.legendLabel}>{createdLabel}</span>
        </li>
        <li className={styles.legendItem}>
          <span
            className={styles.legendDot}
            style={{
              backgroundColor: CHART_COLORS.success,
              backgroundImage: `repeating-linear-gradient(45deg, ${CHART_COLORS.surface} 0 2px, transparent 2px 6px)`,
            }}
          />
          <span className={styles.legendLabel}>{completedLabel}</span>
        </li>
      </ul>
    </figure>
  );
}
