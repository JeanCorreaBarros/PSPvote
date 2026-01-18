"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { CameraCapture } from "@/components/camera-capture"
import { OCRExtractor } from "@/components/ocr-extractor"
import { UsuariosTable, type UsuarioScaneado } from "@/components/usuarios-table"
import { Plus, X, Download, CheckCircle2 } from "lucide-react"
import type { OCRExtractedData } from "@/components/ocr-extractor"
import { Header } from "@/components/header"

export default function ScanUsuariosPage() {
    const [usuarios, setUsuarios] = useState<UsuarioScaneado[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [fotoFrente, setFotoFrente] = useState<string | null>(null)
    const [fotoDorso, setFotoDorso] = useState<string | null>(null)
    const [datosFrente, setDatosFrente] = useState<OCRExtractedData | null>(null)
    const [datosDorso, setDatosDorso] = useState<OCRExtractedData | null>(null)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [viewUsuario, setViewUsuario] = useState<UsuarioScaneado | null>(null)

    // Cargar usuarios del localStorage
    useEffect(() => {
        const saved = localStorage.getItem("usuarios_escaneados")
        if (saved) {
            setUsuarios(JSON.parse(saved))
        }
    }, [])

    // Guardar usuarios en localStorage
    useEffect(() => {
        localStorage.setItem("usuarios_escaneados", JSON.stringify(usuarios))
    }, [usuarios])

    // Auto-registrar cuando ambas fotos y datos estén listos
    useEffect(() => {
        if (fotoFrente && fotoDorso && datosFrente && datosDorso) {
            console.log("✅ Ambas fotos capturadas, registrando automáticamente...")
            handleRegistrar()
        }
    }, [fotoFrente, fotoDorso, datosFrente, datosDorso])

    const handleFotoFrente = (imageData: string) => {
        console.log("📷 Foto frente capturada")
        setFotoFrente(imageData)
    }

    const handleFotoDorso = (imageData: string) => {
        console.log("📷 Foto dorso capturada")
        setFotoDorso(imageData)
        handleRegistrar()
    }

    const handleDatosFrente = (data: OCRExtractedData) => {
        console.log("📊 Datos frente extraídos:", data)
        setDatosFrente(data)
    }

    const handleDatosDorso = (data: OCRExtractedData) => {
        console.log("📊 Datos dorso extraídos:", data)
        setDatosDorso(data)
    }

    const handleRegistrar = () => {
        console.log("💾 Registrando usuario...")
        if (!datosFrente?.nombre || !datosFrente?.apellido || !datosFrente?.numero) {
            console.error("❌ Faltan datos")
            alert("Faltan datos de la cédula. Por favor captura ambas fotos.")
            return
        }

        const nuevoUsuario: UsuarioScaneado = {
            id: `${Date.now()}`,
            nombre: datosFrente.nombre || "",
            apellido: datosFrente.apellido || "",
            cedula: datosFrente.numero || "",
            nacimiento: datosFrente.nacimiento || "",
            genero: datosFrente.genero || "",
            nacionalidad: datosFrente.nacionalidad || "",
            fechaCaptura: new Date().toISOString(),
        }

        console.log("✅ Usuario registrado:", nuevoUsuario)
        setUsuarios([nuevoUsuario, ...usuarios])
        resetForm()
        setIsDialogOpen(false)
    }

    const resetForm = () => {
        console.log("🔄 Reiniciando formulario")
        setFotoFrente(null)
        setFotoDorso(null)
        setDatosFrente(null)
        setDatosDorso(null)
    }

    const handleDelete = (id: string) => {
        setUsuarios(usuarios.filter(u => u.id !== id))
        setDeleteId(null)
    }

    const handleExportCSV = () => {
        if (usuarios.length === 0) {
            alert("No hay usuarios para exportar")
            return
        }

        const headers = ["Nombre", "Apellido", "Cédula", "Nacimiento", "Género", "Nacionalidad", "Fecha Captura"]
        const rows = usuarios.map(u => [
            u.nombre,
            u.apellido,
            u.cedula,
            u.nacimiento,
            u.genero,
            u.nacionalidad,
            new Date(u.fechaCaptura).toLocaleDateString(),
        ])

        const csv = [
            headers.join(","),
            ...rows.map(row => row.join(",")),
        ].join("\n")

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", `usuarios_escaneados_${new Date().toISOString().split("T")[0]}.csv`)
        link.click()
    }

    return (
        <div className="min-h-screen">
            <Header title="Scan Usuarios" />
            <div className="space-y-6 p-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">Scan Usuarios</h2>
                        <p className="text-sm text-muted-foreground">
                            Captura y registra usuarios escaneando cédulas
                        </p>
                    </div>
                    <div className="space-x-3">
                        {usuarios.length > 0 && (
                            <Button
                                onClick={handleExportCSV}
                                variant="outline"
                                className="h-12"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Exportar CSV ({usuarios.length})
                            </Button>
                        )}
                        <Button
                            onClick={() => setIsDialogOpen(true)}
                            className="gap-2 bg-primary text-primary-foreground"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Escaneo
                        </Button>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Escaneados
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">{usuarios.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">Usuarios en el sistema</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Hoy
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-secondary">
                                {usuarios.filter(u => {
                                    const today = new Date().toLocaleDateString()
                                    const userDate = new Date(u.fechaCaptura).toLocaleDateString()
                                    return today === userDate
                                }).length}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Escaneados hoy</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Este Mes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-accent">
                                {usuarios.filter(u => {
                                    const today = new Date()
                                    const userDate = new Date(u.fechaCaptura)
                                    return today.getMonth() === userDate.getMonth() &&
                                        today.getFullYear() === userDate.getFullYear()
                                }).length}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Escaneados este mes</p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Tabla */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Usuarios Escaneados</CardTitle>
                            <CardDescription>
                                Historial de todos los usuarios capturados
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UsuariosTable
                                usuarios={usuarios}
                                onDelete={(id) => setDeleteId(id)}
                                onView={setViewUsuario}
                            />
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Dialog de Escaneo */}
                <AnimatePresence>
                    {isDialogOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                            onClick={() => setIsDialogOpen(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background rounded-lg shadow-lg p-6"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-foreground">Escanear Nueva Cédula</h2>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Captura el frente y dorso de la cédula para extraer los datos automáticamente
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsDialogOpen(false)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                <div className="space-y-6">
                                    {/* Frente */}
                                    <div className="space-y-2">
                                        <h3 className="font-semibold text-foreground">Paso 1: Frente de la Cédula</h3>
                                        <CameraCapture
                                            onCapture={handleFotoFrente}
                                            side="frente"
                                            captured={fotoFrente !== null}
                                        />
                                        {fotoFrente && datosFrente === null && (
                                            <div className="text-center text-sm text-muted-foreground">
                                                Procesando datos...
                                            </div>
                                        )}
                                        {datosFrente && (
                                            <OCRExtractor
                                                imageData={fotoFrente}
                                                side="frente"
                                                onExtract={handleDatosFrente}
                                            />
                                        )}
                                    </div>

                                    {/* Dorso */}
                                    {fotoFrente && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-2 pt-4 border-t"
                                        >
                                            <h3 className="font-semibold text-foreground">Paso 2: Dorso de la Cédula</h3>
                                            <CameraCapture
                                                onCapture={handleFotoDorso}
                                                side="dorso"
                                                captured={fotoDorso !== null}
                                            />
                                            {fotoDorso && datosDorso === null && (
                                                <div className="text-center text-sm text-muted-foreground">
                                                    Procesando datos...
                                                </div>
                                            )}
                                            {datosDorso && (
                                                <OCRExtractor
                                                    imageData={fotoDorso}
                                                    side="dorso"
                                                    onExtract={handleDatosDorso}
                                                />
                                            )}
                                        </motion.div>
                                    )}

                                    {/* Mensaje de éxito cuando se registra */}
                                    {fotoFrente && fotoDorso && datosFrente && datosDorso && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="pt-4 border-t"
                                        >
                                            <Card className="p-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                                                <div className="flex items-center gap-3">
                                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                                    <div>
                                                        <p className="font-medium text-green-700 dark:text-green-300">Usuario registrado exitosamente</p>
                                                        <p className="text-sm text-green-600 dark:text-green-400">{datosFrente.nombre} {datosFrente.apellido}</p>
                                                    </div>
                                                </div>
                                            </Card>
                                            <Button
                                                onClick={() => setIsDialogOpen(false)}
                                                className="w-full h-12 mt-4 bg-primary hover:bg-primary/90"
                                            >
                                                Cerrar
                                            </Button>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Delete Dialog */}
                <AnimatePresence>
                    {deleteId && (
                        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Eliminar Usuario</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        ¿Estás seguro de que quieres eliminar este usuario del registro?
                                        Esta acción no se puede deshacer.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="flex gap-3 justify-end">
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => handleDelete(deleteId)}
                                        className="bg-destructive hover:bg-destructive/90"
                                    >
                                        Eliminar
                                    </AlertDialogAction>
                                </div>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </AnimatePresence>

                {/* View Usuario Dialog */}
                <AnimatePresence>
                    {viewUsuario && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                            onClick={() => setViewUsuario(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-md bg-background rounded-lg shadow-lg p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold text-foreground">Detalles del Usuario</h2>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setViewUsuario(null)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Nombre</p>
                                            <p className="text-sm font-medium">{viewUsuario.nombre}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Apellido</p>
                                            <p className="text-sm font-medium">{viewUsuario.apellido}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Cédula</p>
                                            <p className="text-sm font-mono font-medium">{viewUsuario.cedula}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Nacimiento</p>
                                            <p className="text-sm font-medium">{viewUsuario.nacimiento}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Género</p>
                                            <p className="text-sm font-medium">{viewUsuario.genero}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium text-muted-foreground">Nacionalidad</p>
                                            <p className="text-sm font-medium">{viewUsuario.nacionalidad}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs font-medium text-muted-foreground">Fecha de Captura</p>
                                            <p className="text-sm font-medium">
                                                {new Date(viewUsuario.fechaCaptura).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
