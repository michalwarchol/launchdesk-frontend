"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { WorkloadItem } from "../types";

import styles from "./Charts.module.scss";
import { AXIS_TICK, CHART_COLORS } from "./chartTheme";
import ChartTooltip from "./ChartTooltip";

interface TeamWorkloadChartProps {
  data: WorkloadItem[];
  title: string;
  personLabel: string;
  countLabel: string;
}

export default function TeamWorkloadChart({
  data,
  title,
  personLabel,
  countLabel,
}: TeamWorkloadChartProps) {
  const chartData = data.map((item) => ({
    id: item.userId,
    name: item.name,
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
              width={120}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: CHART_COLORS.border }} />
            <Bar
              dataKey="count"
              name={countLabel}
              fill={CHART_COLORS.info}
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
              <th scope="col">{personLabel}</th>
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
