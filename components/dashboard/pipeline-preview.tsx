import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const pipelineStages = [
  { name: "New", count: 8, color: "bg-info" },
  { name: "Negotiating", count: 3, color: "bg-warning" },
  { name: "Accepted", count: 5, color: "bg-success" },
  { name: "Processing", count: 4, color: "bg-primary" },
  { name: "Completed", count: 12, color: "bg-muted-foreground" },
]

export function PipelinePreview() {
  const total = pipelineStages.reduce((acc, stage) => acc + stage.count, 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Pipeline Overview</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/pipeline" className="gap-1">
            Open board <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {/* Progress bar */}
        <div className="mb-6 flex h-2 overflow-hidden rounded-full bg-secondary">
          {pipelineStages.map((stage) => (
            <div
              key={stage.name}
              className={`${stage.color} transition-all`}
              style={{ width: `${(stage.count / total) * 100}%` }}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {pipelineStages.map((stage) => (
            <div key={stage.name} className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{stage.name}</p>
                <p className="text-sm font-medium text-foreground">{stage.count}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
