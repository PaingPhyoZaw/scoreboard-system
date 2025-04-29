import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScoreRules } from "@/components/score-rules"
import { TargetSettings } from "@/components/target-settings"
import { getRoles } from "@/app/actions"

export default async function MasterDataPage() {
  const roles = await getRoles()

  return (
    <div className="space-y-6">
      <DashboardHeader 
        heading="Master Data" 
        text="Manage roles, scoring rules, and performance targets."
      />

      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="fields" className="w-full">
            <TabsList className="w-full rounded-none border-b bg-transparent p-0">
              <div className="container flex h-10 items-center gap-4">
                <TabsTrigger
                  value="fields"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Evaluation Fields
                </TabsTrigger>
                <TabsTrigger
                  value="targets"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Target Settings
                </TabsTrigger>
              </div>
            </TabsList>
            <TabsContent value="fields" className="p-0">
              <ScoreRules roles={roles || []} />
            </TabsContent>
            <TabsContent value="targets" className="p-0">
              <TargetSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
