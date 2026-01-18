"use client"

import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  MapPin,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ClipboardList, label: "Votos", href: "/dashboard/registro-votos" },
  { icon: Users, label: "Votantes", href: "/dashboard/votantes" },
  { icon: MapPin, label: "Puestos", href: "/dashboard/puestos" },
  { icon: BarChart3, label: "Reportes", href: "/dashboard/reportes" },
]

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile()

  if (!isMobile) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-sidebar border-t border-sidebar-border flex items-center justify-around px-2 py-2 z-40 md:hidden">
      {menuItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
        const Icon = item.icon

        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className={cn(
              "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors",
              isActive
                ? "text-primary bg-primary/10"
                : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            )}
            title={item.label}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs truncate max-w-12.5">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
