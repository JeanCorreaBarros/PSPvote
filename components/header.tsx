"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Bell, Search, User, Settings, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getUser, logout, type User as UserType } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { HelpButton } from "@/components/help-button"
import { TourStep } from "@/hooks/use-driver-tour"

interface TourGuide {
  name: string
  steps: TourStep[]
}

interface HeaderProps {
  title: string
  tours?: TourGuide[]
}

export function Header({ title, tours }: HeaderProps) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [user, setUser] = useState<UserType | null>(null)

  useEffect(() => {
    setUser(getUser())
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-16 bg-card border-b border-border flex items-center justify-between px-6"
    >
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden ">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="w-64 pl-9 h-9 bg-muted/50"
          />
        </div>

        {/* Help Button */}
        {tours && tours.length > 0 && <HelpButton tours={tours} />}


        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 h-9 px-2 hover:bg-sidebar-accent/50 transition-colors"
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {user?.role?.name === "LIDER" 
                    ? user?.leader?.name?.charAt(0) 
                    : user?.username?.charAt(0) 
                    || user?.name?.charAt(0) 
                    || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground hidden md:block">
                {user?.role?.name === "LIDER" 
                  ? user?.leader?.name 
                  : user?.username || user?.name || "Usuario"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => router.push("/dashboard/perfil")}
              className="hover:bg-sidebar-accent/50 cursor-pointer transition-colors rounded-md"
            >
              <User className="w-4 h-4 mr-2" />
              Perfil
            </DropdownMenuItem>
            {isMobile && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => router.push("/dashboard/configuracion")}
                  className="hover:bg-sidebar-accent/50 cursor-pointer transition-colors rounded-md"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-colors rounded-md"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}
