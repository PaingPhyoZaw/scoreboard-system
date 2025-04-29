import { redirect } from "next/navigation"

// This is a Server Component
export default function Home() {
  // Redirect to the dashboard page
  redirect("/dashboard")
}
