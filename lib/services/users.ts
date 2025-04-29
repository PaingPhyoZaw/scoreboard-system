import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export interface User {
  id: number
  full_name: string
  email: string
  role_id: number | null
  created_at: string
  updated_at: string
}

export interface CreateUserInput {
  full_name: string
  email: string
  role_id?: number
}

export interface UpdateUserInput extends Partial<CreateUserInput> {
  id: number
}

export class UserService {
  private static instance: UserService
  private constructor() {}

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  private supabase = createClientComponentClient()

  async getUsers(): Promise<User[]> {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .order("full_name", { ascending: true })

    if (error) throw error
    return data
  }

  async getUserById(id: number): Promise<User | null> {
    const { data, error } = await this.supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  }

  async createUser(input: CreateUserInput): Promise<User> {
    const { data, error } = await this.supabase
      .from("users")
      .insert([input])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async updateUser(input: UpdateUserInput): Promise<User> {
    const { id, ...updateData } = input
    const { data, error } = await this.supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteUser(id: number): Promise<void> {
    const { error } = await this.supabase.from("users").delete().eq("id", id)
    if (error) throw error
  }
}
