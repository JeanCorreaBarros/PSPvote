"use client"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Camera, RotateCcw, Check, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

interface CameraCaptureProps {
  onCapture: (imageData: string, side: "frente" | "dorso") => void
  side: "frente" | "dorso"
  captured?: boolean
}

export function CameraCapture({ onCapture, side, captured }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Limpiar stream cuando se desmonta o cuando cierra
  useEffect(() => {
    return () => {
      console.log("🧹 Limpiando stream")
      if (stream) {
        stream.getTracks().forEach(track => {
          console.log("🛑 Deteniendo track:", track.kind)
          track.stop()
        })
      }
    }
  }, [])

  // Cuando isOpen cambia, reproducir el video
  useEffect(() => {
    if (isOpen && videoRef.current && stream) {
      console.log("▶️ Intentando reproducir video")
      videoRef.current.play().catch(err => {
        console.error("❌ Error reproduciendo:", err)
      })
    }
  }, [isOpen, stream])

  const startCamera = async () => {
    console.log("🎥 startCamera llamado, lado:", side)
    console.log("📌 videoRef.current existe?", !!videoRef.current)
    
    setIsLoading(true)
    setError(null)
    
    try {
      console.log("📷 Solicitando acceso a cámara trasera...")
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 }, 
          height: { ideal: 720 }
        },
        audio: false,
      }).catch(async (err) => {
        console.log("⚠️ Cámara trasera falló:", err.message)
        console.log("📷 Intentando con cámara frontal...")
        return navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: "user",
            width: { ideal: 1280 }, 
            height: { ideal: 720 }
          },
          audio: false,
        })
      })
      
      console.log("✅ Cámara obtenida, stream:", !!mediaStream)
      console.log("📹 Tracks disponibles:", mediaStream.getTracks().length)
      
      // Establecer el stream PRIMERO
      setStream(mediaStream)
      setIsOpen(true)
      
      // Usar setTimeout para asegurar que el ref esté actualizado
      setTimeout(() => {
        if (videoRef.current) {
          console.log("🎬 Asignando stream al video element")
          videoRef.current.srcObject = mediaStream
          
          // Manejar el evento onloadedmetadata
          videoRef.current.onloadedmetadata = () => {
            console.log("✅ Video metadata cargado, dimensiones:", videoRef.current?.videoWidth, "x", videoRef.current?.videoHeight)
            videoRef.current?.play().catch(err => {
              console.error("❌ Error al reproducir:", err)
            })
          }
        } else {
          console.error("❌ videoRef.current es null!")
        }
      }, 100)
      
    } catch (err) {
      console.error("❌ Error general:", err)
      const errorMsg = err instanceof Error ? err.message : "Error desconocido"
      setError(`Error: ${errorMsg}`)
      setIsOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const capturePhoto = () => {
    console.log("📸 Capturando foto")
    if (!videoRef.current || !canvasRef.current) {
      console.error("❌ Video o canvas ref no disponible")
      return
    }
    
    const video = videoRef.current
    console.log("📺 Dimensiones del video:", video.videoWidth, "x", video.videoHeight)
    
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError("El video aún no está listo. Intenta de nuevo en un momento.")
      return
    }

    try {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = video.videoWidth
        canvasRef.current.height = video.videoHeight
        context.drawImage(video, 0, 0)
        const imageData = canvasRef.current.toDataURL("image/jpeg", 0.9)
        console.log("✅ Foto capturada exitosamente")
        setPreview(imageData)
        setError(null)
      }
    } catch (err) {
      console.error("❌ Error capturando foto:", err)
      setError("Error al capturar la foto")
    }
  }

  const confirmCapture = () => {
    if (preview) {
      console.log("✅ Confirmando captura")
      onCapture(preview, side)
      stopCamera()
    }
  }

  const stopCamera = () => {
    console.log("🛑 Deteniendo cámara")
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsOpen(false)
    setPreview(null)
    setError(null)
  }

  const retakePhoto = () => {
    console.log("🔄 Reintentando foto")
    setPreview(null)
    setError(null)
  }

  if (captured) {
    return (
      <Card className="p-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
        <div className="flex items-center gap-3">
          <Check className="w-6 h-6 text-green-600" />
          <span className="text-green-700 dark:text-green-300 font-medium">
            Foto del {side} capturada correctamente
          </span>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Card className="p-4 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </Card>
      )}

      {!isOpen && !preview && (
        <Button
          onClick={startCamera}
          disabled={isLoading}
          className="w-full h-12 bg-primary hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
              />
              Abriendo cámara...
            </>
          ) : (
            <>
              <Camera className="w-5 h-5 mr-2" />
              Capturar foto del {side} de cédula
            </>
          )}
        </Button>
      )}

      {isOpen && !preview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <Card className="overflow-hidden bg-black aspect-video flex items-center justify-center relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </Card>
          <div className="flex gap-3">
            <Button
              onClick={capturePhoto}
              className="flex-1 h-12 bg-primary hover:bg-primary/90"
            >
              <Camera className="w-5 h-5 mr-2" />
              Tomar Foto
            </Button>
            <Button
              onClick={stopCamera}
              variant="outline"
              className="flex-1 h-12"
            >
              Cancelar
            </Button>
          </div>
        </motion.div>
      )}

      {preview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <Card className="overflow-hidden">
            <img src={preview} alt="Preview" className="w-full" />
          </Card>
          <div className="flex gap-3">
            <Button
              onClick={confirmCapture}
              className="flex-1 h-12 bg-green-600 hover:bg-green-700"
            >
              <Check className="w-5 h-5 mr-2" />
              Confirmar Foto
            </Button>
            <Button
              onClick={retakePhoto}
              variant="outline"
              className="flex-1 h-12"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reintentar
            </Button>
          </div>
        </motion.div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
