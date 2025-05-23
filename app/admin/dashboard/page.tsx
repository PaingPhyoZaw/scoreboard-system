"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentScores } from "@/components/recent-scores"
import { RolePerformance } from "@/components/role-performance"
import { EngineerProgressCard } from "@/components/engineer-progress-card"
import { DashboardService, DashboardStats } from "@/lib/services/dashboard"
import { Loading } from "@/components/ui/loading"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashboardService = DashboardService.getInstance()
        const data = await dashboardService.getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <Loading text="Loading dashboard..." />
  }

  if (!stats) {
    return null
  }

  // Format data for charts
  const overviewData = stats.monthlyScores.map((score) => ({
    name: new Date(score.score_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    actual: score.total_score,
    target: score.target_score,
  }))

  // Calculate completion percentage
  const completionPercentage = stats.overallCompletion || 0

  return (
    <div className="space-y-6">
      <DashboardHeader heading="Dashboard" text="Monitor daily performance scores and progress against targets.">
        <Button asChild className="bg-black hover:bg-black/90 text-white">
          <Link href="/admin/scores/new">Record New Score</Link>
        </Button>
      </DashboardHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Overall Performance</p>
              <h2 className="text-2xl font-bold">{stats.overallCompletion ? `${stats.overallCompletion}%` : "0%"}</h2>
              <p className="text-xs text-muted-foreground">
                Team completion rate
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <h2 className="text-2xl font-bold">{stats.totalUsers || 0}</h2>
              <p className="text-xs text-muted-foreground">Active users in the system</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Team Average</p>
              <h2 className="text-2xl font-bold">{stats.teamAverageScore ? `${stats.teamAverageScore.toFixed(1)}` : "0"}</h2>
              <p className="text-xs text-muted-foreground">Points per evaluation</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Top Performer</p>
              <h2 className="text-2xl font-bold">{stats.topPerformer?.user.full_name || "No data"}</h2>
              <p className="text-xs text-muted-foreground">
                {stats.topPerformer?.user.role.name || "No role"} •{" "}
                {stats.topPerformer?.score ? `${stats.topPerformer.score.toFixed(0)} pts` : "0 pts"} •{" "}
                {stats.topPerformer?.completion ? `${stats.topPerformer.completion}%` : "0%"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={overviewData} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Role Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <RolePerformance data={stats.rolePerformanceData} />
          </CardContent>
        </Card>
      </div> */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">Engineer Performance</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.engineerStats.map((engineer) => (
            <EngineerProgressCard key={engineer.id} engineer={engineer} />
          ))}
        </div>
      </div>

      {/* <Card>
        <CardContent className="p-6">
          <div className="space-y-2 mb-4">
            <h3 className="font-semibold">Recent Scores</h3>
            <p className="text-sm text-muted-foreground">Latest performance evaluations across all roles</p>
          </div>
          <RecentScores scores={stats.monthlyScores.slice(-5)} />
        </CardContent>
      </Card> */}
    </div>
  )
}
