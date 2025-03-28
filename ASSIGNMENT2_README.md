# CS4067 - Assignment 02: Containerization & Deployment

This repository contains the containerized version of the Online Event Booking Platform and its Kubernetes deployment configuration.

## Project Structure

```
/CS4067-EventBooking
├── user-service/
│   └── Dockerfile
├── event-service/
│   └── Dockerfile
├── booking-service/
│   └── Dockerfile
├── notification-service/
│   └── Dockerfile
├── client/
│   ├── Dockerfile
│   └── nginx.conf
├── kubernetes/
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secrets.yaml
│   ├── deployment-service-user.yaml
│   ├── deployment-service-event.yaml
│   ├── deployment-service-booking.yaml
│   ├── deployment-service-notification.yaml
│   ├── deployment-service-frontend.yaml
│   ├── ingress.yaml
├── docker-compose.yml
├── README.md
└── ASSIGNMENT2_README.md
```

## Containerization

Each microservice has been containerized using Docker with the following considerations:

1. **Minimal Base Images**: Used Node.js Alpine images for all backend services and Nginx for the frontend.
2. **Proper Dependencies**: Optimized package installation to reduce container size.
3. **Correct Configuration**: Exposed appropriate ports and defined proper working directories.
4. **Startup Commands**: Set up correct startup commands for each service.

## Docker Compose

The `docker-compose.yml` file orchestrates all services together, including:

- Backend services (User, Event, Booking, Notification)
- Frontend service with Nginx
- Database services (PostgreSQL, MongoDB)
- Message broker (RabbitMQ)

The Docker Compose configuration includes:

- Network configuration for inter-service communication
- Volume management for database persistence
- Environment variable management
- Proper service dependencies

## Kubernetes Deployment

The Kubernetes manifests are organized in the `kubernetes/` directory:

### Namespace

- `namespace.yaml`: Creates a dedicated namespace for the application (`OnlineEventBookingSaribAftab`).

### Configuration

- `configmap.yaml`: Stores non-sensitive configuration data such as service URLs, database configurations, and ports.
- `secrets.yaml`: Stores sensitive data like database passwords, API keys, and JWT secrets in a secure manner.

### Deployments & Services

Each microservice has a corresponding deployment and service defined in a single file:

- `deployment-service-user.yaml`: User Service deployment and service configuration.
- `deployment-service-event.yaml`: Event Service deployment and service configuration.
- `deployment-service-booking.yaml`: Booking Service deployment and service configuration.
- `deployment-service-notification.yaml`: Notification Service deployment and service configuration.
- `deployment-service-frontend.yaml`: Frontend Service deployment and service configuration.

Each deployment includes:

- Resource limits and requests
- Environment variables from ConfigMaps and Secrets
- Health checks (readiness and liveness probes)
- Replica configuration for high availability

### Ingress

- `ingress.yaml`: Configures the NGINX Ingress Controller to route traffic to the appropriate services based on URL paths.

## How to Run

### With Docker Compose

1. Build and start all services:
   ```bash
   docker-compose up -d
   ```

2. Monitor the logs:
   ```bash
   docker-compose logs -f
   ```

3. Stop all services:
   ```bash
   docker-compose down
   ```

### With Kubernetes

1. Create the namespace:
   ```bash
   kubectl apply -f kubernetes/namespace.yaml
   ```

2. Apply ConfigMaps and Secrets:
   ```bash
   kubectl apply -f kubernetes/configmap.yaml
   kubectl apply -f kubernetes/secrets.yaml
   ```

3. Deploy all services:
   ```bash
   kubectl apply -f kubernetes/deployment-service-user.yaml
   kubectl apply -f kubernetes/deployment-service-event.yaml
   kubectl apply -f kubernetes/deployment-service-booking.yaml
   kubectl apply -f kubernetes/deployment-service-notification.yaml
   kubectl apply -f kubernetes/deployment-service-frontend.yaml
   ```

4. Apply the Ingress configuration:
   ```bash
   kubectl apply -f kubernetes/ingress.yaml
   ```

5. Verify the deployment:
   ```bash
   kubectl get all -n OnlineEventBookingSaribAftab
   ```

## Configuration Details

### Environment Variables

The application uses several environment variables which are configured in ConfigMaps and Secrets:

1. **Database Configuration**:
   - PostgreSQL connection details for User and Booking services
   - MongoDB connection details for Event and Notification services

2. **Service Communication**:
   - Service URLs for inter-service communication
   - RabbitMQ connection details for asynchronous messaging

3. **Security**:
   - JWT secret for authentication
   - API keys for external services

4. **Email Notification**:
   - SMTP configuration for sending email notifications

## Architectural Improvements

The containerized and Kubernetes-based deployment provides several improvements:

1. **Scalability**: Services can be scaled independently based on demand.
2. **Reliability**: Health checks ensure services remain available.
3. **Resource Efficiency**: Resource limits prevent any single service from consuming all resources.
4. **Security**: Sensitive data is stored securely in Kubernetes Secrets.
5. **Maintainability**: Configuration is centralized in ConfigMaps and Secrets. 