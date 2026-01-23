# Bird Wars - Async Battle Server

## Overview
A Next.js application with MongoDB backend for async multiplayer turn-based tactics game (Bird Wars) on Playdate. The server handles device registration with secure token-based authentication, battle session management, and turn submission with validation.

## Tech Stack
- **Framework**: Next.js 16 with App Router
- **Database**: MongoDB (via Mongoose)
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Project Structure
```
/app                    # Next.js App Router pages and API routes
  /api
    /register          # Device registration endpoint
    /battles           # Battle CRUD endpoints
    /battles/[id]      # Single battle operations
    /turns             # Turn submission endpoint
  /dashboard           # Dashboard page
  /battles             # Battles list page
  /battles/[id]        # Battle detail page
  /devices             # Device management page
/components/ui         # Reusable UI components (Button, Card, Badge)
/lib                   # Utilities and database connection
  /mongodb.ts          # MongoDB connection singleton
  /auth.ts             # Token generation and HMAC utilities
  /authMiddleware.ts   # Device authentication middleware
  /utils.ts            # Helper functions
/models                # Mongoose models
  /Device.ts           # Device schema
  /Battle.ts           # Battle schema
  /Turn.ts             # Turn schema
```

## Key Features

### 1. Device Registration
- Server-issued secure tokens (not predictable UUIDs)
- Token stored on Playdate device for authentication
- Tokens cannot be retrieved after registration

### 2. Battle Management
- Create battles (pending state until opponent joins)
- Join pending battles
- Track current turn and active player

### 3. Turn Submission
- Authenticated endpoints require Bearer token
- Turn validation (action types, sequence)
- Server maintains authoritative game state
- Prevents replay attacks (turn number validation)

## API Endpoints

### POST /api/register
Register a new Playdate device.
```json
Request: { "displayName": "My Playdate" }
Response: { "deviceId": "...", "secretToken": "...", "success": true }
```

### GET /api/battles
List all battles (optionally filtered by device token).

### POST /api/battles
Create a new battle (requires auth).
```json
Request: { "mapData": {...} }
Response: { "battleId": "...", "status": "pending" }
```

### PATCH /api/battles/[id]
Join a pending battle (requires auth).

### GET /api/battles/[id]
Get battle details and turn history.

### POST /api/turns
Submit a turn (requires auth).
```json
Request: {
  "battleId": "...",
  "actions": [
    { "type": "move", "unitId": "u1", "from": {"x":1,"y":2}, "to": {"x":3,"y":2} },
    { "type": "attack", "unitId": "u1", "targetId": "enemy1" },
    { "type": "end_turn" }
  ],
  "gameState": {...}
}
```

## Authentication
All mutating endpoints (except registration) require:
```
Authorization: Bearer <secret-token>
```

## Environment Variables
- `MONGODB_URI` - MongoDB connection string (required)
- `SESSION_SECRET` - Session secret (optional)

## Running the Application
The app runs on port 5000 via `npm run dev` which starts Next.js.
