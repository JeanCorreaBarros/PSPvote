# 🧪 Guía de Testing - Validación de Roles

## ✅ Verificación Rápida

### 1. Probar Login con ADMIN
```bash
# Acceder a http://localhost:3000
# Usar credenciales:
Username: admin
Password: admin123
```

**Resultado esperado:**
- ✅ Redirige a /dashboard
- ✅ Aparece en consola: `✅ Usuario autenticado: admin | Rol: ADMIN`
- ✅ Sidebar muestra TODAS las opciones:
  - Dashboard
  - Registro de Votos
  - Votantes
  - Puestos de Votación
  - Reportes
  - Configuración (con submenú)

### 2. Probar Login con LIDER
```bash
# Acceder a http://localhost:3000
# Usar credenciales:
Username: lider1
Password: lider123
```

**Resultado esperado:**
- ✅ Redirige a /dashboard
- ✅ Aparece en consola: `✅ Usuario autenticado: lider1 | Rol: LIDER`
- ✅ Sidebar muestra SOLO 2 opciones:
  - Dashboard
  - Registro de Votos

---

## 🔍 Verificación en Consola

### Paso 1: Abrir DevTools
- Presiona `F12` en Windows/Linux
- O `Cmd + Option + I` en Mac

### Paso 2: Ir a la pestaña Console
- Click en "Console" en DevTools

### Paso 3: Verificar Logs

Después de hacer login, deberías ver:

**Para ADMIN:**
```
✅ Usuario autenticado: admin | Rol: ADMIN
```

**Para LIDER:**
```
✅ Usuario autenticado: lider1 | Rol: LIDER
```

### Paso 4: Inspeccionar Token

En la consola, ejecuta:

```javascript
// Ver el token completo
localStorage.getItem('pspvote_token')

// Decodificar el rol
JSON.parse(atob(localStorage.getItem('pspvote_token').split('.')[1])).role

// Ver todo el payload
JSON.parse(atob(localStorage.getItem('pspvote_token').split('.')[1]))
```

**Salida esperada:**
```javascript
// El rol
"ADMIN"

// O todo el payload:
{
  sub: "550e8400-e29b-41d4-a716-446655440000"
  id: 1
  username: "admin"
  role: "ADMIN"
  iat: 1704067200
  exp: 1704153600
}
```

---

## 🧪 Checklist de Testing

### Funcionalidad Básica
- [ ] Usuario ADMIN ve todas las opciones del sidebar
- [ ] Usuario LIDER ve solo Dashboard y Registro de Votos
- [ ] Log en consola muestra el rol correcto
- [ ] Token se guarda en localStorage
- [ ] Payload del token contiene el campo "role"

### Navegación
- [ ] ADMIN puede hacer click en todas las opciones
- [ ] LIDER puede hacer click solo en Dashboard y Registro de Votos
- [ ] El resto de opciones no son clickeables para LIDER
- [ ] Las opciones no permitidas no aparecen en la UI

### Logout
- [ ] Logout limpia el token de localStorage
- [ ] Logout redirige a la página de login
- [ ] Al hacer logout, localStorage no contiene 'pspvote_token'

### Edge Cases
- [ ] Si alguien intenta acceder a /dashboard/votantes siendo LIDER:
  - Debería verlo en la barra de direcciones (la ruta es válida)
  - Pero NO debería estar visible en el sidebar
  - Backend debería rechazar la petición si es LIDER

- [ ] Si se borra manualmente el token de localStorage:
  - `localStorage.removeItem('pspvote_token')`
  - Recargar la página
  - Debería redirigir al login

- [ ] Si se intenta cambiar manualmente el token:
  - Backend debería validar y rechazar peticiones inválidas

---

## 🐛 Troubleshooting

### Problema: No veo el log en la consola

**Soluciones:**
1. Verifica que DevTools esté abierto en la pestaña Console
2. Haz refresh de la página (F5)
3. Busca por "Usuario autenticado" en la consola
4. Verifica que hayas hecho login correctamente

### Problema: El sidebar muestra todas las opciones para LIDER

**Soluciones:**
1. Verifica el rol en el token:
   ```javascript
   JSON.parse(atob(localStorage.getItem('pspvote_token').split('.')[1])).role
   ```
2. Debería retornar `"LIDER"` y no `"ADMIN"`
3. Verifica que el backend esté retornando el rol correcto
4. Haz refresh de la página (F5)

### Problema: El token no se guarda

**Soluciones:**
1. Verifica en DevTools → Application → Local Storage
2. Debería haber una entrada `pspvote_token`
3. Si no está, el login falló
4. Verifica la respuesta del endpoint en Network tab

### Problema: No puedo hacer login

**Soluciones:**
1. Verifica que el backend esté corriendo en `http://localhost:3000`
2. Abre DevTools → Network tab
3. Intenta hacer login y busca la request POST a `/api/auth/login`
4. Verifica el status code (debería ser 200)
5. Verifica que el response tiene un campo "token"

### Problema: Las credenciales no funcionan

**Soluciones:**
1. Verifica las credenciales correctas:
   - ADMIN: `admin` / `admin123`
   - LIDER: `lider1` / `lider123`
2. Verifica que se escriben exactamente así
3. Verifica en el backend que esas credenciales existan

---

## 📊 Tabla de Troubleshooting

| Síntoma | Causa Probable | Solución |
|---------|---|---|
| Log no aparece en consola | DevTools no abierto o refresh necesario | Abrir DevTools con F12, hacer refresh |
| Todas las opciones visibles para LIDER | Token tiene "ADMIN" en lugar de "LIDER" | Verificar backend retorna rol correcto |
| Token no en localStorage | Login falló | Revisar respuesta del endpoint |
| No puedo hacer login | Backend no conecta | Verificar localhost:3000 esté corriendo |
| Credenciales incorrectas | Datos incorrectos | Usar admin/admin123 o lider1/lider123 |

---

## 🔐 Verificación de Seguridad

### ¿Qué valida el Backend?

El backend DEBE validar:

```typescript
// 1. El token es válido (no expirado, firma correcta)
// 2. El usuario existe
// 3. El usuario tiene el rol asignado
// 4. El usuario tiene permiso para la acción
```

### ¿Qué valida el Frontend?

El frontend SOLO valida:

```typescript
// 1. Decodifica el JWT (sin validar firma)
// 2. Lee el campo "role"
// 3. Muestra/oculta opciones en UI según el rol
```

**Nota Importante:** El frontend puede ser bypasseado. La verdadera seguridad está en el backend.

---

## 🎯 Casos de Prueba

### Test Case 1: Login ADMIN

```
PRECONDICIÓN:
  - Usuario no autenticado
  - Está en página de login

PASOS:
  1. Ingresar username: admin
  2. Ingresar password: admin123
  3. Hacer click en "Iniciar Sesión"

RESULTADOS ESPERADOS:
  ✅ Se redirige a /dashboard
  ✅ En consola aparece: "✅ Usuario autenticado: admin | Rol: ADMIN"
  ✅ Sidebar muestra 8 items (5 principales + 3 en submenú)
  ✅ localStorage tiene 'pspvote_token'
  ✅ Token decodificado tiene "role": "ADMIN"
```

### Test Case 2: Login LIDER

```
PRECONDICIÓN:
  - Usuario no autenticado
  - Está en página de login

PASOS:
  1. Ingresar username: lider1
  2. Ingresar password: lider123
  3. Hacer click en "Iniciar Sesión"

RESULTADOS ESPERADOS:
  ✅ Se redirige a /dashboard
  ✅ En consola aparece: "✅ Usuario autenticado: lider1 | Rol: LIDER"
  ✅ Sidebar muestra 2 items (Dashboard y Registro de Votos)
  ✅ localStorage tiene 'pspvote_token'
  ✅ Token decodificado tiene "role": "LIDER"
```

### Test Case 3: Logout

```
PRECONDICIÓN:
  - Usuario autenticado (ADMIN o LIDER)
  - Está en /dashboard

PASOS:
  1. Hacer scroll al final del sidebar
  2. Hacer click en "Cerrar Sesión"

RESULTADOS ESPERADOS:
  ✅ Se redirige a /
  ✅ localStorage NO tiene 'pspvote_token'
  ✅ localStorage NO tiene 'pspvote_user'
  ✅ Se puede volver a hacer login
```

### Test Case 4: Acceso Directo a Ruta Protegida (LIDER intenta ir a /dashboard/votantes)

```
PRECONDICIÓN:
  - Usuario LIDER autenticado
  - Está en /dashboard

PASOS:
  1. En la barra de direcciones, escribir: localhost:3000/dashboard/votantes
  2. Presionar Enter

RESULTADOS ESPERADOS:
  ✅ La página carga (porque NextJS es SPA)
  ⚠️ Pero NO aparece en el sidebar
  🔒 Al hacer petición API, backend rechaza (requiere ADMIN)
```

---

## 📝 Formato de Reporte de Error

Si algo no funciona, proporciona:

```markdown
## 🐛 Reporte de Error

**Descripción:**
[Describe qué esperabas vs qué sucedió]

**Pasos para reproducir:**
1. ...
2. ...
3. ...

**Rol probado:**
- [ ] ADMIN
- [ ] LIDER

**Información en Consola:**
```
[Copia el log de la consola aquí]
```

**LocalStorage:**
```javascript
localStorage.getItem('pspvote_token')
// [Pega el token aquí]
```

**Backend Status:**
- ¿Está corriendo? [ ] Sí [ ] No
- ¿En qué puerto? ____
- ¿Retorna token? [ ] Sí [ ] No

**Ambiente:**
- OS: [Windows/Mac/Linux]
- Navegador: [Chrome/Firefox/Safari]
- Node: [versión]
```

---

## ✅ Checklist Pre-Deploy

Antes de desplegar a producción:

- [ ] ADMIN ve todas las opciones
- [ ] LIDER ve solo Dashboard y Registro de Votos
- [ ] Logs en consola funcionan correctamente
- [ ] Token se guarda/limpia correctamente
- [ ] Logout funciona
- [ ] Refresh de página mantiene la sesión
- [ ] Backend valida roles en cada request
- [ ] Frontend no puede bypassear permisos (validación en API)
- [ ] No hay errores en console
- [ ] No hay warnings de TypeScript

---

## 🎓 Preguntas Frecuentes

**P: ¿Dónde se valida realmente la seguridad?**
R: En el backend. El frontend solo es UI. Siempre valida en el servidor.

**P: ¿Qué pasa si edito el token en localStorage?**
R: El backend lo rechazará porque la firma no será válida.

**P: ¿Qué pasa si alguien intenta acceder a `/dashboard/votantes` siendo LIDER?**
R: Puede acceder a la página, pero las requests API serán rechazadas por el backend.

**P: ¿Se puede extender a más roles?**
R: Sí, solo agrega más roles a los campos `requiredRole` en el sidebar.

**P: ¿Dónde viene el rol?**
R: Del backend en el JWT. El campo `role` en el payload.

---

## 🚀 Siguiente Paso

Una vez verificado que todo funciona:

1. Compartir el reporte con el equipo
2. Documentar en la wiki del proyecto
3. Considerar agregar más roles si es necesario
4. Implementar protección de rutas (Route Guards)

✅ **Testing completado exitosamente** 🎉
