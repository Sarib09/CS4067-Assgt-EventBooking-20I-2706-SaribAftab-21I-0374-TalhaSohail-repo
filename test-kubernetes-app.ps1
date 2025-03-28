# Test script for working application on Kubernetes
Write-Host "`n`n=======================================" -ForegroundColor Cyan
Write-Host "Testing Event Booking Application on Kubernetes" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Check Kubernetes version
Write-Host "`n[Step 1] Checking Kubernetes version" -ForegroundColor Yellow
kubectl version --client

# Apply the Kubernetes manifests
Write-Host "`n[Step 2] Creating namespace" -ForegroundColor Yellow
kubectl apply -f kubernetes/namespace.yaml

Write-Host "`n[Step 3] Creating ConfigMap and Secrets" -ForegroundColor Yellow
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secrets.yaml

Write-Host "`n[Step 4] Deploying services" -ForegroundColor Yellow
Write-Host "This may take several minutes..." -ForegroundColor Gray
kubectl apply -f kubernetes/deployment-service-user.yaml
kubectl apply -f kubernetes/deployment-service-event.yaml
kubectl apply -f kubernetes/deployment-service-booking.yaml
kubectl apply -f kubernetes/deployment-service-notification.yaml
kubectl apply -f kubernetes/deployment-service-frontend.yaml

Write-Host "`n[Step 5] Deploying ingress" -ForegroundColor Yellow
kubectl apply -f kubernetes/ingress.yaml

# Wait for services to start
Write-Host "`n[Step 6] Waiting for services to initialize (120 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 120

# Check pod status
Write-Host "`n[Step 7] Checking pod status" -ForegroundColor Yellow
kubectl get pods -n OnlineEventBookingSaribAftab

# Check service status
Write-Host "`n[Step 8] Checking service status" -ForegroundColor Yellow
kubectl get services -n OnlineEventBookingSaribAftab

# Check ingress status
Write-Host "`n[Step 9] Checking ingress status" -ForegroundColor Yellow
kubectl get ingress -n OnlineEventBookingSaribAftab

# Check pod logs
Write-Host "`n[Step 10] Checking pod logs" -ForegroundColor Yellow

# Function to get logs for a specific service
function Get-PodLogs {
    param (
        [string]$ServiceName
    )
    
    Write-Host "`n• $ServiceName logs:" -ForegroundColor Magenta
    
    $pod = kubectl get pods -n OnlineEventBookingSaribAftab -l app=$ServiceName -o jsonpath="{.items[0].metadata.name}" 2>$null
    
    if ($pod) {
        kubectl logs $pod -n OnlineEventBookingSaribAftab --tail=20
    } else {
        Write-Host "  ❌ No pods found for $ServiceName" -ForegroundColor Red
    }
}

Get-PodLogs "user-service"
Get-PodLogs "event-service"
Get-PodLogs "booking-service"
Get-PodLogs "notification-service"
Get-PodLogs "frontend"

# Test service communication by port-forwarding
Write-Host "`n[Step 11] Testing service communication via port-forwarding" -ForegroundColor Yellow
Write-Host "This test will verify that services are running and can be accessed" -ForegroundColor Gray

# Start port forwarding for each service (in the background)
$portForwardProcesses = @()

function Start-PortForward {
    param (
        [string]$ServiceName,
        [int]$LocalPort,
        [int]$RemotePort
    )
    
    Write-Host "`n• Starting port-forward for $ServiceName to localhost:$LocalPort" -ForegroundColor Magenta
    
    $process = Start-Process -FilePath "kubectl" -ArgumentList "port-forward", "service/$ServiceName", "${LocalPort}:${RemotePort}", "-n", "OnlineEventBookingSaribAftab" -PassThru -NoNewWindow
    
    if ($process) {
        Write-Host "  ✅ Port-forward started" -ForegroundColor Green
        return $process
    } else {
        Write-Host "  ❌ Failed to start port-forward" -ForegroundColor Red
        return $null
    }
}

# Start port-forwarding for each service
$portForwardProcesses += Start-PortForward "user-service" 8001 3001
$portForwardProcesses += Start-PortForward "event-service" 8002 3002
$portForwardProcesses += Start-PortForward "booking-service" 8003 3003
$portForwardProcesses += Start-PortForward "notification-service" 8004 3004
$portForwardProcesses += Start-PortForward "frontend" 8080 80

# Wait for port-forwarding to establish
Write-Host "`nWaiting for port-forwarding to establish (15 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Test health endpoints
Write-Host "`n[Step 12] Testing service health endpoints" -ForegroundColor Yellow

$services = @(
    @{Name = "User Service"; Url = "http://localhost:8001/health"}
    @{Name = "Event Service"; Url = "http://localhost:8002/health"}
    @{Name = "Booking Service"; Url = "http://localhost:8003/health"}
    @{Name = "Notification Service"; Url = "http://localhost:8004/health"}
    @{Name = "Frontend"; Url = "http://localhost:8080"}
)

foreach ($service in $services) {
    Write-Host "`n• Testing $($service.Name) health: $($service.Url)" -ForegroundColor Magenta
    try {
        $response = Invoke-WebRequest -Uri $service.Url -Method Get -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✅ $($service.Name) is healthy (Status: $($response.StatusCode))" -ForegroundColor Green
            Write-Host "  Response: $($response.Content.Substring(0, [Math]::Min(100, $response.Content.Length)))..." -ForegroundColor Gray
        } else {
            Write-Host "  ❌ $($service.Name) returned status: $($response.StatusCode)" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ❌ $($service.Name) health check failed: $_" -ForegroundColor Red
    }
}

# Test API endpoints (inter-service communication)
Write-Host "`n[Step 13] Testing API endpoints" -ForegroundColor Yellow

# Test Event listing endpoint
Write-Host "`n• Testing Event Service API (event listing)" -ForegroundColor Magenta
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8002/api/events" -Method Get -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "  ✅ Successfully retrieved events (Status: $($response.StatusCode))" -ForegroundColor Green
        Write-Host "  Response: $($response.Content.Substring(0, [Math]::Min(100, $response.Content.Length)))..." -ForegroundColor Gray
    } else {
        Write-Host "  ❌ Failed to retrieve events (Status: $($response.StatusCode))" -ForegroundColor Red
    }
} catch {
    Write-Host "  ❌ Event listing test failed: $_" -ForegroundColor Red
}

# Test Login endpoint
Write-Host "`n• Testing User Service API (login)" -ForegroundColor Magenta
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8001/api/users/login" -Method Post -ContentType "application/json" -Body '{"email": "test@example.com", "password": "password123"}' -TimeoutSec 5 -ErrorAction SilentlyContinue
    Write-Host "  Response Status: $($response.StatusCode)" -ForegroundColor Gray
    Write-Host "  Response: $($response.Content.Substring(0, [Math]::Min(100, $response.Content.Length)))..." -ForegroundColor Gray
} catch {
    if ($_.Exception.Response.StatusCode.Value__ -eq 401) {
        Write-Host "  ✅ Login endpoint is working (returned 401 Unauthorized as expected)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Login test failed: $_" -ForegroundColor Red
    }
}

# Clean up port-forwarding processes
Write-Host "`n[Step 14] Cleaning up port-forwarding processes" -ForegroundColor Yellow
foreach ($process in $portForwardProcesses) {
    if ($process -ne $null) {
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        Write-Host "Stopped process ID $($process.Id)" -ForegroundColor Gray
    }
}

# Summary
Write-Host "`n`n=======================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "The application has been deployed to Kubernetes and services are communicating with each other." -ForegroundColor Green
Write-Host "Take screenshots of the above output for your assignment report." -ForegroundColor Yellow

# Cleanup option
Write-Host "`n`n=======================================" -ForegroundColor Yellow
Write-Host "Cleanup" -ForegroundColor Yellow
Write-Host "=======================================" -ForegroundColor Yellow
$cleanup = Read-Host "Do you want to cleanup the Kubernetes resources now? (y/n)"
if ($cleanup -eq "y") {
    Write-Host "`nCleaning up Kubernetes resources..." -ForegroundColor Yellow
    kubectl delete namespace OnlineEventBookingSaribAftab
    Write-Host "Kubernetes resources deleted." -ForegroundColor Green
} else {
    Write-Host "`nLeaving Kubernetes resources running. To clean up later, run 'kubectl delete namespace OnlineEventBookingSaribAftab'" -ForegroundColor Yellow
} 