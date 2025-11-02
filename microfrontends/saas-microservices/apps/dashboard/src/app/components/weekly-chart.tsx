"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface WeeklyChartProps {
  chartData: Array<{
    day: string;
    value: number;
    color: string;
  }>;
}

export function WeeklyChart({ chartData }: WeeklyChartProps) {
  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Weekly Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Sales performance for this week
        </p>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="flex h-full w-full items-center justify-center">
          <svg
            className="w-full h-[280px]"
            viewBox="0 0 400 240"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Gradients for bars */}
              {chartData.map((_, index) => (
                <linearGradient
                  key={`gradient-${index}`}
                  id={`gradient-${index}`}
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor={chartData[index].color}
                    stopOpacity="0.8"
                  />
                  <stop
                    offset="100%"
                    stopColor={chartData[index].color}
                    stopOpacity="0.3"
                  />
                </linearGradient>
              ))}

              {/* Grid pattern */}
              <pattern
                id="grid"
                width="40"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 20"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </pattern>
            </defs>

            {/* Background grid */}
            <rect
              x="60"
              y="20"
              width="300"
              height="160"
              fill="url(#grid)"
              opacity="0.5"
            />

            {/* Y-axis labels and grid lines */}
            {[0, 25, 50, 75, 100].map((value, index) => {
              const y = 180 - (value / 100) * 160;
              return (
                <g key={value}>
                  <line
                    x1="60"
                    y1={y}
                    x2="360"
                    y2={y}
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                    opacity="0.2"
                  />
                  <text
                    x="50"
                    y={y + 4}
                    textAnchor="end"
                    fontSize="11"
                    fill="hsl(var(--muted-foreground))"
                    className="font-medium"
                  >
                    {value}
                  </text>
                </g>
              );
            })}

            {/* X and Y axis */}
            <line
              x1="60"
              y1="20"
              x2="60"
              y2="180"
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />
            <line
              x1="60"
              y1="180"
              x2="360"
              y2="180"
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />

            {/* Bars without animation */}
            {chartData.map((data, index) => {
              const barHeight = (data.value / maxValue) * 140;
              const x = 90 + index * 50;
              const y = 180 - barHeight;

              return (
                <g key={data.day}>
                  {/* Bar shadow */}
                  <rect
                    x={x + 2}
                    y={y + 2}
                    width="35"
                    height={barHeight}
                    fill="hsl(var(--foreground))"
                    opacity="0.1"
                    rx="8"
                  />

                  {/* Main bar */}
                  <rect
                    x={x}
                    y={y}
                    width="35"
                    height={barHeight}
                    fill={`url(#gradient-${index})`}
                    rx="8"
                    className="transition-all duration-300 hover:opacity-80"
                  />

                  {/* Value labels on top of bars */}
                  <text
                    x={x + 17.5}
                    y={y - 8}
                    textAnchor="middle"
                    fontSize="12"
                    fill="hsl(var(--foreground))"
                    className="font-semibold"
                    opacity="1"
                  >
                    {data.value}
                  </text>

                  {/* Day labels */}
                  <text
                    x={x + 17.5}
                    y="200"
                    textAnchor="middle"
                    fontSize="12"
                    fill="hsl(var(--muted-foreground))"
                    className="font-medium"
                  >
                    {data.day}
                  </text>
                </g>
              );
            })}

            {/* Trend line without animation */}
            <path
              d={`M ${90 + 17.5} ${
                180 - (chartData[0].value / maxValue) * 140
              } ${chartData
                .map(
                  (data, index) =>
                    `L ${90 + index * 50 + 17.5} ${
                      180 - (data.value / maxValue) * 140
                    }`
                )
                .join(" ")}`}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />

            {/* Data points on trend line without animation */}
            {chartData.map((data, index) => {
              const cx = 90 + index * 50 + 17.5;
              const cy = 180 - (data.value / maxValue) * 140;

              return (
                <circle
                  key={`point-${index}`}
                  cx={cx}
                  cy={cy}
                  r="4"
                  fill="hsl(var(--background))"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  opacity="1"
                />
              );
            })}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
