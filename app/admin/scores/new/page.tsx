import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { NewScoreForm } from "@/components/new-score-form"
import { getUsers, getRoles } from "@/app/actions"

export default async function NewScorePage() {
  const users = await getUsers()
  const roles = await getRoles()

  return (
    <div className="space-y-6">
      <DashboardHeader heading="Record New Score" text="Create a new performance evaluation record.">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/scores" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Scores
          </Link>
        </Button>
      </DashboardHeader>

      <Card>
        <NewScoreForm users={users} roles={roles} />
      </Card>
    </div>
  )
}
