"use server"

import { getSupabaseServerClient } from "@/lib/supabase"

export async function getDashboardStats() {
  const supabase = getSupabaseServerClient()

  // Get total users count
  const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true })

  // Get average score
  const { data: scoreData } = await supabase
    .from("scores")
    .select("total_score")
    .order("created_at", { ascending: false })
    .limit(100)
  let averageScore = 0
  if (scoreData && scoreData.length > 0) {
    averageScore = scoreData.reduce((sum, score) => sum + score.total_score, 0) / scoreData.length
  }

  // Get top performer
  const { data: topPerformer } = await supabase
    .from("scores")
    .select(`
      total_score,
      users (
        full_name,
        role_id,
        roles (
          name
        )
      )
    `)
    .order("total_score", { ascending: false })
    .limit(1)
    .single()

  // Get monthly scores for chart
  const { data: monthlyScores } = await supabase
    .from("scores")
    .select("score_date, total_score, target_score")
    .order("score_date", { ascending: true })
    .limit(30)

  // Get performance by role
  const { data: rolePerformance } = await supabase
    .from("users")
    .select(`
      role_id,
      roles (
        name
      ),
      scores (
        total_score,
        target_score
      )
    `)
    .not("role_id", "is", null)

  // Process role performance data
  const roleScores: Record<string, { totalScore: number; count: number; targetScore: number }> = {}
  if (rolePerformance) {
    rolePerformance.forEach((user) => {
      if (user.roles && user.scores && user.scores.length > 0) {
        const roleName = user.roles[0].name
        if (!roleScores[roleName]) {
          roleScores[roleName] = {
            totalScore: 0,
            count: 0,
            targetScore: 0,
          }
        }

        user.scores.forEach((score) => {
          roleScores[roleName].totalScore += score.total_score
          roleScores[roleName].count += 1
          roleScores[roleName].targetScore = score.target_score // Just use the last one
        })
      }
    })
  }

  // Convert role scores to array format for the chart
  const rolePerformanceData = Object.keys(roleScores).map((role) => ({
    name: role,
    score: roleScores[role].count > 0 ? Math.round(roleScores[role].totalScore / roleScores[role].count) : 0,
    target: roleScores[role].targetScore,
  }))

  // Get recent scores
  const { data: recentScores } = await supabase
    .from("scores")
    .select(`
      id,
      total_score,
      target_score,
      score_date,
      user_id,
      users (
        full_name,
        email,
        role_id,
        roles (
          name
        )
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  return {
    totalUsers,
    averageScore,
    topPerformer,
    monthlyScores,
    rolePerformanceData,
    recentScores,
  }
}

export async function getRoles() {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.from("roles").select("*").order("name")

  if (error) {
    console.error("Error fetching roles:", error)
    return []
  }

  return data || []
}

export async function getUserById(id: number) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      email,
      full_name,
      avatar_url,
      status,
      role_id,
      roles (
        id,
        name
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching user:", error)
    return null
  }

  return data
}

export async function getUsers() {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      email,
      full_name,
      avatar_url,
      status,
      role_id,
      roles:role_id (id, name)
    `)
    .order("full_name")

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return (data || []).map(user => ({
    ...user,
    roles: user.roles || undefined
  }))
}

export async function getEvaluationFieldsByRole(roleId: number) {
  const supabase = getSupabaseServerClient()
  const { data, error } = await supabase.from("evaluation_fields").select("*").eq("role_id", roleId).order("name")

  if (error) {
    console.error("Error fetching evaluation fields:", error)
    return []
  }

  return data || []
}

export async function createScore(formData: any) {
  const supabase = getSupabaseServerClient()

  // First create the score record
  const { data: score, error: scoreError } = await supabase
    .from("scores")
    .insert({
      user_id: formData.userId,
      evaluator_id: formData.evaluatorId,
      score_date: formData.scoreDate,
      total_score: formData.totalScore,
      target_score: formData.targetScore,
      comments: formData.comments,
    })
    .select("id")
    .single()

  if (scoreError) {
    console.error("Error creating score:", scoreError)
    return { success: false, error: scoreError.message }
  }

  // Then create the score details
  const scoreDetails = formData.fields.map((field: any) => ({
    score_id: score.id,
    field_id: field.id,
    field_name: field.name,
    field_value: field.value,
    field_score: field.score,
  }))

  const { error: detailsError } = await supabase.from("score_details").insert(scoreDetails)

  if (detailsError) {
    console.error("Error creating score details:", detailsError)
    return { success: false, error: detailsError.message }
  }

  return { success: true, scoreId: score.id }
}

export async function updateUserRole(userId: string, roleId: number) {
  const supabase = getSupabaseServerClient()
  const { error } = await supabase.from("users").update({ role_id: roleId }).eq("id", userId)

  if (error) {
    console.error("Error updating user role:", error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
