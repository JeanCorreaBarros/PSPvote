# Sistema de Tours Automáticos - PSPVote

## 🎯 Cómo Funciona

### 1. **Tour Automático al Iniciar Sesión**

Cuando un usuario entra al Dashboard por primera vez después de iniciar sesión:

```
1. Accede a /dashboard
2. El componente SidebarTourTrigger verifica si existe la cookie
3. Si NO existe la cookie "pspvote_tour_sidebar-welcome"
   → Inicia automáticamente el tour del sidebar
4. El usuario ve las explicaciones de cada opción del menú
5. Al presionar "Done" o cerrar el tour
   → Se guarda la cookie "pspvote_tour_sidebar-welcome=completed"
6. La próxima vez que acceda al dashboard, NO se muestra el tour
7. Puede activarlo manualmente con el botón de ayuda (?)
```

### 2. **Cookies de Tours**

Se guardan cookies con formato: `pspvote_tour_[nombre-tour]=completed`

**Ejemplos:**
- `pspvote_tour_sidebar-welcome=completed`
- `pspvote_tour_registro-votos=completed`
- `pspvote_tour_registrar-votante=completed`

**Duración:** 1 año (365 días)

### 3. **Botón de Ayuda en Cada Página**

Todas las páginas principales tienen un botón **?** en la esquina superior derecha:

- **Dashboard**: Ver tour del sidebar
- **Registro de Votos**: Ver tour completo o específico del modal
- **Puestos de Votación**: Ver información de puestos
- **Reportes**: Ver guía de generación de reportes

## 🗂️ Archivos Modificados

### Nuevos archivos:
```
hooks/use-driver-tour.ts          ← Hook con manejo de cookies
components/help-button.tsx         ← Botón de ayuda
components/sidebar-tour-trigger.tsx ← Trigger automático
lib/tours-config.ts               ← Configuración de tours
```

### Archivos actualizados:
```
app/dashboard/layout.tsx           ← Agregó SidebarTourTrigger
app/dashboard/page.tsx             ← Agregó HelpButton
app/dashboard/puestos/page.tsx     ← Agregó HelpButton
app/dashboard/reportes/page.tsx    ← Agregó HelpButton
app/dashboard/registro-votos/page.tsx ← Agregó HelpButton (ya estaba)
```

## 🔄 Flujo Detallado

### Primer acceso (después de login):

```
┌─────────────────┐
│ Usuario Inicia  │
│    Sesión       │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Va a /dashboard         │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│ SidebarTourTrigger verifica cookies     │
│ ¿Existe pspvote_tour_sidebar-welcome?   │
└────────┬────────────────────────────────┘
         │
    NO  │  SÍ
        │  └──────────────────────┐
        │                         │
        ▼                         ▼
┌──────────────────┐    ┌─────────────────┐
│ Inicia tour      │    │ Muestra página  │
│ automáticamente  │    │ sin tour        │
└────────┬─────────┘    └─────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Usuario sigue los pasos │
└────────┬────────────────┘
         │
    Click en "Done" o Close
         │
         ▼
┌──────────────────────────────────┐
│ Se guarda cookie:                │
│ pspvote_tour_sidebar-welcome     │
│ =completed (1 año)               │
└──────────────────────────────────┘
```

### Accesos posteriores:

```
Usuario accede a /dashboard
         │
         ▼
Cookie existe ✓
         │
         ▼
Muestra página normalmente
         │
         ▼
Usuario puede hacer clic en el botón ?
para ver el tour manualmente
```

## 🎮 Interacciones del Usuario

### Activar tour automático:
- Simplemente accede a /dashboard
- El tour se muestra automáticamente si es la primera vez

### Activar tour manualmente:
1. Haz clic en el botón **?** en la esquina superior derecha
2. Selecciona la guía que deseas ver
3. Sigue los pasos del tour

### Limpiar cookies (para probar):
En la consola del navegador:
```javascript
// Limpiar una cookie específica
document.cookie = "pspvote_tour_sidebar-welcome=; path=/; max-age=0";

// Limpiar todas las cookies de tours
document.cookie = "pspvote_tour_sidebar-welcome=; path=/; max-age=0";
document.cookie = "pspvote_tour_registro-votos=; path=/; max-age=0";
document.cookie = "pspvote_tour_registrar-votante=; path=/; max-age=0";
```

## 🧪 Prueba de Funcionalidad

### Test 1: Primer acceso
```
1. Abre una ventana incógnita/privada
2. Inicia sesión
3. ✅ Debe mostrar el tour automáticamente
4. Completa el tour
5. Recarga la página
6. ✅ NO debe mostrar el tour
```

### Test 2: Activar manualmente
```
1. Desde cualquier página
2. Haz clic en el botón ? (esquina superior derecha)
3. ✅ Debe mostrar el menú de guías disponibles
4. Selecciona una guía
5. ✅ Debe iniciar el tour
```

### Test 3: Tours múltiples
```
1. En Registro de Votos
2. Haz clic en ? 
3. ✅ Debe mostrar 2 opciones de tours
4. Prueba ambas
```

## 🛠️ Personalización

### Cambiar el tiempo de espera del tour automático:
Edita [app/dashboard/layout.tsx](app/dashboard/layout.tsx):
```typescript
// Cambiar 1500 a otro valor (en ms)
setTimeout(() => {
  startTour(sidebarTour, "sidebar-welcome")
}, 1500)
```

### Deshabilitar tour automático:
En [components/sidebar-tour-trigger.tsx](components/sidebar-tour-trigger.tsx):
```typescript
// Cambiar esta línea:
if (pathname === "/dashboard" && !isTourCompleted("sidebar-welcome")) {
  
// A:
if (false && pathname === "/dashboard" && !isTourCompleted("sidebar-welcome")) {
```

### Cambiar duración de cookie:
En [hooks/use-driver-tour.ts](hooks/use-driver-tour.ts):
```typescript
// max-age=31536000 es 1 año
// Cambiar a otro valor en segundos:
// 86400 = 1 día
// 604800 = 1 semana
// 2592000 = 30 días
document.cookie = `pspvote_tour_${tourName}=completed; path=/; max-age=86400`
```

## 📊 Tours Disponibles

| Página | Tours | Automático |
|--------|-------|-----------|
| Dashboard | Guía del Sidebar | ✅ Sí |
| Registro de Votos | 2 tours (general + modal) | ❌ No |
| Puestos de Votación | 1 tour | ❌ No |
| Reportes | 1 tour | ❌ No |

## 🚀 Próximas Mejoras

- [ ] Agregar tour automático a página de Puestos
- [ ] Agregar tour automático a página de Reportes
- [ ] Agregar opción para resetear todos los tours
- [ ] Agregar analytics de tours completados
- [ ] Tours en video para procedimientos complejos
- [ ] Opción en perfil para "mostrar tours de nuevo"

---

**Versión:** 1.1  
**Última actualización:** Enero 2026
