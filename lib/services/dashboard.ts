import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface ScoreWithUser {
  score_date: string
  total_score: number
  target_score: number
  user: {
    full_name: string
    email: string
    role: {
      name: string
    }
  }
}

interface TopPerformer {
  total_score: number
  target_score: number
  user: {
    full_name: string
    role: {
      name: string
    }
  }
}

export interface DashboardStats {
  totalUsers: number
  averageScore: number
  totalScores: number
  topPerformer: {
    user: {
      full_name: string
      role: {
        name: string
      }
    }
    total_score: number
    target_score: number
  } | null
  monthlyScores: {
    score_date: string
    total_score: number
    target_score: number
    user: {
      name: string
      email: string
      role: string
    }
  }[]
  rolePerformanceData: {
    role: string
    average_score: number
    total_scores: number
  }[]
}

export class DashboardService {
  private static instance: DashboardService
  private constructor() {}

  static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService()
    }
    return DashboardService.instance
  }

  private supabase = createClientComponentClient()

  async getDashboardStats(): Promise<DashboardStats> {
    // Get total users count
    const { count: totalUsers } = await this.supabase
      .from("users")
      .select("*", { count: "exact", head: true })

    // Get scores statistics
    const { data: scoreStats } = await this.supabase
      .rpc('get_score_statistics')

    // Get top performer
    const { data: topPerformer } = await this.supabase
      .from("scores")
      .select(`
        total_score,
        target_score,
        user:users!scores_user_id_fkey (
          full_name,
          role:roles!users_role_id_fkey (
            name
          )
        )
      `)
      .order("total_score", { ascending: false })
      .limit(1) as { data: TopPerformer[] | null }

    // Get monthly scores
    const { data: monthlyScores } = await this.supabase
      .from('scores')
      .select(`
        score_date,
        total_score,
        target_score,
        user:users!scores_user_id_fkey (
          full_name,
          email,
          role:roles!users_role_id_fkey (name)
        )
      `)
      .gte(
        'score_date',
        new Date(new Date().setDate(new Date().getDate() - 30)).toISOString()
      )
      .order('score_date', { ascending: true })
      .limit(10) as { data: ScoreWithUser[] | null }

    // Get performance by role
    const { data: rolePerformance } = await this.supabase
      .from("roles")
      .select(`
        name,
        users!users_role_id_fkey (
          scores (
            total_score
          )
        )
      `)

    // Process role performance data
    const rolePerformanceData = rolePerformance?.map(role => {
      const scores = role.users?.flatMap(user => user.scores || []) || []
      const total_scores = scores.length
      const average_score = total_scores > 0
        ? scores.reduce((sum, score) => sum + score.total_score, 0) / total_scores
        : 0

      return {
        role: role.name,
        average_score,
        total_scores
      }
    }) || []

    return {
      totalUsers: totalUsers || 0,
      totalScores: scoreStats?.[0]?.total_scores || 0,
      averageScore: scoreStats?.[0]?.average_score || 0,
      topPerformer: topPerformer?.[0] ?? null,
      monthlyScores: (monthlyScores || []).map(score => ({
        score_date: score.score_date,
        total_score: score.total_score,
        target_score: score.target_score,
        user: {
          name: score.user.full_name,
          email: score.user.email,
          role: score.user.role.name
        }
      })),
      rolePerformanceData: rolePerformanceData || []
    }
  }
}
