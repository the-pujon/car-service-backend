# Car Service Backend

## Project Overview

This is the backend codebase for a Car service website

## Setup

1. Install dependencies: `npm install`
2. Start the server: `npm run start:dev` for development with nodemon.
3. The server will be running on `http://localhost:5000`.

<!--## Project Structure

- `src/config/db.js`: MongoDB connection setup.
- `src/routes/`: Contains route handlers for different entities (users, instructors, classes, payments, categories).
- `src/controllers/`: Controllers for each entity's CRUD operations.
- `src/middlewares/auth.js`: Authentication and authorization middleware.
- `app.js`: Main application file with configuration and route setup.
- `package.json`: Project metadata and dependencies.-->

## Endpoints

### Users

- `POST /api/auth/signup`: Create a new user.
- `POST /api/users/login`: Login user.

### Service

- `GET /api/services`: Get all services.
- `POST /api/services`: Add a new instructor. (requires admin privileges)
- `GET /api/services/:id`: Get a single service by id.
- `PUT /api/services/:id`: Update an service by email. (requires admin privileges)
- `DELETE /api/service/:id`: Delete an service by id. (requires admin privileges)

### Slot

- `POST /api/services/slot`: Create new slots. (requires admin privileges).
- `GET /api/slots/availability`: Get slots

  **Query Parameters:**

           `date`: (Optional) The specific date for which available slots are requested (format: YYYY-MM-DD).

           `serviceId`: (Optional) ID of the service for which available slots are requested.

  **Request Example:**

          GET /api/slots/availability?date=2024-06-15&serviceId=60d9c4e4f3b4b544b8b8d1c5

### Booking

- `POST /api/bookings`: Create new booking for user (requires authentication and user privileges).
- `GET /api/bookings`: Get all bookings. (requires admin privileges)
- `GET /api/my-bookings`: Get all bookings for user. (requires user privileges)

## Middleware

- `auth`: verify authorization (user/admin).
- `globalErrorHandler`: A global error handler for this entire project.
- `notFoundRouteHandler`: A handler for handling not found route.
- `validateRequest`: A handler for handling zod validation

## Scripts

- `npm run start:dev`: Starts the server.

## Project Demo

Click [here](https://car-service-pi.vercel.app/) to view the Skills Voyage project.

<!--For Frontend, click [here](https://github.com/the-pujon/skill-voyage-frontend).-->

---

## Credentials

### Admin Login:

- **Email:** web@programming-hero.com
- **Password:** ph-password

### User Login:

- **Email:** webcoder@programming-hero.com
- **Password:** ph-password

---

<div align="center">
  <a href="https://car-service-pi.vercel.app/">Explore the car service api</a>
</div>
