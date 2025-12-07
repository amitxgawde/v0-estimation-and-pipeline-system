"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Kanban,
  ShoppingCart,
  DollarSign,
  Users,
  Settings,
  Plus,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Estimates", href: "/estimates", icon: FileText },
  { name: "Pipeline", href: "/pipeline", icon: Kanban },
  { name: "Orders", href: "/orders", icon: ShoppingCart },
  { name: "Finance", href: "/finance", icon: DollarSign },
  { name: "Customers", href: "/customers", icon: Users },
  { name: "Vendors", href: "/vendors", icon: Building2 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span aria-label="Gift" role="img" className="text-base">
              🎁
            </span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-tight font-sans text-foreground">AGSoft</span>
            <span className="text-[11px] font-medium text-muted-foreground">the gift store manager</span>
          </div>
        </div>

        {/* Quick Action */}
        <div className="p-4">
          <Button asChild className="w-full justify-start gap-2" size="sm">
            <Link href="/estimates/new">
              <Plus className="h-4 w-4" />
              New Estimate
            </Link>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-border p-3">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  )
}
