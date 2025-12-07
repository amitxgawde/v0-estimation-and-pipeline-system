import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const updates = [
  {
    title: "Live data & INR everywhere",
    detail: "Dashboard, estimates, pipeline, finance, customers, vendors now use live data in INR.",
    date: "2025-12-07",
  },
  {
    title: "Vercel Postgres ready",
    detail: "App data layer refactored to use Vercel Postgres. Set DATABASE_URL in Vercel.",
    date: "2025-12-07",
  },
  {
    title: "Estimates fixes",
    detail: "Create, revise, delete fixed; customer autocomplete deduped; INR in PDFs and summaries.",
    date: "2025-12-07",
  },
]

export const dynamic = "force-dynamic"

export default function UpdatesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title="Updates" description="Recent changes and fixes" />
        <div className="p-6 space-y-4">
          {updates.map((u) => (
            <Card key={`${u.title}-${u.date}`}>
              <CardHeader>
                <CardTitle className="text-base">{u.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{u.detail}</p>
                <p className="text-xs text-muted-foreground">Date: {u.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}


