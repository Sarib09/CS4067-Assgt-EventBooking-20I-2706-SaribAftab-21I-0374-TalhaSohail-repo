# Cleanup Script for Event Booking Platform

Write-Host "`n=== Cleaning up Docker Compose Resources ===" -ForegroundColor Cyan
Write-Host "Stopping and removing Docker Compose services..."
docker-compose down -v

Write-Host "`n=== Cleaning up Docker Resources ===" -ForegroundColor Cyan
Write-Host "Removing unused Docker volumes..."
docker volume prune -f

Write-Host "Removing unused Docker networks..."
docker network prune -f

Write-Host "`n=== Cleaning up Kubernetes Resources ===" -ForegroundColor Cyan
Write-Host "Removing namespace and all its resources..."
kubectl delete namespace online-event-booking-sarib-aftab --ignore-not-found

Write-Host "Removing any stray port-forward processes..."
Get-Process -Name powershell | Where-Object { $_.CommandLine -like "*port-forward*" } | Stop-Process -Force

Write-Host "`n=== Cleanup Complete ===" -ForegroundColor Green
Write-Host "All resources have been removed except Docker images." -ForegroundColor Green
Write-Host "To remove Docker images as well, run: docker rmi event-booking/user-service event-booking/event-service event-booking/booking-service event-booking/notification-service event-booking/frontend" -ForegroundColor Yellow 