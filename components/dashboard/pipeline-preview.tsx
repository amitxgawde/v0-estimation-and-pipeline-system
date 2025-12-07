import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const pipelineStages: { name: string; count: number; color: string }[] = []

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
        {pipelineStages.length === 0 ? (
          <div className="text-sm text-muted-foreground">No pipeline data yet.</div>
        ) : (
          <>
            <div className="mb-6 flex h-2 overflow-hidden rounded-full bg-secondary">
              {pipelineStages.map((stage) => (
                <div
                  key={stage.name}
                  className={`${stage.color} transition-all`}
                  style={{ width: `${(stage.count / total) * 100}%` }}
                />
              ))}
            </div>

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
          </>
        )}
      </CardContent>
    </Card>
  )
}
