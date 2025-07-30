# Script para iniciar todos los microservicios
Write-Host "🧹 Limpiando procesos PM2 previos..." -ForegroundColor Cyan
pm2 stop all
pm2 delete all

Write-Host "🚀 Iniciando todos los microservicios con PM2..." -ForegroundColor Green

# Función para iniciar un microservicio con PM2
function Start-Microservice {
    param(
        [string]$ServiceName,
        [string]$ServicePath,
        [string]$ProcessName
    )
    Write-Host "Iniciando $ServiceName con PM2..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ServicePath'; npm install; pm2 start index.js --name $ProcessName --cwd '$ServicePath'" -WindowStyle Normal
    Start-Sleep -Seconds 2
}

# Iniciar cada microservicio con el nombre correcto
$basePath = "C:\AppTurismoEsmeraldas\backend\microservicios"

Start-Microservice "AuthService" "$basePath\authservice" "authservice"
Start-Microservice "PlacesService" "$basePath\placeservice" "placeservice"
Start-Microservice "ReviewsService" "$basePath\reviewservice" "reviewservice"
Start-Microservice "MediaUploadService" "$basePath\mediaupload" "mediaupload"
Start-Microservice "NotificationsService" "$basePath\notificationsservice" "notificationsservice"
Start-Microservice "StatsService" "$basePath\statservice" "statservice"

Write-Host "✅ Todos los microservicios han sido iniciados con PM2" -ForegroundColor Green
Write-Host "📋 Puertos de los servicios:" -ForegroundColor Cyan
Write-Host "   - AuthService: http://localhost:3001" -ForegroundColor White
Write-Host "   - PlacesService: http://localhost:3002" -ForegroundColor White
Write-Host "   - ReviewsService: http://localhost:3003" -ForegroundColor White
Write-Host "   - MediaUploadService: http://localhost:3003" -ForegroundColor White
Write-Host "   - NotificationsService: http://localhost:3006" -ForegroundColor White
Write-Host "   - StatsService: http://localhost:3005" -ForegroundColor White 