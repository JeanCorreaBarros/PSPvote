"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Mail, User as UserIcon, Calendar, Shield, Edit2, Moon, Sun } from "lucide-react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { ChangePasswordDialog } from "@/components/change-password-dialog"
import { getUser, type User as UserType } from "@/lib/auth"

export default function PerfilPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false)

  useEffect(() => {
    const currentUser = getUser()
    if (!currentUser) {
      router.push("/")
    } else {
      setUser(currentUser)
    }

    // Cargar preferencias del localStorage
    const savedDarkMode = localStorage.getItem("theme-dark-mode") === "true"
    const savedNotifications = localStorage.getItem("notifications-enabled") !== "false"
    setIsDarkMode(savedDarkMode)
    setNotificationsEnabled(savedNotifications)

    // Aplicar tema al cargar
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    setIsLoading(false)
  }, [router])

  const handleDarkModeToggle = (enabled: boolean) => {
    setIsDarkMode(enabled)
    localStorage.setItem("theme-dark-mode", enabled.toString())

    if (enabled) {
      document.documentElement.classList.add("dark")
      document.body.style.backgroundColor = "#09090b"
      document.body.style.color = "#fafafa"
    } else {
      document.documentElement.classList.remove("dark")
      document.body.style.backgroundColor = "#ffffff"
      document.body.style.color = "#000000"
    }

    // Recargar para aplicar cambios completos
    window.location.reload()
  }

  const handleNotificationsToggle = (enabled: boolean) => {
    setNotificationsEnabled(enabled)
    localStorage.setItem("notifications-enabled", enabled.toString())
  }

  const handleChangePassword = () => {
    // El componente ChangePasswordDialog se encargará de redirigir después de cambiar
    setOpenChangePasswordDialog(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Perfil" />
        <div className="flex items-center justify-center h-96">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
          />
        </div>
      </div>
    )
  }

  if (!user) return null

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Mi Perfil" />

      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="p-4 md:p-8 max-w-4xl mx-auto mt-6"
      >
        {/* Header con botón volver */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Información del Perfil</h1>
            <p className="text-muted-foreground mt-1">Gestiona tu información personal</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="gap-2 hover:bg-primary/10 focus:ring-2 focus:ring-primary cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>
        </div>

        {/* Card Principal - Información de Usuario */}
        <motion.div variants={itemVariants}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Datos básicos de tu cuenta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                      {user.role?.name === "LIDER"
                        ? user.leader?.name?.charAt(0)
                        : user.username?.charAt(0) || user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Edit2 className="w-4 hidden h-4" />
                    Avatar
                  </Button>
                </div>

                {/* Información */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ID */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                      <UserIcon className="w-4 h-4" />
                      ID de Usuario
                    </label>
                    <p className="text-xs font-mono text-foreground break-all truncate w-2/5">{user.id || "No especificado"}</p>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                      <UserIcon className="w-4 h-4" />
                      Nombre de Usuario
                    </label>
                    <p className="text-lg font-semibold text-foreground">{user.username || "No especificado"}</p>
                  </div>

                  {/* Rol */}
                  <div className="flex flex-row gap-3">

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                        <Shield className="w-4 h-4" />
                        Rol
                      </label>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary text-primary-foreground">
                          {user.role?.name || "Usuario"}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                        <Shield className="w-4 h-4" />
                        Role ID
                      </label>
                      <p className="text-xs mt-3 font-mono text-foreground break-all truncate w-2/5">{user.roleId || "No especificado"}</p>
                    </div>
                  </div>

                  {/* Fecha de Registro */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                      <Calendar className="w-4 h-4" />
                      Miembro desde
                    </label>
                    <p className="text-sm font-semibold text-foreground">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                        : "No especificado"}
                    </p>
                  </div>

                  
                  {/* Leader Info - Solo si es LIDER */}
                  {user.role?.name === "LIDER" && user.leader && (
                    <div className="col-span-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
                        <UserIcon className="w-4 h-4" />
                        Información del Líder Asignado
                      </label>
                      <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                        <p className="font-semibold text-foreground">Nombre: {user.leader.name}</p>
                        <p className="text-sm text-muted-foreground">Teléfono: {user.leader.phone}</p>
                        <p className="text-sm text-muted-foreground">Dirección: {user.leader.address}</p>
                        <p className="text-xs font-mono text-muted-foreground break-all truncate w-2/5">ID: {user.leader.id}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card - Seguridad */}
        <motion.div variants={itemVariants}>
          <Card className="mb-6 ">
            <CardHeader>
              <CardTitle>Seguridad</CardTitle>
              <CardDescription>Gestiona tu acceso y contraseña</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Contraseña</p>
                  <p className="text-sm text-muted-foreground">Al cambiar la contraseña debes volver a inciar session </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setOpenChangePasswordDialog(true)}
                >
                  Cambiar
                </Button>
              </div>

              <Separator />

              <div className=" hidden items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Autenticación de Dos Factores</p>
                  <p className="text-sm text-muted-foreground">Deshabilitado</p>
                </div>
                <Button variant="outline" size="sm">
                  Habilitar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Card - Preferencias */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Preferencias</CardTitle>
              <CardDescription>Personaliza tu experiencia</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center hidden justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Notificaciones por Email</p>
                  <p className="text-sm text-muted-foreground">Recibe alertas importantes</p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={handleNotificationsToggle}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {isDarkMode ? (
                      <Moon className="w-5 h-5 text-primary" />
                    ) : (
                      <Sun className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Tema Oscuro</p>
                    <p className="text-sm text-muted-foreground">
                      {isDarkMode ? "Tema oscuro activado" : "Usa tema oscuro por defecto"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={handleDarkModeToggle}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Botones de Acción */}
        <motion.div variants={itemVariants} className="mt-8 hidden flex gap-4 justify-center">
          <Button variant="outline">
            Descargar mis datos
          </Button>
          <Button variant="destructive">
            Eliminar cuenta
          </Button>
        </motion.div>
      </motion.main>

      {/* Dialog Cambiar Contraseña */}
      {user && (
        <ChangePasswordDialog
          open={openChangePasswordDialog}
          onOpenChange={setOpenChangePasswordDialog}
          onChangePassword={handleChangePassword}
          userId={user.id}
          username={user.username}
          roleId={user.roleId}
        />
      )}
    </div>
  )
}
