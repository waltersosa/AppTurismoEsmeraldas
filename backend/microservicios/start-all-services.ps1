# Script para iniciar todos los microservicios
Write-Host "🚀 Iniciando todos los microservicios..." -ForegroundColor Green

# Función para iniciar un microservicio
function Start-Microservice {
    param(
        [string]$ServiceName,
        [string]$ServicePath
    )
    
    Write-Host "Iniciando $ServiceName..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ServicePath'; npm install; node index.js" -WindowStyle Normal
    Start-Sleep -Seconds 2
}

# Iniciar cada microservicio
$basePath = "C:\AppTurismoEsmeraldas\backend\microservicios"

Start-Microservice "AuthService" "$basePath\authservice"
Start-Microservice "PlacesService" "$basePath\placeservice"
Start-Microservice "ReviewsService" "$basePath\reviewservice"
Start-Microservice "MediaUploadService" "$basePath\mediaupload"
Start-Microservice "NotificationsService" "$basePath\notificationsservice"
Start-Microservice "StatsService" "$basePath\statservice"

Write-Host "✅ Todos los microservicios han sido iniciados" -ForegroundColor Green
Write-Host "📋 Puertos de los servicios:" -ForegroundColor Cyan
Write-Host "   - AuthService: http://localhost:3001" -ForegroundColor White
Write-Host "   - PlacesService: http://localhost:3002" -ForegroundColor White
Write-Host "   - ReviewsService: http://localhost:3003" -ForegroundColor White
Write-Host "   - MediaUploadService: http://localhost:3004" -ForegroundColor White
Write-Host "   - NotificationsService: http://localhost:3005" -ForegroundColor White
Write-Host "   - StatsService: http://localhost:3006" -ForegroundColor White 