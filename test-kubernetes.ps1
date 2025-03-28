# Test Kubernetes manifests
$manifests = @(
    "kubernetes/namespace.yaml",
    "kubernetes/configmap.yaml",
    "kubernetes/secrets.yaml",
    "kubernetes/deployment-service-user.yaml",
    "kubernetes/deployment-service-event.yaml",
    "kubernetes/deployment-service-booking.yaml",
    "kubernetes/deployment-service-notification.yaml",
    "kubernetes/deployment-service-frontend.yaml",
    "kubernetes/ingress.yaml"
)

# Check if kubectl is available
try {
    $kubectlVersion = kubectl version --client --output=json 2>&1
    Write-Host "`n✅ kubectl is installed" -ForegroundColor Green
} catch {
    Write-Host "`n❌ kubectl is not installed. Please install kubectl to test Kubernetes manifests." -ForegroundColor Red
    exit 1
}

# Validate Kubernetes manifests
Write-Host "`n`n=======================================" -ForegroundColor Green
Write-Host "Validating Kubernetes manifests" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

$allValid = $true

foreach ($manifest in $manifests) {
    Write-Host "`nValidating $manifest..." -ForegroundColor Cyan
    
    # Check if file exists
    if (-not (Test-Path $manifest)) {
        Write-Host "❌ File not found: $manifest" -ForegroundColor Red
        $allValid = $false
        continue
    }
    
    # Validate using kubectl
    $result = kubectl apply --dry-run=client -f $manifest 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $manifest is valid" -ForegroundColor Green
        Write-Host "   $result" -ForegroundColor Gray
    } else {
        Write-Host "❌ $manifest has errors:" -ForegroundColor Red
        Write-Host "   $result" -ForegroundColor Red
        $allValid = $false
    }
}

if ($allValid) {
    Write-Host "`n`n=======================================" -ForegroundColor Green
    Write-Host "All Kubernetes manifests are valid!" -ForegroundColor Green
    Write-Host "=======================================" -ForegroundColor Green
} else {
    Write-Host "`n`n=======================================" -ForegroundColor Red
    Write-Host "Some Kubernetes manifests have errors." -ForegroundColor Red
    Write-Host "=======================================" -ForegroundColor Red
    exit 1
}

# Instructions for deploying to a real Kubernetes cluster
Write-Host "`n`n=======================================" -ForegroundColor Yellow
Write-Host "Deployment Instructions" -ForegroundColor Yellow
Write-Host "=======================================" -ForegroundColor Yellow

Write-Host "To deploy to a real Kubernetes cluster, run the following commands in order:" -ForegroundColor White
Write-Host "1. Create the namespace:" -ForegroundColor Cyan
Write-Host "   kubectl apply -f kubernetes/namespace.yaml" -ForegroundColor White
Write-Host "`n2. Create ConfigMaps and Secrets:" -ForegroundColor Cyan
Write-Host "   kubectl apply -f kubernetes/configmap.yaml" -ForegroundColor White
Write-Host "   kubectl apply -f kubernetes/secrets.yaml" -ForegroundColor White
Write-Host "`n3. Deploy services:" -ForegroundColor Cyan
Write-Host "   kubectl apply -f kubernetes/deployment-service-user.yaml" -ForegroundColor White
Write-Host "   kubectl apply -f kubernetes/deployment-service-event.yaml" -ForegroundColor White
Write-Host "   kubectl apply -f kubernetes/deployment-service-booking.yaml" -ForegroundColor White
Write-Host "   kubectl apply -f kubernetes/deployment-service-notification.yaml" -ForegroundColor White
Write-Host "   kubectl apply -f kubernetes/deployment-service-frontend.yaml" -ForegroundColor White
Write-Host "`n4. Deploy Ingress:" -ForegroundColor Cyan
Write-Host "   kubectl apply -f kubernetes/ingress.yaml" -ForegroundColor White
Write-Host "`n5. Check deployment status:" -ForegroundColor Cyan
Write-Host "   kubectl get all -n OnlineEventBookingSaribAftab" -ForegroundColor White 