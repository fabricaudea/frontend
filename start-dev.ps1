# Script para iniciar la aplicación en modo desarrollo
Write-Host "🚀 Iniciando aplicación FleetGuard en modo desarrollo..." -ForegroundColor Green

# Verificar si node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

# Iniciar servidor de desarrollo
Write-Host "🔧 Iniciando servidor de desarrollo en http://localhost:3000" -ForegroundColor Cyan
npm run dev