"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface RecentScoresProps {
  scores: Array<{
    score_date: string
    total_score: number
    target_score: number
    user: {
      name: string
      email: string
      role: string
    }
  }>
}

const getAvatarText = (name: string | null | undefined): string => {
  if (!name) return 'NA'
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
}

export function RecentScores({ scores }: RecentScoresProps) {
  // Sort scores by date in descending order (latest first)
  const sortedScores = [...scores].sort((a, b) => 
    new Date(b.score_date).getTime() - new Date(a.score_date).getTime()
  )
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Achievement</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedScores.map((score, index) => (
            <TableRow key={index}>
              <TableCell className="flex items-center gap-3">
                <Avatar className="bg-gradient-to-br from-purple-100 to-indigo-100 border border-purple-200/50">
                  <AvatarFallback className="bg-transparent text-purple-700 font-medium">
                    {getAvatarText(score.user?.name)}
                  </AvatarFallback>
                </Avatar>
                {score.user.name}
              </TableCell>
              <TableCell>{score.user.role}</TableCell>
              <TableCell>{score.total_score}/{score.target_score}</TableCell>
              <TableCell>{Math.round((score.total_score / score.target_score) * 100)}%</TableCell>
              <TableCell>{new Date(score.score_date).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
