"use client"

import React from "react"
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
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

// Gráfico de línea - Votos por día
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
        <CardTitle>Votos por día</CardTitle>
      </CardHeader>
      <CardContent>
        <Line data={data} options={chartOptions} height={300} />
      </CardContent>
    </Card>
  )
}

// Gráfico de barras - Votos por puesto
export function VotosPuestoChart() {
  const data = {
    labels: ["Puesto A", "Puesto B", "Puesto C", "Puesto D", "Puesto E"],
    datasets: [
      {
        label: "Votos totales",
        data: [120, 190, 150, 170, 140],
        backgroundColor: [
          chartColors.primary,
          chartColors.accent,
          chartColors.success,
          chartColors.warning,
          chartColors.danger,
        ],
        borderColor: [
          chartColors.primary,
          chartColors.accent,
          chartColors.success,
          chartColors.warning,
          chartColors.danger,
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Votos por puesto</CardTitle>
      </CardHeader>
      <CardContent>
        <Bar data={data} options={chartOptions} height={300} />
      </CardContent>
    </Card>
  )
}

// Gráfico de pastel - Participación por género
export function ParticipacionGeneroChart() {
  const data = {
    labels: ["Mujeres", "Hombres"],
    datasets: [
      {
        data: [55, 45],
        backgroundColor: ["rgb(236, 72, 153)", "rgb(59, 130, 246)"],
        borderColor: ["rgba(236, 72, 153, 0.5)", "rgba(59, 130, 246, 0.5)"],
        borderWidth: 2,
      },
    ],
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Participación por género</CardTitle>
      </CardHeader>
      <CardContent>
        <Pie data={data} options={chartOptions} height={300} />
      </CardContent>
    </Card>
  )
}

// Gráfico de barras - Votos por Punto de Votación
export function VotosPorPuntoVotacionChart() {
  const data = {
    labels: [
      "Puesto Centro",
      "Puesto Norte",
      "Puesto Sur",
      "Puesto Este",
      "Puesto Oeste",
    ],
    datasets: [
      {
        label: "Votos emitidos",
        data: [450, 320, 380, 290, 410],
        backgroundColor: [
          chartColors.primary,
          chartColors.accent,
          chartColors.success,
          chartColors.warning,
          chartColors.danger,
        ],
        borderColor: [
          chartColors.primary,
          chartColors.accent,
          chartColors.success,
          chartColors.warning,
          chartColors.danger,
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Votos por Punto de Votación</CardTitle>
      </CardHeader>
      <CardContent>
        <Bar data={data} options={chartOptions} height={300} />
      </CardContent>
    </Card>
  )
}

// Gráfico de dona - Estado de votantes
export function EstadoVotantesChart() {
  const data = {
    labels: ["Verificados", "Registrados", "Pendientes"],
    datasets: [
      {
        data: [60, 25, 15],
        backgroundColor: [
          "rgb(16, 185, 129)",
          "rgb(59, 130, 246)",
          "rgb(245, 158, 11)",
        ],
        borderColor: [
          "rgba(16, 185, 129, 0.5)",
          "rgba(59, 130, 246, 0.5)",
          "rgba(245, 158, 11, 0.5)",
        ],
        borderWidth: 2,
      },
    ],
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Estado de votantes</CardTitle>
      </CardHeader>
      <CardContent>
        <Doughnut data={data} options={chartOptions} height={300} />
      </CardContent>
    </Card>
  )
}

// Gráfico combinado - Votantes vs Votos
export function VotantesVsVotosChart() {
  const data = {
    labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
    datasets: [
      {
        label: "Votantes registrados",
        data: [1200, 1900, 1500, 2200],
        borderColor: chartColors.primary,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        yAxisID: "y",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: chartColors.primary,
      },
      {
        label: "Votos procesados",
        data: [1000, 1700, 1200, 1900],
        borderColor: chartColors.accent,
        backgroundColor: "rgba(236, 72, 153, 0.1)",
        yAxisID: "y1",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: chartColors.accent,
      },
    ],
  }

  const options = {
    ...chartOptions,
    scales: {
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        title: {
          display: true,
          text: "Votantes registrados",
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        title: {
          display: true,
          text: "Votos procesados",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Votantes vs Votos</CardTitle>
      </CardHeader>
      <CardContent>
        <Line data={data} options={options} height={300} />
      </CardContent>
    </Card>
  )
}

// Gráfico de barras - Votos por Líder
export function VotosPorLideresChart() {
  const data = {
    labels: [
      "Juan García",
      "María López",
      "Carlos Rodríguez",
      "Ana Martínez",
      "Pedro Sánchez",
    ],
    datasets: [
      {
        label: "Votos gestionados",
        data: [450, 320, 380, 290, 410],
        backgroundColor: [
          chartColors.primary,
          chartColors.accent,
          chartColors.success,
          chartColors.warning,
          chartColors.danger,
        ],
        borderColor: [
          chartColors.primary,
          chartColors.accent,
          chartColors.success,
          chartColors.warning,
          chartColors.danger,
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Votos por Líderes</CardTitle>
      </CardHeader>
      <CardContent>
        <Bar data={data} options={chartOptions} height={300} />
      </CardContent>
    </Card>
  )
}
