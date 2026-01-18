"use client"

import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

export interface OCRExtractedData {
  nombre?: string
  apellido?: string
  numero?: string
  nacimiento?: string
  genero?: string
  nacionalidad?: string
  raw?: string
}

interface OCRExtractorProps {
  imageData: string
  side: "frente" | "dorso"
  onExtract: (data: OCRExtractedData) => void
}

export function OCRExtractor({ imageData, side, onExtract }: OCRExtractorProps) {
  useEffect(() => {
    const extractData = async () => {
      console.log("🔍 Iniciando extracción OCR para:", side)
      
      // Simulamos extracción de datos
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Datos simulados según el lado
      const mockData: OCRExtractedData = {
        nombre: side === "frente" ? "JUAN" : undefined,
        apellido: side === "frente" ? "PÉREZ" : undefined,
        numero: "12345678",
        nacimiento: side === "frente" ? "15/03/1990" : undefined,
        genero: side === "frente" ? "M" : undefined,
        nacionalidad: "V",
        raw: "Datos extraídos de cédula",
      }
      
      console.log("✅ Datos extraídos:", mockData)
      onExtract(mockData)
    }
    
    extractData()
  }, [imageData, side, onExtract])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card className="p-6 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
        <div className="flex items-start gap-3 mb-4">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-green-700 dark:text-green-300">Datos extraídos correctamente</p>
            <p className="text-sm text-green-600 dark:text-green-400">Lado: {side === "frente" ? "Frente" : "Dorso"}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
