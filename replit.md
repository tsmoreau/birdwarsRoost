# Bird Wars - Async Battle Server

## Overview
A Next.js application with MongoDB backend for async multiplayer turn-based tactics game (Bird Wars) on Playdate. The server handles device registration with secure token-based authentication, battle session management, and turn submission with validation. Inspired by Advance Wars-style gameplay.

## Tech Stack
- **Framework**: Next.js 16 with App Router
- **Database**: MongoDB (via Mongoose)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Client**: Playdate (Lua)

## Project Structure
```
/app                    # Next.js App Router pages and API routes
  /api
    /register          # Device registration (dual-purpose: register/verify/update name)
    /battles           # Battle CRUD endpoints
    /battles/[id]      # Single battle operations (GET details, PATCH to join)
    /mybattles         # Player's own battles
    /turns             # Turn submission endpoint
  /dashboard           # Dashboard page
  /battles             # Battles list page
  /battles/[id]        # Battle detail page
  /devices             # Device management page
  /schema              # API schema documentation page
/components            # React components
  /Nav.tsx             # Shared navigation (uses birb001.png icon)
  /ui                  # Reusable UI components (Button, Card, Badge)
/lib                   # Utilities and database connection
  /mongodb.ts          # MongoDB connection singleton
  /auth.ts             # Token generation and HMAC utilities
  /authMiddleware.ts   # Device authentication middleware
  /utils.ts            # Helper functions
/models                # Mongoose models
  /Device.ts           # Device schema
  /Battle.ts           # Battle schema
  /Turn.ts             # Turn schema
/public
  /birb001.png         # App icon (used in Nav)

battleConfig.lua       # Game configuration (source of truth from Playdate client)
API_SCHEMA.md          # Complete API documentation for client integration
```

## Game Configuration (battleConfig.lua)

The Lua config file from the Playdate client defines all game rules:

### 12 Bird Units
| Bird | Name | Role | Move | Attack Range | Cost | Notes |
|------|------|------|------|--------------|------|-------|
| BIRD1 | Pigeon | Infantry | 4 | 1 | 10 | Can capture, cheap |
| BIRD2 | Bluejay | Recon | 7 | 1 | 40 | Fast scout |
| BIRD3 | Raven | Mech | 4 | 1 | 30 | Anti-armor infantry |
| BIRD4 | Duck | Light Tank | 5 | 1 | 80 | Balanced combat |
| BIRD5 | Seagull | Artillery | 4 | 2-3 | 60 | Indirect fire |
| BIRD6 | Goose | Heavy Tank | 4 | 1 | 160 | High armor/damage |
| BIRD7 | Toucan | Rockets | 4 | 3-5 | 150 | Long range indirect |
| BIRD8 | Pelican | APC | 4 | 0 | 50 | Transport, no attack |
| BIRD9 | Hummingbird | B-Copter | 7 | 1 | 90 | Always flying |
| BIRD10 | Owl | Stealth | 5 | 1 | 180 | 1.35x vs flying |
| BIRD11 | Eagle | Jet | 7 | 1 | 200 | 1.5x vs flying |
| BIRD12 | Penguin | Anti-Air | 6 | 1 | 70 | 2x vs flying, ground only |

### Terrain System
- **Defense**: grass=20, sand=10, concrete=0, water=0
- **Movement Cost**: grass=2, water=3, asphalt=1, sand=2

### Other Entities
- **Food**: Fries (150 power), Burger (300 power)
- **Items**: Garbage Can, Park Bench (block movement)
- **Nests**: Nest, Sticks, Mega Nest (capture points)

---

## Server Validation Architecture

### Design Philosophy
The server is a **lightweight state tracker**, not a full game engine. The Playdate client handles all complex game logic (pathfinding, damage calculation, animations). The server only validates what's necessary to prevent cheating.

### What the Server Tracks
- **Occupied tiles**: `{unitId, x, y, owner, hp}`
- **Unit deaths**: Remove from occupied tiles when HP <= 0
- **Turn order**: Which player's turn, turn number
- **Battle state**: pending → active → completed

### What Comes from mapData
- Initial unit placements (per player)
- Terrain layout
- Building/nest positions
- Grid dimensions

### Validation Rules (Current)
✅ Implemented:
- Correct player submitting (not opponent's turn)
- Battle is active status
- Turn number matches expected (no replays)
- Device is participant in battle
- Turn includes end_turn action

🔜 Planned:
- Tile collision (can't move to occupied tile)
- Unit ownership (can't control enemy units)
- Unit existence (unitId must be valid)

### Not Server-Validated (Client Responsibility)
- Movement range/pathfinding
- Attack range validation
- Damage calculation
- Resource/currency management
- Fog of war

---

## API Endpoints

### Device Registration

#### POST /api/register
**Dual-purpose endpoint:**
- Without token → Register new device, receive secretToken
- With token → Verify registration, optionally update displayName

```
# New registration
POST /api/register
{ "displayName": "My Playdate" }
→ 201: { deviceId, secretToken, registered: false }

# Verify existing
POST /api/register
Authorization: Bearer <token>
→ 200: { deviceId, displayName, registered: true }

# Update name
POST /api/register
Authorization: Bearer <token>
{ "displayName": "New Name" }
→ 200: { deviceId, displayName, registered: true, message: "...updated" }
```

### Battle Management

#### GET /api/battles
List public battles (excludes private).

#### POST /api/battles
Create battle (requires auth). Status starts as "pending".

#### GET /api/battles/[id]
Get battle details + turn history.

#### PATCH /api/battles/[id]
Join pending battle (requires auth). Cannot join after started.

#### GET /api/mybattles
List battles for authenticated device.

### Turn Submission

#### POST /api/turns
Submit turn actions (requires auth).
```json
{
  "battleId": "...",
  "actions": [
    { "type": "move", "unitId": "u1", "from": {"x":1,"y":2}, "to": {"x":3,"y":2} },
    { "type": "attack", "unitId": "u1", "targetId": "enemy1" },
    { "type": "end_turn" }
  ],
  "gameState": { "occupiedTiles": [...], "unitStates": {...} }
}
```

---

## Authentication

All mutating endpoints (except new registration) require:
```
Authorization: Bearer <secret-token>
```

Tokens are:
- Server-issued (secure random, not UUIDs)
- Hashed with HMAC-SHA256 before storage
- Cannot be retrieved after initial registration

---

## Environment Variables
- `MONGODB_URI` - MongoDB connection string (required)
- `SESSION_SECRET` - For token hashing, min 32 chars (required)

---

## UI Design Decisions
- **Greyscale theme** except for API method badges (POST=green, GET=blue, PATCH=yellow) and status badges
- **Shared Nav component** with automatic active state based on pathname
- **Branding**: "Bird Wars Roost!" with birb001.png icon

---

## Development Roadmap

### Phase 1: Core API ✅
- [x] Device registration with secure tokens
- [x] Battle creation and joining
- [x] Turn submission with basic validation
- [x] Dashboard and admin UI
- [x] API documentation (API_SCHEMA.md)

### Phase 2: Server-Side Validation 🔜
- [ ] Convert battleConfig.lua to TypeScript/JSON
- [ ] Load mapData to establish initial game state
- [ ] Track occupied tiles per battle
- [ ] Validate tile collisions on move actions
- [ ] Validate unit ownership

### Phase 3: Enhanced Features
- [ ] Map file upload/storage
- [ ] Spectator mode
- [ ] Battle history/replays
- [ ] Player statistics

---

## Running the Application
```bash
npm run dev  # Starts Next.js on port 5000
```

## Files for Client Integration
- `API_SCHEMA.md` - Complete API documentation
- `battleConfig.lua` - Game rules reference (kept in sync with Playdate client)
