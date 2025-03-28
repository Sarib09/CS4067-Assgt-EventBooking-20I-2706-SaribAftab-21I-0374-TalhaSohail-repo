# Test Docker Compose configuration
Write-Host "`n`n=======================================" -ForegroundColor Green
Write-Host "Validating docker-compose.yml file" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

docker-compose config

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ docker-compose.yml is valid" -ForegroundColor Green
} else {
    Write-Host "`n❌ docker-compose.yml has errors" -ForegroundColor Red
    exit 1
}

# Create a .env file for Docker Compose if it doesn't exist
$envFile = ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "`n`n=======================================" -ForegroundColor Yellow
    Write-Host "Creating .env file for Docker Compose" -ForegroundColor Yellow
    Write-Host "=======================================" -ForegroundColor Yellow
    
    @"
SUPABASE_URL=https://zbcxwfactkshkbgsmolf.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiY3h3ZmFjdGtzaGtiZ3Ntb2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NDM1MTAsImV4cCI6MjA1NjUxOTUxMH0.2qvVH3a2fA-DlAnCij1Fl2GC2spGh9KkWgeB6G_iu_Y
JWT_SECRET=tBr2kDlBCO1xuCC4clBm4UOP1Bgtgzdo5gKwiUugrPW8xW+r4Y2tdS3s+IRV1KvYj1d/E7iY/2li5WKKLysYMw==
EMAIL_USER=a2dragneel00@gmail.com
EMAIL_PASSWORD=rgirurzlymgxyijx
EMAIL_FROM=a2dragneel00@gmail.com
"@ | Out-File -FilePath $envFile -Encoding utf8

    Write-Host "`n✅ .env file created with required variables" -ForegroundColor Green
}

# Test Docker Compose up
Write-Host "`n`n=======================================" -ForegroundColor Green
Write-Host "Starting services with Docker Compose" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green
Write-Host "This will start the services in detached mode for testing." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop after testing." -ForegroundColor Yellow

# Start services in detached mode
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Services started successfully" -ForegroundColor Green
    
    # Give services some time to start
    Write-Host "`nWaiting 10 seconds for services to initialize..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
    
    # List running containers
    Write-Host "`n`n=======================================" -ForegroundColor Cyan
    Write-Host "Running Containers:" -ForegroundColor Cyan
    Write-Host "=======================================" -ForegroundColor Cyan
    docker-compose ps
    
    # Check service health
    Write-Host "`n`n=======================================" -ForegroundColor Cyan
    Write-Host "Health Check:" -ForegroundColor Cyan
    Write-Host "=======================================" -ForegroundColor Cyan
    
    $services = @(
        @{Name = "User Service"; Url = "http://localhost:3001/health"},
        @{Name = "Event Service"; Url = "http://localhost:3002/health"},
        @{Name = "Booking Service"; Url = "http://localhost:3003/health"},
        @{Name = "Notification Service"; Url = "http://localhost:3004/health"},
        @{Name = "Frontend"; Url = "http://localhost:80"}
    )
    
    foreach ($service in $services) {
        try {
            $response = Invoke-WebRequest -Uri $service.Url -Method Get -TimeoutSec 5 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Host "$($service.Name): ✅ Healthy (Status: $($response.StatusCode))" -ForegroundColor Green
            } else {
                Write-Host "$($service.Name): ❌ Unhealthy (Status: $($response.StatusCode))" -ForegroundColor Red
            }
        } catch {
            Write-Host "$($service.Name): ❌ Cannot connect" -ForegroundColor Red
        }
    }
    
    # Ask user if they want to stop the services
    $stopServices = Read-Host "`n`nDo you want to stop the services now? (y/n)"
    if ($stopServices -eq "y") {
        Write-Host "`n`n=======================================" -ForegroundColor Yellow
        Write-Host "Stopping services" -ForegroundColor Yellow
        Write-Host "=======================================" -ForegroundColor Yellow
        docker-compose down
        Write-Host "`n✅ Services stopped" -ForegroundColor Green
    } else {
        Write-Host "`nServices are still running. Stop them later with 'docker-compose down'" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n❌ Failed to start services" -ForegroundColor Red
} 