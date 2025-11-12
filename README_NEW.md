# 🚛 FleetGuard360 - Sistema de Monitoreo Satelital

Sistema completo de gestión y monitoreo de flota vehicular con tracking GPS en tiempo real, desarrollado con Next.js, TypeScript y Tailwind CSS.

## 🌟 Características Principales

### 📡 Monitoreo en Tiempo Real
- Visualización GPS de toda la flota en mapa interactivo
- Actualización automática cada 15 segundos
- Alertas automáticas por exceso de velocidad
- Panel detallado de información por vehículo
- Dashboard con estadísticas en vivo

### 📊 Historial de Ubicaciones
- Consulta de rutas históricas con filtros avanzados
- Dashboard visual con métricas de distancia y velocidad
- Exportación de datos a CSV
- Análisis de paradas y tiempos de recorrido
- Mapas con trazado de rutas animadas

### 🚗 Gestión de Flota
- CRUD completo de vehículos
- Control de estados (activo/inactivo)
- Validación de datos con Zod
- Interfaz responsive y accesible

### 🔐 Sistema de Autenticación
- Roles diferenciados (Admin/Operator)
- Control de permisos por funcionalidad
- Contexto de autenticación persistente

## 🛠️ Tecnologías Utilizadas

- **Frontend:** Next.js 13, TypeScript, Tailwind CSS
- **Componentes UI:** Radix UI primitives
- **Formularios:** React Hook Form + Zod validation
- **Iconos:** Lucide React
- **Notificaciones:** Sonner (toast)
- **Estilo:** Tema oscuro personalizado

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar repositorio
git clone https://github.com/TU_USUARIO/FleetGuard360.git
cd FleetGuard360

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Acceso a la aplicación
- URL: `http://localhost:3000`
- **Usuario Admin:** admin@fleetguard.com (cualquier contraseña)
- **Usuario Operator:** operator@fleetguard.com (cualquier contraseña)

## 📱 Funcionalidades por Página

### `/fleet` - Gestión de Flota
- ✅ Crear, editar y eliminar vehículos
- ✅ Alternar estado activo/inactivo
- ✅ Tabla responsive con controles por roles

### `/monitoring` - Monitoreo en Tiempo Real
- ✅ Mapa interactivo con ubicaciones GPS
- ✅ Alertas de velocidad automáticas  
- ✅ Panel de información detallado
- ✅ Estadísticas en tiempo real

### `/history` - Historial de Ubicaciones
- ✅ Filtros por vehículo y fechas
- ✅ Visualización de rutas históricas
- ✅ Dashboard de métricas
- ✅ Exportación de datos

## 🗺️ Integración con Mapas

El sistema está preparado para integración con:
- **Google Maps API** (implementación incluida)
- **Mapbox** (componente alternativo)
- **OpenStreetMap** con Leaflet

Actualmente usa mapas simulados con rutas animadas para demostración.

## 📊 Datos Mock Incluidos

- 3 vehículos con ubicaciones en Bogotá
- Historial GPS de 7 días
- Alertas de velocidad simuladas
- Estadísticas de rendimiento

## 🔧 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run start    # Servidor de producción
npm run lint     # Linting con ESLint
```

## 📋 Estructura del Proyecto

```
├── app/                    # Páginas de Next.js 13 (App Router)
│   ├── fleet/             # Gestión de flota
│   ├── monitoring/        # Monitoreo en tiempo real
│   ├── history/           # Historial de ubicaciones
│   └── (auth)/            # Páginas de autenticación
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (Radix UI)
│   ├── VehicleTable.tsx  # Tabla de vehículos
│   ├── VehicleForm.tsx   # Formulario de vehículos
│   └── RealTimeTracking.tsx # Componentes de tracking
├── lib/                   # Utilidades y configuración
│   ├── models/           # Tipos TypeScript
│   ├── api/              # APIs mock
│   └── auth/             # Contexto de autenticación
└── hooks/                # Custom hooks
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

⭐ Si este proyecto te resulta útil, ¡dale una estrella en GitHub!