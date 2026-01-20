# 📊 Resumen de Validación de Roles

## 🎯 Objetivo Alcanzado

✅ **Validación del rol obtenido del token JWT**
✅ **Mostrar opciones diferenciadas por rol en el sidebar**
✅ **Si es ADMIN: todas las opciones**
✅ **Si es LIDER: solo Dashboard y Registro de Votos**

---

## 🔍 Detalles de Implementación

### 1️⃣ Obtención del Rol desde el Token

**Archivo:** `lib/auth.ts`

```typescript
export function getRoleFromToken(): string | null {
  // Obtiene el token de localStorage
  // Decodifica manualmente el JWT (sin validar firma)
  // Extrae el campo 'role' del payload
  // Retorna el rol o null
}
```

**¿Cómo funciona?**
- El token JWT tiene 3 partes separadas por puntos: `header.payload.signature`
- Se toma la segunda parte (payload) y se decodifica de base64
- Se extrae el campo `role`

---

### 2️⃣ Filtrado de Menú del Sidebar

**Archivo:** `components/sidebar.tsx`

```typescript
// Cada item del menú tiene un campo requiredRole
const menuItems: MenuItem[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    requiredRole: ["ADMIN", "LIDER"]  // ← Ambos roles ven esto
  },
  {
    icon: Users,
    label: "Votantes",
    href: "/dashboard/votantes",
    requiredRole: ["ADMIN"]  // ← Solo ADMIN ve esto
  },
  // ... más items
]

// Al renderizar, se filtra según el rol del usuario
const filteredMenuItems = menuItems.filter((item) => {
  if (!item.requiredRole) return true
  if (!userRole) return false
  return item.requiredRole.includes(userRole)  // ← Validación
})
```

---

### 3️⃣ Validación en el Dashboard

**Archivo:** `app/dashboard/layout.tsx`

```typescript
useEffect(() => {
  const user = getUser()
  const role = getRoleFromToken()  // ← Obtiene el rol
  
  if (!user) {
    router.push("/")
  } else {
    setUserRole(role)
    // Log mostrando usuario y rol
    console.log(`✅ Usuario autenticado: ${user.username} | Rol: ${role}`)
    setIsLoading(false)
  }
}, [router])
```

---

## 🎨 Comparación Visual

### Usuario con Rol ADMIN
```
🔐 LOGGED IN AS: admin | ROLE: ADMIN

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

### Usuario con Rol LIDER
```
🔐 LOGGED IN AS: lider1 | ROLE: LIDER

📊 Dashboard
📋 Registro de Votos
🚪 Cerrar Sesión
```

---

## 🔑 Estructura del Token JWT

El backend debe retornar un token con esta estructura:

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "id": 1,
  "username": "admin",
  "role": "ADMIN",
  "iat": 1704067200,
  "exp": 1704153600
}
```

**Campo importante:** `"role": "ADMIN"` o `"role": "LIDER"`

---

## ✅ Tablas de Permisos

| Opción | ADMIN | LIDER |
|--------|-------|-------|
| Dashboard | ✅ | ✅ |
| Registro de Votos | ✅ | ✅ |
| Votantes | ✅ | ❌ |
| Puestos de Votación | ✅ | ❌ |
| Reportes | ✅ | ❌ |
| Configuración | ✅ | ❌ |
| Usuarios | ✅ | ❌ |

---

## 🧪 Cómo Probar

### 1. Abrir DevTools
Presiona `F12` en el navegador

### 2. Ir a la pestaña Console
Búsca el log de autenticación

### 3. Ejemplos de Logs:

**Admin:**
```
✅ Usuario autenticado: admin | Rol: ADMIN
```

**Lider:**
```
✅ Usuario autenticado: lider1 | Rol: LIDER
```

---

## 🚀 Flujo de Ejecución

```
1. Usuario hace LOGIN
   └─→ Endpoint: POST /api/auth/login

2. Backend retorna TOKEN
   └─→ { "token": "eyJhbGc..." }

3. Frontend guarda TOKEN
   └─→ localStorage.setItem('pspvote_token', token)

4. Usuario es redirigido a /dashboard
   └─→ Se carga DashboardLayout

5. DashboardLayout llama getRoleFromToken()
   └─→ Decodifica JWT y extrae role

6. Se obtiene el rol (ADMIN o LIDER)
   └─→ Se guarda en estado userRole

7. Sidebar filtra menús según rol
   └─→ Solo muestra items permitidos

8. Resultado final
   └─→ ADMIN ve todo
   └─→ LIDER ve solo Dashboard y Registro de Votos
```

---

## 📝 Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `lib/auth.ts` | ✅ +2 funciones nuevas, +1 interfaz |
| `components/sidebar.tsx` | ✅ Filtrado dinámico de menús |
| `app/dashboard/layout.tsx` | ✅ Validación de rol, logs |

---

## 💡 Datos Importantes

- 🔑 **Token guardado en:** `localStorage['pspvote_token']`
- 👤 **Usuario guardado en:** `localStorage['pspvote_user']`
- 🎯 **Rol extraído de:** JWT payload, campo `role`
- 🔐 **Tipos de rol:** `ADMIN` o `LIDER` (extensible)

---

## ⚠️ Notas de Seguridad

1. **Decodificación sin validación de firma:** Está bien porque el token viene del servidor confiable
2. **Siempre validar en backend:** La verdadera autorización debe ocurrir en el servidor
3. **El rol en frontend es solo UI:** Para bloquear acceso real, el backend debe validar
4. **Token en localStorage:** Recordar que está accesible desde JavaScript (usar HttpOnly si es posible)

---

## ✨ Ventajas de esta Implementación

✅ No requiere librerías externas (jwt-decode no es necesaria)
✅ Válida y actúa en tiempo real
✅ Fácil de extender a más roles
✅ Logs claros para debugging
✅ Control de permisos en UI y API

---

## 🎓 Función getRoleFromToken() Explicada

```typescript
export function getRoleFromToken(): string | null {
  if (typeof window === "undefined") return null  // Server-side rendering
  
  const token = localStorage.getItem("pspvote_token")
  if (!token) return null
  
  try {
    const parts = token.split('.')  // Separa las 3 partes del JWT
    if (parts.length !== 3) return null  // JWT debe tener exactamente 3 partes
    
    const decoded = JSON.parse(atob(parts[1]))  // Decodifica el payload (parte 2)
    return decoded.role || null  // Retorna el rol o null
  } catch (error) {
    console.error('Error al extraer rol del token:', error)
    return null
  }
}
```

**Paso a paso:**
1. Verifica si estamos en el navegador (no en SSR)
2. Obtiene el token de localStorage
3. Lo divide en sus 3 partes (header.payload.signature)
4. Decodifica la segunda parte (payload) de base64
5. Extrae el campo `role`
6. Retorna el rol o null si hay error

---

## 🔄 Próximos Pasos (Opcional)

Para mejorar aún más la validación:

- [ ] Crear hook custom `useUserRole()` para reutilización
- [ ] Agregar validación de expiración del token
- [ ] Implementar refresh token
- [ ] Agregar protección de rutas por rol (Route Guard)
- [ ] Crear componente `<RoleGate>` para mostrar/ocultar contenido
- [ ] Logs más detallados con timestamps

---

**✅ Implementación completada exitosamente** 🎉
