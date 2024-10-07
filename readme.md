# Sparkle Car Wash Backend

## Project Overview

This is the backend codebase for a Car service website

## Setup

1. Install dependencies: `npm install`
2. Start the server: `npm run start:dev` for development with nodemon.
3. The server will be running on `http://localhost:5000`.

## Project Structure

```
|   app.ts
|   server.ts
|
\---app
    +---config
    +---errors
    +---interface
    +---middlewares
    +---modules
    |   +---auth
    |   +---booking
    |   +---review
    |   +---service
    |   \---slot
    +---routes
    \---utils
```

## Endpoints

### Auth

- `POST /api/auth/signup`: Create a new user.
- `POST /api/auth/login`: Login user.
- `PATCH /api/auth/update-profile`: Update user's own profile. (requires authentication)
- `PATCH /api/auth/update-role/:id`: Update user's role. (requires admin privileges)
- `GET /api/auth/users`: Get all users. (requires admin privileges)
- `GET /api/auth/users/:id`: Get a single user by id. (requires authentication)
- `GET /api/auth/users/email/:email`: Get a single user by email. (requires admin privileges)

### Service

- `GET /api/services`: Get all services.
- `POST /api/services`: Add a new service. (requires admin privileges)
- `GET /api/services/:id`: Get a single service by id.
- `PATCH /api/services/:id`: Update a service by id. (requires admin privileges)
- `DELETE /api/services/:id`: Delete a service by id. (requires admin privileges)

### Slot

- `POST /api/services/slots`: Create new slots. (requires admin privileges)
- `GET /api/services/slots/availability`: Get available slots
- `GET /api/services/slots/:id`: Get a slot by id
- `PATCH /api/services/slots/:id`: Update slot status (requires admin privileges)

### Booking

- `POST /api/bookings`: Create new booking for user (requires user privileges)
- `GET /api/bookings`: Get all bookings (requires admin privileges)
- `GET /api/bookings/my-bookings`: Get all bookings for user (requires user privileges)
- `GET /api/bookings/customer/:customerId`: Get bookings by customer ID (requires admin privileges)

### Review

- `POST /api/reviews`: Create a new review (requires authentication)
- `GET /api/reviews`: Get all reviews
- `GET /api/reviews/my-reviews`: Get user's own reviews (requires user privileges)

## Middleware

- `auth`: Verify authorization (user/admin).
- `globalErrorHandler`: A global error handler for this entire project.
- `notFoundRouteHandler`: A handler for handling not found routes.
- `validateRequest`: A handler for handling zod validation.

## Scripts

- `npm run start`: Starts the production server.
- `npm run start:prod`: Starts the production server (alternative).
- `npm run start:dev`: Starts the development server with hot-reloading.
- `npm run build`: Builds the TypeScript project.
- `npm run lint`: Runs ESLint on the source files.
- `npm run lint:fix`: Runs ESLint and attempts to fix issues.
- `npm run prettier`: Runs Prettier on the source files.
- `npm run prettier:fix`: Runs Prettier and fixes formatting issues.

## Project Demo

Click [here](https://car-service-frontend-ten.vercel.app/) to view the Car Service project.

## Credentials

### Admin Login:

- **Email:** web@programming-hero.com
- **Password:** ph-password

### User Login:

- **Email:** webcoder@programming-hero.com
- **Password:** ph-password

---

<div align="center">
  <a href="https://car-service-frontend-ten.vercel.app/">Explore the car service API</a>
</div>
