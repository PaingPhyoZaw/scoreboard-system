import { Database } from './supabase'

export type Score = Database['public']['Tables']['scores']['Row']
export type ScoreDetail = Database['public']['Tables']['score_details']['Row']

export interface ScoreCreateInput {
  user_id: number
  evaluator_id: number
  score_date: string
  comments?: string
  score_details: {
    field_id: number
    field_name: string
    field_value: number
    field_score: number
  }[]
}

export interface ScoreWithRelations extends Score {
  user: {
    id: number
    full_name: string
    email: string
    role_id: number
  }
  evaluator: {
    id: number
    full_name: string
  }
  score_details: {
    id: number
    field_id: number
    field_name: string
    field_value: number
    field_score: number
  }[]
}
