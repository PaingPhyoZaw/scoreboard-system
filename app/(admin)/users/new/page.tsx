import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { UserForm } from "@/components/user-form"
import { getRoles } from "@/app/actions"

export default async function NewUserPage() {
  const roles = await getRoles()

  return (
    <div className="space-y-6">
      <DashboardHeader heading="Add New User" text="Create a new user account.">
        <Button variant="outline" size="sm" asChild>
          <Link href="/users" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Link>
        </Button>
      </DashboardHeader>

      <Card>
        <UserForm roles={roles} />
      </Card>
    </div>
  )
}
