# Integración API - Gestión de Usuarios

## ✅ Cambios Implementados

Se ha integrado el consumo del endpoint `/api/users` para crear y obtener usuarios en tiempo real.

### 1. **Actualización: lib/api.ts**
Agregado nuevo módulo `usersApi` con endpoints:

```typescript
export const usersApi = {
  getAll: () => apiCall('/users'),
  getById: (id: string) => apiCall(`/users/${id}`),
  create: (data: { username: string; password: string; roleId: string; leaderId?: string | null }) =>
    apiCall('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiCall(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiCall(`/users/${id}`, { method: 'DELETE' }),
}
```

### 2. **Actualización: components/add-usuario-dialog.tsx**
- ✅ Consumo real del endpoint `/api/users`
- ✅ Token automático incluido en headers
- ✅ Mapeo de roles a IDs:
  - ADMIN → `122b4e4e-c580-4244-a7f1-8aff23269ccb`
  - SUPERVISOR → `a1b2c3d4-e5f6-4748-b9c0-d1e2f3a4b5c6`
  - OPERADOR → `b2c3d4e5-f6a7-4859-c0d1-e2f3a4b5c6d7`
- ✅ Validaciones de formulario
- ✅ Manejo de errores con mensajes descriptivos

**Datos que envía:**
```json
{
  "username": "lider1",
  "password": "123456",
  "roleId": "122b4e4e-c580-4244-a7f1-8aff23269ccb",
  "leaderId": null
}
```

### 3. **Actualización: app/dashboard/configuracion/usuarios/page.tsx**
- ✅ Carga de usuarios desde el endpoint real
- ✅ `useEffect` para cargar usuarios al montar
- ✅ Estados de carga (`isLoading`)
- ✅ Eliminación de usuarios con confirmación
- ✅ Búsqueda en tiempo real
- ✅ Notificaciones con `toast`
- ✅ Mapeo de IDs de roles a nombres legibles

**Características:**
- Indicador de carga mientras se obtienen usuarios
- Manejo de errores con notificaciones
- Tabla dinámica que se actualiza en tiempo real
- Estados disabled durante operaciones asincrónicas

## 🔄 Flujo de Creación de Usuario

```
1. Usuario llena formulario
   ↓
2. Se validan los datos
   ↓
3. Se envía POST a /api/users
   {
     "username": "lider1",
     "password": "123456",
     "roleId": "UUID",
     "leaderId": null
   }
   ↓
4. Se recibe respuesta con usuario creado
   ↓
5. Se agrega a la tabla localmente
   ↓
6. Se muestra notificación de éxito
```

## 📋 Flujo de Carga de Usuarios

```
1. Componente monta
   ↓
2. useEffect ejecuta loadUsuarios()
   ↓
3. Se envía GET a /api/users
   ↓
4. Se reciben usuarios
   ↓
5. Se mapean y muestran en tabla
```

## 🔐 Autenticación

El token se envía automáticamente en todos los requests:

```typescript
// En lib/api.ts - apiCall()
const token = localStorage.getItem('pspvote_token')
if (token) {
  defaultHeaders['Authorization'] = `Bearer ${token}`
}
```

## 📊 Mapeo de Roles

| Nombre | UUID |
|--------|------|
| ADMIN | `122b4e4e-c580-4244-a7f1-8aff23269ccb` |
| SUPERVISOR | `a1b2c3d4-e5f6-4748-b9c0-d1e2f3a4b5c6` |
| OPERADOR | `b2c3d4e5-f6a7-4859-c0d1-e2f3a4b5c6d7` |

## 🎯 Validaciones

**Formulario de Creación:**
- ✅ Usuario requerido
- ✅ Contraseña mínimo 6 caracteres
- ✅ Las contraseñas deben coincidir

## 🚀 Pruebas

Para probar la integración:

1. **Crear usuario:**
   ```
   - Ir a Configuración → Usuarios
   - Clic en "Nuevo Usuario"
   - Completar formulario
   - Clic en "Crear Usuario"
   - Debería aparecer en la tabla
   ```

2. **Ver usuarios:**
   ```
   - Ir a Configuración → Usuarios
   - La tabla debería cargar usuarios del servidor
   - Se muestra indicador de carga
   ```

3. **Eliminar usuario:**
   ```
   - Clic en icono de papelera
   - Confirmar eliminación
   - Usuario desaparece de la tabla
   ```

4. **Buscar usuario:**
   ```
   - Escribir en la caja de búsqueda
   - La tabla se filtra en tiempo real
   ```

## ⚠️ Notas Importantes

- El token JWT se obtiene de `localStorage.getItem('pspvote_token')`
- Los IDs de roles deben coincidir exactamente con los del backend
- Las notificaciones (toast) requieren que `Sonner` esté configurado
- El componente maneja errores de red gracefully

## ✅ Estado de Compilación

- ✅ TypeScript - Compila exitosamente
- ✅ Build Production - Sin errores
- ✅ Todas las rutas registradas
- ✅ Integración de API completa
