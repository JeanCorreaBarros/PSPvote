# Integración API de Votaciones

## Resumen de Cambios

Se ha integrado exitosamente el consumo del endpoint de votaciones en la vista de registro de votos. A continuación se detallan los cambios realizados:

## Cambios en `app/dashboard/registro-votos/page.tsx`

### 1. **Importación de Toast**
```typescript
import toast from "react-hot-toast"
```
Se agregó la importación de `react-hot-toast` para mostrar notificaciones de éxito y error.

### 2. **Actualización de la Interfaz `Votante`**
Se cambió la estructura de la interfaz para usar los nombres de campos del endpoint:
- `nombres` → `nombre1`
- `apellidos` → `apellido1`

```typescript
interface Votante {
  id: string
  nombre1: string
  apellido1: string
  cedula: string
  telefono: string
  direccion: string
  barrio: string
  puestoVotacion: string
  estado: "registrado" | "verificado" | "pendiente"
  fechaRegistro: string
}
```

### 3. **Actualización del Estado del Formulario**
```typescript
const [formData, setFormData] = useState({
  nombre1: "",
  apellido1: "",
  cedula: "",
  telefono: "",
  direccion: "",
  barrio: "",
  puestoVotacion: "",
})
```

### 4. **Cargar Datos desde el API**
Se actualizo el `useEffect` para consumir el endpoint `http://localhost:3000/api/votaciones`:

```typescript
useEffect(() => {
  const fetchVotos = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetch('http://localhost:3000/api/votaciones').then(res => res.json())
      if (Array.isArray(data)) {
        const votantesFormateados = data.map((votante: any) => ({
          id: votante.id,
          nombre1: votante.nombre1,
          apellido1: votante.apellido1,
          cedula: votante.cedula,
          telefono: votante.telefono,
          direccion: votante.direccion,
          barrio: votante.barrio,
          puestoVotacion: votante.puestoVotacion,
          estado: "registrado" as const,
          fechaRegistro: new Date(votante.createdAt).toLocaleDateString("es-CO"),
        }))
        setVotantes(votantesFormateados)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar votos')
      setVotantes(initialVotantes)
    } finally {
      setLoading(false)
    }
  }

  fetchVotos()
}, [])
```

### 5. **Función handleSubmit Mejorada**
Se implementó la lógica para consumir el endpoint POST:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    setLoading(true)
    
    if (editingVotante) {
      // Para edición, solo actualizar localmente
      setVotantes(...)
      toast.success('Votante actualizado correctamente')
    } else {
      // Para registro nuevo, consumir el endpoint
      const response = await fetch('http://localhost:3000/api/votaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Error al registrar el votante')
      }

      const nuevoVotante = await response.json()
      
      // Agregar el nuevo votante a la tabla
      const votanteFormateado: Votante = {
        id: nuevoVotante.id,
        nombre1: nuevoVotante.nombre1,
        apellido1: nuevoVotante.apellido1,
        cedula: nuevoVotante.cedula,
        telefono: nuevoVotante.telefono,
        direccion: nuevoVotante.direccion,
        barrio: nuevoVotante.barrio,
        puestoVotacion: nuevoVotante.puestoVotacion,
        estado: "registrado",
        fechaRegistro: new Date(nuevoVotante.createdAt).toLocaleDateString("es-CO"),
      }
      
      setVotantes([votanteFormateado, ...votantes])
      toast.success('¡Votante registrado con éxito!')
    }
    
    resetForm()
    setIsDialogOpen(false)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Error al registrar'
    toast.error(errorMessage)
  } finally {
    setLoading(false)
  }
}
```

## Flujo de Funcionamiento

### 1. **Carga Inicial**
- Al cargar la página, se consume el endpoint `GET http://localhost:3000/api/votaciones`
- Los datos se formatean y se muestran en la tabla

### 2. **Registro de Nuevo Votante**
- El usuario hace clic en "Nuevo Registro"
- Se abre el modal con el formulario
- Al enviar, se hace un POST a `http://localhost:3000/api/votaciones` con los datos:
  ```json
  {
    "nombre1": "Juan",
    "apellido1": "Gómez",
    "cedula": "123456789",
    "telefono": "3005555555",
    "direccion": "Calle 10",
    "barrio": "Centro",
    "puestoVotacion": "Colegio Central"
  }
  ```

### 3. **Respuesta del API**
- El API devuelve:
  ```json
  {
    "id": "4e584017-45f2-4350-a4b5-1348e7205cad",
    "nombre1": "Juan",
    "apellido1": "Gómez",
    "cedula": "123456789",
    "telefono": "3005555555",
    "direccion": "Calle 10",
    "barrio": "Centro",
    "puestoVotacion": "Colegio Central",
    "leaderId": "1029ef53-da28-4078-8a11-5bfa9b0e8bcd",
    "createdAt": "2026-01-19T20:10:21.062Z",
    "updatedAt": "2026-01-19T20:10:21.062Z"
  }
  ```

### 4. **Actualización de la Tabla**
- El nuevo votante se agrega al inicio de la tabla
- Se muestra una notificación: "¡Votante registrado con éxito!"
- Se cierra el modal y se limpia el formulario

## Notificaciones Implementadas

- ✅ **Éxito**: "¡Votante registrado con éxito!"
- ✅ **Actualización**: "Votante actualizado correctamente"
- ❌ **Error**: Se muestra el mensaje de error específico

## Campos del Formulario

El modal de registro ahora incluye los siguientes campos (todos requeridos):
1. **Nombres** (`nombre1`)
2. **Apellidos** (`apellido1`)
3. **Cédula**
4. **Teléfono**
5. **Dirección**
6. **Barrio**
7. **Puesto de Votación** (Select)

## Validación

✅ El proyecto compila correctamente sin errores
✅ Se ha validado la sintaxis de TypeScript
✅ Se ha probado la build de producción exitosamente

## Próximos Pasos (Opcional)

Si lo deseas, puedes:
1. Agregar validaciones más estrictas en los campos del formulario
2. Implementar una carga en tiempo real desde el API
3. Agregar paginación a la tabla
4. Implementar eliminación desde el API
5. Agregar edición desde el API
