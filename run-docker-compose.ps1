# Set Docker API Version
$env:COMPOSE_API_VERSION = "1.40"
$env:DOCKER_API_VERSION = "1.40"

# Display current configuration
Write-Host "Setting Docker API Version to: $env:DOCKER_API_VERSION" -ForegroundColor Cyan

# Test docker-compose with the specified API version
Write-Host "`nValidating docker-compose.yml..." -ForegroundColor Green
docker-compose config

if ($LASTEXITCODE -eq 0) {
    Write-Host "`ndocker-compose.yml is valid!" -ForegroundColor Green
    
    # Ask for user confirmation to run docker-compose up
    $runCompose = Read-Host "`nDo you want to start the services with docker-compose up? (y/n)"
    
    if ($runCompose -eq "y") {
        Write-Host "`nStarting services..." -ForegroundColor Green
        docker-compose up -d
    }
} else {
    Write-Host "`ndocker-compose.yml has errors." -ForegroundColor Red
} 