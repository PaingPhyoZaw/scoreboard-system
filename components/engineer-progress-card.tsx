"use client"

import { Card, CardContent } from "@/components/ui/card"

interface EngineerProgressCardProps {
  engineer: {
    id: string
    name: string
    role: string
    totalScore: number
    maxPossibleScore: number
  }
}

export function EngineerProgressCard({ engineer }: EngineerProgressCardProps) {
  const progressPercentage = Math.round((engineer.totalScore / engineer.maxPossibleScore) * 100)
  
  // Color based on progress percentage
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "rgb(34, 197, 94)" // green-500
    if (percentage >= 70) return "rgb(59, 130, 246)" // blue-500
    if (percentage >= 50) return "rgb(234, 179, 8)" // yellow-500
    return "rgb(239, 68, 68)" // red-500
  }

  const progressColor = getProgressColor(progressPercentage)
  const progressBackground = `conic-gradient(${progressColor} ${progressPercentage}%, rgb(243 244 246) ${progressPercentage}%)`

  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold truncate text-lg">{engineer.name}</h3>
              <p className="text-sm text-muted-foreground">{engineer.role}</p>
            </div>
            <div className="relative h-20 w-20">
              {/* Outer circle with gradient */}
              <div 
                className="absolute inset-0 rounded-full transition-all duration-700 ease-in-out"
                style={{
                  background: progressBackground,
                  transform: "rotate(-90deg)"
                }}
              />
              {/* Inner white circle */}
              <div className="absolute inset-[3px] bg-white rounded-full" />
              {/* Progress text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xl font-semibold" style={{ color: progressColor }}>
                    {progressPercentage}%
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                <span className="font-semibold" style={{ color: progressColor }}>{engineer.totalScore}</span>
                <span className="text-muted-foreground"> / {engineer.maxPossibleScore}</span>
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-700 ease-in-out rounded-full"
                style={{ 
                  width: `${progressPercentage}%`,
                  backgroundColor: progressColor
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
