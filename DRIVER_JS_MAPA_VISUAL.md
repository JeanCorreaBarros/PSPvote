# 🗺️ Mapa Visual de Tours en PSPVote

## 1. 📱 Sidebar (Menú Lateral Izquierdo)

```
┌─────────────────────────────┐
│  #sidebar-logo              │ ← Tour: "Logo de PSPVote"
│  PSPVote                    │
├─────────────────────────────┤
│ 📊 #menu-dashboard          │ ← Tour: "Dashboard"
│                             │
│ 📋 #menu-registro-de-votos  │ ← Tour: "Registro de Votos"
│                             │
│ 📍 #menu-puestos-votacion   │ ← Tour: "Puestos de Votación"
│                             │
│ 📈 #menu-reportes           │ ← Tour: "Reportes"
│                             │
│ ⚙️  #menu-configuracion     │ ← Tour: "Configuración"
├─────────────────────────────┤
│ 🚪 Cerrar Sesión            │
└─────────────────────────────┘
```

## 2. 📋 Página: Registro de Votos

```
┌──────────────────────────────────────────────────────────┐
│ Registro de Votos  [?] Help Button                       │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ #registro-titulo                                         │
│ "Listado de Votantes"                                    │
│                                                          │
│  🔍 #registro-busqueda        [❌] [➕] Nuevo Registro  │
│  Buscar votante...             Filtros    #registro-nuevo-btn
│                                                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ #registro-tabla                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ #registro-tabla-header                              │ │
│ │ Avatar │ Nombre │ Cédula │ Tel │ Dir │ Barrio │... │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │ #tabla-avatar #tabla-nombre    #tabla-estado       │ │
│ │   [👤]  Juan Pérez García    Registrado   [⋯]      │ │
│ │                                          #tabla-acciones
│ │   [👤]  María López         Verificado   [⋯]       │ │
│ │                                                      │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## 3. 📝 Modal: Registrar Nuevo Votante

```
┌────────────────────────────────────────┐
│ Registrar Nuevo Votante                │
├────────────────────────────────────────┤
│                                        │
│ Nombres            Apellidos           │
│ [_____________]    [_____________]     │
│  #form-nombres      #form-apellidos    │
│                                        │
│ Cédula             Teléfono            │
│ [_____________]    [_____________]     │
│  #form-cedula       #form-telefono     │
│                                        │
│ Dirección                              │
│ [_________________________________]    │
│  #form-direccion                       │
│                                        │
│ Barrio             Puesto de Votación  │
│ [_____________]    [_____________]     │
│  #form-barrio       #form-puesto       │
│                                        │
│ [Cancelar]  [Registrar]                │
│                      #form-submit      │
└────────────────────────────────────────┘
```

## 4. 🎯 Tours Disponibles

### Tour 1: Sidebar Completo
```
Paso 1: #sidebar-logo
        "Bienvenido a PSPVote"
        
Paso 2: #menu-dashboard
        "Ir a Dashboard"
        
Paso 3: #menu-registro-de-votos
        "Gestionar votantes"
        
Paso 4: #menu-puestos-votacion
        "Administrar puestos"
        
Paso 5: #menu-reportes
        "Ver estadísticas"
        
Paso 6: #menu-configuracion
        "Ajustes de sistema"
```

### Tour 2: Registro de Votos
```
Paso 1: #registro-titulo
        "Página de Registro"
        
Paso 2: #registro-busqueda
        "Buscar votantes"
        
Paso 3: #registro-nuevo-btn
        "Registrar nuevo"
        
Paso 4: #registro-tabla
        "Ver registrados"
        
Paso 5: #registro-tabla-header
        "Columnas disponibles"
```

### Tour 3: Formulario de Votante
```
Paso 1: #form-nombres
        "Ingresa nombres"
        
Paso 2: #form-apellidos
        "Ingresa apellidos"
        
Paso 3: #form-cedula
        "Cédula o documento"
        
Paso 4: #form-telefono
        "Teléfono del votante"
        
Paso 5: #form-direccion
        "Dirección residencial"
        
Paso 6: #form-barrio
        "Barrio o localidad"
        
Paso 7: #form-puesto
        "Puesto asignado"
        
Paso 8: #form-submit
        "Guardar votante"
```

### Tour 4: Tabla de Votantes
```
Paso 1: #tabla-avatar
        "Avatar del votante"
        
Paso 2: #tabla-nombre
        "Nombre completo"
        
Paso 3: #tabla-estado
        "Estado del registro"
        
Paso 4: #tabla-acciones
        "Opciones (editar/eliminar)"
```

## 5. 🎨 Posicionamiento de Popovers

### Recomendado por ubicación:

```
SIDEBAR (columna izquierda)
├─ side: "right"      ← Popup a la derecha del elemento
├─ align: "start"      ← En la parte superior
└─ align: "center"     ← Centrado

HEADER (fila superior)
├─ side: "bottom"     ← Popup debajo del elemento
├─ align: "end"        ← A la derecha
└─ align: "center"     ← Centrado

CONTENIDO CENTRAL
├─ side: "right"      ← Popup a la derecha
├─ side: "left"       ← Popup a la izquierda (si está en borde)
├─ align: "center"    ← Siempre centrado
└─ En modales: side: "top" ← Arriba, centrado

TABLA
├─ side: "left"       ← Popup a la izquierda
├─ align: "center"    ← Centrado verticalmente
└─ side: "top"        ← En la primera fila, arriba
```

## 6. 📊 Flujo de Tours Recomendado

```
Usuario entra a Dashboard
        │
        ├─→ Primera vez (localStorage vacío)
        │   └─→ Mostrar: Sidebar Tour (automático)
        │
        ├─→ Va a Registro de Votos
        │   └─→ Mostrar HelpButton con:
        │       ├─ Guía de Registro de Votos
        │       └─ Cómo Registrar Votante
        │
        └─→ Abre modal Registrar Votante
            └─→ Mostrar HelpButton con:
                ├─ Registrar Nuevo Votante
                └─ Entender la Tabla
```

## 7. 🔄 Estados e Indicadores

```
┌─────────────────────────────────────┐
│ Estado del Votante (tabla)          │
├─────────────────────────────────────┤
│ 🟢 Registrado (verde)    #tabla-estado
│ 🔵 Verificado (azul)
│ 🟡 Pendiente (amarillo)
└─────────────────────────────────────┘
```

## 8. 📍 Cómo Encontrar los Elementos

### Usando el navegador:
```
1. Abre DevTools (F12)
2. Usa Ctrl+Shift+C (selector de elementos)
3. Busca por ID, ej: #registro-titulo
4. Verifica que el elemento esté visible
```

### Usando JavaScript en consola:
```javascript
// Verificar que existe
document.getElementById('registro-titulo')

// Ver su posición
const el = document.getElementById('registro-titulo')
console.log(el.getBoundingClientRect())
```

## 9. ✅ Checklist de IDs

- ✅ #sidebar-logo
- ✅ #menu-dashboard
- ✅ #menu-registro-de-votos
- ✅ #menu-puestos-votacion
- ✅ #menu-reportes
- ✅ #menu-configuracion
- ✅ #registro-titulo
- ✅ #registro-busqueda
- ✅ #registro-nuevo-btn
- ✅ #registro-tabla
- ✅ #registro-tabla-header
- ✅ #form-nombres
- ✅ #form-apellidos
- ✅ #form-cedula
- ✅ #form-telefono
- ✅ #form-direccion
- ✅ #form-barrio
- ✅ #form-puesto
- ✅ #form-submit
- ✅ #tabla-avatar
- ✅ #tabla-nombre
- ✅ #tabla-estado
- ✅ #tabla-acciones

## 10. 🎓 Navegación de Tour

Cada tour incluye:
- ⬅️ Botón: Paso anterior
- ➡️ Botón: Siguiente paso
- ❌ Botón: Cerrar tour
- 📊 Indicador: Paso X de Y

---

**Tip**: Guarda esta documentación para referencia rápida mientras desarrollas nuevos tours.
