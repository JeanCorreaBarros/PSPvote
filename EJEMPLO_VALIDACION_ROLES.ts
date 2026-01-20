/**
 * EJEMPLO COMPLETO: Validación de Roles en PSPVote
 * 
 * Este archivo muestra cómo funciona el sistema de validación de roles
 * desde el login hasta la visualización del sidebar
 */

// ============================================
// 1. LOGIN - El usuario ingresa credenciales
// ============================================

import { authApi } from '@/lib/api'
import { setToken, getRoleFromToken } from '@/lib/auth'

async function handleLogin(username: string, password: string) {
  try {
    // Realizar login
    const response = await authApi.login({ username, password })
    
    // El backend retorna un token JWT con esta estructura:
    // {
    //   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcwNDA2NzIwMCwiZXhwIjoxNzA0MTUzNjAwfQ...."
    // }
    
    console.log('✅ Login exitoso')
    console.log('Token recibido:', response.token)
    
    // Guardar token en localStorage
    setToken(response.token)
    console.log('📦 Token guardado en localStorage')
    
    // Redirigir a dashboard
    window.location.href = '/dashboard'
    
  } catch (error) {
    console.error('❌ Error en login:', error)
  }
}

// ============================================
// 2. TOKEN - Estructura del JWT
// ============================================

/**
 * Cuando se decodifica el token obtenemos:
 * 
 * Para un ADMIN:
 * {
 *   "sub": "550e8400-e29b-41d4-a716-446655440000",
 *   "id": 1,
 *   "username": "admin",
 *   "role": "ADMIN",              ← Este es el campo importante
 *   "iat": 1704067200,
 *   "exp": 1704153600
 * }
 * 
 * Para un LIDER:
 * {
 *   "sub": "660e8400-e29b-41d4-a716-446655440001",
 *   "id": 2,
 *   "username": "lider1",
 *   "role": "LIDER",               ← Este es el campo importante
 *   "iat": 1704067200,
 *   "exp": 1704153600
 * }
 */

// ============================================
// 3. OBTENER ROL - Función auxiliar
// ============================================

import { getRoleFromToken, decodeToken } from '@/lib/auth'

// Opción 1: Obtener solo el rol
function ejemploObtenerRol() {
  const role = getRoleFromToken()
  console.log('Rol del usuario:', role) // "ADMIN" o "LIDER"
}

// Opción 2: Decodificar token completo
function ejemploDecodificarToken() {
  const token = localStorage.getItem('pspvote_token')
  if (token) {
    const payload = decodeToken(token)
    console.log('Payload completo:', payload)
    console.log('Rol específico:', payload?.role)
  }
}

// ============================================
// 4. SIDEBAR - Filtrado dinámico
// ============================================

/**
 * En components/sidebar.tsx, el rol se obtiene y se usa para filtrar
 */

// Definición de items del menú con permisos
const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard",
    requiredRole: ["ADMIN", "LIDER"]  // ← Ambos pueden verlo
  },
  {
    icon: ClipboardList,
    label: "Registro de Votos",
    href: "/dashboard/registro-votos",
    requiredRole: ["ADMIN", "LIDER"]  // ← Ambos pueden verlo
  },
  {
    icon: Users,
    label: "Votantes",
    href: "/dashboard/votantes",
    requiredRole: ["ADMIN"]  // ← Solo ADMIN
  },
  {
    icon: MapPin,
    label: "Puestos de Votación",
    href: "/dashboard/puestos",
    requiredRole: ["ADMIN"]  // ← Solo ADMIN
  },
  {
    icon: BarChart3,
    label: "Reportes",
    href: "/dashboard/reportes",
    requiredRole: ["ADMIN"]  // ← Solo ADMIN
  },
  {
    icon: Settings,
    label: "Configuración",
    requiredRole: ["ADMIN"],  // ← Solo ADMIN
    submenu: [
      {
        label: "Configuración",
        href: "/dashboard/configuracion",
        requiredRole: ["ADMIN"]
      },
      {
        label: "Usuarios",
        href: "/dashboard/configuracion/usuarios",
        requiredRole: ["ADMIN"]
      },
    ],
  },
]

// Filtrado en el componente
function ejemploFiltrado() {
  const userRole = getRoleFromToken()  // "ADMIN" o "LIDER"
  
  const filteredMenuItems = menuItems.filter((item) => {
    // Si no tiene requiredRole, mostrarlo
    if (!item.requiredRole) return true
    
    // Si no hay rol, no mostrar nada
    if (!userRole) return false
    
    // Mostrar si el rol está en requiredRole
    return item.requiredRole.includes(userRole)
  })
  
  console.log('Items visibles:', filteredMenuItems)
  // Si userRole es "LIDER", solo verá Dashboard y Registro de Votos
  // Si userRole es "ADMIN", verá todos los items
}

// ============================================
// 5. DASHBOARD LAYOUT - Validación
// ============================================

/**
 * En app/dashboard/layout.tsx
 */

function ejemploDashboardLayout() {
  const user = getUser()  // Obtener usuario de localStorage
  const role = getRoleFromToken()  // Obtener rol del token
  
  console.log(`✅ Usuario autenticado: ${user?.username} | Rol: ${role}`)
  
  // Este log aparecerá en la consola del navegador cuando se cargue el dashboard
  // Ejemplo de salida:
  // ✅ Usuario autenticado: admin | Rol: ADMIN
  // o
  // ✅ Usuario autenticado: lider1 | Rol: LIDER
}

// ============================================
// 6. RESULTADO - Vistas Diferentes
// ============================================

/**
 * Vista del Sidebar para ADMIN:
 * 
 * 📊 Dashboard
 * 📋 Registro de Votos
 * 👥 Votantes
 * 📍 Puestos de Votación
 * 📈 Reportes
 * ⚙️ Configuración
 *    ├─ Configuración
 *    └─ Usuarios
 * 🚪 Cerrar Sesión
 */

/**
 * Vista del Sidebar para LIDER:
 * 
 * 📊 Dashboard
 * 📋 Registro de Votos
 * 🚪 Cerrar Sesión
 */

// ============================================
// 7. FLUJO COMPLETO - Paso a Paso
// ============================================

/**
 * FLUJO COMPLETO DE EJECUCIÓN:
 * 
 * 1. Usuario accede a http://localhost:3000
 *    └─ Ve la página de login
 * 
 * 2. Ingresa credenciales:
 *    ├─ Username: admin
 *    └─ Password: admin123
 * 
 * 3. Frontend envía POST /api/auth/login
 *    └─ Body: { username: "admin", password: "admin123" }
 * 
 * 4. Backend valida y retorna token JWT:
 *    └─ Response: {
 *         "token": "eyJhbGc...iOiJBRE1JTiIsImlhdCI6MTcwNDA2NzIwMCwiZXhwIjoxNzA0MTUzNjAwfQ..."
 *       }
 * 
 * 5. Frontend guarda el token:
 *    └─ localStorage.setItem('pspvote_token', token)
 * 
 * 6. Usuario es redirigido a /dashboard
 *    └─ Se carga DashboardLayout
 * 
 * 7. DashboardLayout ejecuta:
 *    ├─ getUser() → obtiene usuario de localStorage
 *    ├─ getRoleFromToken() → decodifica JWT y extrae "role"
 *    └─ console.log(`✅ Usuario autenticado: admin | Rol: ADMIN`)
 * 
 * 8. Se renderiza Sidebar
 *    ├─ Llama getRoleFromToken() nuevamente
 *    ├─ Obtiene "ADMIN"
 *    ├─ Filtra menuItems (solo mostrará items donde requiredRole incluye "ADMIN")
 *    └─ Resultado: Muestra TODOS los items del menú
 * 
 * 9. Usuario ve el Dashboard completo con todas las opciones
 *    ├─ Dashboard ✅
 *    ├─ Registro de Votos ✅
 *    ├─ Votantes ✅
 *    ├─ Puestos de Votación ✅
 *    ├─ Reportes ✅
 *    ├─ Configuración ✅
 *    └─ Cerrar Sesión ✅
 * 
 * ALTERNATIVA - Si fuera LIDER:
 * 
 * 7. DashboardLayout ejecuta:
 *    ├─ getRoleFromToken() → retorna "LIDER"
 *    └─ console.log(`✅ Usuario autenticado: lider1 | Rol: LIDER`)
 * 
 * 8. Se renderiza Sidebar
 *    ├─ Filtra menuItems (solo mostrará items donde requiredRole incluye "LIDER")
 *    └─ Resultado: Solo muestra Dashboard y Registro de Votos
 * 
 * 9. Usuario ve el Dashboard limitado:
 *    ├─ Dashboard ✅
 *    ├─ Registro de Votos ✅
 *    └─ Cerrar Sesión ✅
 *    (Las otras opciones NO aparecen)
 */

// ============================================
// 8. TESTING - Cómo Probar
// ============================================

/**
 * PARA PROBAR LA VALIDACIÓN DE ROLES:
 * 
 * 1. Abrir DevTools: Presiona F12
 * 
 * 2. Ir a pestaña Console
 * 
 * 3. Verificar logs:
 *    ✅ Usuario autenticado: admin | Rol: ADMIN
 *    (o con rol LIDER, según lo que hayas iniciado)
 * 
 * 4. Verificar manualmente el token:
 *    └─ En consola ejecuta:
 *       localStorage.getItem('pspvote_token')
 *    └─ Verás el JWT completo
 * 
 * 5. Decodificar el rol manualmente:
 *    └─ En consola ejecuta:
 *       JSON.parse(atob(localStorage.getItem('pspvote_token').split('.')[1]))
 *    └─ Verás el payload completo incluido el campo "role"
 * 
 * 6. Verificar el filtrado del sidebar:
 *    └─ Cuenta cuantos items aparecen en el menú
 *    └─ Para ADMIN: 5 items principales + 2 subitems = 7 total
 *    └─ Para LIDER: 2 items principales = 2 total
 */

// ============================================
// 9. CASOS DE USO
// ============================================

/**
 * CASO 1: Usuario ADMIN
 * ├─ Inicia sesión como admin
 * ├─ Token contiene: "role": "ADMIN"
 * ├─ getRoleFromToken() retorna "ADMIN"
 * ├─ Sidebar filtra y muestra todos los items
 * └─ Puede acceder a: todo
 * 
 * CASO 2: Usuario LIDER
 * ├─ Inicia sesión como lider1
 * ├─ Token contiene: "role": "LIDER"
 * ├─ getRoleFromToken() retorna "LIDER"
 * ├─ Sidebar filtra y solo muestra Dashboard y Registro de Votos
 * └─ Puede acceder a: solo esas dos opciones
 * 
 * CASO 3: Sin Token (usuario intenta acceder directo a /dashboard)
 * ├─ localStorage no tiene 'pspvote_token'
 * ├─ getRoleFromToken() retorna null
 * ├─ Sidebar no muestra ningún item (filtrado vacío)
 * └─ DashboardLayout redirige a / (login)
 * 
 * CASO 4: Token Inválido o Corrupto
 * ├─ localStorage tiene 'pspvote_token' pero está corrupto
 * ├─ getRoleFromToken() intenta decodificar y catch error
 * ├─ Retorna null
 * └─ Comportamiento igual al CASO 3
 */

// ============================================
// 10. FUNCIONES EXPORTADAS
// ============================================

/**
 * Funciones disponibles en lib/auth.ts:
 * 
 * export function getRoleFromToken(): string | null
 *   └─ Obtiene el rol del token, retorna "ADMIN", "LIDER", etc o null
 * 
 * export function decodeToken(token: string): TokenPayload | null
 *   └─ Decodifica un JWT completo y retorna el payload
 * 
 * export function getToken(): string | null
 *   └─ Obtiene el token de localStorage
 * 
 * export function getUser(): User | null
 *   └─ Obtiene datos del usuario guardados
 * 
 * export function setToken(token: string): void
 *   └─ Guarda el token en localStorage
 * 
 * export function logout(): void
 *   └─ Elimina token y datos del usuario
 */

// ============================================
// RESUMEN FINAL
// ============================================

/**
 * ✅ VALIDACIÓN DE ROLES IMPLEMENTADA
 * 
 * 1. getRoleFromToken() extrae el rol del token JWT
 * 2. Sidebar filtra menús según el rol
 * 3. ADMIN ve todas las opciones
 * 4. LIDER solo ve Dashboard y Registro de Votos
 * 5. Se muestra log de autenticación en consola
 * 
 * RESULTADO:
 * ├─ Seguridad: Opciones no permitidas no se muestran
 * ├─ UX: Interfaz limpia según perfil del usuario
 * ├─ Validación: El token es la fuente de verdad
 * └─ Extensible: Fácil agregar más roles
 */
