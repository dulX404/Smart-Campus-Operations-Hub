# Project Structure

## Modular Monolith Architecture

This project uses a modular monolith architecture to keep the system simple for a university team project while still maintaining clear separation of responsibilities.

### Why this architecture

- Easier to set up and run than microservices
- Good for a team with limited time
- Keeps all modules in one codebase
- Makes collaboration, debugging, and deployment simpler

## Backend Structure

The backend follows both:

- Layered architecture
- Module-based organization

Each module is grouped by business area and contains:

- `controller`
- `service`
- `repository`
- `entity`
- `dto`

Examples:

- `resources`
- `bookings`
- `tickets`
- `notifications`
- `auth`

Shared concerns are placed in common packages such as:

- `config`
- `security`
- `exception`
- `response`
- `common`

## MongoDB Usage Approach

MongoDB is used with separate collections for:

- `users`
- `resources`
- `bookings`
- `tickets`
- `comments`
- `notifications`

### Data modeling rule

Use references between collections by storing related document IDs instead of embedding large nested objects.

Examples:

- A booking stores `userId` and `resourceId`
- A notification stores `userId`
- A comment stores `ticketId` and `userId`

This keeps documents simpler, reduces duplication, and makes future updates easier.
