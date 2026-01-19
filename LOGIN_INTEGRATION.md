# Integración del Endpoint de Login

## ✅ Cambios Implementados

Se ha integrado el consumo del endpoint de login `http://localhost:3000/api/auth/login` en la aplicación.

### Archivos Modificados

#### 1. **`lib/api.ts`** 
- Cambiado el `API_BASE_URL` de `http://localhost:3000/api` a `http://localhost:3000/api`
- Agregada lógica para incluir automáticamente el token JWT en el header `Authorization: Bearer <token>`
- Agregado nuevo módulo `authApi` con función `login()`

```typescript
export const authApi = {
  login: (credentials: { username: string; password: string }) =>
    apiCall('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
}
```

#### 2. **`lib/auth.ts`**
- Agregadas funciones para gestionar el token JWT:
  - `getToken()` - Obtiene el token guardado
  - `setToken()` - Guarda el token
- Actualizado `logout()` para eliminar tanto el token como los datos de usuario
- Agregada interfaz `LoginResponse`

#### 3. **`app/page.tsx`** (Login Page)
- Cambiado de campo `email` a `username` para coincidir con el endpoint
- Integrado consumo real del endpoint mediante `authApi.login()`
- Guardado automático del token JWT con `setToken(response.token)`
- Credenciales de prueba actualizadas a:
  - **Usuario**: `admin`
  - **Contraseña**: `admin123`

## 🔄 Flujo de Login

```
1. Usuario ingresa username/password
   ↓
2. Se envía POST a http://localhost:3000/api/auth/login
   {
     "username": "admin",
     "password": "admin123"
   }
   ↓
3. Se recibe respuesta con token JWT
   {
     "token": "eyJhbGc..."
   }
   ↓
4. Token se guarda en localStorage (pspvote_token)
   ↓
5. Token se incluye automáticamente en futuras peticiones
   Authorization: Bearer <token>
   ↓
6. Usuario es redirigido a /dashboard
```

## 🚀 Uso

### Login
```typescript
import { authApi } from '@/lib/api'
import { setToken } from '@/lib/auth'

try {
  const response = await authApi.login({ 
    username: "admin", 
    password: "admin123" 
  })
  setToken(response.token)
  // Usuario autenticado ✅
} catch (error) {
  console.error("Login failed:", error)
}
```

### Obtener Token
```typescript
import { getToken } from '@/lib/auth'

const token = getToken()
```

### Logout
```typescript
import { authApi } from '@/lib/api'

authApi.logout() // Limpia token y datos de usuario
```

## 📝 Notas

- El token JWT se guarda en `localStorage` con key: `pspvote_token`
- Los datos del usuario se guardan con key: `pspvote_user`
- Todas las peticiones API incluyen automáticamente el header `Authorization: Bearer <token>`
- El proyecto compila exitosamente ✅

## 🧪 Testing

Para probar el login con las credenciales demo:
1. Abre http://localhost:3000
2. Haz clic en "Usar credenciales demo"
3. Haz clic en "Iniciar Sesión"
4. Deberías ser redirigido a `/dashboard` si el endpoint está disponible
