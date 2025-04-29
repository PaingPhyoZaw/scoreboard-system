"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { UserService } from "@/lib/services/users"
import Link from "next/link"

interface UserFormProps {
  roles: any[]
  user?: any
}

export function UserForm({ roles, user }: UserFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    email: user?.email || "",
    role_id: user?.role_id?.toString() || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const userService = UserService.getInstance()
      const input = {
        ...formData,
        role_id: formData.role_id ? Number(formData.role_id) : undefined,
      }

      if (user) {
        await userService.updateUser({ id: user.id, ...input })
        toast({
          title: "User Updated",
          description: "The user has been successfully updated.",
        })
      } else {
        await userService.createUser(input)
        toast({
          title: "User Created",
          description: "The new user has been successfully created.",
        })
      }

      router.push("/users")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            required
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role_id} onValueChange={(value) => setFormData({ ...formData, role_id: value })}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-6 pt-0">
        <Button variant="outline" asChild>
          <Link href="/users">Cancel</Link>
        </Button>
        <Button type="submit" className="bg-black hover:bg-black/90 text-white" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : user ? "Update User" : "Create User"}
        </Button>
      </CardFooter>
    </form>
  )
}
