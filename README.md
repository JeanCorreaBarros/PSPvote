# 🗳️ PSPVote - Sistema Integral de Votaciones

**Desarrollado por:** Jean Carlos Correa Barros

---

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características Principales](#características-principales)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Uso](#uso)
- [Personalización de Colores](#personalización-de-colores)
- [API Integration](#api-integration)
- [Documentación Técnica](#documentación-técnica)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

---

## 🎯 Descripción General

**PSPVote** es un sistema web moderno y profesional diseñado para gestionar procesos electorales completos. Desde el registro de votantes hasta la generación de reportes en tiempo real, PSPVote proporciona herramientas intuitivas y potentes para administradores y supervisores de votaciones.

### Objetivo Principal
Facilitar la gestión integral de procesos electorales mediante una plataforma web segura, escalable y de fácil uso.

### Casos de Uso
- 🏛️ Elecciones municipales y regionales
- 🏢 Votaciones empresariales
- 🎓 Procesos de elección estudiantil
- 📊 Consultas democráticas

---

## ✨ Características Principales

### 🔐 Autenticación y Seguridad
- Sistema de login seguro
- Gestión de sesiones
- Control de acceso basado en roles
- Protección de datos sensibles

### 👥 Gestión de Votantes
- Registro y administración de votantes
- Búsqueda y filtrado avanzado
- Importación de listas de votantes
- Seguimiento del estado de votación
- Información completa: cédula, teléfono, dirección, estado

### 🏘️ Administración de Puestos de Votación
- Creación y gestión de puestos
- Información de ubicación y contacto
- Número de mesas y votantes por puesto
- Estado operativo (activo/inactivo)
- Horarios de funcionamiento

### 📝 Registro de Votos
- Interfaz intuitiva para registrar votos
- Validación en tiempo real
- Historial completo de votaciones
- Estados: registrado, verificado, pendiente
- Timestamp automático de cada voto

### 📊 Reportes y Análisis
- Resumen general de votación
- Estadísticas por puesto
- Análisis demográfico (género, edad)
- Tasa de participación
- Exportación a CSV y PDF
- Gráficos interactivos

### ⚙️ Configuración del Sistema
- Personalización de datos del evento
- Información de contacto del administrador
- Horarios de votación
- Preferencias de notificaciones
- Configuración de seguridad

### 🎨 Personalización Dinámica
- Cambio de colores desde `.env`
- Tema consistente en toda la aplicación
- 3 colores principales personalizables:
  - **Primary**: Color principal de la UI
  - **Secondary**: Color secundario y acentos
  - **Accent**: Color de énfasis y destacados

### 🚀 Interfaz Moderna
- Diseño responsive (mobile, tablet, desktop)
- Animaciones fluidas con Framer Motion
- Componentes reutilizables
- Dark mode compatible
- Iconografía intuitiva

---

## 📋 Requisitos Previos

Antes de instalar PSPVote, asegúrate de tener:

- **Node.js** v18.0 o superior
- **npm** o **pnpm** como gestor de paquetes
- **Git** para control de versiones
- Un editor de código (VS Code recomendado)

### Verificar Versiones
```bash
node --version    # v18.x.x o superior
npm --version     # 9.x.x o superior
```

---

## 📦 Instalación

### 1. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd pspvote
```

### 2. Instalar Dependencias
```bash
npm install
# o si usas pnpm
pnpm install
```

### 3. Configurar Variables de Entorno
```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores:
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

# Theme Colors
NEXT_PUBLIC_COLOR_PRIMARY=#3b82f6
NEXT_PUBLIC_COLOR_SECONDARY=#8b5cf6
NEXT_PUBLIC_COLOR_ACCENT=#ec4899
```

### 4. Iniciar el Servidor de Desarrollo
```bash
npm run dev
# o con pnpm
pnpm dev
```

La aplicación estará disponible en `http://localhost:3000`

---

## ⚙️ Configuración

### Variables de Entorno

#### 🌐 API Configuration
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```
Define la URL base del backend para todos los consumos de API.

#### 🎨 Colores de la Aplicación

**Primary Color** - Color principal (botones, headers, sidebar)
```env
NEXT_PUBLIC_COLOR_PRIMARY=#3b82f6
```

**Secondary Color** - Color secundario (acentos, borders)
```env
NEXT_PUBLIC_COLOR_SECONDARY=#8b5cf6
```

**Accent Color** - Color de énfasis (highlights, badges)
```env
NEXT_PUBLIC_COLOR_ACCENT=#ec4899
```

### Ejemplos de Esquemas de Color

**Esquema Azul (Default)**
```env
NEXT_PUBLIC_COLOR_PRIMARY=#3b82f6
NEXT_PUBLIC_COLOR_SECONDARY=#1e40af
NEXT_PUBLIC_COLOR_ACCENT=#06b6d4
```

**Esquema Verde (Amigable)**
```env
NEXT_PUBLIC_COLOR_PRIMARY=#22c55e
NEXT_PUBLIC_COLOR_SECONDARY=#16a34a
NEXT_PUBLIC_COLOR_ACCENT=#10b981
```

**Esquema Rojo (Corporativo)**
```env
NEXT_PUBLIC_COLOR_PRIMARY=#ef4444
NEXT_PUBLIC_COLOR_SECONDARY#dc2626
NEXT_PUBLIC_COLOR_ACCENT=#f97316
```

**Esquema Morado (Moderno)**
```env
NEXT_PUBLIC_COLOR_PRIMARY=#a855f7
NEXT_PUBLIC_COLOR_SECONDARY#9333ea
NEXT_PUBLIC_COLOR_ACCENT=#d946ef
```

---

## 📁 Estructura del Proyecto

```
pspvote/
├── app/
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Login/Página inicial
│   ├── globals.css             # Estilos globales
│   └── dashboard/
│       ├── layout.tsx          # Layout del dashboard
│       ├── page.tsx            # Dashboard principal
│       ├── votantes/           # Gestión de votantes
│       ├── puestos/            # Gestión de puestos
│       ├── registro-votos/     # Registro de votaciones
│       ├── reportes/           # Reportes y análisis
│       └── configuracion/      # Configuración del sistema
│
├── components/
│   ├── header.tsx              # Header/Navbar
│   ├── sidebar.tsx             # Menú lateral
│   ├── theme-provider.tsx      # Proveedor de temas
│   ├── color-theme-provider.tsx # Inyector de colores dinámicos
│   └── ui/                     # Componentes Shadcn/UI
│
├── hooks/
│   ├── use-api.ts              # Hook para consumo de API
│   ├── use-mobile.ts           # Detección de dispositivo móvil
│   └── use-toast.ts            # Notificaciones
│
├── lib/
│   ├── api.ts                  # Servicio centralizado de API
│   ├── theme.ts                # Configuración de temas
│   └── utils.ts                # Utilidades generales
│
├── public/                     # Archivos estáticos
├── styles/                     # Estilos adicionales
│
├── .env.local                  # Variables de entorno (local)
├── .env.example                # Plantilla de variables
├── next.config.mjs             # Configuración Next.js
├── tsconfig.json               # Configuración TypeScript
├── tailwind.config.ts          # Configuración Tailwind CSS
└── package.json                # Dependencias del proyecto
```

---

## 🚀 Uso

### Acceder a la Aplicación

1. **Login**
   - Navega a `http://localhost:3000`
   - Ingresa credenciales (demo disponible)

2. **Dashboard Principal**
   - Vista de resumen de votaciones
   - Acceso rápido a todas las funciones

3. **Gestionar Votantes**
   - Ir a: Dashboard → Votantes
   - Ver lista completa de votantes
   - Buscar, filtrar, agregar, editar, eliminar

4. **Administrar Puestos**
   - Ir a: Dashboard → Puestos
   - Configurar ubicaciones de votación
   - Asignar mesas y votantes

5. **Registrar Votos**
   - Ir a: Dashboard → Registro de Votos
   - Registrar y verificar votos
   - Validación en tiempo real

6. **Ver Reportes**
   - Ir a: Dashboard → Reportes
   - Análisis completo de participación
   - Exportar datos a CSV/PDF

7. **Configurar Sistema**
   - Ir a: Dashboard → Configuración
   - Personalizar datos del evento
   - Gestionar preferencias

---

## 🎨 Personalización de Colores

### Cambiar Colores Globales

1. **Abrir `.env.local`**
   ```bash
   nano .env.local
   ```

2. **Modificar los 3 valores de color**
   ```env
   NEXT_PUBLIC_COLOR_PRIMARY=#tu-color-primario
   NEXT_PUBLIC_COLOR_SECONDARY=#tu-color-secundario
   NEXT_PUBLIC_COLOR_ACCENT=#tu-color-acento
   ```

3. **Guardar y reiniciar servidor**
   ```bash
   npm run dev
   ```

4. **Los colores se aplicarán automáticamente** en:
   - Botones
   - Headers y sidebars
   - Badges y etiquetas
   - Inputs y formularios
   - Links y textos destacados
   - Estados y validaciones

### Generador de Paletas
Recomendamos usar herramientas como:
- [Coolors.co](https://coolors.co)
- [Color.adobe.com](https://color.adobe.com)
- [Tailwind Color Generator](https://uicolors.app)

---

## 🔌 API Integration

### Endpoints Esperados

El backend debe implementar los siguientes endpoints:

#### Votantes
```
GET    /api/votantes              # Obtener todos
POST   /api/votantes              # Crear nuevo
PUT    /api/votantes/{id}         # Actualizar
DELETE /api/votantes/{id}         # Eliminar
```

#### Puestos
```
GET    /api/puestos
POST   /api/puestos
PUT    /api/puestos/{id}
DELETE /api/puestos/{id}
```

#### Votos
```
GET    /api/votos
POST   /api/votos
PUT    /api/votos/{id}
DELETE /api/votos/{id}
```

#### Reportes
```
GET    /api/reportes/resumen
GET    /api/reportes/por-puesto
GET    /api/reportes/por-genero
GET    /api/reportes/por-edad
GET    /api/reportes/export-csv
GET    /api/reportes/export-pdf
```

#### Configuración
```
GET    /api/configuracion
PUT    /api/configuracion
```

### Consumo de API en Componentes

```typescript
import { votantesApi } from '@/lib/api'

export function MiComponente() {
  useEffect(() => {
    const fetchVotantes = async () => {
      try {
        const data = await votantesApi.getAll()
        setVotantes(data)
      } catch (error) {
        console.error('Error:', error)
      }
    }
    
    fetchVotantes()
  }, [])
}
```

Ver `API_INTEGRATION_GUIDE.md` para documentación completa.

---

## 📚 Documentación Técnica

### Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|----------|
| **Next.js** | 15+ | Framework React |
| **React** | 19+ | Librería UI |
| **TypeScript** | 5+ | Tipado estático |
| **Tailwind CSS** | 3.4+ | Estilos CSS |
| **Framer Motion** | 11+ | Animaciones |
| **Shadcn/UI** | Latest | Componentes UI |
| **Lucide React** | 0.x | Iconografía |

### Guías de Desarrollo

- [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md) - Guía completa de integración de API
- [SETUP_API.md](./SETUP_API.md) - Setup de API y próximos pasos
- [TYPES_API.ts](./TYPES_API.ts) - Definición de tipos esperados
- [EJEMPLO_VISUAL.md](./EJEMPLO_VISUAL.md) - Ejemplos visuales de implementación

### Comandos Útiles

```bash
# Desarrollo
npm run dev                 # Iniciar servidor de desarrollo

# Build
npm run build              # Compilar para producción
npm run start              # Iniciar servidor en producción

# Linting y Formatting
npm run lint               # Verificar errores de código

# TypeScript
npm run type-check         # Verificar tipos TS
```

---

## 👥 Contribuciones

### Reportar Bugs
Si encuentras un bug, por favor:
1. Verificar que no esté reportado ya
2. Incluir pasos para reproducir
3. Describir el comportamiento esperado vs actual
4. Adjuntar screenshots si es relevante

### Sugerencias de Mejora
Las sugerencias son bienvenidas. Por favor crear un issue con:
- Descripción clara de la mejora
- Caso de uso
- Beneficios esperados

### Pull Requests
1. Fork el repositorio
2. Crear rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT.

Ver archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**Jean Carlos Correa Barros**

- GitHub: [@jeancarlos](https://github.com)
- Email: jeancarlos@example.com
- LinkedIn: [jean-carlos-correa](https://linkedin.com)

---

## 🤝 Soporte

Para soporte y consultas:
- 📧 Email: support@pspvote.com
- 💬 Issues en GitHub
- 📖 Documentación en Wiki

---

## 🙏 Agradecimientos

Agradecimientos especiales a:
- [Vercel](https://vercel.com) por Next.js y hospedaje
- [Shadcn](https://shadcn.com) por los componentes UI
- [Tailwind Labs](https://tailwindlabs.com) por Tailwind CSS
- La comunidad open source

---

**Última actualización:** 18 de Enero, 2026

**Versión:** 1.0.0

---

## 📊 Estadísticas del Proyecto

- 📝 **Líneas de código:** 5,000+
- 🧩 **Componentes:** 30+
- 🔧 **Hooks personalizados:** 3+
- 📚 **Vistas:** 6+
- 🎨 **Estilos:** CSS + Tailwind
- ⚡ **Performance:** Optimizado

---

## 🔄 Roadmap Futuro

- [ ] Autenticación con OAuth
- [ ] Exportación a Excel avanzada
- [ ] Gráficos en tiempo real
- [ ] Sistema de notificaciones por email
- [ ] Auditoría y logs
- [ ] Backup automático
- [ ] API Documentation con Swagger
- [ ] Mobile app (React Native)
- [ ] Soporte multi-idioma
- [ ] Dashboard con WebSockets

---

**¡Gracias por usar PSPVote!** 🗳️
