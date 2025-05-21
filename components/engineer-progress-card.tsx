"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface EngineerProgressCardProps {
  engineer: {
    id: string
    name: string
    role: string
    monthToDateScore: number
    targetScore: number
    scoreBreakdown: {
      category: string
      score: number
      maxScore: number
    }[]
  }
}

export function EngineerProgressCard({ engineer }: EngineerProgressCardProps) {
  const progressPercentage = Math.round((engineer.monthToDateScore / engineer.targetScore) * 100)

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold truncate">{engineer.name}</h3>
              <p className="text-sm text-muted-foreground">{engineer.role}</p>
            </div>
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-sm font-medium">{progressPercentage}%</p>
              </div>
              <Progress
                value={progressPercentage}
                className="h-full w-full rounded-full bg-muted"
                style={{
                  background: `conic-gradient(from 0deg at 50% 50%, rgb(99 102 241) ${progressPercentage}%, rgb(229 231 235) ${progressPercentage}%)`
                }}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span>Current Score</span>
              <span className="font-medium">{engineer.monthToDateScore.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Target</span>
              <span className="font-medium">{engineer.targetScore}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
