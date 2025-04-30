import { DashboardHeader } from "@/components/dashboard-header"
import { Loading } from "@/components/ui/loading"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default function LoadingUsersPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader heading="Users" text="Manage user accounts and permissions.">
        <Button asChild className="bg-black hover:bg-black/90 text-white">
          <Link href="/users/new">
            <Plus className="mr-2 h-4 w-4" />
            New User
          </Link>
        </Button>
      </DashboardHeader>
      <Loading text="Loading users..." />
    </div>
  )
}
