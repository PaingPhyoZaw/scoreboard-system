"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Eye } from "lucide-react"
import Link from "next/link"

export function RecentScores() {
  const scores = [
    {
      id: "SCORE-1234",
      user: {
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Engineer",
      },
      score: 85,
      target: 90,
      date: "2023-04-19",
    },
    {
      id: "SCORE-1235",
      user: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "Service Admin",
      },
      score: 78,
      target: 85,
      date: "2023-04-19",
    },
    {
      id: "SCORE-1236",
      user: {
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        role: "Store",
      },
      score: 72,
      target: 80,
      date: "2023-04-18",
    },
    {
      id: "SCORE-1237",
      user: {
        name: "Emily Davis",
        email: "emily.davis@example.com",
        role: "Reception",
      },
      score: 80,
      target: 85,
      date: "2023-04-18",
    },
    {
      id: "SCORE-1238",
      user: {
        name: "Michael Wilson",
        email: "michael.wilson@example.com",
        role: "Engineer",
      },
      score: 92,
      target: 90,
      date: "2023-04-17",
    },
  ]

  return (
    <>
      {/* Mobile view - cards */}
      <div className="grid gap-4 md:hidden">
        {scores.map((score) => (
          <Card key={score.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={score.user.name} />
                    <AvatarFallback>{score.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{score.user.name}</div>
                    <Badge variant="outline" className="bg-muted/50 mt-1">
                      {score.user.role}
                    </Badge>
                  </div>
                </div>
                <div
                  className={`font-medium text-lg ${score.score >= score.target ? "text-emerald-600" : "text-amber-600"}`}
                >
                  {score.score}%
                </div>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <div>Target: {score.target}%</div>
                <div>{new Date(score.date).toLocaleDateString()}</div>
              </div>
              <div className="flex justify-end gap-2 mt-3">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/scores/${score.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/scores/${score.id}/edit`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop view - table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores.map((score) => (
              <TableRow key={score.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt={score.user.name} />
                      <AvatarFallback>{score.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{score.user.name}</div>
                      <div className="text-xs text-muted-foreground">{score.user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-muted/50">
                    {score.user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className={`font-medium ${score.score >= score.target ? "text-emerald-600" : "text-amber-600"}`}>
                    {score.score}%
                  </div>
                </TableCell>
                <TableCell>{score.target}%</TableCell>
                <TableCell>{new Date(score.date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/scores/${score.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/scores/${score.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
