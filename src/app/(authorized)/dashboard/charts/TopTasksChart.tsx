"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { TopTaskItem } from "../types";

import styles from "./Charts.module.scss";
import { AXIS_TICK, CHART_COLORS } from "./chartTheme";
import ChartTooltip from "./ChartTooltip";

interface TopTasksChartProps {
  data: TopTaskItem[];
  countLabel: string;
}

export default function TopTasksChart({ data, countLabel }: TopTasksChartProps) {
  const chartData = data.map((item) => ({ name: item.taskName, count: item.count }));

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
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
  );
}
