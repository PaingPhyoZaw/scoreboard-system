import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScoresList } from "@/components/scores-list"
import Link from "next/link"
import { Plus } from "lucide-react"
import { getUsers, getRoles } from "@/app/actions"
import type { User, Role } from "@/types/supabase"

export default async function ScoresPage() {
  const [users, roles]: [User[], Role[]] = await Promise.all([
    getUsers(),
    getRoles(),
  ])

  return (
    <div className="space-y-6">
      <DashboardHeader heading="Performance Scores" text="View and manage daily performance evaluations.">
        <Button asChild className="bg-black hover:bg-black/90 text-white">
          <Link href="/scores/new">
            <Plus className="mr-2 h-4 w-4" />
            New Score
          </Link>
        </Button>
      </DashboardHeader>
      <ScoresList users={users} roles={roles} />
    </div>
  )
}
