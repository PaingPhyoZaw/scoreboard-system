import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentScores } from "@/components/recent-scores"
import { RolePerformance } from "@/components/role-performance"
import { getDashboardStats } from "@/app/actions"

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  // Format data for charts
  const overviewData =
    stats.monthlyScores?.map((score) => ({
      name: new Date(score.score_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      actual: score.total_score,
      target: score.target_score,
    })) || []

  // Calculate target completion
  const targetCompletion =
    stats.averageScore > 0 && stats.topPerformer?.target_score > 0
      ? Math.round((stats.averageScore / stats.topPerformer.target_score) * 100)
      : 0

  const remainingToTarget = 100 - targetCompletion

  return (
    <div className="space-y-6">
      <DashboardHeader heading="Dashboard" text="Monitor daily performance scores and progress against targets.">
        <Button asChild className="bg-black hover:bg-black/90 text-white">
          <Link href="/scores/new">Record New Score</Link>
        </Button>
      </DashboardHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
              <p className="text-sm font-medium text-muted-foreground">Target Completion</p>
              <h2 className="text-3xl font-bold">{targetCompletion}%</h2>
              <p className="text-xs text-muted-foreground">{remainingToTarget}% remaining to reach target</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Top Performer</p>
              <h2 className="text-3xl font-bold">
                {stats.topPerformer?.users?.full_name
                  ? stats.topPerformer.users.full_name.split(" ")[0] +
                    " " +
                    stats.topPerformer.users.full_name.split(" ")[1]?.charAt(0) +
                    "."
                  : "N/A"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {stats.topPerformer?.users?.roles?.name} - {stats.topPerformer?.total_score}% score
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
          <RecentScores scores={stats.recentScores || []} />
        </CardContent>
      </Card>
    </div>
  )
}
