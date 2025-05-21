"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface RolePerformanceProps {
  data: {
    role: string
    average_score: number
    total_scores: number
  }[]
}

export function RolePerformance({ data }: RolePerformanceProps) {
  const chartData = data.map(item => ({
    name: item.role,
    score: item.average_score,
    target: 85, // Default target score, you might want to make this configurable
    total: item.total_scores
  }))

  const defaultData = [
    {
      name: "Engineer",
      score: 85,
      target: 90,
    },
    {
      name: "Service Admin",
      score: 78,
      target: 85,
    },
    {
      name: "Store",
      score: 72,
      target: 80,
    },
    {
      name: "Reception",
      score: 80,
      target: 85,
    },
  ]

  return (
    <ChartContainer
      config={{
        score: {
          label: "Current Score",
          color: "hsl(165, 60%, 45%)",
        },
        target: {
          label: "Target Score",
          color: "hsl(15, 80%, 60%)",
        },
      }}
      className="h-[300px]"
    >
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 20,
        }}
        barGap={8}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} stroke="#888" fontSize={12} />
        <YAxis tickLine={false} axisLine={false} tickMargin={10} domain={[0, 100]} stroke="#888" fontSize={12} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="score" fill="var(--color-score)" radius={4} maxBarSize={40} />
        <Bar dataKey="target" fill="var(--color-target)" radius={4} maxBarSize={40} />
      </BarChart>
    </ChartContainer>
  )
}
