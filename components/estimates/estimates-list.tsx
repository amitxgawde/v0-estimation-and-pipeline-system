"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ExternalLink, Copy, Edit, Send, FileText } from "lucide-react"
import Link from "next/link"

const estimates = [
  {
    id: "EST-001",
    customer: "Acme Corp",
    email: "purchasing@acme.com",
    items: 3,
    amount: "$12,500",
    margin: "25%",
    status: "sent",
    date: "Dec 5, 2025",
    revisions: 1,
  },
  {
    id: "EST-002",
    customer: "TechStart Inc",
    email: "jane@techstart.io",
    items: 5,
    amount: "$8,750",
    margin: "30%",
    status: "viewed",
    date: "Dec 5, 2025",
    revisions: 0,
  },
  {
    id: "EST-003",
    customer: "Global Solutions",
    email: "orders@globalsolutions.com",
    items: 8,
    amount: "$24,000",
    margin: "22%",
    status: "accepted",
    date: "Dec 4, 2025",
    revisions: 2,
  },
  {
    id: "EST-004",
    customer: "Retail Plus",
    email: "mike@retailplus.co",
    items: 2,
    amount: "$5,200",
    margin: "35%",
    status: "negotiating",
    date: "Dec 3, 2025",
    revisions: 3,
  },
  {
    id: "EST-005",
    customer: "BuildRight LLC",
    email: "procurement@buildright.com",
    items: 12,
    amount: "$45,800",
    margin: "18%",
    status: "draft",
    date: "Dec 3, 2025",
    revisions: 0,
  },
  {
    id: "EST-006",
    customer: "QuickServe",
    email: "orders@quickserve.net",
    items: 1,
    amount: "$2,100",
    margin: "40%",
    status: "rejected",
    date: "Dec 2, 2025",
    revisions: 1,
  },
]

const statusStyles: Record<string, string> = {
  draft: "bg-secondary text-secondary-foreground",
  sent: "bg-info/10 text-info border-info/20",
  viewed: "bg-warning/10 text-warning border-warning/20",
  accepted: "bg-success/10 text-success border-success/20",
  negotiating: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
}

export function EstimatesList() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Estimate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Margin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {estimates.map((estimate) => (
                <tr key={estimate.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <Link
                          href={`/estimates/${estimate.id}`}
                          className="text-sm font-medium text-foreground hover:text-primary"
                        >
                          {estimate.id}
                        </Link>
                        {estimate.revisions > 0 && (
                          <p className="text-xs text-muted-foreground">v{estimate.revisions + 1}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{estimate.customer}</p>
                      <p className="text-xs text-muted-foreground">{estimate.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">{estimate.items}</td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">{estimate.amount}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{estimate.margin}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className={statusStyles[estimate.status]}>
                      {estimate.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{estimate.date}</td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Link
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Revise
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Send className="mr-2 h-4 w-4" />
                          Resend
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
