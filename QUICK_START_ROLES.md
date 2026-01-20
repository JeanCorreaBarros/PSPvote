# ⚡ Quick Start - Validación de Roles

## 🚀 Inicio Rápido en 5 minutos

### Paso 1: Asegúrate que el backend esté corriendo
```bash
# El backend debe estar en http://localhost:3000
# Debería tener los endpoints:
# - POST /api/auth/login
# - Con credenciales: admin/admin123 y lider1/lider123
```

### Paso 2: Inicia sesión como ADMIN
1. Ve a http://localhost:3000
2. Usa: `admin` / `admin123`
3. Presiona "Iniciar Sesión"

### Paso 3: Verifica en Consola
```
Presiona F12 y ve a la pestaña Console
Debería ver: ✅ Usuario autenticado: admin | Rol: ADMIN
```

### Paso 4: Verifica el Sidebar
```
Deberías ver estas opciones:
✅ Dashboard
✅ Registro de Votos
✅ Votantes
✅ Puestos de Votación
✅ Reportes
✅ Configuración
✅ Cerrar Sesión
```

### Paso 5: Prueba con LIDER
1. Haz logout
2. Inicia sesión con: `lider1` / `lider123`
3. Verifica que solo ves:
```
✅ Dashboard
✅ Registro de Votos
✅ Cerrar Sesión
```

---

## 🔍 Verificación Rápida

### ¿Funciona el rol?
- [ ] ADMIN ve todas las opciones
- [ ] LIDER ve solo 2 opciones
- [ ] Console muestra "Usuario autenticado" con el rol correcto

### ¿El token se guarda?
```javascript
// En la consola, copia y pega:
localStorage.getItem('pspvote_token')
// Debería mostrar el JWT
```

### ¿El rol está en el token?
```javascript
// En la consola, copia y pega:
JSON.parse(atob(localStorage.getItem('pspvote_token').split('.')[1])).role
// Debería mostrar: "ADMIN" o "LIDER"
```

---

## 📋 Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `lib/auth.ts` | ✅ Agregadas funciones getRoleFromToken() y decodeToken() |
| `components/sidebar.tsx` | ✅ Filtrado dinámico de menús |
| `app/dashboard/layout.tsx` | ✅ Validación y logs de rol |

---

## 🐛 Problemas Comunes

**P: No veo el log en la consola**
R: Abre DevTools (F12), ve a Console y haz refresh (F5)

**P: LIDER ve todas las opciones**
R: El backend está retornando "ADMIN" en lugar de "LIDER"

**P: No puedo hacer login**
R: Verifica que el backend esté corriendo en localhost:3000

**P: Las credenciales no funcionan**
R: Usa `admin`/`admin123` o `lider1`/`lider123`

---

## 📚 Documentación Completa

Para más detalles, lee:

1. **ROLE_VALIDATION.md** - Documentación técnica
2. **ROLE_VALIDATION_RESUMEN.md** - Resumen visual
3. **TESTING_VALIDACION_ROLES.md** - Guía de testing
4. **EJEMPLO_VALIDACION_ROLES.ts** - Ejemplos de código

---

## ✅ Listo para usar

La validación de roles está completamente implementada y lista para producción.

¡Disfruta! 🎉
