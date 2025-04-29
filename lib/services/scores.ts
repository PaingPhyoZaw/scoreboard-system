import { getSupabaseServerClient } from "@/lib/supabase"
import { Score, ScoreCreateInput, ScoreWithRelations } from "@/types/database"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export class ScoreService {
  private static instance: ScoreService
  private constructor() {}

  static getInstance(): ScoreService {
    if (!ScoreService.instance) {
      ScoreService.instance = new ScoreService()
    }
    return ScoreService.instance
  }

  async getScores(filters?: {
    search?: string
    role?: string
    startDate?: string
    endDate?: string
  }): Promise<ScoreWithRelations[]> {
    const supabase = createClientComponentClient()
    
    let query = supabase
      .from('scores')
      .select(`
        *,
        user:users!scores_user_id_fkey (
          id,
          full_name,
          email,
          role_id,
          roles:role_id (id, name)
        ),
        evaluator:users!scores_evaluator_id_fkey (
          id,
          full_name
        ),
        score_details!score_details_score_id_fkey (
          id,
          field_id,
          field_name,
          field_value,
          field_score
        )
      `)
      .order('score_date', { ascending: false })

    if (filters?.role && filters.role !== 'all') {
      query = query.eq('user.role_id', filters.role)
    }

    if (filters?.search) {
      query = query.ilike('user.full_name', `%${filters.search}%`)
    }

    if (filters?.startDate && filters?.endDate) {
      query = query.gte('score_date', filters.startDate).lte('score_date', filters.endDate)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching scores:', error)
      throw error
    }

    return data as unknown as ScoreWithRelations[]
  }

  async createScore(input: ScoreCreateInput): Promise<Score> {
    const supabase = getSupabaseServerClient()

    // Calculate total and target scores
    const totalScore = input.score_details.reduce((sum, detail) => sum + detail.field_score, 0)
    const targetScore = input.score_details.reduce((sum, detail) => sum + Number(detail.field_value), 0)

    // Start a transaction
    const { data: score, error: scoreError } = await supabase
      .from('scores')
      .insert({
        user_id: input.user_id,
        evaluator_id: input.evaluator_id,
        score_date: input.score_date,
        total_score: totalScore,
        target_score: targetScore,
        comments: input.comments
      })
      .select()
      .single()

    if (scoreError) {
      console.error('Error creating score:', scoreError)
      throw scoreError
    }

    // Insert score details
    const { error: detailsError } = await supabase
      .from('score_details')
      .insert(
        input.score_details.map(detail => ({
          score_id: score.id,
          ...detail
        }))
      )

    if (detailsError) {
      console.error('Error creating score details:', detailsError)
      throw detailsError
    }

    return score
  }

  async deleteScore(id: number): Promise<void> {
    const supabase = getSupabaseServerClient()

    const { error } = await supabase
      .from('scores')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting score:', error)
      throw error
    }
  }

  async getScoreById(id: number): Promise<ScoreWithRelations> {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('scores')
      .select(`
        *,
        user:users!scores_user_id_fkey (
          id,
          full_name,
          email,
          role_id,
          roles:role_id (id, name)
        ),
        evaluator:users!scores_evaluator_id_fkey (
          id,
          full_name
        ),
        score_details!score_details_score_id_fkey (
          id,
          field_id,
          field_name,
          field_value,
          field_score
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching score:', error)
      throw error
    }

    return data as unknown as ScoreWithRelations
  }
}
