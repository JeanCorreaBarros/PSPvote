# Ejemplos de Uso de Driver.js en PSPVote

## 1️⃣ Ejemplo Simple: Agregar ayuda a una página

```tsx
"use client"

import { HelpButton } from "@/components/help-button"
import { miTour } from "@/lib/tours-config"

export default function MiPagina() {
  return (
    <div>
      {/* Botón de ayuda */}
      <HelpButton tours={[{ name: "Mi Guía", steps: miTour }]} />
      
      {/* Contenido de la página */}
      <h1 id="titulo-pagina">Bienvenido</h1>
      <button id="boton-importante">Hacer algo</button>
    </div>
  )
}
```

## 2️⃣ Crear un nuevo tour

### Paso 1: Definir los pasos en `lib/tours-config.ts`

```typescript
export const miNuevoTour: TourStep[] = [
  {
    element: "#titulo-pagina",
    popover: {
      title: "Bienvenido",
      description: "Este es el título principal de la página",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#boton-importante",
    popover: {
      title: "Botón de Acción",
      description: "Haz clic aquí para hacer algo importante",
      side: "right",
      align: "center",
    },
  },
]
```

### Paso 2: Agregar IDs a los elementos

```tsx
<h1 id="titulo-pagina">Bienvenido</h1>
<button id="boton-importante">Hacer algo</button>
```

### Paso 3: Usar el tour en el componente

```tsx
import { HelpButton } from "@/components/help-button"
import { miNuevoTour } from "@/lib/tours-config"

export default function MiPagina() {
  return (
    <>
      <HelpButton tours={[{ name: "Mi Guía", steps: miNuevoTour }]} />
      
      <h1 id="titulo-pagina">Bienvenido</h1>
      <button id="boton-importante">Hacer algo</button>
    </>
  )
}
```

## 3️⃣ Tours múltiples en una página

```tsx
import { HelpButton } from "@/components/help-button"
import { 
  registroVotosTour, 
  registrarVotanteTour,
  tablaVotantesTour 
} from "@/lib/tours-config"

export default function RegistroVotos() {
  return (
    <>
      <HelpButton
        tours={[
          { name: "Visita Guiada Completa", steps: registroVotosTour },
          { name: "Cómo Registrar un Votante", steps: registrarVotanteTour },
          { name: "Entender la Tabla", steps: tablaVotantesTour },
        ]}
      />
      
      {/* Contenido */}
    </>
  )
}
```

## 4️⃣ Tour con scroll automático

```typescript
export const miTourConScroll: TourStep[] = [
  {
    element: "#elemento-fuera-de-vista",
    popover: {
      title: "Elemento Abajo",
      description: "Este elemento estará visible después de hacer scroll",
      side: "top",
    },
  },
]
```

El driver.js automáticamente hace scroll para mostrar el elemento.

## 5️⃣ Obtener la posición correcta (side y align)

### `side` - Posición del popover

- `"left"` - A la izquierda del elemento
- `"right"` - A la derecha del elemento
- `"top"` - Arriba del elemento
- `"bottom"` - Abajo del elemento

### `align` - Alineación dentro del lado

- `"start"` - Alineado al inicio
- `"center"` - Centrado (defecto)
- `"end"` - Alineado al final

### Ejemplos:

```typescript
// Arriba del elemento, alineado a la derecha
{ side: "top", align: "end" }

// A la izquierda, centrado
{ side: "left", align: "center" }

// Abajo, alineado a la izquierda
{ side: "bottom", align: "start" }
```

## 6️⃣ Usar el hook directamente

```tsx
import { useDriverTour } from "@/hooks/use-driver-tour"
import { miTour } from "@/lib/tours-config"

export default function MiComponente() {
  const { startTour } = useDriverTour()

  return (
    <button onClick={() => startTour(miTour, "mi-tour")}>
      Iniciar Tour
    </button>
  )
}
```

## 7️⃣ Tour de bienvenida automático

Usa el componente `SidebarTourTrigger` en el layout:

```tsx
import { SidebarTourTrigger } from "@/components/sidebar-tour-trigger"

export default function DashboardLayout({ children }) {
  return (
    <>
      <SidebarTourTrigger />
      {children}
    </>
  )
}
```

Para mostrar el tour, descomenta esta línea en `sidebar-tour-trigger.tsx`:
```typescript
const [hasShownTour, setHasShownTour] = useState(false) // Cambiar de true a false
```

## 8️⃣ Convenciones de nombrado para IDs

```
#menu-{nombre}           → Menús
#form-{campo}            → Campos de formulario
#tabla-{columna}         → Elementos de tabla
#boton-{accion}          → Botones
#seccion-{elemento}      → Elementos de secciones
#titulo-{pagina}         → Títulos
#busqueda-{tipo}         → Campos de búsqueda
```

## 9️⃣ Debugging

Para ver en consola cuándo se inicia el tour:

```typescript
const driverInstance = driver({...})
console.log("Tour iniciado:", driverInstance)
driverInstance.drive()
```

## 🔟 Recursos

- [Documentación Driver.js](https://driverjs.com/docs/)
- [GitHub Examples](https://github.com/kamranahmedse/driver.js/tree/master/docs/examples)

---

**Tip**: Siempre prueba los tours en diferentes tamaños de pantalla para asegurar que los popover se vean bien.
