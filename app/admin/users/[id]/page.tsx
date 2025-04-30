import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { UserForm } from "@/components/user-form"
import { getRoles, getUserById } from "@/app/actions"
import { notFound } from "next/navigation"

interface EditUserPageProps {
  params: {
    id: string
  }
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const [user, roles] = await Promise.all([
    getUserById(Number(params.id)),
    getRoles(),
  ])

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <DashboardHeader heading="Edit User" text="Update user information.">
        <Button variant="outline" size="sm" asChild>
          <Link href="/users" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Link>
        </Button>
      </DashboardHeader>

      <Card>
        <UserForm roles={roles} user={user} />
      </Card>
    </div>
  )
}
