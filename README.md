# Event Booking Platform
# 20I-2706 Sarib Aftab
# 21I-0374 Talha Sohail

A microservices-based event booking platform built with Node.js, React, Supabase and MongoDB. The platform allows users to browse events, book tickets, and receive notifications.

## Architecture

The platform consists of four microservices:

1. **User Service** (Port: 3001)
   - Handles user authentication and profile management
   - Uses Supabase (PostgreSQL) for data storage
   - JWT-based authentication

2. **Event Service** (Port: 3002)
   - Manages event listings and details
   - Uses MongoDB for data storage
   - Supports CRUD operations for events

3. **Booking Service** (Port: 3003)
   - Handles ticket bookings and payments
   - Uses Supabase (PostgreSQL) for data storage
   - Integrates with RabbitMQ for notifications

4. **Notification Service** (Port: 3004)
   - Sends email notifications for booking confirmations
   - Uses MongoDB for storing notification history
   - Consumes messages from RabbitMQ

5. **Frontend Client** (Port: 3000)
   - React-based SPA with Material-UI
   - Uses React Query for state management
   - Responsive design

### Architecture Diagram

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
```

## API Documentation

### User Service (3001)

- **POST /api/users/register**
  - Register a new user
  - Body: `{ email, password, firstName, lastName, phone? }`

- **POST /api/users/login**
  - Login user
  - Body: `{ email, password }`

- **GET /api/users/profile**
  - Get current user profile
  - Requires: JWT token

- **PUT /api/users/profile**
  - Update user profile
  - Requires: JWT token
  - Body: `{ firstName?, lastName?, phone? }`

### Event Service (3002)

- **GET /api/events**
  - Get all events
  - Query params: `{ page, limit, search, category }`

- **GET /api/events/:id**
  - Get event details

- **POST /api/events**
  - Create new event
  - Requires: JWT token
  - Body: `{ title, description, date, time, location, category, price, totalTickets }`

- **PUT /api/events/:id**
  - Update event
  - Requires: JWT token

### Booking Service (3003)

- **POST /api/bookings**
  - Create booking
  - Requires: JWT token
  - Body: `{ eventId, tickets }`

- **GET /api/bookings**
  - Get user's bookings
  - Requires: JWT token

- **GET /api/bookings/:id**
  - Get booking details
  - Requires: JWT token

### Notification Service (3004)

- **GET /api/notifications**
  - Get user notifications
  - Query params: `{ userEmail }`

- **PUT /api/notifications/:id/read**
  - Mark notification as read

- **PUT /api/notifications/read-all**
  - Mark all notifications as read
  - Body: `{ userEmail }`

## Setup Guide

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- RabbitMQ
- Supabase account
- Gmail account (for notifications)

### Environment Variables

1. User Service (.env)
```
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
JWT_SECRET=your_jwt_secret
```

2. Event Service (.env)
```
PORT=3002
MONGODB_URI=your_mongodb_uri
USER_SERVICE_URL=http://localhost:3001
```

3. Booking Service (.env)
```
PORT=3003
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
RABBITMQ_URL=amqp://guest:guest@localhost:5672
USER_SERVICE_URL=http://localhost:3001
EVENT_SERVICE_URL=http://localhost:3002
```

4. Notification Service (.env)
```
PORT=3004
MONGODB_URI=your_mongodb_uri
RABBITMQ_URL=amqp://guest:guest@localhost:5672
EMAIL_SERVICE=gmail
EMAIL_USER=your_gmail
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_gmail
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/event-booking.git
cd event-booking
```

2. Install dependencies for each service:
```bash
cd user-service && npm install
cd ../event-service && npm install
cd ../booking-service && npm install
cd ../notification-service && npm install
cd ../client && npm install
```

3. Start the services:

For Windows (PowerShell):
```powershell
./start-services.ps1
```

For Unix/Linux:
```bash
# Terminal 1
cd user-service && npm start

# Terminal 2
cd event-service && npm start

# Terminal 3
cd booking-service && npm start

# Terminal 4
cd notification-service && npm start

# Terminal 5
cd client && npm start
```

### Database Setup

1. Create a Supabase project and run the SQL scripts:
   - `docs/sql/users_table.sql`
   - `docs/sql/bookings_table.sql`
   - `docs/sql/fix_bookings_rls.sql`

2. MongoDB collections will be created automatically when the services start.

## Features

- User authentication and profile management
- Event creation and management
- Ticket booking system
- Real-time email notifications
- Responsive UI with Material-UI
- JWT-based authentication
- Message queue for reliable notifications
- Error handling and logging
- API documentation
- Database schema with proper indexing
- Row Level Security in Supabase

## Tech Stack

- **Backend**:
  - Node.js
  - Express
  - MongoDB
  - Supabase (PostgreSQL)
  - RabbitMQ
  - JWT
  - Nodemailer

- **Frontend**:
  - React
  - TypeScript
  - Material-UI
  - React Query
  - React Router
  - Axios
  - React Hook Form
  - Yup validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

