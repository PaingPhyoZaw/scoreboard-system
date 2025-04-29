"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Eye, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { format } from "date-fns"
import { ScoreDetails } from "@/components/score-details"
import { ScoreService } from "@/lib/services/scores"
import { Role, ScoreWithRelations, User } from "@/types/supabase"
import { deleteScore } from "@/app/actions/scores"
import { toast } from "sonner"

interface ScoresListProps {
  users: User[]
  roles: Role[]
}

const getScoreColor = (percentage: number) => {
  if (percentage >= 0.9) return 'bg-green-500'
  if (percentage >= 0.7) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getAvatarText = (name: string | null | undefined): string => {
  if (!name) return 'NA'
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
}

export function ScoresList({ users, roles }: ScoresListProps) {
  const [filter, setFilter] = useState<{
    search: string
    role: string
    startDate: string
    endDate: string
  }>({
    search: "",
    role: "all",
    startDate: "",
    endDate: "",
  })
  const [scores, setScores] = useState<ScoreWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [selectedScore, setSelectedScore] = useState<any>(null)
  const itemsPerPage = 10

  useEffect(() => {
    fetchScores()
  }, [filter])

  const fetchScores = async () => {
    try {
      setLoading(true)
      const scoreService = ScoreService.getInstance()
      const data = await scoreService.getScores(filter)
      setScores(data)
    } catch (error) {
      console.error('Error fetching scores:', error)
      toast.error('Failed to load scores')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this score?')) return

    const result = await deleteScore(id)
    
    if (result.success) {
      toast.success('Score deleted successfully')
      fetchScores()
    } else {
      toast.error(result.error || 'Failed to delete score')
    }
  }

  if (loading) {
    return <div className="p-4">Loading scores...</div>
  }

  const uniqueDates = Array.from(new Set(scores.map((s) => s.score_date)))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            className="max-w-sm"
          />
        </div>
        <Select
          value={filter.role}
          onValueChange={(value) => setFilter({ ...filter, role: value })}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map((role) => (
              <SelectItem key={role.id} value={role.id.toString()}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={filter.startDate}
            onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
            className="w-[180px]"
          />
          <span className="text-sm text-muted-foreground">to</span>
          <Input
            type="date"
            value={filter.endDate}
            onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
            className="w-[180px]"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]">
                <Checkbox
                  checked={selectedRows.length === scores.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedRows(scores.map(s => s.id))
                    } else {
                      setSelectedRows([])
                    }
                  }}
                />
              </TableHead>
              <TableHead className="w-[50px]">No.</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No scores found.
                </TableCell>
              </TableRow>
            ) : (
              scores
                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map((score, index) => (
                  <TableRow key={score.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(score.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedRows([...selectedRows, score.id])
                          } else {
                            setSelectedRows(selectedRows.filter(id => id !== score.id))
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {(page - 1) * itemsPerPage + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="">
                          {score.created_at ? format(new Date(score.created_at), 'dd/MM/yyyy') : '-'}
                        </div>
                        <div className="text-muted-foreground">
                          {score.created_at ? format(new Date(score.created_at), 'hh:mm a') : '-'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="bg-gradient-to-br from-purple-100 to-indigo-100 border border-purple-200/50">
                          <AvatarFallback className="bg-transparent text-purple-700 font-medium">
                            {getAvatarText(score.user?.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{score.user?.full_name || 'Unknown User'}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {Array.isArray(score.user?.roles) ? score.user?.roles[0]?.name : score.user?.roles?.name || 'Unknown Role'}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="">
                          {score.total_score} / {score.target_score}
                        </div>
                        <div className="h-2.5 w-full max-w-[120px] rounded-full bg-gray-100">
                          <div
                            className={`h-full rounded-full transition-all ${getScoreColor(score.total_score / score.target_score)}`}
                            style={{
                              width: `${Math.min(
                                100,
                                (score.total_score / score.target_score) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setSelectedScore(score)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          {scores.length} {scores.length === 1 ? 'result' : 'results'}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <div className="text-sm">
            Page {page} of {Math.ceil(scores.length / itemsPerPage)}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(scores.length / itemsPerPage)}
          >
            Next
          </Button>
        </div>
      </div>

      <ScoreDetails 
        score={selectedScore}
        open={!!selectedScore}
        onClose={() => setSelectedScore(null)}
      />
    </div>
  )
}
