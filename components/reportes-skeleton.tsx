"use client"

import { motion } from "framer-motion"

export function EstadisticasSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-6"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="p-4 rounded-lg bg-muted/50"
        >
          {/* Número simulado */}
          <div className="h-8 bg-muted rounded mb-3 w-16" />
          
          {/* Etiqueta simulada */}
          <div className="h-4 bg-muted rounded w-24" />
        </motion.div>
      ))}
    </motion.div>
  )
}

export function ReportCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-border rounded-lg p-5 space-y-4"
    >
      <div className="flex items-start gap-4">
        {/* Icono simulado */}
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-12 h-12 rounded-xl bg-muted shrink-0"
        />

        <div className="flex-1 space-y-3 w-full">
          {/* Título */}
          <div className="h-5 bg-muted rounded w-3/4" />

          {/* Descripción */}
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-5/6" />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <div className="h-9 bg-muted rounded w-32" />
            <div className="h-9 bg-muted rounded w-28" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
