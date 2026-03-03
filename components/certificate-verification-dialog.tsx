"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, CheckCircle, AlertCircle, Loader2, X } from "lucide-react"

interface CertificateVerificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  votanteNombre: string
  votanteCedula: string
  votanteId: string
  onConfirm: (codigoBarras: string, imageBlob?: Blob | null) => Promise<void>
}

export function CertificateVerificationDialog({
  open,
  onOpenChange,
  votanteNombre,
  votanteCedula,
  votanteId,
  onConfirm,
}: CertificateVerificationDialogProps) {
  const { toast } = useToast()
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isConfirmingRef = useRef(false)

  const [cameraActive, setCameraActive] = useState(false)
  const [barcodeData, setBarcodeData] = useState<string>("")
  const [manualInput, setManualInput] = useState("")
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null)
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  /* ==================== CÁMARA ==================== */

  const startCamera = async () => {
    try {
      setError(null)
      setCameraActive(true)

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch {
      setError("No se pudo acceder a la cámara")
      setCameraActive(false)
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((t) => t.stop())
    }
    setCameraActive(false)
  }

  const takePhoto = async () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    if (!video.videoWidth) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(video, 0, 0)

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85)
    )

    if (blob) {
      setCapturedBlob(blob)
      setCapturedUrl(URL.createObjectURL(blob))
      stopCamera()
    }
  }

  /* ==================== CONFIRMAR ==================== */

  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevenir propagación y comportamiento por defecto
    e.preventDefault()
    e.stopPropagation()
    
    // Prevenir ejecución múltiple
    if (isConfirmingRef.current || !barcodeData || !capturedBlob || isLoading) return
    
    isConfirmingRef.current = true
    setIsLoading(true)

    try {
      toast({
        title: "Confirmando...",
        description: "Por favor espere",
      })

      // Llamar al callback del padre (que hace el fetch)
      await onConfirm(barcodeData, capturedBlob)

      // Si llegó aquí, la confirmación fue exitosa
      setSuccess(true)
      toast({
        title: "Éxito",
        description: "Votante certificado correctamente",
      })

      // Resetear ref inmediatamente después de éxito
      isConfirmingRef.current = false
      setIsLoading(false)

      // Cerrar modal después de 800ms
      setTimeout(() => {
        onOpenChange(false)
        // Limpiar estado
        setBarcodeData("")
        setManualInput("")
        setCapturedBlob(null)
        setCapturedUrl(null)
        setError(null)
        setSuccess(false)
      }, 800)
    } catch (err) {
      isConfirmingRef.current = false
      const errorMsg = err instanceof Error ? err.message : "Error al confirmar el certificado"
      setError(errorMsg)
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  /* ==================== RESET ==================== */

  useEffect(() => {
    if (!open) {
      stopCamera()
      setBarcodeData("")
      setManualInput("")
      setCapturedBlob(null)
      setCapturedUrl(null)
      setError(null)
      setSuccess(false)
      isConfirmingRef.current = false
    }
  }, [open])

  /* ==================== UI ==================== */

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Verificación de Certificado</DialogTitle>
          <DialogDescription>
            Captura la foto del certificado e ingresa el código
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info votante */}
          <div className="p-3 bg-muted rounded">
            <p className="font-medium">{votanteNombre}</p>
            <p className="text-xs text-muted-foreground">
              CC: {votanteCedula}
            </p>
          </div>

          {/* CÁMARA EMBEBIDA */}
          {cameraActive && !capturedUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <div className="relative rounded overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-48 object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="flex gap-2">
                <Button onClick={takePhoto} className="flex-1">
                  📸 Tomar foto
                </Button>
                <Button variant="outline" onClick={stopCamera}>
                  Cancelar
                </Button>
              </div>
            </motion.div>
          )}

          {/* PREVIEW FOTO */}
          {capturedUrl && (
            <motion.div className="space-y-2">
              <div className="relative rounded overflow-hidden border border-green-500">
                <img
                  src={capturedUrl}
                  className="w-full h-40 object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-green-600">
                  ✓ Adjunta
                </Badge>
              </div>
            </motion.div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!cameraActive && !capturedUrl && (
            <Button onClick={startCamera} className="w-full">
              <Camera className="w-4 h-4 mr-2" />
              Abrir cámara
            </Button>
          )}

          {/* Código manual */}
          <div className="flex gap-2">
            <Input
              placeholder="Código del certificado"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
            />
            <Button
              variant="secondary"
              onClick={() => setBarcodeData(manualInput)}
              disabled={!manualInput}
            >
              OK
            </Button>
          </div>

          {barcodeData && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Código: <b>{barcodeData}</b>
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Votante certificado correctamente
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!barcodeData || !capturedBlob || isLoading}
            className="relative"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              "Confirmar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
