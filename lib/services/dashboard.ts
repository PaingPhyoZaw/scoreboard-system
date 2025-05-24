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

interface EngineerStats {
  id: string
  name: string
  role: string
  totalScore: number
  maxPossibleScore: number
}

export interface DashboardStats {
  totalUsers: number
  overallCompletion: number
  teamAverageScore: number
  topPerformer: {
    user: {
      full_name: string
      role: {
        name: string
      }
    }
    score: number
    completion: number
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
  engineerStats: EngineerStats[]
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

    // Get dashboard statistics including top performer
    const { data: dashboardStats } = await this.supabase
      .rpc('get_dashboard_stats')
   
    // Get top performer details
    const { data: topPerformerDetails } = await this.supabase
      .from("users")
      .select(`
        full_name,
        role:roles!users_role_id_fkey (name)
      `)
      .eq('id', dashboardStats?.[0]?.top_performer_id)
      .single() as { data: { full_name: string; role: { name: string } } | null }

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

    // Transform monthly scores data
    const transformedMonthlyScores = (monthlyScores || []).map(score => ({
      score_date: score.score_date,
      total_score: score.total_score,
      target_score: score.target_score,
      user: {
        name: score.user.full_name,
        email: score.user.email,
        role: score.user.role.name
      }
    }))

    // Get role performance data
    const { data: rolePerformanceData } = await this.supabase
      .rpc('get_role_performance')

    // Get engineer stats
    const { data: engineerStats } = await this.supabase
      .rpc('get_all_engineers_stats')
   
    return {
      totalUsers: totalUsers || 0,
      overallCompletion: dashboardStats?.[0]?.overall_completion || 0,
      teamAverageScore: dashboardStats?.[0]?.team_average_score || 0,
      topPerformer: topPerformerDetails ? {
        user: {
          full_name: topPerformerDetails.full_name,
          role: topPerformerDetails.role
        },
        score: dashboardStats?.[0]?.top_performer_score || 0,
        completion: dashboardStats?.[0]?.top_performer_percentage || 0
      } : null,
      monthlyScores: transformedMonthlyScores,
      rolePerformanceData: rolePerformanceData || [],
      engineerStats: engineerStats || []
    }
  }
}
