"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface EngineerStatsProps {
  monthToDateScore: number
  targetScore: number
  scoreBreakdown: {
    category: string
    score: number
    maxScore: number
  }[]
}

export function EngineerStats({
  monthToDateScore,
  targetScore,
  scoreBreakdown
}: EngineerStatsProps) {
  const progressPercentage = Math.round((monthToDateScore / targetScore) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Month to Date Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-3xl font-bold">{monthToDateScore.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">
                Target: {targetScore}%
              </p>
            </div>
            <div className="h-24 w-24 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-lg font-semibold">{progressPercentage}%</p>
              </div>
              <Progress
                value={progressPercentage}
                className="h-full w-full rounded-full"
              />
            </div>
          </div>
          <div className="space-y-2">
            {scoreBreakdown.map((item) => (
              <div key={item.category} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{item.category}</span>
                  <span className="font-medium">
                    {item.score}/{item.maxScore}
                  </span>
                </div>
                <Progress
                  value={(item.score / item.maxScore) * 100}
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
