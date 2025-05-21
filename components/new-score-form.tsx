"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CardContent, CardFooter } from "@/components/ui/card"
import { getEvaluationFieldsByRole, createScore } from "@/app/actions"
import { useAuth } from "@/context/auth-context"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

interface NewScoreFormProps {
  users: any[]
  roles: any[]
}

export function NewScoreForm({ users, roles }: NewScoreFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  interface EvaluationField {
    id: number
    name: string
    type: 'rating' | 'number' | 'text' | 'boolean'
    is_required: boolean
    score_weight: number
  }

  interface FieldValues extends Record<number, string> {}

  const [formFields, setFormFields] = useState<EvaluationField[]>([])
  const [scoreDate, setScoreDate] = useState(new Date().toISOString().split("T")[0])
  const [comments, setComments] = useState("")
  const [fieldValues, setFieldValues] = useState<FieldValues>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [targetScore, setTargetScore] = useState(0)

  // Get the user's role information when a user is selected
  useEffect(() => {
    if (selectedUser) {
      const userObj = users.find((u) => u.id === selectedUser)
      if (userObj && userObj.role_id) {
        setSelectedRole(userObj.role_id.toString())
      }
    }
  }, [selectedUser, users])

  // Get evaluation fields when role changes
  useEffect(() => {
    const fetchFields = async () => {
      if (selectedRole) {
        const fields = await getEvaluationFieldsByRole(Number(selectedRole))
        setFormFields(fields)

        // Initialize field values
        const initialValues: FieldValues = {}
        fields.forEach((field) => {
          if (field.type === "rating") {
            initialValues[field.id] = "3" // Default to middle value
          } else if (field.type === "number") {
            initialValues[field.id] = "0"
          } else if (field.type === "text") {
            initialValues[field.id] = ""
          } else if (field.type === "boolean") {
            initialValues[field.id] = "yes"
          }
        })
        setFieldValues(initialValues)

        // Get target score for the role
        const roleObj = roles.find((r) => r.id.toString() === selectedRole)
        if (roleObj) {
          // In a real app, you would fetch the target score from the performance_targets table
          // For now, we'll use a default value
          setTargetScore(85)
        }
      }
    }

    fetchFields()
  }, [selectedRole, roles])

  const calculateFieldScore = (field: any, value: string): number => {
    if (field.type === "boolean") {
      return value === "yes" ? field.score_weight : 0
    }
    else if (field.type === "rating") {
      const rating = Number(value || 0)
      const maxRating = 5
      return Math.round((rating / maxRating) * field.score_weight)
    }
    else if (field.type === "number") {
      const score = Math.min(100, Math.max(0, Number(value || 0)))
      return Math.round((score / 100) * field.score_weight)
    }
    return 0
  }

  const handleFieldChange = (fieldId: number, value: string) => {
    setFieldValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const calculateTotalScore = () => {
    if (formFields.length === 0) return { points: 0, maxPoints: 0 }

    let totalPoints = 0
    let maxPoints = 0

    formFields.forEach((field) => {
      const value = fieldValues[field.id]
      
      if (field.type === "boolean") {
        if (value === "yes") {
          totalPoints += field.score_weight
        }
        maxPoints += field.score_weight
      } 
      else if (field.type === "rating") {
        // Rating is 1-5, calculate proportional score
        const rating = Number(value || 0)
        const maxRating = 5
        totalPoints += (rating / maxRating) * field.score_weight
        maxPoints += field.score_weight
      }
      else if (field.type === "number") {
        // Number field should be within 0-100
        const score = Math.min(100, Math.max(0, Number(value || 0)))
        totalPoints += (score / 100) * field.score_weight
        maxPoints += field.score_weight
      }
    })

    return { points: Math.round(totalPoints), maxPoints }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedUser || !selectedRole || !scoreDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const { points, maxPoints } = calculateTotalScore()

      // Prepare field data
      const fields = formFields.map((field) => ({
        id: field.id,
        name: field.name,
        value: fieldValues[field.id] || "",
        score: calculateFieldScore(field, fieldValues[field.id]),
      }))

      const formData = {
        userId: selectedUser,
        evaluatorId: user?.id,
        scoreDate,
        totalScore: points,
        targetScore: maxPoints,
        comments,
        fields,
      }

      const result = await createScore(formData)

      if (result.success) {
        toast({
          title: "Score Recorded",
          description: "The performance score has been successfully recorded.",
        })
        router.push("/admin/scores")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to record score. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="user">Select User</Label>
            <Select required value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger id="user" className="w-full">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select required value={selectedRole} onValueChange={setSelectedRole} disabled={!!selectedUser}>
              <SelectTrigger id="role" className="w-full">
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
            {selectedUser && (
              <p className="text-xs text-muted-foreground mt-1">
                Role is determined by the selected user's assigned role.
              </p>
            )}
          </div>
        </div>

        {/* <div className="space-y-2">
          <Label htmlFor="date">Evaluation Date</Label>
          <Input id="date" type="date" required value={scoreDate} onChange={(e) => setScoreDate(e.target.value)} />
        </div> */}

        {formFields.length > 0 && (
          <div className="space-y-6">
            {/* <h3 className="font-medium text-lg">Performance Criteria</h3> */}

            {formFields.map((field) => (
              <div key={field.id} className="space-y-3 pb-4 border-b border-border/50 last:border-0">
                <Label htmlFor={`field-${field.id}`} className="text-base">
                  {field.name}
                </Label>

                {field.type === "rating" && (
                  <RadioGroup
                    value={fieldValues[field.id] || "3"}
                    onValueChange={(value) => handleFieldChange(field.id, value)}
                    className="flex space-x-2"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="flex flex-col items-center space-y-1">
                        <RadioGroupItem value={value.toString()} id={`${field.id}-${value}`} className="peer sr-only" />
                        <Label
                          htmlFor={`${field.id}-${value}`}
                          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-muted bg-background p-0 text-center font-medium hover:bg-muted hover:text-muted-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                        >
                          {value}
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {value === 1
                            ? "Poor"
                            : value === 2
                              ? "Fair"
                              : value === 3
                                ? "Good"
                                : value === 4
                                  ? "Great"
                                  : "Excellent"}
                        </span>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {field.type === "number" && (
                  <Input
                    id={`field-${field.id}`}
                    type="number"
                    min="0"
                    required={field.is_required}
                    value={fieldValues[field.id] || "0"}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder="Enter value"
                  />
                )}

                {field.type === "text" && (
                  <Textarea
                    id={`field-${field.id}`}
                    required={field.is_required}
                    value={fieldValues[field.id] || ""}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder="Enter details"
                  />
                )}

                {field.type === "boolean" && (
                  <RadioGroup
                    defaultValue="yes"
                    className="flex space-x-4"
                    value={fieldValues[field.id] || "yes"}
                    onValueChange={(value) => handleFieldChange(field.id, value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id={`${field.id}-yes`} />
                      <Label htmlFor={`${field.id}-yes`}>Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id={`${field.id}-no`} />
                      <Label htmlFor={`${field.id}-no`}>No</Label>
                    </div>
                  </RadioGroup>
                )}
              </div>
            ))}

            <div className="pt-4 border-t space-y-4">
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Score:</span>
                  <span className="text-xl font-bold">
                    {calculateTotalScore().points} / {calculateTotalScore().maxPoints} points
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="comments">Additional Comments</Label>
          <Textarea
            id="comments"
            placeholder="Enter any additional observations or comments"
            rows={4}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-6 pt-0">
        <Button variant="outline" asChild>
          <Link href="/admin/scores">Cancel</Link>
        </Button>
        <Button
          type="submit"
          className="bg-black hover:bg-black/90 text-white"
          disabled={isSubmitting || formFields.length === 0}
        >
          {isSubmitting ? "Submitting..." : "Submit Evaluation"}
        </Button>
      </CardFooter>
    </form>
  )
}
