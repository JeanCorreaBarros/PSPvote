# 🎓 Guía de Inicio Rápido: Tours Interactivos en PSPVote

## ¿Qué se instaló?

Se integró **driver.js**, una librería que permite crear **tours interactivos** para guiar a los usuarios a través de tu aplicación.

## 🚀 Cómo Usar

### Para Usuarios Finales

#### 1️⃣ Acceder a las guías

En cualquier página del dashboard, busca el icono **❓** (interrogación) en la parte superior derecha.

#### 2️⃣ Seleccionar una guía

Haz clic en el icono para ver las guías disponibles para esa página.

```
┌─────────────────────────────┐
│ Guías disponibles           │
├─────────────────────────────┤
│ ✓ Guía de Registro de Votos │
│ ✓ Registrar Nuevo Votante   │
│ ✓ Entender la Tabla         │
└─────────────────────────────┘
```

#### 3️⃣ Seguir el tour

- Cada paso muestra qué elemento se explica y para qué sirve
- Navega con los botones **Siguiente** y **Anterior**
- Presiona **Cerrar** para salir en cualquier momento

## 📍 Tours Disponibles Actualmente

### 1. **Sidebar** (Menú Lateral)
- **Nombre**: Disponible desde cualquier página
- **Qué cubre**: Cada opción del menú principal
- **Duración**: ~2 minutos

### 2. **Registro de Votos**
- **Ubicación**: Página de Registro de Votos
- **Qué cubre**: La página completa y su tabla
- **Duración**: ~3 minutos

### 3. **Registrar Nuevo Votante**
- **Ubicación**: Modal que aparece al hacer clic en "Nuevo Registro"
- **Qué cubre**: Cada campo del formulario
- **Duración**: ~2 minutos

### 4. **Tabla de Votantes**
- **Ubicación**: En la tabla de registro de votos
- **Qué cubre**: Cada columna y sus significados
- **Duración**: ~1 minuto

## 💡 Ejemplos

### Ejemplo 1: Aprender sobre el Sidebar
```
1. Abre cualquier página (ej: Dashboard)
2. Haz clic en el icono ❓
3. Selecciona "Guía del Sidebar"
4. Sigue los pasos interactivos
```

### Ejemplo 2: Aprender a registrar votantes
```
1. Ve a: Dashboard → Registro de Votos
2. Haz clic en el icono ❓
3. Selecciona "Registrar Nuevo Votante"
4. El tour mostrará cada campo del formulario
```

### Ejemplo 3: Entender la tabla
```
1. Ve a: Dashboard → Registro de Votos
2. Mira la tabla de votantes
3. Haz clic en el icono ❓
4. Selecciona "Entender la Tabla"
5. Aprenderás qué significa cada columna
```

## ⌨️ Controles del Tour

| Acción | Botón | Atajo |
|--------|-------|-------|
| Siguiente | ➡️ | Flecha derecha |
| Anterior | ⬅️ | Flecha izquierda |
| Cerrar | ❌ | Esc |
| Ver progreso | 📊 | Se muestra automáticamente |

## 🎯 Guía por Sección

### Dashboard
```
📊 Página Principal
├─ Estadísticas generales
├─ Actividad reciente
└─ Resumen por zona
```

### Registro de Votos ⭐ (Con Tours)
```
📋 Gestionar Votantes
├─ Buscar votantes existentes
├─ Registrar nuevos votantes
├─ Editar registros
├─ Eliminar registros
└─ Ver tabla completa
```

### Puestos de Votación
```
📍 Administración de Puestos
├─ Ver puestos activos
├─ Crear nuevos puestos
├─ Editar puestos
└─ Eliminar puestos
```

### Reportes
```
📈 Generación de Reportes
├─ Reportes por zona
├─ Estadísticas de participación
├─ Exportar a Excel/PDF
└─ Ver gráficos
```

### Configuración
```
⚙️ Ajustes del Sistema
├─ Gestión de usuarios
├─ Configuración general
└─ Preferencias de sistema
```

## ❓ Preguntas Frecuentes

### P: ¿Puedo usar los tours en cualquier dispositivo?
**R**: Sí, los tours funcionan en desktop, tablet y móvil.

### P: ¿Los tours se guardan?
**R**: Los tours son públicos. Cada vez que abras la página, podrás verlos de nuevo.

### P: ¿Qué sucede si cierro el tour a mitad?
**R**: Puedes volver a iniciarlo en cualquier momento. No se pierde información.

### P: ¿Hay tours en otras páginas?
**R**: Actualmente, los tours están en:
- Sidebar (en todas partes)
- Registro de Votos
- Modal de Registrar Votante

**Próximamente**: Reportes, Puestos, Configuración.

### P: ¿Cómo reporto problemas?
**R**: Si encuentras errores en los tours, reporta:
- Qué tour tiene el error
- Qué paso está mal
- Qué debería decir

## 🎯 Consejos

1. **Para nuevos usuarios**: Comienza con el tour del Sidebar
2. **Para registrar votantes**: Sigue el tour "Registrar Nuevo Votante"
3. **Para reportes**: Consulta la documentación en línea
4. **Para capacitaciones**: Usa los tours como material educativo

## 🔄 Cómo se ven los Tours

Cuando activas un tour, verás:

```
┌──────────────────────────────┐
│ Paso 2 de 5: Bienvenida      │
├──────────────────────────────┤
│                              │
│ Este es el botón para        │
│ registrar un nuevo votante.  │
│                              │
│ Haz clic en "Nuevo Registro" │
│ para empezar.                │
│                              │
├──────────────────────────────┤
│ [Anterior] [Siguiente] [❌]  │
└──────────────────────────────┘
       ↓
    Se destaca el elemento
```

## 📚 Más Información

- Documentación detallada: Ver `DRIVER_JS_SETUP.md`
- Ejemplos técnicos: Ver `DRIVER_JS_EXAMPLES.md`
- Mapa visual: Ver `DRIVER_JS_MAPA_VISUAL.md`

## 🔗 Recursos

- [Driver.js Oficial](https://driverjs.com/)
- [Documentación Técnica](https://driverjs.com/docs/)

---

**Última actualización**: Enero 20, 2026  
**Versión**: 1.0  
**Estado**: ✅ Funcionando correctamente

¡Disfruta de los tours interactivos! 🎉
