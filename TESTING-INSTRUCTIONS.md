# Event Booking Platform - Testing Instructions

This document provides step-by-step commands to test both Docker Compose and Kubernetes deployments of the Event Booking Platform.

## Table of Contents
- [Building Docker Images](#building-docker-images)
- [Docker Compose Testing](#docker-compose-testing)
- [Kubernetes Testing](#kubernetes-testing)
- [Automated Testing Scripts](#automated-testing-scripts)

## Building Docker Images

Before deploying with Docker Compose or Kubernetes, you need to build the Docker images for each service.

### 1. Examining Dockerfile Structure

Let's first examine the structure of a sample Dockerfile to understand what we're building:

```powershell
# View the User Service Dockerfile
cat user-service/Dockerfile
```

A typical Dockerfile for the services contains:
- Base Node.js image
- Working directory setup
- Dependency installation
- Port exposure
- Application startup command

### 2. Building Individual Service Images

```powershell
# Navigate to the project root directory
cd /path/to/Event-Booking

# Build User Service image
cd user-service
docker build -t event-booking/user-service:latest .
# You should see the build process with several steps including:
# - Downloading the base Node.js image
# - Setting up the working directory
# - Copying package.json
# - Installing dependencies
# - Copying application code
# - Setting the start command
cd ..

# Build Event Service image
cd event-service
docker build -t event-booking/event-service:latest .
cd ..

# Build Booking Service image
cd booking-service
docker build -t event-booking/booking-service:latest .
cd ..

# Build Notification Service image
cd notification-service
docker build -t event-booking/notification-service:latest .
cd ..

# Build Frontend image
cd client
docker build -t event-booking/frontend:latest .
cd ..
```

### 3. Check Built Images

```powershell
# List all built images
docker images | findstr event-booking

# Should show output similar to:
# event-booking/frontend           latest    8e9a340b2d5a   2 minutes ago   245MB
# event-booking/notification-service latest  7c0f4b2e3d9a   3 minutes ago   198MB
# event-booking/booking-service    latest    a1d4c9b7e8f2   4 minutes ago   193MB
# event-booking/event-service      latest    6b3e2c0d1a5f   5 minutes ago   195MB
# event-booking/user-service       latest    0d9e8c7b6f3a   6 minutes ago   190MB
```

### 4. Inspecting Docker Images

```powershell
# Inspect the details of an image (e.g., user service)
docker image inspect event-booking/user-service:latest

# View the image layers and how it was built
docker history event-booking/user-service:latest

# Run a container from the image to test it independently
docker run -d --name test-user-service -p 3001:3001 event-booking/user-service:latest
docker logs test-user-service
docker stop test-user-service
docker rm test-user-service
```

### 5. Building All Images at Once with Docker Compose

```powershell
# Build all service images without starting containers
docker-compose build

# Build specific service
docker-compose build user-service

# Build with no cache (clean build)
docker-compose build --no-cache
```

## Docker Compose Testing

### 1. Starting the Application

```powershell
# Build and start all services with Docker Compose
docker-compose up -d

# Watch the startup logs
docker-compose logs -f

# Wait for all services to start (at least 60 seconds for first-time startup)
Start-Sleep -Seconds 60
```

### 2. Checking Service Status

```powershell
# Check if all containers are running
docker-compose ps

# Check logs for each service
docker logs event-booking-user-service --tail 20
docker logs event-booking-event-service --tail 20
docker logs event-booking-booking-service --tail 20
docker logs event-booking-notification-service --tail 20
docker logs event-booking-frontend --tail 20

# Check resource usage
docker stats --no-stream
```

### 3. Testing Service Health Endpoints

```powershell
# Test User Service health endpoint
Invoke-WebRequest -Uri http://localhost:3001/health -Method Get

# Test Event Service health endpoint
Invoke-WebRequest -Uri http://localhost:3002/health -Method Get

# Test Booking Service health endpoint
Invoke-WebRequest -Uri http://localhost:3003/health -Method Get

# Test Notification Service health endpoint
Invoke-WebRequest -Uri http://localhost:3004/health -Method Get

# Test Frontend
Invoke-WebRequest -Uri http://localhost -Method Get
```

### 4. Testing API Endpoints

```powershell
# Test User Service API (login endpoint)
Invoke-WebRequest -Uri http://localhost:3001/api/users/login -Method Post -ContentType "application/json" -Body '{"email": "test@example.com", "password": "password123"}'

# Test Event Service API (get all events)
Invoke-WebRequest -Uri http://localhost:3002/api/events -Method Get

# Test Booking Service API (bookings endpoint)
Invoke-WebRequest -Uri http://localhost:3003/api/bookings -Method Get
```

### 5. Exploring Docker Networking

```powershell
# Check Docker networks
docker network ls

# Inspect the event-booking network
docker network inspect event-booking-network

# See how containers are connected
docker inspect event-booking-mongodb | Select-String -Pattern "NetworkSettings" -Context 0,20
```

### 6. Stopping Docker Compose

```powershell
# Stop all containers but keep volumes
docker-compose down

# Stop all containers and remove volumes
docker-compose down -v
```

## Kubernetes Testing

### 1. Preparing Images for Kubernetes

```powershell
# Option 1: For local Kubernetes (e.g., Minikube), load Docker images
minikube image load event-booking/user-service:latest
minikube image load event-booking/event-service:latest
minikube image load event-booking/booking-service:latest
minikube image load event-booking/notification-service:latest
minikube image load event-booking/frontend:latest

# Option 2: For Docker Desktop Kubernetes, the local images are already available

# Option 3: For a remote cluster, tag and push images to a registry
docker tag event-booking/user-service:latest your-registry/event-booking/user-service:latest
docker tag event-booking/event-service:latest your-registry/event-booking/event-service:latest
docker tag event-booking/booking-service:latest your-registry/event-booking/booking-service:latest
docker tag event-booking/notification-service:latest your-registry/event-booking/notification-service:latest
docker tag event-booking/frontend:latest your-registry/event-booking/frontend:latest

docker push your-registry/event-booking/user-service:latest
docker push your-registry/event-booking/event-service:latest
docker push your-registry/event-booking/booking-service:latest
docker push your-registry/event-booking/notification-service:latest
docker push your-registry/event-booking/frontend:latest
```

### 2. Setting Up the Kubernetes Environment

```powershell
# Create the namespace
kubectl apply -f kubernetes/namespace.yaml

# Create ConfigMaps and Secrets
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secrets.yaml
kubectl apply -f kubernetes/tls-secret.yaml
kubectl apply -f kubernetes/mongodb-init-script.yaml

# Verify the ConfigMaps and Secrets were created
kubectl get configmaps -n online-event-booking-sarib-aftab
kubectl get secrets -n online-event-booking-sarib-aftab
```

### 3. Deploying Infrastructure Services

```powershell
# Deploy MongoDB
kubectl apply -f kubernetes/deployment-service-mongodb.yaml

# Deploy RabbitMQ
kubectl apply -f kubernetes/deployment-service-rabbitmq.yaml

# Wait for infrastructure services to be ready
Start-Sleep -Seconds 30

# Check if infrastructure services are running
kubectl get pods -l app=mongodb -n online-event-booking-sarib-aftab
kubectl get pods -l app=rabbitmq -n online-event-booking-sarib-aftab

# Check the MongoDB logs
kubectl logs -l app=mongodb -n online-event-booking-sarib-aftab

# Check the RabbitMQ logs
kubectl logs -l app=rabbitmq -n online-event-booking-sarib-aftab
```

### 4. Deploying Microservices

```powershell
# Deploy User Service
kubectl apply -f kubernetes/deployment-service-user.yaml

# Deploy Event Service
kubectl apply -f kubernetes/deployment-service-event.yaml

# Deploy Booking Service
kubectl apply -f kubernetes/deployment-service-booking.yaml

# Deploy Notification Service
kubectl apply -f kubernetes/deployment-service-notification.yaml

# Deploy Frontend
kubectl apply -f kubernetes/deployment-service-frontend.yaml

# Wait for services to be ready
Start-Sleep -Seconds 60

# Check if all services are running
kubectl get pods -n online-event-booking-sarib-aftab

# Check the status of all deployments
kubectl get deployments -n online-event-booking-sarib-aftab

# Check the services
kubectl get services -n online-event-booking-sarib-aftab
```

### 5. Deploying Ingress

```powershell
# Deploy Ingress
kubectl apply -f kubernetes/ingress.yaml

# Check Ingress status
kubectl get ingress -n online-event-booking-sarib-aftab

# Check ingress controller status (if using NGINX ingress)
kubectl get pods -n ingress-nginx
```

### 6. Testing Kubernetes Services via Port-Forwarding

```powershell
# Test User Service health endpoint
kubectl port-forward service/user-service 8001:3001 -n online-event-booking-sarib-aftab
# In a new terminal window
Invoke-WebRequest -Uri http://localhost:8001/health -Method Get
# Stop port-forwarding with Ctrl+C in the first terminal

# Test Event Service health endpoint
kubectl port-forward service/event-service 8002:3002 -n online-event-booking-sarib-aftab
# In a new terminal window
Invoke-WebRequest -Uri http://localhost:8002/health -Method Get
# Stop port-forwarding with Ctrl+C in the first terminal

# Test Booking Service health endpoint
kubectl port-forward service/booking-service 8003:3003 -n online-event-booking-sarib-aftab
# In a new terminal window
Invoke-WebRequest -Uri http://localhost:8003/health -Method Get
# Stop port-forwarding with Ctrl+C in the first terminal

# Test Notification Service health endpoint
kubectl port-forward service/notification-service 8004:3004 -n online-event-booking-sarib-aftab
# In a new terminal window
Invoke-WebRequest -Uri http://localhost:8004/health -Method Get
# Stop port-forwarding with Ctrl+C in the first terminal

# Test Frontend
kubectl port-forward service/frontend 8080:80 -n online-event-booking-sarib-aftab
# In a new terminal window
Invoke-WebRequest -Uri http://localhost:8080 -Method Get
# Stop port-forwarding with Ctrl+C in the first terminal
```

### 7. Testing Ingress (requires host file modification)

To test ingress properly, add this line to your hosts file (`C:\Windows\System32\drivers\etc\hosts`):
```
127.0.0.1 event-booking.example.com
```

Then set up port-forwarding for the ingress:
```powershell
# Get the name of the ingress controller pod (if using minikube)
kubectl get pods -n ingress-nginx

# Port-forward the ingress controller
kubectl port-forward -n ingress-nginx service/ingress-nginx-controller 8443:443

# Test access via hostname (in a new terminal)
Invoke-WebRequest -Uri https://event-booking.example.com:8443 -Method Get -SkipCertificateCheck

# Test API endpoints through ingress
Invoke-WebRequest -Uri https://event-booking.example.com:8443/api/users/health -Method Get -SkipCertificateCheck
Invoke-WebRequest -Uri https://event-booking.example.com:8443/api/events/health -Method Get -SkipCertificateCheck
```

### 8. Examining Kubernetes Resources

```powershell
# Examine pod details
kubectl describe pod -l app=event-service -n online-event-booking-sarib-aftab

# Check pod logs
kubectl logs -l app=notification-service -n online-event-booking-sarib-aftab

# Check ConfigMap values
kubectl get configmap event-booking-config -n online-event-booking-sarib-aftab -o yaml

# Check environment variables in a container
kubectl exec -it $(kubectl get pod -l app=user-service -n online-event-booking-sarib-aftab -o jsonpath="{.items[0].metadata.name}") -n online-event-booking-sarib-aftab -- env | Sort-Object
```

### 9. Cleaning Up Kubernetes Resources

```powershell
# Delete the entire namespace and all resources
kubectl delete namespace online-event-booking-sarib-aftab

# Verify the namespace was deleted
kubectl get namespace online-event-booking-sarib-aftab
```

## Automated Testing Scripts

The repository includes several PowerShell scripts for automated testing:

### Docker Compose Testing Scripts

```powershell
# Run Docker Compose and validate the configuration
./run-docker-compose.ps1

# Comprehensive test of the Docker Compose setup
./test-docker-compose-app.ps1

# Clean up Docker resources
./cleanup-docker.ps1
```

### Kubernetes Testing Scripts

```powershell
# Validate Kubernetes YAML files
./test-kubernetes.ps1

# Fix authentication issues and run full Kubernetes test
./fix-kubernetes-deployment.ps1

# Comprehensive test of the Kubernetes setup 
./test-kubernetes-app.ps1

# Test Dockerfiles individually
./test-dockerfiles.ps1
```

## Troubleshooting

### Common Docker Compose Issues
- If services fail to start, check logs with `docker logs <container-name>`
- If MongoDB authentication fails, ensure the credentials match in all services
- If RabbitMQ connection fails, check the RabbitMQ logs and verify connection strings
- If containers restart repeatedly, check for environment variable or dependency issues

### Common Kubernetes Issues
- If pods are stuck in "Pending" state, check for resource constraints with `kubectl describe pod <pod-name> -n online-event-booking-sarib-aftab`
- If pods have "ImagePullBackOff" errors, ensure your Docker images are properly tagged and available
- If services can't connect to each other, verify service names and ports in ConfigMaps
- If MongoDB authentication fails, check the MongoDB init script and credentials in secrets 