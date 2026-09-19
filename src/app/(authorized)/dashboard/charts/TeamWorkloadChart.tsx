"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { WorkloadItem } from "../types";

import styles from "./Charts.module.scss";
import { AXIS_TICK, CHART_COLORS } from "./chartTheme";
import ChartTooltip from "./ChartTooltip";

interface TeamWorkloadChartProps {
  data: WorkloadItem[];
  countLabel: string;
}

export default function TeamWorkloadChart({ data, countLabel }: TeamWorkloadChartProps) {
  const chartData = data.map((item) => ({ name: item.name, count: item.count }));

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
  );
}
