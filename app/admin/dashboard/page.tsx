"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentScores } from "@/components/recent-scores"
import { RolePerformance } from "@/components/role-performance"
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

  // Calculate target completion
  const targetCompletion = stats.topPerformer
    ? Math.round((stats.averageScore / stats.topPerformer.target_score) * 100)
    : 0

  const remainingToTarget = 100 - targetCompletion

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
              <p className="text-sm text-muted-foreground">Most improved</p>
              <h2 className="text-3xl font-bold">{stats.topPerformer?.user.full_name || "No data"}</h2>
              <p className="text-xs text-muted-foreground">
                {stats.topPerformer?.user.role.name || "No role"}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <h2 className="text-3xl font-bold">{stats.totalUsers || 0}</h2>
              <p className="text-xs text-muted-foreground">Active users in the system</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Average Score</p>
              <h2 className="text-3xl font-bold">{stats.averageScore ? `${stats.averageScore.toFixed(1)}%` : "0%"}</h2>
              <p className="text-xs text-muted-foreground">Based on recent evaluations</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Top performer this month</p>
              <h2 className="text-3xl font-bold">{stats.topPerformer?.user.full_name || "No data"}</h2>
              <p className="text-xs text-muted-foreground">
                {stats.topPerformer?.user.role.name || "No role"} -{" "}
                {stats.topPerformer?.total_score ? `${stats.topPerformer.total_score.toFixed(1)}%` : "0%"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-2 mb-4">
            <h3 className="font-semibold">Recent Scores</h3>
            <p className="text-sm text-muted-foreground">Latest performance evaluations across all roles</p>
          </div>
          <RecentScores scores={stats.monthlyScores.slice(-5)} />
        </CardContent>
      </Card>
    </div>
  )
}
