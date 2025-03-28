# Test all Dockerfiles by building images
$services = @('user-service', 'event-service', 'booking-service', 'notification-service', 'client')

foreach ($service in $services) {
    Write-Host "`n`n=======================================" -ForegroundColor Green
    Write-Host "Building $service image" -ForegroundColor Green
    Write-Host "=======================================" -ForegroundColor Green
    
    Set-Location -Path "$PSScriptRoot\$service"
    docker build -t "event-booking/$service`:latest" .
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Successfully built $service image" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Failed to build $service image" -ForegroundColor Red
    }
}

# Return to the root directory
Set-Location -Path $PSScriptRoot

# List all built images
Write-Host "`n`n=======================================" -ForegroundColor Cyan
Write-Host "Built Images:" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
docker images | Select-String "event-booking" 