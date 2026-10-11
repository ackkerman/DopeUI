"use client";
// This file guarantees the preview and copyable application example use the same component.
// This file guarantees the examples compose canonical UI components with shared, local state.
import { useId, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ArrowUpRight, MoreHorizontal } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AnimatedCounter } from "../../library/components/animated-counter";
import SlidingTabs from "../../library/components/sliding-tabs";
import "../showcase-previews.css";
function cn(...values: ClassValue[]) {
  return twMerge(clsx(values));
}
function AppTitle({
  label,
  children,
}: {
  label: string;
  children?: import("react").ReactNode;
}) {
  return (
    <div className={cn("sc-title")}>
      <strong>{label}</strong>
      <div>{children ?? <MoreHorizontal size={16} aria-hidden />}</div>
    </div>
  );
}
export default function AnalyticsPanel() {
  const [period, setPeriod] = useState<0 | 1 | 2>(0);
  const gradientId = useId().replace(/:/g, "");
  const series = [
    [2100, 1850, 2440, 2220, 3010, 2840, 3960],
    [2600, 2820, 3010, 3360, 3520, 4010, 4760],
    [3210, 3660, 3940, 4220, 4880, 5670, 6300],
  ];
  const data = series[period].map((visitors, index) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
    visitors,
  }));
  const total = data.reduce((sum, point) => sum + point.visitors, 0);
  return (
    <div
      className={cn("sc-app sc-analytics")}
      data-component-layout="interaction"
    >
      <AppTitle label="Overview" />
      <p className={cn("sc-muted")}>Total visitors</p>
      <AnimatedCounter value={total} className={cn("sc-large-number")} />
      <span className={cn("sc-trend")}>
        <ArrowUpRight size={13} />
        {[12.8, 18.4, 24.2][period]}% this week
      </span>
      <div
        className={cn("sc-chart")}
        role="img"
        aria-label={`Weekly visitors: ${data.map((point) => `${point.day} ${point.visitors}`).join(", ")}. Total ${total.toLocaleString()}.`}
      >
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 8, bottom: 0, left: -22 }}
            accessibilityLayer
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#416C91" stopOpacity={0.24} />
                <stop offset="100%" stopColor="#416C91" stopOpacity={0.015} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="#E5E9F0"
              strokeDasharray="3 4"
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#788493", fontSize: 10 }}
              tickMargin={12}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#788493", fontSize: 10 }}
              tickFormatter={(value) => `${value / 1000}k`}
              tickCount={4}
              domain={[0, "auto"]}
            />
            <Tooltip
              cursor={{ stroke: "#A3B4C4", strokeDasharray: "3 4" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #E5E9F0",
                boxShadow: "0 4px 18px #2E344014",
                fontSize: 12,
              }}
              formatter={(value) => [
                Number(value).toLocaleString(),
                "Visitors",
              ]}
              labelStyle={{ color: "#788493", marginBottom: 4 }}
            />
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="#416C91"
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              activeDot={{ r: 4, stroke: "white", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <SlidingTabs value={period} onValueChange={setPeriod} />
    </div>
  );
}
