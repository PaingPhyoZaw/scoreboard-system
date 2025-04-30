import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { UsersList } from "@/components/users-list"
import { Plus } from "lucide-react"
import { getUsers, getRoles } from "@/app/actions"

export default async function UsersPage() {
  const users = await getUsers()
  const roles = await getRoles()

  return (
    <div className="space-y-6">
      <DashboardHeader heading="Users" text="Manage users and their roles.">
        {/* <Button className="bg-black hover:bg-black/90 text-white" asChild>
          <Link href="/admin/users/new">
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Link>
        </Button> */}
      </DashboardHeader>

      <Card>
        <UsersList users={users} roles={roles} />
      </Card>
    </div>
  )
}
