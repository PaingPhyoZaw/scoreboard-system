"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface OverviewProps {
  data: {
    name: string
    actual: number
    target: number
  }[]
}

export function Overview({ data }: OverviewProps) {
  const defaultData = [
    {
      name: "Week 1",
      actual: 65,
      target: 70,
    },
    {
      name: "Week 2",
      actual: 72,
      target: 75,
    },
    {
      name: "Week 3",
      actual: 78,
      target: 80,
    },
    {
      name: "Week 4",
      actual: 82,
      target: 85,
    },
    {
      name: "Week 5",
      actual: 85,
      target: 90,
    },
  ]

  return (
    <ChartContainer
      config={{
        actual: {
          label: "Actual Score",
          color: "hsl(165, 60%, 45%)",
        },
        target: {
          label: "Target Score",
          color: "hsl(15, 80%, 60%)",
        },
      }}
      className="h-[300px]"
    >
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} stroke="#888" fontSize={12} />
        <YAxis tickLine={false} axisLine={false} tickMargin={10} domain={[0, 100]} stroke="#888" fontSize={12} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="actual"
          strokeWidth={2}
          activeDot={{ r: 6 }}
          stroke="var(--color-actual)"
          dot={{ stroke: "var(--color-actual)", strokeWidth: 2, r: 4, fill: "white" }}
        />
        <Line
          type="monotone"
          dataKey="target"
          strokeWidth={2}
          stroke="var(--color-target)"
          strokeDasharray="4 4"
          dot={{ stroke: "var(--color-target)", strokeWidth: 2, r: 4, fill: "white" }}
        />
      </LineChart>
    </ChartContainer>
  )
}
