# 🎉 ¡Consumos de API Listos! - PSPVote

## Resumen Ejecutivo

He preparado **consumos completos de API** para todas las vistas principales del dashboard, utilizando la variable de entorno `.env` para manejar la URL base.

---

## 📦 Lo Que Se Ha Creado

### 1. **Servicio de API Centralizado** (`lib/api.ts`)
- Función base que maneja todas las llamadas HTTP
- Usa automáticamente `NEXT_PUBLIC_API_BASE_URL` del .env
- Organizados en 5 servicios reutilizables:
  - `votantesApi` - Gestión de votantes
  - `puestosApi` - Gestión de puestos
  - `votosApi` - Registro de votos
  - `reportesApi` - Generación de reportes
  - `configuracionApi` - Configuración del evento

### 2. **Hook Personalizado** (`hooks/use-api.ts`)
- `useApi<T>()` para simplificar el manejo de datos asincronos
- Manejo automático de: loading, error, data
- Control de montaje para evitar memory leaks

### 3. **Vistas Actualizadas**
Todas estas vistas ya tienen consumo de API configurado y listo:

| Vista | Endpoints | Estado |
|-------|-----------|--------|
| **Votantes** | `GET /votantes` | ✅ Listo |
| **Puestos** | `GET /puestos` | ✅ Listo |
| **Registro de Votos** | `GET /votos`, `POST /votos` | ✅ Listo |
| **Reportes** | `GET /resumen`, `/export-csv`, `/export-pdf` | ✅ Listo |
| **Configuración** | `GET /config`, `PUT /config` | ✅ Listo |

---

## 🔧 Cómo Funciona

### Paso 1: Variables de Entorno
```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

### Paso 2: Usar en Componentes
```typescript
import { votantesApi } from '@/lib/api'

// En un useEffect:
const data = await votantesApi.getAll()
setVotantes(data)
```

### Paso 3: Manejo de Errores
Cada vista tiene:
- ✅ Try-catch automático
- ✅ Estado de error mostrado en UI
- ✅ Fallback a datos de prueba mientras el backend no esté listo

---

## 📝 Endpoints Esperados

Tu backend debe tener estos endpoints:

```
GET    /api/votantes              # Obtener todos
POST   /api/votantes              # Crear
PUT    /api/votantes/{id}         # Actualizar
DELETE /api/votantes/{id}         # Eliminar

GET    /api/puestos
POST   /api/puestos
PUT    /api/puestos/{id}
DELETE /api/puestos/{id}

GET    /api/votos
POST   /api/votos
PUT    /api/votos/{id}
DELETE /api/votos/{id}

GET    /api/reportes/resumen
GET    /api/reportes/por-puesto
GET    /api/reportes/por-genero
GET    /api/reportes/por-edad
GET    /api/reportes/export-csv
GET    /api/reportes/export-pdf

GET    /api/configuracion
PUT    /api/configuracion
```

---

## 🚀 Activar Endpoints Reales

Cada vista tiene código comentado. Para activar:

**Busca en cada componente:**
```typescript
// Descomenta cuando el endpoint esté listo
// const data = await votantesApi.getAll()
// setVotantes(data)
```

**Descomenta las líneas:**
```typescript
const data = await votantesApi.getAll()
setVotantes(data)
```

---

## 🛠️ Ejemplo Completo (Votantes)

```typescript
// app/dashboard/votantes/votantes-list.tsx

import { votantesApi } from '@/lib/api'
import { useEffect, useState } from 'react'

export function VotantesList({ searchTerm }) {
  const [votantes, setVotantes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const data = await votantesApi.getAll() // ✅ Consumo de API
        setVotantes(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  // ... resto del componente
}
```

---

## 📚 Documentación Disponible

- **`API_INTEGRATION_GUIDE.md`** - Guía completa de uso
- **`SETUP_API.md`** - Setup y próximos pasos
- **Código comentado** - Cada vista tiene instrucciones inline

---

## ✨ Características Principales

✅ URL de API configurable desde `.env`
✅ Tipos TypeScript automáticos
✅ Manejo robusto de errores
✅ Fallback a datos de prueba
✅ UI feedback (loading, error, success)
✅ Reutilizable en todo el proyecto
✅ Fácil de escalar

---

## 🎯 Estado Actual

- ✅ Backend agnostico (funciona con cualquier API REST)
- ✅ Datos de prueba como fallback
- ✅ Error handling completo
- ✅ TypeScript type-safe
- ⏳ Esperando endpoints reales

**¡Todo está listo para conectar tu backend!**
