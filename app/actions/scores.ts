"use server"

import { ScoreService } from "@/lib/services/scores"
import { ScoreCreateInput } from "@/types/database"
import { revalidatePath } from "next/cache"

export async function createScore(data: ScoreCreateInput) {
  try {
    const scoreService = ScoreService.getInstance()
    const score = await scoreService.createScore(data)
    revalidatePath('/scores')
    return { success: true, data: score }
  } catch (error) {
    console.error('Error creating score:', error)
    return { success: false, error: 'Failed to create score' }
  }
}

export async function deleteScore(id: number) {
  try {
    const scoreService = ScoreService.getInstance()
    await scoreService.deleteScore(id)
    revalidatePath('/scores')
    return { success: true }
  } catch (error) {
    console.error('Error deleting score:', error)
    return { success: false, error: 'Failed to delete score' }
  }
}

export async function getScoreById(id: number) {
  try {
    const scoreService = ScoreService.getInstance()
    const score = await scoreService.getScoreById(id)
    return { success: true, data: score }
  } catch (error) {
    console.error('Error fetching score:', error)
    return { success: false, error: 'Failed to fetch score' }
  }
}
