"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  MapPin,
  Map,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Vote,
  QrCode,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { logout, getRoleFromToken } from "@/lib/auth"
import { useState, useEffect } from "react"

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

interface MenuItem {
  icon: React.ComponentType<any>
  label: string
  href?: string
  requiredRole?: string[] // Roles permitidos para este item
  submenu?: Array<{
    label: string
    href: string
    requiredRole?: string[]
  }>
}

const menuItems: MenuItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    requiredRole: ["ADMIN", "LIDER"] // Ambos roles pueden ver
  },
  {
    icon: ClipboardList,
    label: "Registro de Votos",
    href: "/dashboard/registro-votos",
    requiredRole: ["ADMIN", "LIDER"] // Ambos roles pueden ver
  },
  {
    icon: ClipboardList,
    label: "Registro Doc. Bloqueados",
    href: "/dashboard/cedulas-bloqueadas",
    requiredRole: ["ADMIN"] // Solo ADMIN
  },
  {
    icon: Users,
    label: "Confirmacion de Certificados",
    href: "/dashboard/votantes",
    requiredRole: ["ADMIN"] // Solo ADMIN
  },
  {
    icon: MapPin,
    label: "Puestos de Votación",
    href: "/dashboard/puestos",
    requiredRole: ["ADMIN"] // Solo ADMIN
  },
  /*{ 
    icon: Map, 
    label: "Mapa de Líderes", 
    href: "/dashboard/mapa-lideres",
    requiredRole: ["ADMIN"] // Solo ADMIN
  },*/
  {
    icon: BarChart3,
    label: "Reportes",
    href: "/dashboard/reportes",
    requiredRole: ["ADMIN"] // Solo ADMIN
  },
  {
    icon: Settings,
    label: "Configuración",
    requiredRole: ["ADMIN"], // Solo ADMIN
    submenu: [
      {
        label: "Configuración",
        href: "/dashboard/configuracion",
        requiredRole: ["ADMIN"]
      },
      {
        label: "Usuarios",
        href: "/dashboard/configuracion/usuarios",
        requiredRole: ["ADMIN"]
      },
    ],
  },
]

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    // Obtener el rol del token
    const role = getRoleFromToken()
    setUserRole(role)
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const toggleSubmenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label)
  }

  // Filtrar items del menú según el rol del usuario
  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.requiredRole) return true
    if (!userRole) return false
    return item.requiredRole.includes(userRole)
  })

  // Filtrar submenú según el rol
  const getFilteredSubmenu = (submenu: MenuItem["submenu"]) => {
    if (!submenu) return []
    return submenu.filter((item) => {
      if (!item.requiredRole) return true
      if (!userRole) return false
      return item.requiredRole.includes(userRole)
    })
  }

  const sidebarVariants = {
    expanded: { width: 260 },
    collapsed: { width: 80 },
  }

  const labelVariants = {
    visible: { opacity: 1, x: 0, display: "block" },
    hidden: { opacity: 0, x: -10, transitionEnd: { display: "none" } },
  }

  return (
    <motion.aside
      initial={false}
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col fixed left-0 top-0 z-40"
    >
      {/* Logo */}
      <div id="sidebar-logo" className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
            <Vote className="w-5 h-5 text-primary-foreground" />
          </div>
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-lg font-bold text-sidebar-foreground whitespace-nowrap"
              >
                PSPVote
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 bg-sidebar border border-sidebar-border rounded-full flex items-center justify-center hover:bg-sidebar-accent transition-colors shadow-sm"
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronLeft className="w-4 h-4 text-sidebar-foreground" />
        </motion.div>
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {filteredMenuItems.map((item) => {
            const submenuItems = getFilteredSubmenu(item.submenu)
            const hasSubmenu = submenuItems && submenuItems.length > 0
            const isExpanded = expandedMenu === item.label
            const isActive = hasSubmenu
              ? pathname.startsWith("/dashboard/configuracion")
              : item.href === pathname

            return (
              <li key={item.label}>
                <motion.div
                  whileHover={hasSubmenu ? {} : { x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (hasSubmenu) {
                      toggleSubmenu(item.label)
                    } else if (item.href) {
                      router.push(item.href)
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative overflow-hidden cursor-pointer",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon className={cn("w-5 h-5 shrink-0", isActive && "text-primary")} />
                  <motion.span
                    id={`menu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    variants={labelVariants}
                    animate={isCollapsed ? "hidden" : "visible"}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium whitespace-nowrap flex-1"
                  >
                    {item.label}
                  </motion.span>
                  {hasSubmenu && !isCollapsed && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4 text-sidebar-foreground" />
                    </motion.div>
                  )}
                </motion.div>

                {/* Submenu */}
                {hasSubmenu && (
                  <AnimatePresence>
                    {isExpanded && !isCollapsed && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-1 space-y-1 pl-6"
                      >
                        {submenuItems?.map((subitem) => {
                          const isSubActive = pathname === subitem.href
                          return (
                            <li key={subitem.href}>
                              <motion.a
                                href={subitem.href}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm relative overflow-hidden",
                                  isSubActive
                                    ? "bg-sidebar-accent text-sidebar-primary"
                                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                                )}
                              >
                                {isSubActive && (
                                  <motion.div
                                    layoutId="activeSubIndicator"
                                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                  />
                                )}
                                <div className="w-2 h-2 bg-sidebar-foreground/30 rounded-full" />
                                <motion.span className="font-medium whitespace-nowrap">
                                  {subitem.label}
                                </motion.span>
                              </motion.a>
                            </li>
                          )
                        })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <motion.button
          onClick={handleLogout}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <motion.span
            variants={labelVariants}
            animate={isCollapsed ? "hidden" : "visible"}
            transition={{ duration: 0.2 }}
            className="text-sm font-medium whitespace-nowrap"
          >
            Cerrar Sesión
          </motion.span>
        </motion.button>
      </div>
    </motion.aside>
  )
}
