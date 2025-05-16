# Evaluation Testing Script for Event Booking Platform

function Write-Header {
    param($text, $points)
    Write-Host "`n=============================================" -ForegroundColor Cyan
    Write-Host "$text ($points points)" -ForegroundColor Cyan
    Write-Host "=============================================" -ForegroundColor Cyan
}

# Task 2: Docker Compose (15 points)
Write-Header "Task 2: Docker Compose Implementation" "15"
Write-Host "Starting Docker Compose services..."
docker-compose down
docker-compose up -d

Write-Host "Verifying Docker Compose services..."
docker-compose ps

# Task 3: Kubernetes Manifests (20 points)
Write-Header "Task 3: Kubernetes Manifests" "20"
Write-Host "Creating namespace..."
kubectl delete namespace online-event-booking-sarib-aftab --ignore-not-found
kubectl apply -f ./kubernetes/namespace.yaml

Write-Host "Deploying infrastructure..."
kubectl apply -f ./kubernetes/configmap.yaml -n online-event-booking-sarib-aftab
kubectl apply -f ./kubernetes/secrets.yaml -n online-event-booking-sarib-aftab
kubectl apply -f ./kubernetes/mongodb-init-script.yaml -n online-event-booking-sarib-aftab
kubectl apply -f ./kubernetes/deployment-service-mongodb.yaml -n online-event-booking-sarib-aftab
kubectl apply -f ./kubernetes/deployment-service-rabbitmq.yaml -n online-event-booking-sarib-aftab

Write-Host "Waiting for infrastructure to be ready..."
Start-Sleep -Seconds 30

Write-Host "Deploying microservices..."
kubectl apply -f ./kubernetes/deployment-service-user.yaml -n online-event-booking-sarib-aftab
kubectl apply -f ./kubernetes/deployment-service-event.yaml -n online-event-booking-sarib-aftab
kubectl apply -f ./kubernetes/deployment-service-booking.yaml -n online-event-booking-sarib-aftab
kubectl apply -f ./kubernetes/deployment-service-notification.yaml -n online-event-booking-sarib-aftab
kubectl apply -f ./kubernetes/deployment-service-frontend.yaml -n online-event-booking-sarib-aftab

# Task 4: ConfigMaps & Secrets (15 points)
Write-Header "Task 4: ConfigMaps & Secrets" "15"
Write-Host "Verifying ConfigMaps and Secrets..."
kubectl get configmaps -n online-event-booking-sarib-aftab
kubectl get secrets -n online-event-booking-sarib-aftab

# Task 5: Ingress Configuration (15 points)
Write-Header "Task 5: Ingress Configuration" "15"
Write-Host "Applying TLS and Ingress configuration..."
kubectl apply -f ./kubernetes/tls-secret.yaml -n online-event-booking-sarib-aftab
kubectl apply -f ./kubernetes/ingress.yaml -n online-event-booking-sarib-aftab

Write-Host "Verifying Ingress..."
kubectl get ingress -n online-event-booking-sarib-aftab

# Task 7: Docker Compose Application Testing (5 points)
Write-Header "Task 7: Docker Compose Application Testing" "5"
Write-Host "Testing Docker Compose services..."

Write-Host "Testing User Service..."
try {
    Invoke-WebRequest -Uri "http://localhost:3001/health" -Method GET
    Write-Host "✓ User Service is healthy" -ForegroundColor Green
} catch {
    Write-Host "✗ User Service health check failed" -ForegroundColor Red
}

Write-Host "Testing Event Service..."
try {
    Invoke-WebRequest -Uri "http://localhost:3002/health" -Method GET
    Write-Host "✓ Event Service is healthy" -ForegroundColor Green
} catch {
    Write-Host "✗ Event Service health check failed" -ForegroundColor Red
}

Write-Host "Testing Booking Service..."
try {
    Invoke-WebRequest -Uri "http://localhost:3003/health" -Method GET
    Write-Host "✓ Booking Service is healthy" -ForegroundColor Green
} catch {
    Write-Host "✗ Booking Service health check failed" -ForegroundColor Red
}

Write-Host "Testing Notification Service..."
try {
    Invoke-WebRequest -Uri "http://localhost:3004/health" -Method GET
    Write-Host "✓ Notification Service is healthy" -ForegroundColor Green
} catch {
    Write-Host "✗ Notification Service health check failed" -ForegroundColor Red
}

# Task 8: Kubernetes Application Testing (5 points)
Write-Header "Task 8: Kubernetes Application Testing" "5"
Write-Host "Testing Kubernetes services..."

Write-Host "`nVerifying pod status..."
kubectl get pods -n online-event-booking-sarib-aftab

Write-Host "`nWaiting for all pods to be ready..."
Start-Sleep -Seconds 30

Write-Host "`nTesting User Service..."
$userProcess = Start-Process powershell -ArgumentList "kubectl port-forward -n online-event-booking-sarib-aftab svc/user-service 4001:3001" -PassThru
Start-Sleep -Seconds 5
try {
    Invoke-WebRequest -Uri "http://localhost:4001/health" -Method GET -TimeoutSec 5
    Write-Host "✓ User Service is healthy" -ForegroundColor Green
} catch {
    Write-Host "✗ User Service health check failed: $_" -ForegroundColor Red
    Write-Host "Checking User Service logs:"
    kubectl logs -n online-event-booking-sarib-aftab deployment/user-service --tail=50
}
$userProcess | Stop-Process -Force

Write-Host "`nTesting Event Service..."
$eventProcess = Start-Process powershell -ArgumentList "kubectl port-forward -n online-event-booking-sarib-aftab svc/event-service 4002:3002" -PassThru
Start-Sleep -Seconds 5
try {
    Invoke-WebRequest -Uri "http://localhost:4002/health" -Method GET -TimeoutSec 5
    Write-Host "✓ Event Service is healthy" -ForegroundColor Green
} catch {
    Write-Host "✗ Event Service health check failed: $_" -ForegroundColor Red
    Write-Host "Checking Event Service logs:"
    kubectl logs -n online-event-booking-sarib-aftab deployment/event-service --tail=50
}
$eventProcess | Stop-Process -Force

Write-Host "`nTesting Booking Service..."
$bookingProcess = Start-Process powershell -ArgumentList "kubectl port-forward -n online-event-booking-sarib-aftab svc/booking-service 4003:3003" -PassThru
Start-Sleep -Seconds 5
try {
    Invoke-WebRequest -Uri "http://localhost:4003/health" -Method GET -TimeoutSec 5
    Write-Host "✓ Booking Service is healthy" -ForegroundColor Green
} catch {
    Write-Host "✗ Booking Service health check failed: $_" -ForegroundColor Red
    Write-Host "Checking Booking Service logs:"
    kubectl logs -n online-event-booking-sarib-aftab deployment/booking-service --tail=50
}
$bookingProcess | Stop-Process -Force

Write-Host "`nTesting Notification Service..."
$notificationProcess = Start-Process powershell -ArgumentList "kubectl port-forward -n online-event-booking-sarib-aftab svc/notification-service 4004:3004" -PassThru
Start-Sleep -Seconds 5
try {
    Invoke-WebRequest -Uri "http://localhost:4004/health" -Method GET -TimeoutSec 5
    Write-Host "✓ Notification Service is healthy" -ForegroundColor Green
} catch {
    Write-Host "✗ Notification Service health check failed: $_" -ForegroundColor Red
    Write-Host "Checking Notification Service logs:"
    kubectl logs -n online-event-booking-sarib-aftab deployment/notification-service --tail=50
}
$notificationProcess | Stop-Process -Force

Write-Host "`nVerifying MongoDB connection in Kubernetes..."
kubectl logs -n online-event-booking-sarib-aftab deployment/mongodb --tail=20

Write-Host "`nVerifying service endpoints..."
kubectl get endpoints -n online-event-booking-sarib-aftab

# Final Instructions
Write-Header "Manual Testing Instructions" "N/A"
Write-Host @"
To complete the demonstration:

1. Docker Compose Frontend (http://localhost):
   - Register a new user
   - Login with the user
   - Create an event
   - Book an event
   - Check notifications

2. Kubernetes Frontend (https://localhost):
   - Register a new user
   - Login with the user
   - Create an event
   - Book an event
   - Check notifications

3. Show Configuration Files:
   - Dockerfiles for each service
   - docker-compose.yml
   - Kubernetes manifests in ./kubernetes folder
   - README.md and project structure

Press Enter to clean up resources...
"@ -ForegroundColor Yellow

Read-Host

# Cleanup
Write-Host "`nCleaning up resources..."
docker-compose down
kubectl delete namespace online-event-booking-sarib-aftab --ignore-not-found

Write-Host "`nEvaluation testing completed!" -ForegroundColor Green 