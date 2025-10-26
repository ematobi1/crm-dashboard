# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LeadStream CRM is a Node.js/Express backend API for managing sales leads with real-time collaboration features. The application uses MongoDB for data persistence, Redis for caching/session management, Socket.IO for real-time updates, and Bull for job queuing.

## Development Commands

```bash
# Start server in production mode
npm start

# Start server in development mode with auto-reload
npm run dev

# Run tests
npm test
```

## Architecture

### Core Stack
- **Express.js**: REST API framework
- **MongoDB + Mongoose**: Database layer with schema validation
- **Redis**: Caching and real-time user presence tracking
- **Socket.IO**: Real-time bidirectional event-based communication
- **Bull**: Redis-based queue for background job processing
- **Winston**: Structured logging

### Application Structure

**Entry Point**: `src/app.js` - Initializes Express server, Socket.IO, MongoDB, and Redis connections

**Models** (`src/models/`):
- `user.js` - User schema with roles (admin, manager, sales_rep, support), bcrypt password hashing, and preferences
- `lead.js` - Lead schema with status tracking, activity logs, notes, and performance indexes

**Routes** (`src/routes/`):
- `auth.js` - Authentication endpoints (register, login, /me)
- `leads.js` - Comprehensive lead management including CRUD, bulk operations, CSV export, analytics, and follow-up automation
- `users.js` - User profile management

**Middleware** (`src/middleware/`):
- `auth.js` - JWT authentication and role-based authorization
- `errorHandler.js` - Centralized error handling with Mongoose error normalization

**Services** (`src/services/`):
- `socketHandler.js` - Real-time WebSocket event management for lead updates, typing indicators, user presence, and availability status

**Utilities** (`src/utils/`):
- `logger.js` - Winston logger configuration with environment-based log levels

### Key Design Patterns

**Request Enhancement Pattern**: The application injects `io` (Socket.IO) and `redisClient` into Express requests via middleware (src/app.js:71-75), allowing routes to emit real-time events without direct dependencies.

**Role-Based Access Control**:
- Sales reps can only access leads assigned to them
- Managers and admins have full visibility
- Implemented via the `authorize()` middleware wrapper

**Real-Time Synchronization**: Routes emit Socket.IO events after database mutations (e.g., `newLead`, `leadUpdated`, `leadDeleted`, `leadNoteAdded`) to notify connected clients.

**Activity Tracking**: The Lead model maintains an `activities` array that automatically logs status changes, notes, and actions for audit trails.

### Authentication Flow

1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. JWT token is issued with 7-day expiration
3. Client includes token in `Authorization: Bearer <token>` header
4. Socket.IO connections authenticate via `socket.handshake.auth.token`
5. The `auth` middleware validates token and attaches `req.user` object

### Socket.IO Events

**Client → Server**:
- `joinLead(leadId)` - Subscribe to lead updates
- `leaveLead(leadId)` - Unsubscribe from lead
- `leadUpdate(data)` - Broadcast lead changes to room
- `leadTyping(data)` - Notify others of typing status
- `updateAvailability(status)` - Set user availability

**Server → Client**:
- `newLead` - New lead created
- `leadUpdated` - Lead data changed
- `leadDeleted` - Lead removed
- `leadNoteAdded` - Note added to lead
- `userTyping` - User is typing in lead

### Database Indexes

The Lead model has performance indexes on:
- `email` - For lead lookup
- `assignedTo + status` - For filtered queries
- `createdAt` (descending) - For chronological sorting
- `score` (descending) - For priority sorting

### Environment Configuration

Required environment variables:
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - Secret key for JWT signing (min 32 characters)
- `FRONTEND_URL` - CORS-allowed origin
- `NODE_ENV` - Environment mode (affects log level)

### Testing

Currently configured with Jest and Supertest (see devDependencies), though no test files exist yet. Tests should be created in `__tests__` directory or with `.test.js` suffix.

### Lead Management Features

**Filtering & Pagination**: GET `/api/leads` supports query params: `status`, `priority`, `assignedTo`, `source`, `search`, `startDate`, `endDate`, `sortBy`, `sortOrder`, `page`, `limit`

**Bulk Operations**:
- POST `/api/leads/bulk/update` - Update multiple leads
- POST `/api/leads/bulk/delete` - Delete multiple leads (admin/manager only)

**Analytics**: GET `/api/leads/analytics/dashboard` provides conversion rates, response times, and status/source distributions

**Automation**:
- GET `/api/leads/next-lead` - Returns highest priority lead for the user to contact
- POST `/api/leads/send-followup` - Automatically sends follow-up emails to leads inactive for 3+ days

### Response Time Tracking

When a lead status changes from "new" to "contacted" or "qualified", the system automatically calculates `responseTime` (in minutes) and sets `lastContactedAt`.

### Security Features

- Helmet.js for HTTP security headers
- Rate limiting: 100 requests per 15 minutes per IP on `/api/*`
- CORS restricted to `FRONTEND_URL`
- Passwords hashed with bcrypt (cost factor: 12)
- JWT tokens expire after 7 days

### Redis Usage

- User online status: `user:{userId}:online` (TTL: 5 minutes)
- User availability: `user:{userId}:available` (TTL: 1 hour)

### Health Check

GET `/api/health` returns server status including MongoDB and Redis connection states.
