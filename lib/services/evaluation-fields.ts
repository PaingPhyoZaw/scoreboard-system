import { getSupabaseServerClient } from "@/lib/supabase"
import { EvaluationField } from "@/types/supabase"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export class EvaluationFieldService {
  private static instance: EvaluationFieldService
  private constructor() {}

  static getInstance(): EvaluationFieldService {
    if (!EvaluationFieldService.instance) {
      EvaluationFieldService.instance = new EvaluationFieldService()
    }
    return EvaluationFieldService.instance
  }

  async getFieldsByRole(roleId: number): Promise<EvaluationField[]> {
    const supabase = createClientComponentClient()
    
    const { data, error } = await supabase
      .from('evaluation_fields')
      .select('*')
      .eq('role_id', roleId)
      .order('id', { ascending: true })

    if (error) {
      console.error('Error fetching evaluation fields:', error)
      throw error
    }

    return data
  }

  async createField(field: Omit<EvaluationField, 'id' | 'created_at'>): Promise<EvaluationField> {
    const supabase = getSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('evaluation_fields')
      .insert(field)
      .select()
      .single()

    if (error) {
      console.error('Error creating evaluation field:', error)
      throw error
    }

    return data
  }

  async updateField(id: number, field: Partial<EvaluationField>): Promise<EvaluationField> {
    const supabase = getSupabaseServerClient()
    
    const { data, error } = await supabase
      .from('evaluation_fields')
      .update(field)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating evaluation field:', error)
      throw error
    }

    return data
  }

  async deleteField(id: number): Promise<void> {
    const supabase = getSupabaseServerClient()
    
    const { error } = await supabase
      .from('evaluation_fields')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting evaluation field:', error)
      throw error
    }
  }
}
