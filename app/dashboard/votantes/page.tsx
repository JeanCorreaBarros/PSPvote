'use client'

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { AddVotanteDialog } from "@/components/add-votante-dialog"
import { VotantesList } from "./votantes-list"
import { Suspense } from "react"
import Loading from "./loading"

export default function VotantesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterConfirmado, setFilterConfirmado] = useState(false)

  return (
    <div className="min-h-screen">
      <Header title="Votantes" />

      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar votante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-muted/50"
            />
          </div>
          {/*<Button
            variant={filterConfirmado ? "default" : "outline"}
            onClick={() => setFilterConfirmado(!filterConfirmado)}
            className="w-full sm:w-auto"
          >
            {filterConfirmado ? "✓ Confirmados" : "Mostrar Confirmados"}
          </Button>*/}
        </div>

        <Suspense fallback={<Loading />}>
          <VotantesList searchTerm={searchTerm} />
        </Suspense>
      </div>
    </div>
  )
}
