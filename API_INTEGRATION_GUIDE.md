# PSPVote API Integration Guide

## Configuración

### Variables de Entorno (.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

La URL base será utilizada automáticamente por todas las llamadas a la API.

---

## Servicios de API disponibles

### 1. Votantes (`lib/api.ts` - `votantesApi`)

```typescript
import { votantesApi } from '@/lib/api'

// Obtener todos los votantes
const votantes = await votantesApi.getAll()

// Obtener un votante específico
const votante = await votantesApi.getById(1)

// Crear un nuevo votante
const nuevoVotante = await votantesApi.create({
  nombre: "Juan Pérez",
  cedula: "1234567890",
  email: "juan@email.com",
  telefono: "3001234567",
  direccion: "Calle 45 #23-12",
  estado: "activo"
})

// Actualizar un votante
const votanteActualizado = await votantesApi.update(1, {
  nombre: "Juan Carlos Pérez",
  estado: "inactivo"
})

// Eliminar un votante
await votantesApi.delete(1)
```

### 2. Puestos (`lib/api.ts` - `puestosApi`)

```typescript
import { puestosApi } from '@/lib/api'

// Obtener todos los puestos
const puestos = await puestosApi.getAll()

// Crear un nuevo puesto
const nuevoPuesto = await puestosApi.create({
  nombre: "IE San José",
  direccion: "Calle 45 #12-34",
  mesas: 12,
  votantes: 2450,
  horario: "6:00 AM - 4:00 PM",
  estado: "activo"
})

// Actualizar un puesto
const puestoActualizado = await puestosApi.update(1, {
  mesas: 15
})

// Eliminar un puesto
await puestosApi.delete(1)
```

### 3. Votos (`lib/api.ts` - `votosApi`)

```typescript
import { votosApi } from '@/lib/api'

// Obtener todos los votos registrados
const votos = await votosApi.getAll()

// Registrar un nuevo voto
const nuevoVoto = await votosApi.create({
  votante: "Juan Pérez",
  puesto: "Presidente",
  candidato: "Carlos López",
  fechaHora: "2024-01-18 10:30"
})

// Actualizar un voto
const votoActualizado = await votosApi.update(1, {
  estado: "procesado"
})
```

### 4. Reportes (`lib/api.ts` - `reportesApi`)

```typescript
import { reportesApi } from '@/lib/api'

// Obtener resumen general
const resumen = await reportesApi.getResumen()

// Obtener reportes por puesto
const reportePuestos = await reportesApi.getPorPuesto()

// Obtener reportes por género
const reporteGenero = await reportesApi.getPorGenero()

// Obtener reportes por edad
const reporteEdad = await reportesApi.getPorEdad()

// Exportar a CSV
const csvData = await reportesApi.exportarCSV()

// Exportar a PDF
const pdfData = await reportesApi.exportarPDF()
```

### 5. Configuración (`lib/api.ts` - `configuracionApi`)

```typescript
import { configuracionApi } from '@/lib/api'

// Obtener configuración actual
const config = await configuracionApi.get()

// Actualizar configuración
const configActualizada = await configuracionApi.update({
  nombreEvento: "Elecciones 2024",
  fecha: "2024-01-18",
  lugar: "Centro de Convenciones",
  horaInicio: "08:00",
  horaFin: "17:00"
})
```

---

## Hook personalizado useApi

Para facilitar la carga de datos con manejo automático de estados de carga y error:

```typescript
import { useApi } from '@/hooks/use-api'
import { votantesApi } from '@/lib/api'

export function MiComponente() {
  const { data: votantes, loading, error } = useApi(
    () => votantesApi.getAll(),
    [] // dependencias
  )

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {votantes?.map(votante => (
        <div key={votante.id}>{votante.nombre}</div>
      ))}
    </div>
  )
}
```

---

## Manejo de Errores

```typescript
try {
  const votantes = await votantesApi.getAll()
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message)
  }
}
```

---

## Estructura del Endpoint Base

El endpoint base se construye automáticamente usando la variable de entorno:

```
${NEXT_PUBLIC_API_BASE_URL} + ${endpoint}
```

**Ejemplo:**
- Base URL: `http://localhost:3001/api`
- Endpoint: `/votantes`
- URL completa: `http://localhost:3001/api/votantes`

---

## Vistas con Consumo de API Preparado

Las siguientes vistas ya están configuradas para consumir de la API:

1. **Votantes** (`app/dashboard/votantes/page.tsx`)
   - Consumo: `votantesApi.getAll()`
   - Estado: Dato de prueba por defecto, listo para conectar

2. **Puestos** (`app/dashboard/puestos/page.tsx`)
   - Consumo: `puestosApi.getAll()`
   - Estado: Dato de prueba por defecto, listo para conectar

3. **Registro de Votos** (`app/dashboard/registro-votos/page.tsx`)
   - Consumo: `votosApi.getAll()`
   - Estado: Dato de prueba por defecto, listo para conectar

4. **Reportes** (`app/dashboard/reportes/page.tsx`)
   - Consumo: `reportesApi.getResumen()`, `reportesApi.exportarCSV()`, `reportesApi.exportarPDF()`
   - Estado: Dato de prueba por defecto, listo para conectar

5. **Configuración** (`app/dashboard/configuracion/page.tsx`)
   - Consumo: `configuracionApi.get()`, `configuracionApi.update()`
   - Estado: Dato de prueba por defecto, listo para conectar

---

## Cómo Activar un Endpoint

En cada vista, busca la línea comentada con `// Descomenta cuando el endpoint esté listo` y descomenta la llamada a la API:

**Antes:**
```typescript
// const data = await votantesApi.getAll()
// setVotantes(data)
```

**Después:**
```typescript
const data = await votantesApi.getAll()
setVotantes(data)
```

---

## Notas Importantes

- Todos los consumos de API están envueltos en try-catch con fallback a datos de prueba
- Los estados de error se muestran en un banner rojo en la interfaz
- Los datos de prueba permanecen activos hasta que el endpoint real esté listo
- La URL de la API se configura desde `.env.local`
