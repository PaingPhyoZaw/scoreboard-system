"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { 
  Loader2, Trophy, Target, TrendingUp, Star, 
  Calendar, User, BarChart3, Info
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { format } from "date-fns"

interface ScoreEvaluation {
  field_id: number
  score: number
}

interface DatabaseScore {
  id: string
  user_id: string
  evaluator_id: string
  score_date: string
  total_score: number
  target_score: number
  comments?: string
  created_at: string

}

interface Score {
  id: string
  user_id: string
  score_date: string
  total_score: number
  target_score: number
  comments?: string
  created_at: string
}

export default function ScoresPage() {
  const { user } = useAuth()
  const [scores, setScores] = useState<Score[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const fetchScores = async () => {
      if (!user?.id) return
      
      setIsLoading(true)
      setError(null)
      try {
        // Get user's scores with related details
        const { data: scores, error: scoresError } = await supabase
          .from('scores')
          .select(`
            id,
            user_id,
            id,
            user_id,
            evaluator_id,
            score_date,
            total_score,
            target_score,
            comments,
            created_at
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (scoresError) throw scoresError

        // Transform the data to match our Score type
        const transformedScores = scores?.map((score: any): Score => ({
          id: score.id,
          user_id: score.user_id,
          score_date: score.score_date,
          total_score: score.total_score,
          target_score: score.target_score,
          comments: score.comments,
          created_at: score.created_at
        })) || []

        setScores(transformedScores)
      } catch (error) {
        console.error('Error fetching scores:', error)
        setError('Failed to load scores. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchScores()
  }, [user?.id, user?.role_id])

  const calculatePercentage = (score: number, target: number) => {
    return Math.round((score / target) * 100)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-900 dark:to-slate-900 min-h-screen">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Performance</h2>
          <p className="text-muted-foreground">Track your daily achievements and scores</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <Card className="bg-white/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scores.reduce((sum, s) => sum + s.total_score, 0)}</div>
            <p className="text-xs text-muted-foreground">
              {scores.length > 0 ? `+${scores[0].total_score} points` : 'No entries yet'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scores.length > 0 ? Math.round(scores.reduce((sum, s) => sum + s.total_score, 0) / scores.length) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Points per entry</p>
          </CardContent>
        </Card>

        <Card className="bg-white/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Achievement</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scores[0] ? `${calculatePercentage(scores[0].total_score, scores[0].target_score)}%` : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">
              {scores[0] ? `${scores[0].total_score}/${scores[0].target_score} points` : 'No data'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scores.length}</div>
            <p className="text-xs text-muted-foreground">Evaluations recorded</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle>Score History</CardTitle>
          <CardDescription>Your performance records</CardDescription>
        </CardHeader>
        {isLoading ? (
          <CardContent className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </CardContent>
        ) : error ? (
          <CardContent>
            <p className="text-center text-sm text-red-500">{error}</p>
          </CardContent>
        ) : scores.length > 0 ? (
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {scores.map((score) => (
                  <div key={score.id} className="flex items-center justify-between p-4 hover:bg-accent rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {format(new Date(score.score_date), 'PPP')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {score.total_score} / {score.target_score} points ({calculatePercentage(score.total_score, score.target_score)}%)
                      </p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Info className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Score Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Date</p>
                              <p className="text-sm font-medium">
                                {format(new Date(score.score_date), 'PPP')}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Score</p>
                              <p className="text-sm font-medium">
                                {score.total_score} / {score.target_score} ({calculatePercentage(score.total_score, score.target_score)}%)
                              </p>
                            </div>
                          </div>
                          {score.comments && (
                            <div>
                              <p className="text-sm text-muted-foreground">Comments</p>
                              <p className="text-sm whitespace-pre-wrap">{score.comments}</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        ) : (
          <CardContent>
            <p className="text-center text-muted-foreground py-8">
              No scores found yet. Your daily achievements will appear here.
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
