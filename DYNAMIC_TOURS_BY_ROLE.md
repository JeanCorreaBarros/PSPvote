# Tours Dinámicos por Rol de Usuario

## Descripción General

El sistema de tours (guías interactivas) ahora se adapta automáticamente según el rol del usuario. Esto evita que se intente mostrar elementos del sidebar que no son visibles para ese rol.

## Implementación

### 1. **Tours por Rol**

En `lib/tours-config.ts` se definen dos tours diferentes:

#### Tour para LIDER
```typescript
const sidebarTourLider: TourStep[] = [
  // Logo
  // Dashboard
  // Registro de Votos
]
```

#### Tour para ADMIN
```typescript
const sidebarTourComplete: TourStep[] = [
  // Logo
  // Dashboard
  // Registro de Votos
  // Puestos de Votación
  // Reportes
  // Configuración
]
```

### 2. **Función `getSidebarTour()`**

Función que determina cuál tour mostrar basado en el rol:

```typescript
export const getSidebarTour = (): TourStep[] => {
  const role = getRoleFromToken()
  
  if (role === "LIDER") {
    return sidebarTourLider
  }
  
  return sidebarTourComplete  // Por defecto para ADMIN
}
```

### 3. **Integración en Componentes**

#### En Dashboard (`app/dashboard/page.tsx`):
```tsx
import { getSidebarTour } from "@/lib/tours-config"

export default function DashboardPage() {
  return (
    <Header title="Dashboard" tours={[{ name: "Guía del Sidebar", steps: getSidebarTour() }]} />
  )
}
```

#### En SidebarTourTrigger (`components/sidebar-tour-trigger.tsx`):
```tsx
import { getSidebarTour } from "@/lib/tours-config"

useEffect(() => {
  if (pathname === "/dashboard" && !isTourCompleted("sidebar-welcome")) {
    startTour(getSidebarTour(), "sidebar-welcome")
  }
}, [pathname, startTour])
```

## Ventajas

✅ **Tours coherentes**: El tour nunca intenta mostrar elementos ocultos
✅ **Mejor UX**: Los usuarios solo ven instrucciones relevantes a su rol
✅ **Mantenimiento**: Fácil agregar nuevos tours o roles
✅ **Escalabilidad**: Se puede extender a más roles fácilmente

## Cómo Agregar Nuevos Tours por Rol

1. Define el nuevo tour en `lib/tours-config.ts`:
   ```typescript
   const sidebarTourNuevoRol: TourStep[] = [
     // ... pasos del tour
   ]
   ```

2. Actualiza la función `getSidebarTour()`:
   ```typescript
   export const getSidebarTour = (): TourStep[] => {
     const role = getRoleFromToken()
     
     if (role === "LIDER") {
       return sidebarTourLider
     }
     
     if (role === "NUEVO_ROL") {
       return sidebarTourNuevoRol
     }
     
     return sidebarTourComplete
   }
   ```

3. Los cambios se aplicarán automáticamente

## Roles Actuales

- **ADMIN**: Acceso a todas las opciones y tours completos
- **LIDER**: Acceso limitado a Dashboard y Registro de Votos

---

**Última actualización:** 21 de Enero, 2026
