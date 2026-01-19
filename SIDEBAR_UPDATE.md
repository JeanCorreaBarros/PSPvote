# Actualización del Sidebar - Subopciones de Configuración

## ✅ Cambios Implementados

Se ha actualizado la estructura del sidebar para agregar subopciones bajo "Configuración" con funcionalidad expandible.

### 1. **Sidebar Actualizado** 
Archivo: [components/sidebar.tsx](components/sidebar.tsx)

**Características Nuevas:**
- ✅ Subopciones bajo "Configuración"
- ✅ Animaciones de expansión/contracción
- ✅ Indicador visual de subopciones activas
- ✅ Comportamiento responsivo

**Estructura del Menú:**
```
Configuración
├── Configuración
└── Usuarios
```

**Cambios Técnicos:**
- Nueva interfaz `MenuItem` con soporte para `submenu`
- Estado `expandedMenu` para controlar qué menú está expandido
- Función `toggleSubmenu` para abrir/cerrar subopciones
- Animaciones con Framer Motion para transiciones suaves

### 2. **Nueva Página: Gestión de Usuarios**
Archivo: [app/dashboard/configuracion/usuarios/page.tsx](app/dashboard/configuracion/usuarios/page.tsx)

**Características:**
- 📋 Tabla completa de usuarios con columnas:
  - Usuario
  - Correo
  - Rol (ADMIN, SUPERVISOR, OPERADOR)
  - Estado (Activo/Inactivo)
  - Fecha de Creación
  - Acciones (Editar, Eliminar)
- 🔍 Búsqueda por usuario o correo
- ➕ Botón para crear nuevo usuario
- 🗑️ Eliminación con confirmación
- 💾 Datos de demostración precargados

### 3. **Componente: Dialog para Crear Usuario**
Archivo: [components/add-usuario-dialog.tsx](components/add-usuario-dialog.tsx)

**Funcionalidades:**
- 📝 Formulario completo con campos:
  - Username (usuario)
  - Email (correo electrónico)
  - Password (contraseña)
  - Confirm Password (confirmar contraseña)
  - Role (Administrador, Supervisor, Operador)
  - Estado (Activo, Inactivo)

- ✅ Validaciones:
  - Usuario requerido
  - Email válido
  - Contraseña mínimo 6 caracteres
  - Contraseñas deben coincidir

- 🎨 UI mejorada:
  - Mensajes de error inline
  - Estados de carga
  - Dialog modal responsivo

## 🎯 Rutas Disponibles

| Ruta | Descripción |
|------|-------------|
| `/dashboard/configuracion` | Página principal de configuración |
| `/dashboard/configuracion/usuarios` | Gestión de usuarios |

## 🖼️ Vista en Sidebar

```
📊 Dashboard
📋 Registro de Votos
👥 Votantes
📍 Puestos de Votación
📈 Reportes
⚙️ Configuración
   ├─ Configuración
   └─ Usuarios
🚪 Cerrar Sesión
```

## 🔧 Integración con API

Los componentes están listos para conectarse a endpoints reales:

```typescript
// Crear usuario (ejemplo)
await fetch('/api/usuarios', {
  method: 'POST',
  body: JSON.stringify(usuarioData),
  headers: { 'Authorization': `Bearer ${token}` }
})

// Obtener usuarios
await fetch('/api/usuarios', {
  headers: { 'Authorization': `Bearer ${token}` }
})

// Eliminar usuario
await fetch(`/api/usuarios/${id}`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` }
})
```

## ✨ Características Técnicas

- **TypeScript**: Tipado completo
- **Framer Motion**: Animaciones suaves
- **Validación**: Formularios con validación integrada
- **Responsive**: Se adapta a dispositivos móviles
- **Accesibilidad**: Componentes semánticos
- **Estado Local**: Gestión simple con React hooks

## 🧪 Cómo Probar

1. **Acceder a Configuración:**
   - Abre el dashboard
   - Haz clic en "Configuración" en el sidebar
   - Se expandirán las subopciones

2. **Ver Gestión de Usuarios:**
   - Haz clic en "Usuarios"
   - Se mostrará la tabla con usuarios demo
   - Prueba buscar, crear o eliminar usuarios

3. **Crear un Usuario:**
   - Haz clic en "Nuevo Usuario"
   - Completa el formulario
   - Haz clic en "Crear Usuario"

## 📝 Datos de Demo

Se incluyen 3 usuarios de ejemplo:
- **admin** - ADMIN - admin@pspvote.com
- **supervisor1** - SUPERVISOR - supervisor@pspvote.com
- **operador1** - OPERADOR - operador@pspvote.com

## ✅ Estado de Compilación

- ✅ TypeScript - Compila exitosamente
- ✅ Build Production - Sin errores
- ✅ Routes - Todas las rutas registradas
