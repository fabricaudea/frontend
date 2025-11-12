# FleetGuard360 - Sistema de Gestión de Flotas

Sistema integral para la gestión y monitoreo de flotas vehiculares desarrollado con Next.js 14, TypeScript, TailwindCSS y shadcn/ui.

## 🚀 Características

- **Autenticación por roles**: Sistema de login con roles diferenciados (admin/operator)
- **Gestión de vehículos**: CRUD completo con validaciones (Alta, Edición, Baja)
- **Interfaz responsive**: Diseño adaptativo mobile-first
- **Accesibilidad AA**: Cumple estándares de accesibilidad web
- **UI moderna**: Tema oscuro con componentes shadcn/ui
- **Preparado para API**: Servicios mock fáciles de conectar a API real

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: TailwindCSS + tailwindcss-animate
- **Componentes**: shadcn/ui (Radix UI)
- **Íconos**: Lucide React
- **Formularios**: React Hook Form + Zod
- **Notificaciones**: Sonner (integrado con shadcn/ui)

## 🏗️ Estructura del Proyecto

```
/app
  /(auth)/login/          # Página de login
  /fleet/                 # Gestión de flota (CRUD)
  /alerts/                # Dashboard de alertas
  /(errors)/forbidden/    # Página 403
  /layout.tsx
  /page.tsx
  /globals.css

/components
  /ui/                    # Componentes shadcn/ui
  NavBar.tsx              # Barra de navegación
  SideBar.tsx             # Menú lateral
  VehicleTable.tsx        # Tabla de vehículos
  VehicleForm.tsx         # Formulario CRUD
  ConfirmDialog.tsx       # Modal de confirmación
  RoleGuard.tsx           # Control de permisos
  EmptyState.tsx          # Estados vacíos

/lib
  /api/
    http.ts               # Helper para fetch
    vehicles.ts           # Servicios de vehículos (mock)
    auth.ts               # Servicios de autenticación
  /auth/
    context.tsx           # Contexto de autenticación
  /models/
    vehicle.ts            # Tipos TypeScript
  utils.ts                # Utilidades generales
```

## 🚦 Cómo ejecutar

### Requisitos
- Node.js 18+ 
- npm, yarn, pnpm o bun

### Instalación

1. **Clona el repositorio** (o usa los archivos proporcionados)
2. **Instala dependencias**:
   ```bash
   npm install
   ```

3. **Ejecuta el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Abre tu navegador** en [http://localhost:3000](http://localhost:3000)

### Scripts disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción  
npm run start    # Servidor de producción
npm run lint     # Linter ESLint
```

## 👤 Credenciales de Prueba

### Administrador (acceso completo)
- **Email**: `admin@demo.com`
- **Contraseña**: `Admin123`
- **Permisos**: CRUD completo de vehículos, acceso a todas las secciones

### Operador (solo lectura)
- **Email**: `operador@demo.com`
- **Contraseña**: `Operador123`
- **Permisos**: Solo lectura de flota y alertas

## 🔐 Sistema de Roles

### Admin
- ✅ Crear, editar y eliminar vehículos
- ✅ Acceso a gestión de flota
- ✅ Acceso a alertas
- ✅ Navegación completa

### Operator  
- ✅ Ver lista de vehículos (solo lectura)
- ✅ Acceso a alertas
- ❌ No puede modificar vehículos
- ❌ Botones deshabilitados con tooltips informativos

## 🌐 Variables de Entorno

Crea un archivo `.env.local` (opcional):

```env
# URL base de la API (cuando conectes a backend real)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

## 📱 Funcionalidades

### Gestión de Flota (/fleet)
- **Tabla responsive** con scroll horizontal en móvil
- **Estados de carga** (loading, empty, error)
- **CRUD completo** para administradores
- **Solo lectura** para operadores
- **Validaciones** con React Hook Form + Zod
- **Confirmación de eliminación** con modal destructivo

### Alertas (/alerts)
- **Dashboard** con métricas en tiempo real (mock)
- **Lista de alertas** con severidades y ubicaciones
- **Responsive** con cards adaptativas

### Autenticación
- **Login seguro** con validación de campos
- **Redirección automática** según rol
- **Sesión persistente** en localStorage
- **Logout** desde sidebar

## 🎨 Diseño y UX

### Tema Oscuro
- Fondo: `gray-950` (casi negro)
- Cards: `gray-900` con bordes `gray-800`
- Texto: Escala de grises con contraste AA (4.5:1 mínimo)
- Primario: Azul (`blue-600`)
- Destructivo: Rojo (`red-600`)

### Responsive Design
- **Mobile**: Sidebar como drawer, tabla con scroll horizontal
- **Tablet**: Sidebar colapsable, layout optimizado  
- **Desktop**: Sidebar fija, tabla completa

### Accesibilidad
- **Navegación por teclado** completa
- **Focus visible** en todos los elementos interactivos
- **Labels** descriptivos en formularios
- **ARIA labels** en botones e iconos
- **Contraste AA** cumplido en todos los elementos
- **Tooltips informativos** en acciones deshabilitadas

## 🔌 Preparado para API Real

### Servicios Mock Actuales
Los archivos en `/lib/api/` contienen implementaciones mock que simulan:
- **Latencia de red** (400-700ms)
- **Errores aleatorios** (10% probabilidad)
- **Datos persistentes** durante la sesión

### Migración a API Real
Para conectar a una API real, solo necesitas:

1. **Configurar la URL base**:
   ```typescript
   // lib/api/http.ts
   const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
   ```

2. **Reemplazar implementaciones mock**:
   ```typescript
   // lib/api/vehicles.ts
   export async function listVehicles(): Promise<Vehicle[]> {
     return http<Vehicle[]>('/vehicles');
   }
   ```

3. **Mantener la misma interfaz** - toda la UI seguirá funcionando

## 🧪 Estados y Casos de Uso

### Estados de la Aplicación
- ✅ **Loading**: Skeletons en tabla y formularios
- ✅ **Empty**: Estado vacío con CTA para crear vehículo
- ✅ **Error**: Mensajes de error con botón de reintento
- ✅ **Success**: Toasts de confirmación para acciones

### Validaciones
- **Placa**: Requerida, máximo 10 caracteres
- **Modelo**: Requerido, máximo 50 caracteres  
- **Capacidad**: Número entero, 1-999 pasajeros
- **Estado**: Activo/Inactivo (enum)

## 🚀 Siguientes Pasos

Una vez conectado a una API real, podrías agregar:

- **Filtros y búsqueda** en la tabla
- **Paginación** para grandes conjuntos de datos
- **Exportación** de reportes (PDF/Excel)
- **Notificaciones push** para alertas críticas
- **Mapas interactivos** para ubicación en tiempo real
- **Dashboard analítico** con charts y métricas
- **Gestión de usuarios** y permisos granulares

## 📄 Licencia

Proyecto de demostración para FleetGuard360 - Sistema de Gestión de Flotas.

---

**Nota**: Esta aplicación utiliza datos mock para demostración. La UI está completamente preparada para conectar con una API REST real sin cambios en la interfaz de usuario.