"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

type Score = {
  id: string
  user_id: string
  score: number
  created_at: string
  evaluation_fields: Record<string, number>
}

export default function ScoresPage() {
  const { user } = useAuth()
  const [scores, setScores] = useState<Score[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const fetchScores = async () => {
      // Only fetch if we have a non-admin user
      if (!user?.id || user.role_id === 1) return
      
      setIsLoading(true)
      try {
        const { data, error } = await supabase
          .from('scores')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50) // Limit to prevent large data loads

        if (error) throw error
        setScores(data || [])
      } catch (error) {
        console.error('Error fetching scores:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Only fetch if we have a user
    if (user?.id) {
      fetchScores()
    }
  }, [user?.id, user?.role_id])

  return (
    <div className="container py-6 px-4">
      <Card>
        <CardHeader>
          <CardTitle>My Daily Scores</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : scores.length > 0 ? (
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {scores.map((score) => (
                  <Card key={score.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-lg font-medium mb-1">
                            {score.score} points
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(score.created_at).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      {score.evaluation_fields && (
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(score.evaluation_fields).map(([field, value]) => (
                            <div key={field} className="flex justify-between items-center">
                              <span className="text-sm capitalize">{field.replace(/_/g, ' ')}</span>
                              <span className="text-sm font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No scores found. Your daily scores will appear here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
