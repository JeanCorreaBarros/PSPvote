# Driver.js - Guías Interactivas en PSPVote

## 📋 Descripción

Se ha integrado **driver.js** en tu aplicación PSPVote para crear guías interactivas que ayuden a los usuarios a comprender para qué sirve cada elemento de la interfaz.

## 🎯 Características Implementadas

### 1. **Hook personalizado: `useDriverTour`**
   - Ubicación: `hooks/use-driver-tour.ts`
   - Maneja la lógica de los tours interactivos
   - Configurable y fácil de usar

### 2. **Componente HelpButton**
   - Ubicación: `components/help-button.tsx`
   - Botón de ayuda con menú desplegable
   - Muestra las guías disponibles para cada página
   - Ícono de interrogación para fácil identificación

### 3. **Configuración de Tours**
   - Ubicación: `lib/tours-config.ts`
   - Tours predefinidos para:
     - **Sidebar**: Explica cada opción del menú
     - **Registro de Votos**: Guía completa de la página
     - **Registrar Votante**: Tutorial del modal de formulario
     - **Tabla de Votantes**: Detalles de cada columna

## 📍 Tours Disponibles

### Tour del Sidebar
Explica cada opción del menú principal:
- Logo y nombre de la aplicación
- Dashboard
- Registro de Votos
- Puestos de Votación
- Reportes
- Configuración

**Cómo usarlo:**
1. Abre el menú de ayuda en cualquier página
2. Selecciona "Guía del Sidebar"

### Tour de Registro de Votos
Guía completa de la sección de registro:
- Título y descripción de la página
- Búsqueda de votantes
- Botón de nuevo registro
- Tabla de votantes
- Cabeceras de columnas

**Ubicación:** `app/dashboard/registro-votos/page.tsx`
**Cómo usarlo:**
1. Ve a Registro de Votos en el sidebar
2. Haz clic en el icono de ayuda (?)
3. Selecciona "Guía de Registro de Votos"

### Tour de Registrar Votante
Tutorial interactivo del modal de formulario:
- Campo de Nombres
- Campo de Apellidos
- Campo de Cédula
- Campo de Teléfono
- Campo de Dirección
- Campo de Barrio
- Selector de Puesto de Votación
- Botón de Guardar

**Cómo usarlo:**
1. En la página de Registro de Votos
2. Haz clic en el icono de ayuda (?)
3. Selecciona "Registrar Nuevo Votante"

### Tour de Tabla de Votantes
Explica cada elemento de la tabla:
- Avatar del votante
- Nombre completo
- Estado del votante
- Acciones disponibles

## 🔧 Cómo Usar

### Para Usuarios
1. Busca el icono de **?** (interrogación) en la esquina superior derecha de cualquier página
2. Haz clic para ver las guías disponibles
3. Selecciona la guía que deseas ver
4. Sigue los pasos del tour
5. Usa los controles del tour para:
   - **Siguiente**: Ir al siguiente paso
   - **Anterior**: Volver al paso anterior
   - **Cerrar**: Terminar el tour

### Para Desarrolladores

#### Agregar un nuevo tour

1. Define los pasos en `lib/tours-config.ts`:

```typescript
export const miNuevoTour: TourStep[] = [
  {
    element: "#mi-elemento",
    popover: {
      title: "Título del Paso",
      description: "Descripción detallada de qué hace este elemento",
      side: "right", // left, right, top, bottom
      align: "center", // start, center, end
    },
  },
  // Más pasos...
]
```

2. Añade IDs a tus elementos HTML:
```tsx
<div id="mi-elemento">Contenido</div>
```

3. Importa y usa en tu componente:
```tsx
import { miNuevoTour } from "@/lib/tours-config"
import { HelpButton } from "@/components/help-button"

export default function MiPagina() {
  return (
    <>
      <HelpButton tours={[{ name: "Mi Guía", steps: miNuevoTour }]} />
      {/* Contenido */}
    </>
  )
}
```

## 📦 Instalación

Driver.js ya está instalado. Si necesitas reinstalarlo:

```bash
npm install driver.js
```

## 🎨 Personalización

### Cambiar colores del tour
Edita el CSS en `driver.js/dist/driver.css` o crea un archivo CSS personalizado.

### Ajustar velocidades de animación
En `hooks/use-driver-tour.ts`, modifica el `setTimeout`:

```typescript
setTimeout(() => {
  // Cambiar 500 a otro valor (en ms)
  driverInstance.drive()
}, 500)
```

## 📖 Convenciones de IDs

Los IDs deben seguir este patrón para mantener consistencia:

- **Sidebar**: `#menu-{nombre-en-minusculas}`
- **Formularios**: `#form-{nombre-campo}`
- **Tabla**: `#tabla-{nombre-columna}`
- **Secciones**: `#{seccion}-{elemento}`

## 🔗 Recursos

- [Documentación oficial de Driver.js](https://driverjs.com/)
- [GitHub de Driver.js](https://github.com/kamranahmedse/driver.js)

## ✅ Checklist de Elementos Guiados

- ✅ Sidebar con todas sus opciones
- ✅ Página de Registro de Votos
- ✅ Modal de Registrar Votante
- ✅ Tabla de Votantes

## 🚀 Próximas Mejoras Recomendadas

1. Agregar tour para la página de Reportes
2. Agregar tour para la página de Puestos de Votación
3. Agregar tour para la página de Configuración
4. Crear tours de video para procedimientos complejos
5. Añadir analytics para ver qué tours son más usados

---

**Versión**: 1.0  
**Última actualización**: Enero 2026
