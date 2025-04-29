export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      roles: {
        Row: {
          id: number
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role_id: number | null
          avatar_url: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          role_id?: number | null
          avatar_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role_id?: number | null
          avatar_url?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      evaluation_fields: {
        Row: {
          id: number
          name: string
          type: string
          is_required: boolean
          role_id: number | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          type: string
          is_required?: boolean
          role_id?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          type?: string
          is_required?: boolean
          role_id?: number | null
          created_at?: string
        }
      }
      scoring_rules: {
        Row: {
          id: number
          name: string
          description: string | null
          max_score: number
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          max_score: number
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          max_score?: number
          created_at?: string
        }
      }
      rule_role_mapping: {
        Row: {
          rule_id: number
          role_id: number
        }
        Insert: {
          rule_id: number
          role_id: number
        }
        Update: {
          rule_id?: number
          role_id?: number
        }
      }
      performance_targets: {
        Row: {
          id: number
          role_id: number
          monthly_target: number
          yearly_target: number
          previous_target: number | null
          effective_from: string
          effective_to: string | null
          created_at: string
        }
        Insert: {
          id?: number
          role_id: number
          monthly_target: number
          yearly_target: number
          previous_target?: number | null
          effective_from: string
          effective_to?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          role_id?: number
          monthly_target?: number
          yearly_target?: number
          previous_target?: number | null
          effective_from?: string
          effective_to?: string | null
          created_at?: string
        }
      }
      scores: {
        Row: {
          id: number
          user_id: string
          evaluator_id: string | null
          score_date: string
          total_score: number
          target_score: number
          comments: string | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          evaluator_id?: string | null
          score_date: string
          total_score: number
          target_score: number
          comments?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          evaluator_id?: string | null
          score_date?: string
          total_score?: number
          target_score?: number
          comments?: string | null
          created_at?: string
        }
      }
      score_details: {
        Row: {
          id: number
          score_id: number
          field_id: number | null
          field_name: string
          field_value: string
          field_score: number | null
          created_at: string
        }
        Insert: {
          id?: number
          score_id: number
          field_id?: number | null
          field_name: string
          field_value: string
          field_score?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          score_id?: number
          field_id?: number | null
          field_name?: string
          field_value?: string
          field_score?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export interface User {
  id: string
  full_name: string
  email: string
  role_id: number
  avatar_url?: string | null
  status?: string
  created_at?: string
  updated_at?: string
  roles?: Role | Role[]
}

export interface Score {
  id: number
  user_id: string
  evaluator_id: string
  score_date: string
  total_score: number
  target_score: number
  comments?: string | null
  created_at?: string
}

export interface ScoreDetail {
  id: number
  score_id: number
  field_id: number
  field_name: string
  field_value: string
  field_score: number
  created_at?: string
}

export interface EvaluationField {
  id: number
  name: string
  type: 'number' | 'boolean' | 'rating'
  score_weight: number
  role_id: number
  created_at?: string
}

export interface Role {
  id: number
  name: string
  created_at?: string
}

export interface ScoreWithRelations extends Score {
  user: User
  evaluator: User
  score_details: ScoreDetail[]
}

export interface ScoreCreateInput {
  user_id: string
  evaluator_id: string
  score_date: string
  comments?: string
  score_details: {
    field_id: number
    field_name: string
    field_value: string
    field_score: number
  }[]
}
