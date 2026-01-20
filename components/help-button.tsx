"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HelpCircle } from "lucide-react"
import { useDriverTour, TourStep } from "@/hooks/use-driver-tour"

interface TourGuide {
  name: string
  steps: TourStep[]
}

interface HelpButtonProps {
  tours: TourGuide[]
}

export function HelpButton({ tours }: HelpButtonProps) {
  const { startTour } = useDriverTour()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          title="Ver guías de ayuda"
        >
          <HelpCircle className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Guías disponibles</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {tours.map((tour) => (
          <DropdownMenuItem
            key={tour.name}
            onClick={() => startTour(tour.steps, tour.name)}
            className="cursor-pointer"
          >
            {tour.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
