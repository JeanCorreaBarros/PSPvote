"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Vote, Lock, Mail, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { authApi } from "@/lib/api"
import { setToken } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Demo credentials
  const DEMO_USERNAME = "admin"
  const DEMO_PASSWORD = "admin123"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await authApi.login({ username, password }) as any

      if (response && response.token) {
        // Store token and user info
        setToken(response.token)
        if (response.user) {
          sessionStorage.setItem("pspvote_user", JSON.stringify(response.user))
        }
        router.push("/dashboard")
      } else {
        setError("Error: No se recibió token del servidor")
      }
    } catch (err) {
      setError("Credenciales incorrectas o error al conectar con el servidor.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setUsername(DEMO_USERNAME)
    setPassword(DEMO_PASSWORD)
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Illustration */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden
             bg-gradient-to-br from-primary/15 via-primary/5 to-accent/15 p-12"
      >
        {/* Glow decorativo */}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative z-10 max-w-md text-center">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
            className="mb-10"
          >
            <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-3xl
                      bg-primary/90 backdrop-blur-md
                      shadow-2xl shadow-primary/40">
              <Vote className="h-16 w-16 text-primary-foreground" />
            </div>
          </motion.div>

          {/* Título */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="mb-4 text-3xl font-bold tracking-tight text-foreground"
          >
            Sistema de Votaciones
          </motion.h2>

          {/* Descripción */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="text-sm leading-relaxed text-muted-foreground"
          >
            Gestiona y registra votos de manera eficiente en tiempo real con
            <span className="font-bold text-xl"> PSPvote</span>.
          </motion.p>

          {/* Features */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  delayChildren: 0.7,
                  staggerChildren: 0.15,
                },
              },
            }}
            className="mt-10 flex flex-col gap-4"
          >
            {[
              "Registro de votantes",
              "Control de puestos",
              "Reportes en tiempo real",
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 rounded-xl border bg-background/80
                     p-4 shadow-sm backdrop-blur transition-all hover:shadow-md"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>

                <span className="text-sm font-medium text-foreground">
                  {feature}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>


      {/* Right Panel - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
      >
        <Card className="w-full max-w-md border-0 shadow-none bg-transparent">
          <CardContent className="p-0">
            <div className="flex items-center gap-3 mb-2 lg:hidden">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Vote className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">PSPVote</span>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Iniciar Sesión</h1>
              <p className="text-muted-foreground">
                Ingresa tus credenciales para acceder al sistema
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-foreground font-medium">
                  Usuario
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-12 bg-muted/50 border-border focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-muted/50 border-border focus:border-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-sm bg-destructive/10 p-3 rounded-lg"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                  />
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>

            <div className="mt-6 hidden p-4 bg-accent/10 rounded-xl border border-accent/20">
              <p className="text-sm text-muted-foreground mb-2">
                <strong className="text-foreground">Credenciales de prueba:</strong>
              </p>
              <p className="text-sm text-muted-foreground font-mono">
                Usuario: admin<br />
                Contraseña: admin123
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fillDemoCredentials}
                className="mt-3 text-accent border-accent/30 hover:bg-accent/10 bg-transparent"
              >
                Usar credenciales demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
