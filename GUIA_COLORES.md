# 🎨 Guía de Personalización de Colores - PSPVote

## Cómo Funciona el Sistema de Colores Dinámicos

PSPVote permite cambiar el esquema de colores de toda la aplicación modificando solo **3 valores de color** en el archivo `.env.local`.

---

## 📝 Variables de Entorno

### Ubicación
```
.env.local
```

### Variables Disponibles

```env
# Color Principal - Se usa en:
# - Botones principales
# - Headers y navbars
# - Sidebar activo
# - Links principales
# - Tabs activos
NEXT_PUBLIC_COLOR_PRIMARY=#3b82f6

# Color Secundario - Se usa en:
# - Acentos
# - Borders
# - Elementos secundarios
# - Fondos muted
NEXT_PUBLIC_COLOR_SECONDARY=#8b5cf6

# Color de Énfasis - Se usa en:
# - Badges
# - Estados destacados
# - Highlights
# - Elementos de atención
NEXT_PUBLIC_COLOR_ACCENT=#ec4899
```

---

## 🎯 Esquemas Predefinidos

### 1. 🔵 Azul Moderno (Default)
Perfecto para: Gobierno, Instituciones, Corporativo

```env
NEXT_PUBLIC_COLOR_PRIMARY=#3b82f6
NEXT_PUBLIC_COLOR_SECONDARY=#1e40af
NEXT_PUBLIC_COLOR_ACCENT#06b6d4
```

**Aplicación Real:**
- Primary: Azul claro (#3b82f6)
- Secondary: Azul oscuro (#1e40af)
- Accent: Cian (#06b6d4)

### 2. 🟢 Verde Amigable
Perfecto para: ONG, Ambiental, Educativo

```env
NEXT_PUBLIC_COLOR_PRIMARY=#22c55e
NEXT_PUBLIC_COLOR_SECONDARY=#16a34a
NEXT_PUBLIC_COLOR_ACCENT=#10b981
```

**Aplicación Real:**
- Primary: Verde claro (#22c55e)
- Secondary: Verde oscuro (#16a34a)
- Accent: Verde menta (#10b981)

### 3. 🔴 Rojo Corporativo
Perfecto para: Empresas, Comercial, Energía

```env
NEXT_PUBLIC_COLOR_PRIMARY=#ef4444
NEXT_PUBLIC_COLOR_SECONDARY=#dc2626
NEXT_PUBLIC_COLOR_ACCENT=#f97316
```

**Aplicación Real:**
- Primary: Rojo claro (#ef4444)
- Secondary: Rojo oscuro (#dc2626)
- Accent: Naranja (#f97316)

### 4. 🟣 Morado Moderno
Perfecto para: Tech, Startups, Innovación

```env
NEXT_PUBLIC_COLOR_PRIMARY=#a855f7
NEXT_PUBLIC_COLOR_SECONDARY=#9333ea
NEXT_PUBLIC_COLOR_ACCENT=#d946ef
```

**Aplicación Real:**
- Primary: Morado claro (#a855f7)
- Secondary: Morado oscuro (#9333ea)
- Accent: Magenta (#d946ef)

### 5. 🟠 Naranja Energético
Perfecto para: Eventos, Entretenimiento, Dinámico

```env
NEXT_PUBLIC_COLOR_PRIMARY=#f97316
NEXT_PUBLIC_COLOR_SECONDARY=#ea580c
NEXT_PUBLIC_COLOR_ACCENT=#fb923c
```

**Aplicación Real:**
- Primary: Naranja (#f97316)
- Secondary: Naranja oscuro (#ea580c)
- Accent: Naranja claro (#fb923c)

### 6. 🔵 Índigo Elegante
Perfecto para: Finanzas, Premium, Lujo

```env
NEXT_PUBLIC_COLOR_PRIMARY=#4f46e5
NEXT_PUBLIC_COLOR_SECONDARY#3730a3
NEXT_PUBLIC_COLOR_ACCENT=#6366f1
```

**Aplicación Real:**
- Primary: Índigo (#4f46e5)
- Secondary: Índigo oscuro (#3730a3)
- Accent: Índigo claro (#6366f1)

### 7. 🌺 Rosa Moderno
Perfecto para: Salud, Bienestar, Comunidad

```env
NEXT_PUBLIC_COLOR_PRIMARY=#ec4899
NEXT_PUBLIC_COLOR_SECONDARY=#be185d
NEXT_PUBLIC_COLOR_ACCENT=#f43f5e
```

**Aplicación Real:**
- Primary: Rosa (#ec4899)
- Secondary: Rosa oscuro (#be185d)
- Accent: Rojo rosa (#f43f5e)

### 8. 🔴 Rojo Clásico
Perfecto para: Elecciones, Política, Formal

```env
NEXT_PUBLIC_COLOR_PRIMARY=#dc2626
NEXT_PUBLIC_COLOR_SECONDARY=#991b1b
NEXT_PUBLIC_COLOR_ACCENT#b91c1c
```

**Aplicación Real:**
- Primary: Rojo (#dc2626)
- Secondary: Rojo muy oscuro (#991b1b)
- Accent: Rojo oscuro (#b91c1c)

---

## 🎨 Cómo Cambiar los Colores

### Paso 1: Abrir `.env.local`
```bash
# En VS Code
code .env.local

# O en cualquier editor de texto
nano .env.local
```

### Paso 2: Modificar los 3 valores
```env
# Cambiar de esto:
NEXT_PUBLIC_COLOR_PRIMARY=#3b82f6
NEXT_PUBLIC_COLOR_SECONDARY=#8b5cf6
NEXT_PUBLIC_COLOR_ACCENT=#ec4899

# A esto (ejemplo con Verde):
NEXT_PUBLIC_COLOR_PRIMARY=#22c55e
NEXT_PUBLIC_COLOR_SECONDARY=#16a34a
NEXT_PUBLIC_COLOR_ACCENT=#10b981
```

### Paso 3: Guardar archivo
- Ctrl+S (Windows/Linux)
- Cmd+S (Mac)

### Paso 4: Reiniciar servidor
```bash
# Presionar Ctrl+C para detener
# Luego ejecutar:
npm run dev
```

### ⏱️ Tiempo de aplicación
**3-5 segundos** - Los cambios se aplican automáticamente

---

## 🔍 Dónde se Aplican los Colores

### Primary Color (#3b82f6)
Estos elementos usan el color PRIMARY:

```
┌─────────────────────────────────┐
│  🎯 BOTONES PRINCIPALES          │
│  - Guardar, Enviar              │
│  - Crear nuevo                   │
│  - Acciones primarias            │
├─────────────────────────────────┤
│  📱 HEADER/NAVBAR               │
│  - Fondo del header             │
│  - Logo y título                │
├─────────────────────────────────┤
│  📊 SIDEBAR                     │
│  - Item activo                  │
│  - Hover states                 │
├─────────────────────────────────┤
│  🔗 LINKS                       │
│  - Enlaces destacados           │
│  - Breadcrumbs activos          │
├─────────────────────────────────┤
│  ✨ OTROS                       │
│  - Focus rings                  │
│  - Input focus                  │
│  - Checkboxes                   │
└─────────────────────────────────┘
```

### Secondary Color (#8b5cf6)
Estos elementos usan el color SECONDARY:

```
┌─────────────────────────────────┐
│  🎨 ACENTOS                     │
│  - Bordes destacados            │
│  - Líneas divisoras             │
├─────────────────────────────────┤
│  📋 ELEMENTOS SECUNDARIOS       │
│  - Botones secundarios          │
│  - Links secundarios            │
├─────────────────────────────────┤
│  🎭 ESTADOS                     │
│  - Hover secundario             │
│  - Disabled estados             │
├─────────────────────────────────┤
│  📊 FONDOS                      │
│  - Muted backgrounds            │
│  - Cards secundarias            │
└─────────────────────────────────┘
```

### Accent Color (#ec4899)
Estos elementos usan el color ACCENT:

```
┌─────────────────────────────────┐
│  🏷️ BADGES                      │
│  - Estados activos              │
│  - Etiquetas importantes        │
├─────────────────────────────────┤
│  ⭐ HIGHLIGHTS                  │
│  - Elementos destacados         │
│  - Notificaciones              │
├─────────────────────────────────┤
│  🔴 ÉNFASIS                     │
│  - Botones peligrosos           │
│  - Alertas críticas             │
├─────────────────────────────────┤
│  📍 INDICADORES                 │
│  - Puntos de atención           │
│  - Status indicators            │
└─────────────────────────────────┘
```

---

## 💡 Tips para Elegir Colores

### 1. Considera el Contexto
- **Gubernamental/Político**: Azul, Rojo clásico
- **ONG/Educativo**: Verde, Azul cielo
- **Corporativo**: Índigo, Gris + color
- **Tech/Startups**: Morado, Rosa, Cian
- **Eventos**: Naranja, Rojo energético

### 2. Asegura Contraste
- Los colores deben ser legibles en fondo blanco y oscuro
- Usa [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### 3. Mantén Coherencia
- **Primary**: El color más usado, debe ser el protagonista
- **Secondary**: Complemento, tono más oscuro o variación
- **Accent**: Diferente al primary, para contrastar

### 4. Prueba en Diferentes Pantallas
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

### 5. Herramientas Recomendadas
- [Coolors.co](https://coolors.co) - Generador de paletas
- [Color.adobe.com](https://color.adobe.com) - Adobe Color
- [Tailwind Color Generator](https://uicolors.app) - Tailwind específico
- [Accessible Colors](https://accessible-colors.com) - Contraste

---

## 📊 Ejemplos de Cambios en Tiempo Real

### Antes (Azul Default)
```
Botón: Azul #3b82f6
Header: Azul #3b82f6
Badges: Rosa #ec4899
Links: Azul #3b82f6
```

### Después (Verde)
```
Botón: Verde #22c55e
Header: Verde #22c55e
Badges: Verde menta #10b981
Links: Verde #22c55e
```

**Resultado:** Toda la aplicación se ve verde sin cambiar código

---

## 🔧 Solución de Problemas

### Los cambios no se aplican
1. Verificar que `.env.local` está guardado
2. Reiniciar servidor (`Ctrl+C` → `npm run dev`)
3. Refrescar navegador (`F5`)
4. Limpiar caché del navegador

### Colores no se ven bien
1. Usar colores de la gama Tailwind
2. Evitar colores muy claros o oscuros
3. Verificar contraste con [WCAG](https://www.w3.org/WAI/WCAG21/quickref/)

### Algunos elementos no cambian
1. Pueden tener colores hardcodeados
2. Crear issue en GitHub
3. Contactar al desarrollador

---

## 🎓 Entendiendo Códigos HEX

```
#3b82f6
│││││││
││└─┘││ = FF (255 en decimal) = Rojo
│└────┘│ = 82 (130 en decimal) = Verde
└──────┘ = F6 (246 en decimal) = Azul

Resultado: RGB(59, 130, 246) = Azul claro
```

### Paleta Tailwind (Recomendada)
```
Color    | HEX Code | Nombre
---------|----------|----------------
Azul     | #3b82f6  | Blue-500
Rojo     | #ef4444  | Red-500
Verde    | #22c55e  | Green-500
Morado   | #a855f7  | Purple-500
Naranja  | #f97316  | Orange-500
Índigo   | #4f46e5  | Indigo-500
Amarillo | #eab308  | Yellow-500
Rosa     | #ec4899  | Pink-500
```

---

## 📱 Visualización por Sección

### 🔐 Página de Login
- Fondo: Blanco
- Botón: PRIMARY
- Links: PRIMARY
- Texto secundario: SECONDARY

### 📊 Dashboard
- Header: PRIMARY
- Tarjetas: Blanco/Gris
- Botones: PRIMARY
- Badges: ACCENT
- Gráficos: PRIMARY, SECONDARY, ACCENT

### 👥 Votantes
- Buttons: PRIMARY
- Badges de estado: ACCENT
- Headers: PRIMARY
- Borders: SECONDARY

### 📈 Reportes
- Gráficos: PRIMARY, SECONDARY
- Botones de descarga: PRIMARY
- Elementos destacados: ACCENT

---

## 🚀 Próximos Pasos

1. **Elige tu esquema** de la lista de esquemas predefinidos
2. **Actualiza `.env.local`** con los 3 colores
3. **Reinicia servidor** (`npm run dev`)
4. **Verifica cambios** en todas las vistas
5. **Ajusta si es necesario** hasta que quede perfecto

---

## 📞 Soporte

¿Problemas con los colores?
- 📧 Email: support@pspvote.com
- 🐛 GitHub Issues
- 📖 Documentación completa en README.md

---

**Última actualización:** 18 de Enero, 2026
