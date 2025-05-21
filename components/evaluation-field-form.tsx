"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { EvaluationField, Role } from "@/types/supabase"
import { useState } from "react"
import { createEvaluationField, updateEvaluationField } from "@/app/actions/evaluation-fields"
import { toast } from "sonner"

interface EvaluationFieldFormProps {
  field?: EvaluationField
  roles: Role[]
  onSuccess?: () => void
}

export function EvaluationFieldForm({ field, roles, onSuccess }: EvaluationFieldFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<EvaluationField>>(
    field || {
      name: "",
      type: "number",
      score_weight: 1,
      role_id: roles[0]?.id
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (field) {
        // Update existing field
        const result = await updateEvaluationField(field.id, formData)
        if (result.success) {
          toast.success("Evaluation field updated successfully")
          onSuccess?.()
        } else {
          toast.error(result.error)
        }
      } else {
        // Create new field
        const result = await createEvaluationField(formData as Required<Omit<EvaluationField, 'id' | 'created_at'>>)
        if (result.success) {
          toast.success("Evaluation field created successfully")
          onSuccess?.()
        } else {
          toast.error(result.error)
        }
      }
    } catch (error) {
      console.error('Error saving evaluation field:', error)
      toast.error("Failed to save evaluation field")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 py-2 px-1">
      <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Field Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Field Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as EvaluationField['type'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select field type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="number">Number (0-max score)</SelectItem>
                <SelectItem value="boolean">Yes/No</SelectItem>
                <SelectItem value="rating">Rating (1-5 stars)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="score_weight">Score Weight</Label>
            <Input
              id="score_weight"
              type="number"
              min={1}
              max={10}
              value={formData.score_weight}
              onChange={(e) => setFormData({ ...formData, score_weight: parseInt(e.target.value) })}
              required
            />
            <p className="text-sm text-muted-foreground">
              Weight determines how much this field contributes to the total score (1-10)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role_id?.toString()}
              onValueChange={(value) => setFormData({ ...formData, role_id: parseInt(value) })}
            >
              <SelectTrigger>
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

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : field ? "Update Field" : "Create Field"}
          </Button>
        </form>
    </div>
  )
}
