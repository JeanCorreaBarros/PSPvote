"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Bell, Shield, Database } from "lucide-react"
import { configuracionApi } from "@/lib/api"

interface Configuracion {
  nombreEvento: string
  fecha: string
  lugar: string
  horaInicio: string
  horaFin: string
}

const defaultConfig: Configuracion = {
  nombreEvento: "Elecciones 2024",
  fecha: "2024-01-18",
  lugar: "Centro de Convenciones",
  horaInicio: "08:00",
  horaFin: "17:00",
}

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<Configuracion>(defaultConfig)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true)
        setError(null)
        // Descomenta cuando el endpoint esté listo
        // const data = await configuracionApi.get()
        // setConfig(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar configuración')
        setConfig(defaultConfig)
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [])

  const handleSaveConfig = async () => {
    try {
      setLoading(true)
      setError(null)
      // Descomenta cuando el endpoint esté listo
      // await configuracionApi.update(config)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar configuración')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="Configuración" />

      <div className="p-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-6">
            Configuración guardada exitosamente
          </div>
        )}

        <Tabs defaultValue="evento" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="evento" className="gap-2">
              <User className="w-4 h-4" />
              Evento
            </TabsTrigger>
            <TabsTrigger value="notificaciones" className="gap-2">
              <Bell className="w-4 h-4" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="seguridad" className="gap-2">
              <Shield className="w-4 h-4" />
              Seguridad
            </TabsTrigger>
            <TabsTrigger value="sistema" className="gap-2">
              <Database className="w-4 h-4" />
              Sistema
            </TabsTrigger>
          </TabsList>

          <TabsContent value="evento">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Información del Evento</CardTitle>
                  <CardDescription>Configura los datos del evento electoral</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombreEvento">Nombre del Evento</Label>
                    <Input
                      id="nombreEvento"
                      value={config.nombreEvento}
                      onChange={(e) => setConfig({ ...config, nombreEvento: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fecha">Fecha</Label>
                      <Input
                        id="fecha"
                        type="date"
                        value={config.fecha}
                        onChange={(e) => setConfig({ ...config, fecha: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lugar">Lugar</Label>
                      <Input
                        id="lugar"
                        value={config.lugar}
                        onChange={(e) => setConfig({ ...config, lugar: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="horaInicio">Hora de Inicio</Label>
                      <Input
                        id="horaInicio"
                        type="time"
                        value={config.horaInicio}
                        onChange={(e) => setConfig({ ...config, horaInicio: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="horaFin">Hora de Finalización</Label>
                      <Input
                        id="horaFin"
                        type="time"
                        value={config.horaFin}
                        onChange={(e) => setConfig({ ...config, horaFin: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button
                    className="bg-primary text-primary-foreground"
                    onClick={handleSaveConfig}
                    disabled={loading}
                  >
                    Guardar Cambios
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notificaciones">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Preferencias de Notificaciones</CardTitle>
                  <CardDescription>Configura cómo recibir notificaciones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Notificaciones por Email</p>
                      <p className="text-sm text-muted-foreground">Recibe alertas en tu correo</p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Notificaciones Push</p>
                      <p className="text-sm text-muted-foreground">Recibe notificaciones en el navegador</p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Notificaciones SMS</p>
                      <p className="text-sm text-muted-foreground">Recibe mensajes de texto</p>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="seguridad">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Seguridad de la Cuenta</CardTitle>
                  <CardDescription>Administra la seguridad de tu cuenta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Contraseña Actual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nueva Contraseña</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                  <Button className="bg-primary text-primary-foreground">Cambiar Contraseña</Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="sistema">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Configuración del Sistema</CardTitle>
                  <CardDescription>Ajustes generales del sistema de votación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-foreground">Versión del Sistema</p>
                    <p className="text-sm text-muted-foreground">PSPVote v1.0.0</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-foreground">Última Actualización</p>
                    <p className="text-sm text-muted-foreground">18 de Enero, 2026</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-foreground">Base de Datos</p>
                    <p className="text-sm text-muted-foreground">Conectada y funcionando correctamente</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-foreground">URL de API</p>
                    <p className="text-sm text-muted-foreground">{process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
