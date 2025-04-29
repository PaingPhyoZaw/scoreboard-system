"use server"

import { EvaluationFieldService } from "@/lib/services/evaluation-fields"
import { EvaluationField } from "@/types/supabase"
import { revalidatePath } from "next/cache"

export async function createEvaluationField(data: Omit<EvaluationField, 'id' | 'created_at'>) {
  try {
    const service = EvaluationFieldService.getInstance()
    const field = await service.createField(data)
    revalidatePath('/master-data')
    return { success: true, data: field }
  } catch (error) {
    console.error('Error creating evaluation field:', error)
    return { success: false, error: 'Failed to create evaluation field' }
  }
}

export async function updateEvaluationField(id: number, data: Partial<EvaluationField>) {
  try {
    const service = EvaluationFieldService.getInstance()
    const field = await service.updateField(id, data)
    revalidatePath('/master-data')
    return { success: true, data: field }
  } catch (error) {
    console.error('Error updating evaluation field:', error)
    return { success: false, error: 'Failed to update evaluation field' }
  }
}

export async function deleteEvaluationField(id: number) {
  try {
    const service = EvaluationFieldService.getInstance()
    await service.deleteField(id)
    revalidatePath('/master-data')
    return { success: true }
  } catch (error) {
    console.error('Error deleting evaluation field:', error)
    return { success: false, error: 'Failed to delete evaluation field' }
  }
}
