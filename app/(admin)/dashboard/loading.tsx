import { DashboardHeader } from "@/components/dashboard-header"
import { Loading } from "@/components/ui/loading"

export default function LoadingDashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardHeader heading="Dashboard" text="Welcome to your dashboard overview." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[120px] rounded-lg border bg-card animate-pulse" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <div className="h-[400px] rounded-lg border bg-card animate-pulse" />
        </div>
        <div className="col-span-3">
          <div className="h-[400px] rounded-lg border bg-card animate-pulse" />
        </div>
      </div>
    </div>
  )
}
