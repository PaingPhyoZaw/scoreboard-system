"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit, Plus, Trash } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { EvaluationFieldForm } from "./evaluation-field-form"
import { EvaluationField, Role } from "@/types/supabase"
import { EvaluationFieldService } from "@/lib/services/evaluation-fields"
import { deleteEvaluationField } from "@/app/actions/evaluation-fields"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"

interface ScoreRulesProps {
  roles: Role[]
}

export function ScoreRules({ roles }: ScoreRulesProps) {
  const [fields, setFields] = useState<EvaluationField[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedField, setSelectedField] = useState<EvaluationField | undefined>()
  const [showForm, setShowForm] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchFields = async () => {
    try {
      const service = EvaluationFieldService.getInstance()
      const allFields: EvaluationField[] = []
      
      // Fetch fields for all roles
      for (const role of roles) {
        const roleFields = await service.getFieldsByRole(role.id)
        allFields.push(...roleFields)
      }
      
      setFields(allFields)
    } catch (error) {
      console.error('Error fetching evaluation fields:', error)
      toast.error('Failed to load evaluation fields')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFields()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      await deleteEvaluationField(id)
      toast.success('Field deleted successfully')
      fetchFields()
    } catch (error) {
      console.error('Error deleting field:', error)
      toast.error('Failed to delete field')
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedField(undefined)
    fetchFields()
  }

  // Calculate pagination
  const totalPages = Math.ceil(fields.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentFields = fields.slice(startIndex, endIndex)

  return (
    <div className="container space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-medium">Evaluation Fields</h3>
          <p className="text-sm text-gray-500">
            Define evaluation criteria for different roles
          </p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-black/90 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add New Field
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <EvaluationFieldForm
              roles={roles}
              field={selectedField}
              onSuccess={handleFormSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Field Name</TableHead>
            <TableHead>Field Type</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Score Weight</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : currentFields.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No evaluation fields found
              </TableCell>
            </TableRow>
          ) : (
            currentFields.map((field) => (
              <TableRow key={field.id}>
                <TableCell className="font-medium">{field.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {field.type === 'boolean' ? 'Yes/No' :
                     field.type === 'rating' ? 'Rating (1-5)' :
                     'Number'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {roles.find(r => r.id === field.role_id)?.name}
                  </Badge>
                </TableCell>
                <TableCell>{field.score_weight}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(field.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedField(field)
                        setShowForm(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      {fields.length > 0 && (
        <div className="mt-4 flex items-center justify-between px-2">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(endIndex, fields.length)} of {fields.length} entries
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
