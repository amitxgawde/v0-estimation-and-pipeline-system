import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { PipelineBoard } from "@/components/pipeline/pipeline-board"
import { Button } from "@/components/ui/button"
import { Filter, SlidersHorizontal } from "lucide-react"

export default function PipelinePage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title="Pipeline" description="Track your deals through each stage" />
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="ghost" size="sm">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Customize
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">Live pipeline</div>
          </div>
          <PipelineBoard />
        </div>
      </main>
    </div>
  )
}
