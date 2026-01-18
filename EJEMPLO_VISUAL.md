# 📊 Ejemplo Visual: Cómo Funciona el Consumo de API

## Flujo de una Petición

```
┌─────────────────────────────────────────────────────────────┐
│                    APLICACIÓN REACT/NEXT.JS                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
        ┌───────────────────────────────────────┐
        │   Componente (e.g., VotantesPage)     │
        │  import { votantesApi } from @/lib/api│
        └───────────────────────────────────────┘
                            │
                            ↓
        ┌───────────────────────────────────────┐
        │   useEffect(() => {                   │
        │     votantesApi.getAll()              │
        │   }, [])                              │
        └───────────────────────────────────────┘
                            │
                            ↓
    ┌──────────────────────────────────────────────┐
    │   lib/api.ts - apiCall(endpoint, options)    │
    │   • Construye URL base desde .env            │
    │   • Añade headers (Content-Type, etc)        │
    │   • Ejecuta fetch                            │
    │   • Maneja errores                           │
    └──────────────────────────────────────────────┘
                            │
                            ↓
    ┌──────────────────────────────────────────────┐
    │        RED / SERVIDOR BACKEND                │
    │   GET http://localhost:3001/api/votantes     │
    └──────────────────────────────────────────────┘
                            │
                            ↓
    ┌──────────────────────────────────────────────┐
    │        RESPUESTA JSON                        │
    │  [                                           │
    │    { id: 1, nombre: "Juan", ... },          │
    │    { id: 2, nombre: "María", ... }          │
    │  ]                                           │
    └──────────────────────────────────────────────┘
                            │
                            ↓
        ┌───────────────────────────────────────┐
        │   setVotantes(data)                   │
        │   Re-render con nuevos datos          │
        └───────────────────────────────────────┘
```

---

## Estructura del Código

### Nivel 1: Componente
```tsx
// app/dashboard/votantes/page.tsx
import { votantesApi } from '@/lib/api'

export default function VotantesPage() {
  const [votantes, setVotantes] = useState([])

  useEffect(() => {
    const fetchVotantes = async () => {
      try {
        const data = await votantesApi.getAll() // ← Llamada API
        setVotantes(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchVotantes()
  }, [])

  return <div>{/* Renderizar votantes */}</div>
}
```

### Nivel 2: Servicios API
```typescript
// lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

async function apiCall<T>(endpoint: string, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, options)
  if (!response.ok) throw new Error(...)
  return response.json()
}

export const votantesApi = {
  getAll: () => apiCall('/votantes'),
  getById: (id) => apiCall(`/votantes/${id}`),
  create: (data) => apiCall('/votantes', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  }),
  // ... más métodos
}
```

### Nivel 3: Variables de Entorno
```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

---

## Ejemplo Real: Paso a Paso

### 1️⃣ Dentro de un Componente
```typescript
async function handleAgregar() {
  try {
    const nuevoVotante = await votantesApi.create({
      nombre: "Carlos López",
      cedula: "123456789",
      email: "carlos@example.com",
      telefono: "3001234567",
      direccion: "Calle 45",
      estado: "activo"
    })
    
    // Agregar a la lista
    setVotantes([...votantes, nuevoVotante])
  } catch (error) {
    setError(error.message)
  }
}
```

### 2️⃣ En lib/api.ts se ejecuta:
```typescript
// 1. Construir URL
const url = "http://localhost:3001/api/votantes"

// 2. Preparar opciones
const options = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: '{"nombre":"Carlos López", ...}'
}

// 3. Hacer fetch
const response = await fetch(url, options)

// 4. Procesar respuesta
if (!response.ok) throw new Error("Error")
return response.json() // { id: 123, nombre: "Carlos López", ... }
```

### 3️⃣ Backend responde:
```json
{
  "id": 123,
  "nombre": "Carlos López",
  "cedula": "123456789",
  "email": "carlos@example.com",
  "telefono": "3001234567",
  "direccion": "Calle 45",
  "estado": "activo"
}
```

### 4️⃣ UI se actualiza:
```
Antes: [Votante 1, Votante 2]
Después: [Votante 1, Votante 2, Carlos López] ✓
```

---

## Manejo de Estados

### Loading
```typescript
const [loading, setLoading] = useState(false)

useEffect(() => {
  const fetch = async () => {
    setLoading(true)        // ← Mostrar spinner
    const data = await votantesApi.getAll()
    setLoading(false)       // ← Ocultar spinner
  }
}, [])

if (loading) return <Spinner />  // ← UI feedback
```

### Error
```typescript
const [error, setError] = useState(null)

try {
  const data = await votantesApi.getAll()
} catch (err) {
  setError(err.message)  // ← Capturar error
}

if (error) return <ErrorBanner message={error} />
```

### Success
```typescript
const [success, setSuccess] = useState(false)

try {
  await votantesApi.create(data)
  setSuccess(true)  // ← Mostrar confirmación
  setTimeout(() => setSuccess(false), 3000)
} catch (error) {
  // ...
}

if (success) return <SuccessBanner />
```

---

## Tipos de Peticiones

### GET - Obtener datos
```typescript
// Obtener todos
await votantesApi.getAll()
// GET /api/votantes

// Obtener uno
await votantesApi.getById(1)
// GET /api/votantes/1
```

### POST - Crear datos
```typescript
await votantesApi.create({ nombre: "Juan", ... })
// POST /api/votantes
// Body: { nombre: "Juan", ... }
```

### PUT - Actualizar datos
```typescript
await votantesApi.update(1, { nombre: "Juan Carlos" })
// PUT /api/votantes/1
// Body: { nombre: "Juan Carlos" }
```

### DELETE - Eliminar datos
```typescript
await votantesApi.delete(1)
// DELETE /api/votantes/1
```

---

## Cómo Cambiar la URL de API

### Opción 1: En .env.local (Recomendado)
```env
# Desarrollo
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

# Producción
NEXT_PUBLIC_API_BASE_URL=https://api.pspvote.com/api
```

### Opción 2: Sin cambiar código
```bash
# Build con variable de entorno
NEXT_PUBLIC_API_BASE_URL=https://api.prod.com npm run build
```

---

## Ventajas de esta Arquitectura

✅ **Una fuente de verdad** - Todos los servicios en un archivo
✅ **Type-safe** - TypeScript con genéricos
✅ **Reutilizable** - Importar `votantesApi` en cualquier lugar
✅ **Escalable** - Fácil agregar nuevos servicios
✅ **Testeable** - Cada servicio es una función pura
✅ **Error handling** - Try-catch automático
✅ **Configuración centralizada** - URL desde .env

---

## Checklist: Conectar tu Backend

- [ ] Backend listo con endpoints REST
- [ ] CORS habilitado (si frontend y backend están separados)
- [ ] Endpoints responden con JSON válido
- [ ] Actualizar `NEXT_PUBLIC_API_BASE_URL` en .env.local
- [ ] Descomentar llamadas a API en componentes
- [ ] Probar cada endpoint
- [ ] Manejar edge cases (validación, permisos, etc)
- [ ] Agregar logs para debugging
- [ ] Optimizar queries (pagination, filtering)
- [ ] Documentar endpoints

---

## Debugging

### Ver qué URL se está usando
```typescript
console.log(process.env.NEXT_PUBLIC_API_BASE_URL)
// Output: http://localhost:3001/api
```

### Inspeccionar petición en navegador
1. Abrir DevTools (F12)
2. Ir a Network tab
3. Filtrar por XHR/Fetch
4. Ver método, URL, headers, response

### Error común: CORS
```
Access to XMLHttpRequest at 'http://localhost:3001/api/votantes' 
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solución en backend:**
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
```
