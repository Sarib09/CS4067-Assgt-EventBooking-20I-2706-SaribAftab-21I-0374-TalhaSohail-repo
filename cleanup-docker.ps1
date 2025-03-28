# Set Docker API Version to ensure compatibility
$env:COMPOSE_API_VERSION = "1.40"
$env:DOCKER_API_VERSION = "1.40"

Write-Host "Setting Docker API Version to: $env:DOCKER_API_VERSION" -ForegroundColor Cyan
Write-Host "Starting Docker cleanup process..." -ForegroundColor Yellow

# Stop and remove all containers
Write-Host "`nStopping all running containers..." -ForegroundColor Cyan
docker ps -aq | ForEach-Object { docker stop $_ }

Write-Host "`nRemoving all containers..." -ForegroundColor Cyan
docker ps -aq | ForEach-Object { docker rm $_ }

# Remove unused images
Write-Host "`nRemoving all unused images..." -ForegroundColor Cyan
docker image prune -af

# Remove unused volumes
Write-Host "`nRemoving all unused volumes..." -ForegroundColor Cyan
docker volume prune -f

# Remove unused networks
Write-Host "`nRemoving all unused networks..." -ForegroundColor Cyan
docker network prune -f

# Clean Docker system
Write-Host "`nPerforming system cleanup..." -ForegroundColor Cyan
docker system prune -af

Write-Host "`nCleanup complete! Docker resources have been freed." -ForegroundColor Green

# Display current Docker status
Write-Host "`nCurrent Docker status:" -ForegroundColor Yellow
Write-Host "`n1. Containers:" -ForegroundColor Cyan
docker ps -a

Write-Host "`n2. Images:" -ForegroundColor Cyan
docker images

Write-Host "`n3. Volumes:" -ForegroundColor Cyan
docker volume ls

Write-Host "`n4. Networks:" -ForegroundColor Cyan
docker network ls

Write-Host "`n5. System disk usage:" -ForegroundColor Cyan
docker system df 