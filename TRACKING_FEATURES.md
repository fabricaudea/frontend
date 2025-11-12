# FleetGuard360 - Sistema de Monitoreo Satelital

Sistema completo de gestión y monitoreo de flota con tracking GPS en tiempo real.

## 🚀 Nuevas Funcionalidades Implementadas

### 🛰️ Monitoreo en Tiempo Real (`/monitoring`)
- **Visualización en mapa**: Ubicación de todos los vehículos en tiempo real
- **Actualización automática**: Datos actualizados cada 15 segundos
- **Panel de información**: Detalles del vehículo seleccionado (placa, modelo, velocidad, estado)
- **Alertas de velocidad**: Sistema de detección y notificación por exceso de velocidad
- **Dashboard de estadísticas**: Métricas en tiempo real (vehículos activos, velocidad promedio, alertas)

### 📊 Historial de Ubicaciones (`/history`)
- **Consulta de rutas**: Visualización de rutas históricas con filtros avanzados
- **Dashboard visual**: Estadísticas de distancia, tiempo, velocidades promedio y máximas
- **Filtros personalizables**: Por vehículo, rango de fechas, velocidad mínima
- **Tabla detallada**: Historial completo con paradas y métricas por vehículo
- **Exportación**: Función para exportar datos a CSV

### 🔔 Sistema de Alertas
- **Alertas de velocidad**: Detección automática cuando se supera el límite permitido
- **Clasificación por severidad**: Advertencias y alertas críticas
- **Panel de reconocimiento**: Posibilidad de reconocer alertas procesadas
- **Ubicación detallada**: Dirección exacta donde ocurrió la alerta

## 📁 Estructura de Archivos Nuevos

```
lib/
├── models/
│   └── tracking.ts          # Modelos para GPS, tracking y alertas
└── api/
    └── tracking.ts          # API mock para tracking GPS

components/
├── RealTimeTracking.tsx     # Componentes para monitoreo en tiempo real
└── LocationHistory.tsx      # Componentes para historial de ubicaciones

app/
├── monitoring/
│   └── page.tsx            # Página de Monitoreo en Tiempo Real
└── history/
    └── page.tsx            # Página de Historial de Ubicaciones
```

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 13, TypeScript, Tailwind CSS
- **Componentes UI**: Radix UI, Lucide Icons
- **Formas**: React Hook Form + Zod
- **Notificaciones**: Sonner (toast)
- **Mock API**: Simulación de datos GPS y tracking

## 🚦 Cómo Usar las Nuevas Funcionalidades

### Monitoreo en Tiempo Real
1. Navega a **Monitoreo en tiempo real** en el sidebar
2. Observa todos los vehículos en el mapa
3. Haz clic en cualquier marcador para ver información detallada
4. Las alertas de velocidad aparecen automáticamente en rojo
5. Los datos se actualizan cada 15 segundos automáticamente

### Historial de Ubicaciones
1. Navega a **Historial de ubicaciones** en el sidebar
2. Configura los filtros de fecha y vehículo deseados
3. Haz clic en "Aplicar Filtros" para cargar los datos
4. Revisa las estadísticas en las tarjetas superiores
5. Selecciona un vehículo en la lista lateral para ver su ruta
6. Usa la tabla inferior para análisis detallado
7. Exporta datos con el botón "Exportar CSV"

## 🔧 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Compilar proyecto
npm run build

# Iniciar en producción
npm start

# Script automatizado (PowerShell)
.\start-dev.ps1
```

## 📊 Datos Mock Incluidos

El sistema incluye datos simulados para:
- 3 vehículos con ubicaciones GPS en Bogotá
- Historial de posiciones de los últimos 7 días
- Alertas de velocidad simuladas
- Estadísticas de rendimiento de flota

## 🗺️ Integración con Google Maps

**Nota**: Las páginas están preparadas para integración con Google Maps. Para activar:

1. Obtener API Key de Google Maps
2. Instalar librería de Google Maps para React
3. Reemplazar los placeholders de mapa con componentes reales
4. Configurar marcadores y rutas dinámicas

## 🔐 Permisos y Roles

- **Admin**: Acceso completo a todas las funcionalidades
- **Operator**: Acceso a monitoreo y consulta de historial
- Las nuevas páginas respetan el sistema de roles existente

## 📱 Responsive Design

Ambas páginas están optimizadas para:
- ✅ Desktop (pantallas grandes)
- ✅ Tablet (pantallas medianas)  
- ✅ Mobile (pantallas pequeñas)
- ✅ Navegación adaptativa

## 🚀 Próximas Mejoras Sugeridas

1. **Integración real con Google Maps API**
2. **Conexión con APIs de tracking GPS reales**
3. **Notificaciones push para alertas críticas**
4. **Geofencing (cercas virtuales)**
5. **Reportes PDF automáticos**
6. **Dashboard de conductores**