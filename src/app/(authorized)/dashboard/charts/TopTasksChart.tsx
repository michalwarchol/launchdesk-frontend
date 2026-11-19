"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { TopTaskItem } from "../types";

import styles from "./Charts.module.scss";
import { AXIS_TICK, CHART_COLORS } from "./chartTheme";
import ChartTooltip from "./ChartTooltip";

interface TopTasksChartProps {
  data: TopTaskItem[];
  title: string;
  taskLabel: string;
  countLabel: string;
}

export default function TopTasksChart({ data, title, taskLabel, countLabel }: TopTasksChartProps) {
  const chartData = data.map((item) => ({
    id: item.taskId,
    name: item.taskName,
    count: item.count,
  }));

  return (
    <figure className={styles.figure}>
      <figcaption className={styles.visuallyHidden}>{title}</figcaption>
      <div className={styles.chartContainer} aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            accessibilityLayer={false}
            layout="vertical"
            margin={{ top: 0, right: 16, left: 8, bottom: 0 }}
          >
            <XAxis
              type="number"
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              width={140}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: CHART_COLORS.border }} />
            <Bar
              dataKey="count"
              name={countLabel}
              fill={CHART_COLORS.primary}
              radius={[0, 3, 3, 0]}
              maxBarSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.visuallyHidden}>
        <table>
          <caption>{title}</caption>
          <thead>
            <tr>
              <th scope="col">{taskLabel}</th>
              <th scope="col">{countLabel}</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item) => (
              <tr key={item.id}>
                <th scope="row">{item.name}</th>
                <td>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
