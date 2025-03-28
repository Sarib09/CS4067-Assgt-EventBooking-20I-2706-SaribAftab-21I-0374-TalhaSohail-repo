# Testing Guide for CS4067 Assignment 2

This guide will help you test both the Docker Compose and Kubernetes implementations of your Event Booking application. It also explains what screenshots you should include in your assignment report.

## Prerequisites

Before starting the tests, ensure that you have:

1. Docker and Docker Compose installed
2. Kubernetes cluster set up (can be minikube, kind, or Docker Desktop Kubernetes)
3. kubectl configured to interact with your cluster

## Testing with Docker Compose

### Running the Test

1. Open a PowerShell terminal in your project root directory.
2. Run the test script:
   ```powershell
   ./test-docker-compose-app.ps1
   ```
3. The script will automatically:
   - Start all services with Docker Compose
   - Wait for services to initialize
   - Check if all containers are running
   - Display logs from each service
   - Test health endpoints
   - Test inter-service communication

### Screenshots to Include in Report

For Docker Compose testing, include the following screenshots:

1. **Docker Compose Configuration**: The output of `docker-compose config`
2. **Running Containers**: The output of `docker-compose ps` showing all containers running
3. **Service Health Checks**: The results of health endpoint tests for each service
4. **Service Logs**: Key parts of the logs showing successful startup messages
5. **Inter-Service Communication**: The results of API tests showing services communicating with each other

## Testing with Kubernetes

### Running the Test

1. Open a PowerShell terminal in your project root directory.
2. Run the test script:
   ```powershell
   ./test-kubernetes-app.ps1
   ```
3. The script will automatically:
   - Deploy all resources to the Kubernetes cluster
   - Wait for services to initialize
   - Check if all pods are running
   - Display logs from each pod
   - Set up port-forwarding to test services
   - Test health endpoints
   - Test inter-service communication

### Screenshots to Include in Report

For Kubernetes testing, include the following screenshots:

1. **Namespace Creation**: The output of `kubectl apply -f kubernetes/namespace.yaml`
2. **Running Pods**: The output of `kubectl get pods -n OnlineEventBookingSaribAftab` showing all pods running
3. **Service Status**: The output of `kubectl get services -n OnlineEventBookingSaribAftab`
4. **Ingress Status**: The output of `kubectl get ingress -n OnlineEventBookingSaribAftab`
5. **Service Health Checks**: The results of health endpoint tests for each service
6. **Pod Logs**: Key parts of the logs showing successful startup messages
7. **API Tests**: The results of API tests showing services communicating with each other

## Troubleshooting Common Issues

### Docker Compose Issues

1. **Service fails to start**: Check the logs for error messages. Common issues include:
   - Port conflicts (another application using the same port)
   - Missing environment variables
   - Database connection issues

2. **Services can't communicate**: Check network settings and environment variables:
   - Ensure service URLs are correctly set (e.g., `http://service-name:port`)
   - Verify that all services are on the same network

### Kubernetes Issues

1. **Pods not starting**: Check pod status and logs:
   ```bash
   kubectl describe pod <pod-name> -n OnlineEventBookingSaribAftab
   kubectl logs <pod-name> -n OnlineEventBookingSaribAftab
   ```

2. **ConfigMaps or Secrets not applied**: Verify they exist and are correctly referenced:
   ```bash
   kubectl get configmaps -n OnlineEventBookingSaribAftab
   kubectl get secrets -n OnlineEventBookingSaribAftab
   ```

3. **Ingress not working**: Check Ingress controller status and configuration:
   ```bash
   kubectl describe ingress event-booking-ingress -n OnlineEventBookingSaribAftab
   ```

## Report Documentation Template

Here's a suggested template for documenting your tests in your assignment report:

### Docker Compose Testing

#### Configuration
[Screenshot of docker-compose config]

#### Running Containers
[Screenshot of docker-compose ps]

#### Service Health
[Screenshot of health check results]

#### Service Logs
[Screenshot of key log messages]

#### Inter-Service Communication
[Screenshot of API test results]

### Kubernetes Testing

#### Namespace and Resources
[Screenshot of namespace creation and resources]

#### Running Pods
[Screenshot of kubectl get pods]

#### Service and Ingress Status
[Screenshot of service and ingress status]

#### Service Health
[Screenshot of health check results]

#### Pod Logs
[Screenshot of key log messages]

#### Inter-Service Communication
[Screenshot of API test results] 