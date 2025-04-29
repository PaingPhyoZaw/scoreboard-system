"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Plus, Save, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

export function RoleRules() {
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: "Engineer",
      description: "Technical staff responsible for maintenance and repairs",
      fields: [
        { id: 1, name: "Technical Skills", type: "rating", required: true },
        { id: 2, name: "Problem Solving", type: "rating", required: true },
        { id: 3, name: "Response Time", type: "number", required: true },
        { id: 4, name: "Documentation Quality", type: "rating", required: true },
      ],
    },
    {
      id: 2,
      name: "Service Admin",
      description: "Administrative staff handling service requests and scheduling",
      fields: [
        { id: 1, name: "Customer Service", type: "rating", required: true },
        { id: 2, name: "Scheduling Efficiency", type: "rating", required: true },
        { id: 3, name: "Documentation Accuracy", type: "rating", required: true },
        { id: 4, name: "Response Time", type: "number", required: true },
      ],
    },
    {
      id: 3,
      name: "Store",
      description: "Inventory and parts management staff",
      fields: [
        { id: 1, name: "Inventory Accuracy", type: "rating", required: true },
        { id: 2, name: "Order Processing Time", type: "number", required: true },
        { id: 3, name: "Stock Management", type: "rating", required: true },
        { id: 4, name: "Documentation", type: "rating", required: true },
      ],
    },
    {
      id: 4,
      name: "Reception",
      description: "Front desk staff handling customer inquiries",
      fields: [
        { id: 1, name: "Customer Service", type: "rating", required: true },
        { id: 2, name: "Call Handling", type: "rating", required: true },
        { id: 3, name: "Inquiry Resolution", type: "rating", required: true },
        { id: 4, name: "Documentation", type: "rating", required: false },
      ],
    },
  ])

  const [activeRole, setActiveRole] = useState(roles[0])
  const [editMode, setEditMode] = useState(false)
  const [newField, setNewField] = useState({ name: "", type: "rating", required: true })

  const handleAddField = () => {
    if (newField.name.trim() === "") return

    const updatedRole = {
      ...activeRole,
      fields: [
        ...activeRole.fields,
        {
          id: Math.max(...activeRole.fields.map((f) => f.id)) + 1,
          ...newField,
        },
      ],
    }

    setActiveRole(updatedRole)
    setNewField({ name: "", type: "rating", required: true })

    // Update the roles array
    const updatedRoles = roles.map((role) => (role.id === activeRole.id ? updatedRole : role))
    setRoles(updatedRoles)
  }

  const handleRemoveField = (fieldId) => {
    const updatedFields = activeRole.fields.filter((field) => field.id !== fieldId)
    const updatedRole = { ...activeRole, fields: updatedFields }

    setActiveRole(updatedRole)

    // Update the roles array
    const updatedRoles = roles.map((role) => (role.id === activeRole.id ? updatedRole : role))
    setRoles(updatedRoles)
  }

  return (
    <div className="p-6 space-y-6">
      <Tabs
        defaultValue={roles[0].name}
        onValueChange={(value) => {
          const role = roles.find((r) => r.name === value)
          if (role) setActiveRole(role)
          setEditMode(false)
        }}
      >
        <TabsList className="mb-6 bg-muted/50 p-1">
          {roles.map((role) => (
            <TabsTrigger key={role.id} value={role.name} className="px-4 py-2">
              {role.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {roles.map((role) => (
          <TabsContent key={role.id} value={role.name} className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{role.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)} className="h-9">
                {editMode ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                {editMode ? "Save" : "Edit"}
              </Button>
            </div>

            <div className="border rounded-md">
              <div className="p-4 border-b bg-muted/30">
                <h4 className="font-medium">Evaluation Fields</h4>
              </div>
              <div className="p-4 space-y-3">
                {activeRole.fields.map((field) => (
                  <div key={field.id} className="flex items-center justify-between p-3 border rounded-md bg-background">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{field.name}</span>
                      <Badge variant="outline" className="bg-muted/50">
                        {field.type}
                      </Badge>
                      {field.required && (
                        <Badge variant="secondary" className="bg-muted/80">
                          Required
                        </Badge>
                      )}
                    </div>
                    {editMode && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveField(field.id)}
                        className="h-8 w-8"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                {editMode && (
                  <div className="mt-4 grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-12 md:col-span-5">
                      <Input
                        placeholder="Field name"
                        value={newField.name}
                        onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                      />
                    </div>
                    <div className="col-span-6 md:col-span-3">
                      <select
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={newField.type}
                        onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                      >
                        <option value="rating">Rating</option>
                        <option value="number">Number</option>
                        <option value="text">Text</option>
                        <option value="boolean">Yes/No</option>
                      </select>
                    </div>
                    <div className="col-span-4 md:col-span-2 flex items-center gap-2">
                      <Switch
                        id="required"
                        checked={newField.required}
                        onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
                      />
                      <Label htmlFor="required" className="text-sm">
                        Required
                      </Label>
                    </div>
                    <div className="col-span-2 md:col-span-2">
                      <Button onClick={handleAddField} size="sm" className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
