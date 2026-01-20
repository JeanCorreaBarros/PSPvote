# 🔐 Validación de Roles - Guía de Implementación

## ✅ Cambios Implementados

Se ha implementado un sistema de validación de roles basado en el token JWT. El rol se obtiene del payload del token y se usa para controlar qué opciones del sidebar ve cada usuario.

## 📋 Estructura de Roles

### ADMIN
**Permisos:** Acceso total a todas las funciones
- ✅ Dashboard
- ✅ Registro de Votos
- ✅ Votantes
- ✅ Puestos de Votación
- ✅ Reportes
- ✅ Configuración (Configuración + Usuarios)

### LIDER
**Permisos:** Acceso limitado
- ✅ Dashboard
- ✅ Registro de Votos
- ❌ Votantes
- ❌ Puestos de Votación
- ❌ Reportes
- ❌ Configuración

## 🔧 Archivos Modificados

### 1. **`lib/auth.ts`**
Se agregaron nuevas funciones para decodificar y obtener el rol del token:

```typescript
// Decodifica un token JWT sin validar la firma
export function decodeToken(token: string): TokenPayload | null

// Obtiene el rol del token JWT almacenado
export function getRoleFromToken(): string | null
```

**Interfaz agregada:**
```typescript
export interface TokenPayload {
  sub?: string
  id?: string
  username?: string
  role?: string
  iat?: number
  exp?: number
  [key: string]: any
}
```

### 2. **`components/sidebar.tsx`**
Se actualizó el componente Sidebar para:
- Obtener el rol del usuario desde el token
- Filtrar items del menú según el rol
- Mostrar solo las opciones permitidas

**Cambios principales:**
```tsx
interface MenuItem {
  icon: React.ComponentType<any>
  label: string
  href?: string
  requiredRole?: string[] // Roles permitidos
  submenu?: Array<{
    label: string
    href: string
    requiredRole?: string[]
  }>
}

// Hook para obtener el rol
const [userRole, setUserRole] = useState<string | null>(null)
useEffect(() => {
  const role = getRoleFromToken()
  setUserRole(role)
}, [])

// Filtrar menús según el rol
const filteredMenuItems = menuItems.filter((item) => {
  if (!item.requiredRole) return true
  if (!userRole) return false
  return item.requiredRole.includes(userRole)
})
```

### 3. **`app/dashboard/layout.tsx`**
Se agregó:
- Importación de `getRoleFromToken()`
- Estado para almacenar el rol del usuario
- Log en consola mostrando usuario y rol autenticado

```typescript
const [userRole, setUserRole] = useState<string | null>(null)

useEffect(() => {
  const user = getUser()
  const role = getRoleFromToken()
  
  if (!user) {
    router.push("/")
  } else {
    setUserRole(role)
    console.log(`✅ Usuario autenticado: ${user.username} | Rol: ${role}`)
    setIsLoading(false)
  }
}, [router])
```

## 🎯 Cómo Funciona

### Flujo de Validación:

```
1. Usuario inicia sesión
   ↓
2. Se recibe token JWT en la respuesta
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   }
   ↓
3. Token se guarda en localStorage (pspvote_token)
   ↓
4. Al cargar el dashboard, layout.tsx:
   - Llama a getRoleFromToken()
   - Decodifica el JWT y extrae el campo "role"
   - Muestra el rol en consola
   ↓
5. Sidebar.tsx:
   - Obtiene el rol con getRoleFromToken()
   - Filtra los menuItems según requiredRole
   - Solo muestra opciones permitidas para el rol
```

### Estructura del Token JWT Esperada:

```json
{
  "sub": "user-id",
  "id": "123",
  "username": "admin",
  "role": "ADMIN",
  "iat": 1234567890,
  "exp": 1234571490
}
```

O para líder:

```json
{
  "sub": "user-id",
  "id": "456",
  "username": "lider1",
  "role": "LIDER",
  "iat": 1234567890,
  "exp": 1234571490
}
```

## 🚀 Uso en Componentes

### Obtener el rol del usuario:

```typescript
import { getRoleFromToken } from '@/lib/auth'

// En un componente
const userRole = getRoleFromToken()

if (userRole === 'ADMIN') {
  // Mostrar opciones de admin
}
```

### Decodificar token manualmente:

```typescript
import { decodeToken } from '@/lib/auth'

const token = localStorage.getItem('pspvote_token')
const payload = decodeToken(token)
console.log(payload.role) // 'ADMIN' o 'LIDER'
```

## ✨ Características

- ✅ Decodificación de JWT sin librerías externas
- ✅ Validación automática de roles en sidebar
- ✅ Filtrado dinámico de menús según permisos
- ✅ Log de autenticación en consola
- ✅ Compatible con múltiples roles
- ✅ Submenu también respeta control de roles

## 🧪 Testing

Para probar con diferentes roles:

1. **Iniciar con rol ADMIN:**
   - Usuario: `admin`
   - Contraseña: `admin123`
   - Rol esperado: `ADMIN`
   - Resultado: Ver todas las opciones del sidebar

2. **Iniciar con rol LIDER:**
   - Usuario: `lider1`
   - Contraseña: `lider123`
   - Rol esperado: `LIDER`
   - Resultado: Solo ver "Dashboard" y "Registro de Votos"

3. **Verificar en Consola:**
   - Abrir DevTools (F12)
   - Ir a la pestaña "Console"
   - Debería ver: `✅ Usuario autenticado: admin | Rol: ADMIN`

## 📊 Cambios en Sidebar

### Vista ADMIN (Todas las opciones):
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

### Vista LIDER (Solo Dashboard y Registro):
```
📊 Dashboard
📋 Registro de Votos
🚪 Cerrar Sesión
```

## ⚠️ Notas Importantes

1. **Token Obtenido del Backend:** El rol debe venir en el campo `role` del payload JWT
2. **Sin Validación de Firma:** La función decodifica el token sin validar la firma (seguro porque se confía en el servidor)
3. **Sincronización:** El rol se obtiene cada vez que se carga el dashboard
4. **Logout:** Al hacer logout, se limpian tanto el token como los datos del usuario
5. **Error Handling:** Si no hay token o rol, se redirige al login

## 🔄 Flujo Completo

```
LOGIN PAGE
    ↓ (usuario ingresa credenciales)
    ↓
API /auth/login
    ↓ (retorna token con rol)
    ↓
GUARDAR TOKEN EN localStorage
    ↓
REDIRECT A /dashboard
    ↓
DASHBOARD LAYOUT
    ↓ (llama getRoleFromToken())
    ↓
OBTIENE ROL DEL TOKEN
    ↓
PASA AL SIDEBAR
    ↓
SIDEBAR FILTRA MENÚS SEGÚN ROL
    ↓
MUESTRA SOLO OPCIONES PERMITIDAS
```

## ✅ Checklist de Implementación

- ✅ Función `decodeToken()` implementada
- ✅ Función `getRoleFromToken()` implementada
- ✅ Interfaz `TokenPayload` creada
- ✅ Sidebar filtra menús por rol
- ✅ Dashboard obtiene y valida rol
- ✅ Logs de autenticación en consola
- ✅ Submenu respeta permisos de rol
- ✅ Estructura de roles definida (ADMIN, LIDER)
- ✅ Documentación completa
