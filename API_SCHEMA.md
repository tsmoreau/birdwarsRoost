# Bird Wars API Schema

This document provides complete API documentation for the Bird Wars async battle server. Use this reference when building game client logic to communicate with the server.

## Base URL

```
https://your-deployment-url.replit.app/api
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <secret-token>
```

The `secret-token` is obtained during device registration and must be stored securely on the device. It cannot be retrieved after registration.

---

## Endpoints

### 1. Device Registration

#### POST /api/register

Register a new device, verify an existing registration, or update display name.

This is a dual-purpose endpoint:
- **Without token:** Register a new device
- **With token:** Verify registration and optionally update display name

**Authentication:** Optional (Bearer token)

**Request Body:**
```json
{
  "displayName": "My Playdate"  // optional, max 100 chars
}
```

---

**Scenario 1: New Registration (no Authorization header)**

**Success Response (201):**
```json
{
  "success": true,
  "registered": false,
  "deviceId": "a1b2c3d4e5f6...",
  "secretToken": "sk_live_xxxxxxxxxxxxxxxx",
  "displayName": "My Playdate",
  "message": "Device registered successfully. Store this token securely - it cannot be retrieved again."
}
```

**Important:** Store the `secretToken` immediately. It is only returned once and cannot be recovered.

---

**Scenario 2: Verify Existing Registration (with valid Authorization header)**

```
Authorization: Bearer <secret-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "registered": true,
  "deviceId": "a1b2c3d4e5f6...",
  "displayName": "My Playdate",
  "registeredAt": "2025-01-23T12:00:00.000Z",
  "message": "Device already registered."
}
```

---

**Scenario 3: Update Display Name (with valid token + new displayName in body)**

```
Authorization: Bearer <secret-token>
Content-Type: application/json

{ "displayName": "New Name" }
```

**Success Response (200):**
```json
{
  "success": true,
  "registered": true,
  "deviceId": "a1b2c3d4e5f6...",
  "displayName": "New Name",
  "registeredAt": "2025-01-23T12:00:00.000Z",
  "message": "Device verified and display name updated."
}
```

---

**Error Responses:**
- `400` - Invalid request body
- `429` - Rate limit exceeded (max 10 registrations per minute, only applies to new registrations)
- `500` - Server error

**Client Flow:**
1. On first launch, call `POST /api/register` without token → store returned `secretToken`
2. On subsequent launches, call `POST /api/register` with stored token in Authorization header → verify registration
3. To change name, call with token + new `displayName` in body

---

#### GET /api/register

List all registered devices (for admin/dashboard use).

**Authentication:** None required

**Success Response (200):**
```json
{
  "success": true,
  "devices": [
    {
      "deviceId": "a1b2c3d4e5f6...",
      "displayName": "My Playdate",
      "registeredAt": "2025-01-23T12:00:00.000Z",
      "lastSeen": "2025-01-23T14:30:00.000Z"
    }
  ]
}
```

---

### 2. Battle Management

#### GET /api/battles

List all public battles (excludes private battles).

**Authentication:** None required

**Success Response (200):**
```json
{
  "success": true,
  "battles": [
    {
      "battleId": "abc123def456",
      "player1DeviceId": "device1...",
      "player2DeviceId": "device2..." | null,
      "status": "pending" | "active" | "completed" | "abandoned",
      "currentTurn": 0,
      "currentPlayerIndex": 0,
      "createdAt": "2025-01-23T12:00:00.000Z",
      "updatedAt": "2025-01-23T12:00:00.000Z",
      "winnerId": null | "deviceId...",
      "mapData": {},
      "isPrivate": false
    }
  ]
}
```

---

#### POST /api/battles

Create a new battle.

**Authentication:** Required

**Request Body:**
```json
{
  "mapData": {},        // optional, custom map configuration
  "isPrivate": false    // optional, if true the battle won't appear in public listings
}
```

**Success Response (201):**

For public battles:
```json
{
  "success": true,
  "battle": {
    "battleId": "abc123def456",
    "status": "pending",
    "currentTurn": 0,
    "isPrivate": false
  },
  "message": "Battle created. Waiting for opponent to join."
}
```

For private battles:
```json
{
  "success": true,
  "battle": {
    "battleId": "abc123def456",
    "status": "pending",
    "currentTurn": 0,
    "isPrivate": true
  },
  "message": "Private battle created. Share the battleId with your opponent to join."
}
```

**Error Responses:**
- `400` - Invalid request body
- `401` - Authentication required
- `500` - Server error

---

#### GET /api/battles/[id]

Get battle details and turn history.

**Authentication:** None required

**URL Parameters:**
- `id` - The battle ID

**Success Response (200):**
```json
{
  "success": true,
  "battle": {
    "battleId": "abc123def456",
    "player1DeviceId": "device1...",
    "player2DeviceId": "device2...",
    "status": "active",
    "currentTurn": 5,
    "currentPlayerIndex": 1,
    "createdAt": "2025-01-23T12:00:00.000Z",
    "updatedAt": "2025-01-23T14:30:00.000Z",
    "winnerId": null,
    "mapData": {},
    "isPrivate": false
  },
  "turns": [
    {
      "turnId": "turn123...",
      "battleId": "abc123def456",
      "deviceId": "device1...",
      "turnNumber": 1,
      "actions": [...],
      "timestamp": "2025-01-23T12:05:00.000Z",
      "isValid": true,
      "validationErrors": [],
      "gameState": {}
    }
  ]
}
```

**Error Responses:**
- `404` - Battle not found
- `500` - Server error

---

#### PATCH /api/battles/[id]

Join a pending battle as player 2.

**Authentication:** Required

**URL Parameters:**
- `id` - The battle ID to join

**Success Response (200):**
```json
{
  "success": true,
  "battle": {
    "battleId": "abc123def456",
    "status": "active",
    "currentTurn": 0,
    "player1DeviceId": "device1...",
    "player2DeviceId": "device2...",
    "currentState": {
      "units": [
        { "unitId": "device1_u0", "type": "BIRD1", "x": 2, "y": 3, "hp": 10, "owner": "device1..." },
        { "unitId": "device2_u0", "type": "BIRD4", "x": 10, "y": 3, "hp": 10, "owner": "device2..." }
      ],
      "blockedTiles": [
        { "x": 5, "y": 5, "itemType": "garbageCan" }
      ]
    }
  },
  "message": "Joined battle successfully. Battle is now active."
}
```

**Note:** When a battle becomes active (player 2 joins), the server initializes `currentState` from the battle's `mapData`:
- `units` array is seeded from `mapData.unitPlacement`
- `blockedTiles` array is seeded from `mapData.itemPlacement` (items with `canMoveOn: false`)

**Error Responses:**
- `400` - Battle is not in pending state
- `400` - Cannot join your own battle
- `401` - Authentication required
- `404` - Battle not found
- `500` - Server error

---

#### GET /api/mybattles

Get all battles where the authenticated device is a participant (includes private battles).

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "battles": [...],
  "count": 5
}
```

---

### 3. Turn Submission

#### POST /api/turns

Submit a turn for an active battle.

**Authentication:** Required

**Request Body:**
```json
{
  "battleId": "abc123def456",
  "actions": [
    {
      "type": "move",
      "unitId": "unit1",
      "from": { "x": 1, "y": 2 },
      "to": { "x": 3, "y": 2 }
    },
    {
      "type": "attack",
      "unitId": "unit1",
      "targetId": "enemy1"
    },
    {
      "type": "end_turn"
    }
  ],
  "gameState": {
    "units": [...],
    "winner": null  // set to deviceId to end the game
  }
}
```

**Action Types:**

All action fields except `type` are optional. The server validates the schema but does not enforce game logic. Client should implement its own validation for game rules.

| Type | Description | Common Fields |
|------|-------------|---------------|
| `move` | Move a unit | `unitId`, `from`, `to` |
| `attack` | Attack a target | `unitId`, `targetId` |
| `build` | Build something | `unitId`, `to`, `data` |
| `capture` | Capture a target | `unitId`, `targetId` |
| `wait` | Unit waits | `unitId` |
| `end_turn` | End the turn | none |

**Note:** Only `type` is required by the server. All other fields are optional and should be validated client-side based on your game logic.

**Position Schema:**
```json
{
  "x": -1000 to 1000,  // integer
  "y": -1000 to 1000   // integer
}
```

**Validation Rules:**
- Request body must be under 100KB total
- Actions array must contain 1-100 actions
- Must include `end_turn` action
- Game state must be under 50KB
- Each action's data must be under 1KB

**Success Response (201):**
```json
{
  "success": true,
  "turn": {
    "turnId": "turn123...",
    "turnNumber": 6,
    "isValid": true,
    "validationErrors": []
  },
  "battle": {
    "battleId": "abc123def456",
    "currentTurn": 6,
    "currentPlayerIndex": 0,
    "status": "active",
    "currentState": {
      "units": [
        { "unitId": "device1_u0", "type": "BIRD1", "x": 3, "y": 2, "hp": 10, "owner": "device1..." },
        { "unitId": "device2_u0", "type": "BIRD4", "x": 10, "y": 3, "hp": 7, "owner": "device2..." }
      ],
      "blockedTiles": [
        { "x": 5, "y": 5, "itemType": "garbageCan" }
      ]
    }
  },
  "message": "Turn submitted successfully"
}
```

**Note:** The `currentState` is updated based on the client's submitted `gameState.units`. Dead units (HP <= 0) are automatically filtered out.

**Error Responses:**
- `400` - Invalid request body / Battle not active
- `401` - Authentication required
- `403` - Not your turn / Not a participant
- `404` - Battle not found
- `409` - Turn already submitted (replay attack prevention)
- `413` - Request payload too large
- `500` - Server error

---

#### GET /api/turns

Get all turns for a battle.

**Authentication:** None required

**Query Parameters:**
- `battleId` (required) - The battle ID

**Example:**
```
GET /api/turns?battleId=abc123def456
```

**Success Response (200):**
```json
{
  "success": true,
  "turns": [
    {
      "turnId": "turn123...",
      "battleId": "abc123def456",
      "deviceId": "device1...",
      "turnNumber": 1,
      "actions": [...],
      "timestamp": "2025-01-23T12:05:00.000Z",
      "isValid": true,
      "validationErrors": [],
      "gameState": {}
    }
  ]
}
```

**Error Responses:**
- `400` - Battle ID is required (missing `battleId` query param)
- `500` - Server error

---

## Data Models

### Device
```typescript
{
  deviceId: string;        // Unique device identifier
  displayName: string;     // Human-readable name
  registeredAt: Date;      // Registration timestamp
  lastSeen: Date;          // Last activity timestamp
  isActive: boolean;       // Whether device is active
}
```

### Battle
```typescript
{
  battleId: string;              // Unique battle identifier (16 chars)
  player1DeviceId: string;       // Creator's device ID
  player2DeviceId: string | null; // Opponent's device ID (null if pending)
  status: 'pending' | 'active' | 'completed' | 'abandoned';
  currentTurn: number;           // Current turn number (0-indexed)
  currentPlayerIndex: number;    // 0 = player1's turn, 1 = player2's turn
  createdAt: Date;
  updatedAt: Date;
  winnerId: string | null;       // Winner's device ID
  mapData: object;               // Custom map configuration
  isPrivate: boolean;            // If true, hidden from public listings
}
```

### Turn
```typescript
{
  turnId: string;           // Unique turn identifier
  battleId: string;         // Associated battle
  deviceId: string;         // Device that submitted the turn
  turnNumber: number;       // Sequential turn number (1-indexed)
  actions: Action[];        // Array of actions taken
  timestamp: Date;          // Submission timestamp
  isValid: boolean;         // Whether turn passed validation
  validationErrors: string[]; // List of validation errors
  gameState: object;        // Snapshot of game state after turn
}
```

### Action
```typescript
{
  type: 'move' | 'attack' | 'build' | 'capture' | 'wait' | 'end_turn';
  unitId?: string;          // Unit performing the action
  from?: { x: number, y: number };  // Starting position
  to?: { x: number, y: number };    // Target position
  targetId?: string;        // Target unit/building ID
  data?: object;            // Additional action-specific data
}
```

---

## Common Patterns

### Game Flow

1. **Device Registration**
   ```
   POST /api/register → Store secretToken
   ```

2. **Create Battle**
   ```
   POST /api/battles (with auth) → Get battleId
   Share battleId with opponent
   ```

3. **Join Battle**
   ```
   PATCH /api/battles/{battleId} (with auth) → Battle becomes "active"
   ```

4. **Game Loop**
   ```
   GET /api/battles/{battleId} → Check currentPlayerIndex
   If my turn:
     POST /api/turns → Submit actions
   Poll for opponent's turn
   ```

5. **End Game**
   ```
   POST /api/turns with gameState.winner set → Battle becomes "completed"
   ```

### Polling Strategy

For Playdate's limited connectivity, recommend:
- Poll every 30-60 seconds when waiting for opponent
- Use exponential backoff on errors
- Cache battle state locally

### Error Handling

All error responses follow this format:
```json
{
  "success": false,
  "error": "Human-readable error message",
  "details": [...]  // Optional validation details
}
```

---

## Rate Limits

- Device registration: 10 per minute (global)
- Other endpoints: No specific limits, but be respectful

## Security Notes

- Tokens are hashed with HMAC-SHA256 before storage
- Always use HTTPS in production
- Never log or expose secret tokens
- Validate all user input on both client and server
