"use client"

import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ScoreDetailsProps {
  score: any
  open: boolean
  onClose: () => void
}

export function ScoreDetails({ score, open, onClose }: ScoreDetailsProps) {
  if (!score) return null

  const getAvatarText = (name: string | null | undefined): string => {
    if (!name) return 'NA'
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Score Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>{getAvatarText(score.user?.full_name?.split(' ').map(word => word.charAt(0).toUpperCase()).join(''))}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{score.user?.full_name || 'Unknown User'}</div>
                <div className="text-sm text-muted-foreground">
                  {score.created_at ? format(new Date(score.created_at), "dd/MM/yyyy hh:mm a") : '-'}
                </div>
              </div>
            </div>
            <Badge variant="outline">{score.user?.roles?.name || 'Unknown Role'}</Badge>
          </div>

          {/* Score Summary */}
          <div className="rounded-lg bg-muted p-4">
            <div className="grid gap-1">
              <div className="text-sm font-medium">Total Score</div>
              <div className="text-2xl font-bold">
                {score.total_score} / {score.target_score}
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-muted-foreground/20">
                <div
                  className="h-2 rounded-full bg-black"
                  style={{
                    width: `${(score.total_score / score.target_score) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Score Details */}
          <div>
            <div className="text-sm font-medium mb-2">Score Details</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {score.score_details?.map((detail: any) => (
                  <TableRow key={detail.id}>
                    <TableCell className="font-medium">{detail.field_name}</TableCell>
                    <TableCell>
                      {detail.field_value === 'true' ? 'Yes' : 
                       detail.field_value === 'false' ? 'No' : 
                       detail.field_value}
                    </TableCell>
                    <TableCell className="text-right">{detail.field_score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Comments */}
          <div>
            <div className="font-medium mb-2">Comments</div>
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">
                {score.comments || 'No comments provided'}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
