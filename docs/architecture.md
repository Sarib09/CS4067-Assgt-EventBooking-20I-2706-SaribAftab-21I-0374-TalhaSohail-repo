# Event Booking Platform Architecture

## Microservices Architecture

The Event Booking Platform is built using a microservices architecture, which allows for independent development, deployment, and scaling of each service. The system consists of four main microservices:

1. **User Service**: Manages user authentication and profiles
2. **Event Service**: Manages event listings and details
3. **Booking Service**: Handles ticket bookings, payments, and status updates
4. **Notification Service**: Sends email notifications for booking confirmations and updates

## Architecture Diagram

```
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│   User Service  │◄────►   Event Service │
│   (Supabase)    │     │   (MongoDB)     │
│                 │     │                 │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │                       │
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │
│ Booking Service │────►│ Notification    │
│   (Supabase)    │     │ Service         │
│                 │     │ (MongoDB)       │
└─────────────────┘     └─────────────────┘
         │
         │
         ▼
┌─────────────────┐
│                 │
│ Payment Gateway │
│ (Mock Service)  │
│                 │
└─────────────────┘
```

## Communication Patterns

The microservices communicate with each other using two main patterns:

1. **Synchronous Communication (REST API)**:
   - User Service → Event Service
   - User Service → Booking Service
   - Booking Service → Event Service
   - Booking Service → Payment Gateway

2. **Asynchronous Communication (RabbitMQ)**:
   - Booking Service → Notification Service

## Data Storage

The platform uses two different database technologies:

1. **Supabase (PostgreSQL)**:
   - User Service: Stores user profiles and authentication data
   - Booking Service: Stores booking records and payment information

2. **MongoDB**:
   - Event Service: Stores event listings and details
   - Notification Service: Stores notification records

## Authentication Flow

1. User registers or logs in through the User Service
2. User Service generates a JWT token
3. Client includes the JWT token in the Authorization header for subsequent requests
4. Other services verify the token by calling the User Service's verify-token endpoint

## Booking Flow

1. User browses events through the Event Service
2. User creates a booking through the Booking Service
3. Booking Service checks event availability with the Event Service
4. Booking Service processes payment through the Payment Gateway
5. Booking Service updates event availability in the Event Service
6. Booking Service sends a notification message to RabbitMQ
7. Notification Service consumes the message and sends an email to the user 