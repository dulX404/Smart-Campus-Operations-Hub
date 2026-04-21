# Smart Campus Operations Hub

Smart Campus Operations Hub is a group university project scaffold designed for team development with a modular monolith architecture. This repository includes a Spring Boot backend, a React frontend, MongoDB integration placeholders, CI setup, and collaboration-focused documentation.

## Project Overview

The project is structured to support campus operations features such as resource management, bookings, ticket handling, notifications, and authentication. This starter setup focuses on a clean foundation so each team member can develop their assigned module without fighting the project structure.

## Tech Stack

- Backend: Java 17, Spring Boot, Maven
- Frontend: React, Vite, Tailwind CSS
- Database: MongoDB with Spring Data MongoDB
- Security: Spring Security, OAuth2 Client
- Version Control: GitHub
- CI: GitHub Actions

## Architecture

This project uses a modular monolith architecture:

- One backend application
- One frontend application
- One MongoDB database
- Backend modules grouped by business area
- Layered structure inside each module: controller, service, repository, entity, dto

This approach keeps the system simple for a student team while still making it easy to scale and maintain.

## Why MongoDB

MongoDB is used because it fits well with fast-moving project development and flexible document-based data models. For this project:

- Separate collections are used for `users`, `resources`, `bookings`, `tickets`, `comments`, and `notifications`
- Relationships are handled through referenced IDs instead of deep nested documents
- Documents stay simple and easy to evolve as requirements change

## Repository Structure

```text
smart-campus-operations-hub/
├── backend/
├── frontend/
├── docs/
└── .github/workflows/
```

## Setup Steps

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd smart-campus-operations-hub
```

### 2. Backend environment

Create a `.env` file or export environment variables for backend configuration:

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=smart_campus_db
APP_CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### 3. Frontend environment

Copy the example file:

```bash
cp frontend/.env.example frontend/.env
```

Update the API base URL if needed.

## Run Instructions

### Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
pnpm install
pnpm run dev
```

### Health Check

Once the backend is running:

```bash
GET http://localhost:8080/api/health
```

## Team Development Notes

- Keep feature work inside your assigned module
- Use the `dev` branch for integration
- Open pull requests instead of pushing directly to `main`
- Avoid changing another member's module unless discussed first
