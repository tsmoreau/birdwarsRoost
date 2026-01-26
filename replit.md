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
    /ping              # Device ping endpoint (records pings to DB)
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
  /battleNames.ts      # Deterministic battle name generator
  /utils.ts            # Helper functions
/models                # Mongoose models
  /Device.ts           # Device schema
  /Battle.ts           # Battle schema
  /Turn.ts             # Turn schema
  /Ping.ts             # Ping schema
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

### State Management

The Battle document now has a structured `currentState` field:

```typescript
battle.currentState = {
  units: [
    { unitId: "p1_u0", type: "BIRD1", x: 2, y: 3, hp: 10, owner: "player1DeviceId" },
    { unitId: "p1_u1", type: "BIRD4", x: 4, y: 5, hp: 8, owner: "player1DeviceId" },
    { unitId: "p2_u0", type: "BIRD6", x: 10, y: 3, hp: 10, owner: "player2DeviceId" }
  ],
  blockedTiles: [
    { x: 5, y: 5, itemType: "garbageCan" },
    { x: 8, y: 2, itemType: "parkBench" }
  ]
}
```

#### Two Components

**1. `currentState.blockedTiles`** - static, from mapData:
- Items with `canMoveOn = false` (trash cans, benches)
- Loaded once when battle starts (player 2 joins)
- Never changes during battle

**2. `currentState.units`** - dynamic, updated per turn:
- All living units: `{unitId, type, x, y, hp, owner}`
- Updated after each valid turn based on client's gameState

#### State Update Flow
When a turn is submitted:
```
1. Client submits actions + gameState.units
2. Server accepts client's reported unit positions/HP
3. Server updates battle.currentState.units
4. Dead units (hp <= 0) are filtered out
```

### What the Server Tracks
- **currentState.blockedTiles**: Static impassable tiles from mapData
- **currentState.units**: Current unit positions and HP
- **Turn order**: Which player's turn, turn number
- **Battle state**: pending → active → completed

### What Comes from mapData
- Initial unit placements (per player) → seeds `currentState.units`
- Item positions where `canMoveOn=false` → seeds `currentState.blockedTiles`
- Terrain layout (for reference, not validated)
- Building/nest positions
- Grid dimensions

### Validation Rules (Current)
✅ Implemented:
- Correct player submitting (not opponent's turn)
- Battle is active status
- Turn number matches expected (no replays)
- Device is participant in battle
- Turn includes end_turn action

🔜 Planned (Phase 2):
- **Tile collision**: destination not in `blockedTiles` OR `occupiedTiles`
- **Movement range**: distance(from, to) <= unit's `moveSpaces`
- **Unit ownership**: can't control enemy units
- **Unit existence**: unitId must exist in `occupiedTiles`

### Not Server-Validated (Client Responsibility)
- Pathfinding (exact route taken)
- Attack range validation
- Damage calculation (server accepts reported damage)
- Resource/currency management (food depletion)
- Fog of war
- Terrain movement costs

---

## API Endpoints

### Device Registration

#### POST /api/register
**Dual-purpose endpoint:**
- Without token → Register new device, receive secretToken
- With token → Verify registration, optionally update displayName/avatar

**Avatar Options:** BIRD1-BIRD12 (default: BIRD1)

```
# New registration
POST /api/register
{ "displayName": "My Playdate", "avatar": "BIRD4" }
→ 201: { deviceId, secretToken, avatar, registered: false }

# Verify existing
POST /api/register
Authorization: Bearer <token>
→ 200: { deviceId, displayName, avatar, registered: true }

# Update profile
POST /api/register
Authorization: Bearer <token>
{ "displayName": "New Name", "avatar": "BIRD7" }
→ 200: { deviceId, displayName, avatar, registered: true, message: "...updated" }
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
List battles for authenticated device. Supports `?status=` filter (pending, active, completed, abandoned).

**Auto-Forfeit:** When fetching battles, the server checks all active battles. If the opponent hasn't submitted a turn in 7 days, they automatically forfeit.

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
  "gameState": {
    "units": [
      { "unitId": "u1", "type": "BIRD1", "x": 3, "y": 2, "hp": 10, "owner": "device1..." }
    ]
  }
}
```

### Device Ping

#### POST /api/ping
Record a ping from the Playdate device (requires auth). Captures device info, IP address, user agent, and optional message.
```json
{
  "message": "Hello from Playdate!" // optional
}
```
Response:
```json
{
  "success": true,
  "message": "Ping received",
  "pingId": "6975e77b60630a547b8b8f9d",
  "displayName": "MyPlaydate",
  "timestamp": "2026-01-25T09:50:51.867Z"
}
```

#### GET /api/ping
List recorded pings (requires auth). Supports `?limit=` (default 50, max 100) and `?deviceId=` filters.
```json
{
  "success": true,
  "pings": [
    {
      "id": "...",
      "deviceId": "...",
      "displayName": "MyPlaydate",
      "ipAddress": "127.0.0.1",
      "message": "Hello!",
      "createdAt": "2026-01-25T09:50:51.867Z"
    }
  ]
}
```

### Player Statistics

#### GET /api/stats
Get player statistics for authenticated device. Returns battle counts, win/loss record, and total turns.
```json
{
  "success": true,
  "stats": {
    "deviceId": "a0dcb007...",
    "displayName": "My Playdate",
    "memberSince": "2025-01-15T10:30:00.000Z",
    "totalBattles": 15,
    "completedBattles": 12,
    "activeBattles": 2,
    "pendingBattles": 1,
    "wins": 8,
    "losses": 3,
    "draws": 1,
    "winRate": "66.7%",
    "totalTurnsSubmitted": 142
  }
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
- [ ] Load mapData to seed `blockedTiles` (static items) and `occupiedTiles` (initial units)
- [ ] Track `occupiedTiles` updates per turn (remove old position, add new position)
- [ ] Validate tile collisions: destination not in `blockedTiles` OR `occupiedTiles`
- [ ] Validate movement range: distance <= unit's `moveSpaces`
- [ ] Validate unit ownership: can't control enemy units
- [ ] Validate unit existence: unitId must exist in `occupiedTiles`

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
