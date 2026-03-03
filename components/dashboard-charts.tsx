"use client"

import React, { useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line, Bar, Doughnut } from "react-chartjs-2"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
}

const chartColors = {
  primary: "rgb(59, 130, 246)",
  accent: "rgb(236, 72, 153)",
  success: "rgb(16, 185, 129)",
  warning: "rgb(245, 158, 11)",
  danger: "rgb(239, 68, 68)",
}

export type DashboardData = {
  totalVotaciones?: number
  pagos?: { esPago: boolean; total: number; porcentaje: number }[]
  porLider?: { lider: string; pago: number; noPago: number; total: number }[]
  porPrograma?: { programa: string; pago: number; noPago: number; total: number }[]
  porTipo?: { tipo: string; total: number; porcentaje: number }[]
  porPuestoVotacion?: { puestoVotacion: string; pago: number; noPago: number; total: number; porcentajePago: number; porcentajeNoPago: number; porcentajeTotal: number }[]
}

export function VotosDiaChart() {
  const data = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Votos registrados",
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: chartColors.primary,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: chartColors.primary,
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Gráficos por Programa</CardTitle>
      </CardHeader>
      <CardContent>
        <Line data={data} options={chartOptions} height={300} />
      </CardContent>
    </Card>
  )
}

export function VotosPuestoChart({ porTipo }: { porTipo?: { tipo: string; total: number; porcentaje: number }[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const ITEMS_PER_PAGE = 4

  const allData = porTipo || []
  const displayedData = allData.slice(0, ITEMS_PER_PAGE)
  const hasMoreData = allData.length > ITEMS_PER_PAGE

  const createChartData = (data: typeof allData) => {
    const labels = data.length > 0 ? data.map((p) => p.tipo) : ["Sin datos"]
    const values = data.length > 0 ? data.map((p) => p.total) : [0]
    const total = values.reduce((s, v) => s + v, 0) || 1
    const percentages = values.map((v) => Number(((v / total) * 100).toFixed(2)))

    return {
      labels,
      values,
      percentages,
      data: {
        labels,
        datasets: [
          {
            label: "Votos totales",
            data: values,
            backgroundColor: labels.map((_, i) => Object.values(chartColors)[i % 5]),
            borderColor: labels.map((_, i) => Object.values(chartColors)[i % 5]),
            borderWidth: 1,
          },
        ],
      },
      options: {
        ...chartOptions,
        plugins: {
          ...chartOptions.plugins,
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const idx = context.dataIndex
                const val = values[idx] ?? 0
                const pct = percentages[idx] ?? 0
                return `${context.label}: ${val} (${pct}%)`
              },
            },
          },
        },
      },
    }
  }

  const smallChart = createChartData(displayedData)
  const fullChart = createChartData(allData)

  return (
    <>
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gráficos por Tipo</CardTitle>
          {hasMoreData && (
            <Button 
              onClick={() => setIsModalOpen(true)} 
              variant="outline" 
              size="sm"
            >
              Ver más
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Bar data={smallChart.data} options={smallChart.options} height={300} />
          {hasMoreData && (
            <p className="text-xs text-muted-foreground mt-2">
              Mostrando {displayedData.length} de {allData.length} tipos
            </p>
          )}
        </CardContent>
      </Card>

      {/* Modal Fullscreen */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full h-full max-w-7xl max-h-[95vh] flex flex-col shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-2xl font-bold">Gráficos por Tipo - Vista Completa</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="mb-6">
                <Bar data={fullChart.data} options={fullChart.options} height={400} />
              </div>

              {/* Data Table */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Detalles de Votos</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-2 px-4">Tipo</th>
                        <th className="text-right py-2 px-4">Votos</th>
                        <th className="text-right py-2 px-4">Porcentaje</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allData.map((item, idx) => (
                        <tr key={idx} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-4">{item.tipo}</td>
                          <td className="text-right py-2 px-4 font-semibold">{item.total}</td>
                          <td className="text-right py-2 px-4">
                            <span className="text-primary font-semibold">
                              {item.porcentaje?.toFixed(1) ?? "0"}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-6 flex justify-end gap-2">
              <Button onClick={() => setIsModalOpen(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export function VotosPorPuestoChart({ porPuestoVotacion }: { porPuestoVotacion?: { puestoVotacion: string; pago: number; noPago: number; total: number; porcentajePago: number; porcentajeNoPago: number; porcentajeTotal: number }[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const ITEMS_PER_PAGE = 4

  const allData = porPuestoVotacion || []
  const displayedData = allData.slice(0, ITEMS_PER_PAGE)
  const hasMoreData = allData.length > ITEMS_PER_PAGE

  const createChartData = (data: typeof allData) => {
    const labels = data.length > 0 ? data.map((p) => p.puestoVotacion) : ["Sin datos"]
    const values = data.length > 0 ? data.map((p) => p.total ?? 0) : [0]
    const total = values.reduce((s, v) => s + v, 0) || 1
    const percentages = values.map((v) => Number(((v / total) * 100).toFixed(2)))

    return {
      labels,
      values,
      percentages,
      data: {
        labels,
        datasets: [
          {
            label: "Votos totales",
            data: values,
            backgroundColor: labels.map((_, i) => Object.values(chartColors)[i % 5]),
            borderColor: labels.map((_, i) => Object.values(chartColors)[i % 5]),
            borderWidth: 1,
          },
        ],
      },
      options: {
        ...chartOptions,
        indexAxis: "y" as const,
        plugins: {
          ...chartOptions.plugins,
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const idx = context.dataIndex
                const val = values[idx] ?? 0
                const pct = percentages[idx] ?? 0
                return `Votos: ${val} (${pct}%)`
              },
            },
          },
        },
      },
    }
  }

  const smallChart = createChartData(displayedData)
  const fullChart = createChartData(allData)

  return (
    <>
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Votos por Puesto de Votación</CardTitle>
          {hasMoreData && (
            <Button 
              onClick={() => setIsModalOpen(true)} 
              variant="outline" 
              size="sm"
            >
              Ver más
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Bar data={smallChart.data} options={smallChart.options} height={300} />
          {hasMoreData && (
            <p className="text-xs text-muted-foreground mt-2">
              Mostrando {displayedData.length} de {allData.length} puestos
            </p>
          )}
        </CardContent>
      </Card>

      {/* Modal Fullscreen */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full h-full max-w-7xl max-h-[95vh] flex flex-col shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-2xl font-bold">Votos por Puesto de Votación - Vista Completa</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="mb-6">
                <Bar data={fullChart.data} options={fullChart.options} height={400} />
              </div>

              {/* Data Table */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Detalles de Votos</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-2 px-4">Puesto de Votación</th>
                        <th className="text-right py-2 px-4">Votos</th>
                        <th className="text-right py-2 px-4">Porcentaje</th>
                        <th className="text-right py-2 px-4">Pago</th>
                        <th className="text-right py-2 px-4">No Pago</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allData.map((item, idx) => (
                        <tr key={idx} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-4">{item.puestoVotacion}</td>
                          <td className="text-right py-2 px-4 font-semibold">{item.total}</td>
                          <td className="text-right py-2 px-4">
                            <span className="text-primary font-semibold">
                              {item.porcentajeTotal?.toFixed(1) ?? "0"}%
                            </span>
                          </td>
                          <td className="text-right py-2 px-4">
                            <span className="text-green-600 font-semibold">
                              {item.pago} ({item.porcentajePago?.toFixed(1) ?? "0"}%)
                            </span>
                          </td>
                          <td className="text-right py-2 px-4">
                            <span className="text-red-600 font-semibold">
                              {item.noPago} ({item.porcentajeNoPago?.toFixed(1) ?? "0"}%)
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-6 flex justify-end gap-2">
              <Button onClick={() => setIsModalOpen(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export function EstadoVotantesChart({ pagos }: { pagos?: { esPago: boolean; total: number; porcentaje?: number }[] }) {
  const pagoObj = pagos?.find((p) => p.esPago)
  const noPagoObj = pagos?.find((p) => !p.esPago)
  const labels = pagos ? ["Pago", "No Pago"] : ["Verificados", "Registrados", "Pendientes"]
  // prefer API porcentaje if present, otherwise fall back to totals (not ideal)
  const dataValues = pagos
    ? [pagoObj?.porcentaje ?? (pagoObj?.total ?? 0), noPagoObj?.porcentaje ?? (noPagoObj?.total ?? 0)]
    : [60, 25, 15]
  const background = pagos ? ["rgb(16, 185, 129)", "rgb(59, 130, 246)"] : [
    "rgb(16, 185, 129)",
    "rgb(59, 130, 246)",
    "rgb(245, 158, 11)",
  ]

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: background,
        borderColor: background.map((c) => {
          const m = c.match(/rgb\((\d+,\s*\d+,\s*\d+)\)/)
          return m ? `rgba(${m[1]}, 0.5)` : c
        }),
        borderWidth: 2,
      },
    ],
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Graficos por Tipo de Voto</CardTitle>
      </CardHeader>
      <CardContent>
        <Doughnut data={data} options={chartOptions} height={300} />
      </CardContent>
    </Card>
  )
}

export function VotantesVsVotosChart({ porPrograma }: { porPrograma?: { programa: string; pago: number; noPago: number; total: number }[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const ITEMS_PER_PAGE = 4

  const allData = porPrograma || []
  const displayedData = allData.slice(0, ITEMS_PER_PAGE)
  const hasMoreData = allData.length > ITEMS_PER_PAGE

  const createChartData = (data: typeof allData) => {
    const labels = data.length > 0 ? data.map((p) => p.programa) : ["Sin datos"]
    const values = data.length > 0 ? data.map((p) => p.total ?? 0) : [0]
    const total = values.reduce((s, v) => s + v, 0) || 1
    const percentages = values.map((v) => Number(((v / total) * 100).toFixed(2)))

    return {
      labels,
      values,
      percentages,
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: labels.map((_, i) => Object.values(chartColors)[i % 5]),
            borderColor: labels.map((_, i) => Object.values(chartColors)[i % 5]),
            borderWidth: 1,
          },
        ],
      },
      options: {
        ...chartOptions,
        plugins: {
          ...chartOptions.plugins,
          tooltip: {
            callbacks: {
              label: function (context: any) {
                const idx = context.dataIndex
                const val = values[idx] ?? 0
                const pct = percentages[idx] ?? 0
                return `${context.label}: ${val} (${pct}%)`
              },
            },
          },
        },
      },
    }
  }

  const smallChart = createChartData(displayedData)
  const fullChart = createChartData(allData)

  return (
    <>
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Distribución por Programa</CardTitle>
          {hasMoreData && (
            <Button 
              onClick={() => setIsModalOpen(true)} 
              variant="outline" 
              size="sm"
            >
              Ver más
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Doughnut data={smallChart.data} options={smallChart.options} height={300} />
          {hasMoreData && (
            <p className="text-xs text-muted-foreground mt-2">
              Mostrando {displayedData.length} de {allData.length} programas
            </p>
          )}
        </CardContent>
      </Card>

      {/* Modal Fullscreen */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full h-full max-w-7xl max-h-[95vh] flex flex-col shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-2xl font-bold">Distribución por Programa - Vista Completa</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="mb-6">
                <Doughnut data={fullChart.data} options={fullChart.options} height={400} />
              </div>

              {/* Data Table */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Detalles de Programas</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-2 px-4">Programa</th>
                        <th className="text-right py-2 px-4">Votos</th>
                        <th className="text-right py-2 px-4">Porcentaje</th>
                        <th className="text-right py-2 px-4">Pago</th>
                        <th className="text-right py-2 px-4">No Pago</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allData.map((item, idx) => {
                        const total = allData.reduce((s, p) => s + (p.total ?? 0), 0) || 1
                        const pct = Number(((item.total / total) * 100).toFixed(2))
                        return (
                          <tr key={idx} className="border-b hover:bg-muted/50">
                            <td className="py-2 px-4">{item.programa}</td>
                            <td className="text-right py-2 px-4 font-semibold">{item.total}</td>
                            <td className="text-right py-2 px-4">
                              <span className="text-primary font-semibold">{pct.toFixed(1)}%</span>
                            </td>
                            <td className="text-right py-2 px-4">
                              <span className="text-green-600 font-semibold">{item.pago}</span>
                            </td>
                            <td className="text-right py-2 px-4">
                              <span className="text-red-600 font-semibold">{item.noPago}</span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-6 flex justify-end gap-2">
              <Button onClick={() => setIsModalOpen(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function VotosPorLideresChart({ porLider }: { porLider?: { lider: string; pago: number; noPago: number; total: number }[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const ITEMS_PER_PAGE = 4

  const allData = porLider || []
  const displayedData = allData.slice(0, ITEMS_PER_PAGE)
  const hasMoreData = allData.length > ITEMS_PER_PAGE

  const createChartData = (data: typeof allData) => {
    const labels = data.length > 0 ? data.map((p) => p.lider) : ["Sin datos"]
    const sum = data.length > 0 ? data.reduce((s, p) => s + (p.total ?? 0), 0) || 1 : 1
    const pago = data.length > 0 ? data.map((p) => Number(((p.pago ?? 0) / sum * 100).toFixed(2))) : [0]
    const noPago = data.length > 0 ? data.map((p) => Number(((p.noPago ?? 0) / sum * 100).toFixed(2))) : [0]

    return {
      labels,
      sum,
      pago,
      noPago,
      data: {
        labels,
        datasets: [
          {
            label: "Pago",
            data: pago,
            backgroundColor: chartColors.primary,
          },
          {
            label: "No Pago",
            data: noPago,
            backgroundColor: chartColors.accent,
          },
        ],
      },
      options: {
        ...chartOptions,
        scales: {
          x: { stacked: true },
          y: { stacked: true },
        },
      },
    }
  }

  const smallChart = createChartData(displayedData)
  const fullChart = createChartData(allData)

  return (
    <>
      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gráficos por Lider</CardTitle>
          {hasMoreData && (
            <Button 
              onClick={() => setIsModalOpen(true)} 
              variant="outline" 
              size="sm"
            >
              Ver más
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Bar data={smallChart.data} options={smallChart.options} height={300} />
          {hasMoreData && (
            <p className="text-xs text-muted-foreground mt-2">
              Mostrando {displayedData.length} de {allData.length} líderes
            </p>
          )}
        </CardContent>
      </Card>

      {/* Modal Fullscreen */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full h-full max-w-7xl max-h-[95vh] flex flex-col shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-2xl font-bold">Gráficos por Líder - Vista Completa</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="mb-6">
                <Bar data={fullChart.data} options={fullChart.options} height={400} />
              </div>

              {/* Data Table */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Detalles de Líderes</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr>
                        <th className="text-left py-2 px-4">Líder</th>
                        <th className="text-right py-2 px-4">Votos</th>
                        <th className="text-right py-2 px-4">Pago</th>
                        <th className="text-right py-2 px-4">Pago %</th>
                        <th className="text-right py-2 px-4">No Pago</th>
                        <th className="text-right py-2 px-4">No Pago %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allData.map((item, idx) => {
                        const sum = allData.reduce((s, p) => s + (p.total ?? 0), 0) || 1
                        const pagoPct = Number(((item.pago / sum) * 100).toFixed(2))
                        const noPagoPct = Number(((item.noPago / sum) * 100).toFixed(2))
                        return (
                          <tr key={idx} className="border-b hover:bg-muted/50">
                            <td className="py-2 px-4">{item.lider}</td>
                            <td className="text-right py-2 px-4 font-semibold">{item.total}</td>
                            <td className="text-right py-2 px-4">
                              <span className="text-green-600 font-semibold">{item.pago}</span>
                            </td>
                            <td className="text-right py-2 px-4">
                              <span className="text-green-600 font-semibold">{pagoPct.toFixed(1)}%</span>
                            </td>
                            <td className="text-right py-2 px-4">
                              <span className="text-red-600 font-semibold">{item.noPago}</span>
                            </td>
                            <td className="text-right py-2 px-4">
                              <span className="text-red-600 font-semibold">{noPagoPct.toFixed(1)}%</span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t p-6 flex justify-end gap-2">
              <Button onClick={() => setIsModalOpen(false)}>Cerrar</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

