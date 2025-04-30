import { DashboardHeader } from "@/components/dashboard-header"
import { Loading } from "@/components/ui/loading"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function LoadingScoresPage() {
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
      <Loading text="Loading scores..." />
    </div>
  )
}
