'use client';

import Link from 'next/link';
import { Swords, ArrowLeft, Lock, Globe } from 'lucide-react';
import Nav from '@/components/Nav';

interface EndpointSection {
  id: string;
  method: string;
  path: string;
  description: string;
  auth: boolean;
  requestBody?: {
    fields: { name: string; type: string; required: boolean; description: string }[];
    example: Record<string, unknown>;
  };
  responseBody: {
    fields: { name: string; type: string; description: string }[];
    example: Record<string, unknown>;
  };
  errors?: { status: number; description: string }[];
}

const endpoints: EndpointSection[] = [
  {
    id: 'post-register',
    method: 'POST',
    path: '/api/register',
    description: 'Register a new Playdate device. Returns a one-time secret token that must be stored securely - it cannot be retrieved again. Can also be used to update profile (displayName, avatar) when authenticated.',
    auth: false,
    requestBody: {
      fields: [
        { name: 'displayName', type: 'string', required: false, description: 'Optional display name for the device (max 100 chars)' },
        { name: 'avatar', type: 'string', required: false, description: 'Bird avatar: BIRD1-BIRD12 (default: BIRD1)' },
      ],
      example: { displayName: 'My Playdate', avatar: 'BIRD4' },
    },
    responseBody: {
      fields: [
        { name: 'success', type: 'boolean', description: 'Whether the registration was successful' },
        { name: 'deviceId', type: 'string', description: 'Unique identifier for the device' },
        { name: 'secretToken', type: 'string', description: 'Secret token for authentication (store securely!)' },
        { name: 'avatar', type: 'string', description: 'Selected bird avatar (BIRD1-BIRD12)' },
        { name: 'message', type: 'string', description: 'Human-readable status message' },
      ],
      example: {
        success: true,
        deviceId: 'a0dcb007051f88c0aef99bf01ffe224b...',
        secretToken: 'bvUKW9vBPZS8GHtCXe3k8jSm56BQDP...',
        avatar: 'BIRD4',
        message: 'Device registered successfully. Store this token securely - it cannot be retrieved again.',
      },
    },
    errors: [
      { status: 429, description: 'Rate limit exceeded (max 10 registrations per minute)' },
      { status: 500, description: 'Server configuration error' },
    ],
  },
  {
    id: 'get-battles',
    method: 'GET',
    path: '/api/battles',
    description: 'List all public battles. Private battles are excluded from this listing.',
    auth: false,
    responseBody: {
      fields: [
        { name: 'success', type: 'boolean', description: 'Whether the request was successful' },
        { name: 'battles', type: 'Battle[]', description: 'Array of public battle objects' },
      ],
      example: {
        success: true,
        battles: [
          {
            battleId: 'e0a5b571c0ddc493',
            player1DeviceId: 'a0dcb007...',
            player2DeviceId: null,
            status: 'pending',
            currentTurn: 0,
            isPrivate: false,
          },
        ],
      },
    },
  },
  {
    id: 'post-battles',
    method: 'POST',
    path: '/api/battles',
    description: 'Create a new battle session. The authenticated device becomes player 1.',
    auth: true,
    requestBody: {
      fields: [
        { name: 'mapData', type: 'object', required: false, description: 'Optional map configuration data' },
        { name: 'isPrivate', type: 'boolean', required: false, description: 'If true, battle won\'t appear in public listings (default: false)' },
      ],
      example: { mapData: { type: 'forest', size: 10 }, isPrivate: true },
    },
    responseBody: {
      fields: [
        { name: 'success', type: 'boolean', description: 'Whether the battle was created' },
        { name: 'battle', type: 'object', description: 'Created battle summary' },
        { name: 'message', type: 'string', description: 'Human-readable status message' },
      ],
      example: {
        success: true,
        battle: { battleId: 'a99958640027f6bc', status: 'pending', currentTurn: 0, isPrivate: true },
        message: 'Private battle created. Share the battleId with your opponent to join.',
      },
    },
    errors: [
      { status: 401, description: 'Device authentication required' },
    ],
  },
  {
    id: 'get-battles-id',
    method: 'GET',
    path: '/api/battles/:id',
    description: 'Get detailed information about a specific battle including current state.',
    auth: false,
    responseBody: {
      fields: [
        { name: 'success', type: 'boolean', description: 'Whether the request was successful' },
        { name: 'battle', type: 'Battle', description: 'Full battle object with all fields' },
      ],
      example: {
        success: true,
        battle: {
          battleId: 'e0a5b571c0ddc493',
          player1DeviceId: 'a0dcb007...',
          player2DeviceId: 'f55c9b25...',
          status: 'active',
          currentTurn: 3,
          currentPlayerIndex: 1,
          mapData: { type: 'forest' },
          isPrivate: false,
          createdAt: '2026-01-23T00:46:56.440Z',
          updatedAt: '2026-01-23T01:15:22.100Z',
        },
      },
    },
    errors: [
      { status: 404, description: 'Battle not found' },
    ],
  },
  {
    id: 'patch-battles-id',
    method: 'PATCH',
    path: '/api/battles/:id',
    description: 'Join a pending battle as player 2. The battle status changes from "pending" to "active".',
    auth: true,
    responseBody: {
      fields: [
        { name: 'success', type: 'boolean', description: 'Whether joining was successful' },
        { name: 'battle', type: 'Battle', description: 'Updated battle object' },
        { name: 'message', type: 'string', description: 'Human-readable status message' },
      ],
      example: {
        success: true,
        battle: { battleId: 'e0a5b571c0ddc493', status: 'active', currentTurn: 0 },
        message: 'Successfully joined battle. You are player 2.',
      },
    },
    errors: [
      { status: 400, description: 'Battle is not in pending status' },
      { status: 401, description: 'Device authentication required' },
      { status: 404, description: 'Battle not found' },
    ],
  },
  {
    id: 'get-mybattles',
    method: 'GET',
    path: '/api/mybattles',
    description: 'List all battles for the authenticated device. Auto-forfeits opponents who haven\'t moved in 7 days. Supports ?status= filter.',
    auth: true,
    requestBody: {
      fields: [
        { name: 'status', type: 'string', required: false, description: 'Query param filter: pending, active, completed, abandoned' },
      ],
      example: { status: 'active' },
    },
    responseBody: {
      fields: [
        { name: 'success', type: 'boolean', description: 'Whether the request was successful' },
        { name: 'battles', type: 'Battle[]', description: 'Array of battles where device is player1 or player2' },
        { name: 'battles[].winnerId', type: 'string|null', description: 'Winner device ID (null if ongoing)' },
        { name: 'battles[].endReason', type: 'string|null', description: 'How ended: victory, forfeit, draw' },
        { name: 'battles[].lastTurnAt', type: 'string|null', description: 'ISO timestamp of last turn' },
        { name: 'count', type: 'number', description: 'Total number of battles returned' },
      ],
      example: {
        success: true,
        battles: [
          { battleId: 'e0a5b571c0ddc493', status: 'active', winnerId: null, endReason: null, lastTurnAt: '2025-01-20T10:30:00.000Z' },
          { battleId: 'a99958640027f6bc', status: 'completed', winnerId: 'abc123...', endReason: 'forfeit' },
        ],
        count: 2,
      },
    },
    errors: [
      { status: 401, description: 'Device authentication required' },
    ],
  },
  {
    id: 'post-turns',
    method: 'POST',
    path: '/api/turns',
    description: 'Submit a turn with actions. Only the current active player can submit. Turns are validated for proper sequencing.',
    auth: true,
    requestBody: {
      fields: [
        { name: 'battleId', type: 'string', required: true, description: 'The battle to submit the turn for' },
        { name: 'actions', type: 'Action[]', required: true, description: 'Array of actions (max 100). Must include end_turn action.' },
        { name: 'gameState', type: 'object', required: false, description: 'Optional game state snapshot (max 50KB)' },
      ],
      example: {
        battleId: 'e0a5b571c0ddc493',
        actions: [
          { type: 'move', unitId: 'u1', from: { x: 1, y: 2 }, to: { x: 3, y: 2 } },
          { type: 'attack', unitId: 'u1', targetId: 'enemy1' },
          { type: 'end_turn' },
        ],
        gameState: { units: [], resources: 100 },
      },
    },
    responseBody: {
      fields: [
        { name: 'success', type: 'boolean', description: 'Whether the turn was submitted' },
        { name: 'turn', type: 'object', description: 'Submitted turn summary' },
        { name: 'battle', type: 'object', description: 'Updated battle state' },
        { name: 'message', type: 'string', description: 'Human-readable status message' },
      ],
      example: {
        success: true,
        turn: { turnId: 'abc123...', turnNumber: 4, isValid: true, validationErrors: [] },
        battle: { battleId: 'e0a5b571c0ddc493', currentTurn: 4, currentPlayerIndex: 0, status: 'active' },
        message: 'Turn submitted successfully',
      },
    },
    errors: [
      { status: 400, description: 'Invalid request body or battle not active' },
      { status: 401, description: 'Device authentication required' },
      { status: 403, description: 'Not your turn or not a battle participant' },
      { status: 409, description: 'Turn already submitted (duplicate)' },
      { status: 413, description: 'Request payload too large' },
    ],
  },
  {
    id: 'get-turns',
    method: 'GET',
    path: '/api/turns?battleId=:id',
    description: 'Get turn history for a specific battle.',
    auth: false,
    responseBody: {
      fields: [
        { name: 'success', type: 'boolean', description: 'Whether the request was successful' },
        { name: 'turns', type: 'Turn[]', description: 'Array of turn objects in order' },
      ],
      example: {
        success: true,
        turns: [
          { turnId: 'abc123...', turnNumber: 1, deviceId: 'a0dcb007...', actions: [], isValid: true },
          { turnId: 'def456...', turnNumber: 2, deviceId: 'f55c9b25...', actions: [], isValid: true },
        ],
      },
    },
    errors: [
      { status: 400, description: 'Battle ID is required' },
    ],
  },
  {
    id: 'get-stats',
    method: 'GET',
    path: '/api/stats',
    description: 'Get player statistics for the authenticated device. Includes battle counts, win/loss record, and total turns submitted.',
    auth: true,
    responseBody: {
      fields: [
        { name: 'success', type: 'boolean', description: 'Whether the request was successful' },
        { name: 'stats', type: 'object', description: 'Player statistics object' },
        { name: 'stats.deviceId', type: 'string', description: 'Device identifier' },
        { name: 'stats.displayName', type: 'string', description: 'Device display name' },
        { name: 'stats.avatar', type: 'string', description: 'Bird avatar (BIRD1-BIRD12)' },
        { name: 'stats.memberSince', type: 'string', description: 'ISO date when device was registered' },
        { name: 'stats.totalBattles', type: 'number', description: 'Total battles participated in' },
        { name: 'stats.completedBattles', type: 'number', description: 'Battles that have ended' },
        { name: 'stats.activeBattles', type: 'number', description: 'Currently active battles' },
        { name: 'stats.pendingBattles', type: 'number', description: 'Battles waiting for opponent' },
        { name: 'stats.wins', type: 'number', description: 'Total victories' },
        { name: 'stats.losses', type: 'number', description: 'Total defeats' },
        { name: 'stats.draws', type: 'number', description: 'Battles with no winner' },
        { name: 'stats.winRate', type: 'string', description: 'Win percentage (e.g., "66.7%")' },
        { name: 'stats.totalTurnsSubmitted', type: 'number', description: 'Total turns submitted across all battles' },
      ],
      example: {
        success: true,
        stats: {
          deviceId: 'a0dcb007051f88c0...',
          displayName: 'My Playdate',
          avatar: 'BIRD4',
          memberSince: '2025-01-15T10:30:00.000Z',
          totalBattles: 15,
          completedBattles: 12,
          activeBattles: 2,
          pendingBattles: 1,
          wins: 8,
          losses: 3,
          draws: 1,
          winRate: '66.7%',
          totalTurnsSubmitted: 142,
        },
      },
    },
    errors: [
      { status: 401, description: 'Device authentication required' },
      { status: 500, description: 'Server error' },
    ],
  },
];

function getMethodColor(method: string) {
  switch (method) {
    case 'GET':
      return 'bg-chart-2/10 text-chart-2';
    case 'POST':
      return 'bg-primary/10 text-primary';
    case 'PATCH':
      return 'bg-chart-4/10 text-chart-4';
    case 'DELETE':
      return 'bg-destructive/10 text-destructive';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export default function SchemaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4">API Reference</h1>
          <p className="text-muted-foreground">
            Complete documentation for the Bird Wars async battle server API. All authenticated endpoints require a Bearer token in the Authorization header.
          </p>
          <div className="mt-4 p-4 rounded-lg border border-border bg-card">
            <h3 className="font-semibold mb-2">Authentication</h3>
            <p className="text-sm text-muted-foreground mb-2">
              For endpoints marked with <Lock className="w-3 h-3 inline" />, include your secret token:
            </p>
            <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
              Authorization: Bearer &lt;your-secret-token&gt;
            </code>
          </div>
        </div>

        <div className="space-y-12">
          {endpoints.map((endpoint) => (
            <section 
              key={endpoint.id} 
              id={endpoint.id}
              className="scroll-mt-24"
              data-testid={`endpoint-${endpoint.id}`}
            >
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="p-4 bg-card border-b border-border">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${getMethodColor(endpoint.method)}`}>
                      {endpoint.method}
                    </span>
                    <code className="text-sm font-mono font-semibold">{endpoint.path}</code>
                    {endpoint.auth ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-chart-4/10 text-chart-4">
                        <Lock className="w-3 h-3" />
                        Auth Required
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-chart-2/10 text-chart-2">
                        <Globe className="w-3 h-3" />
                        Public
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{endpoint.description}</p>
                </div>

                <div className="p-4 space-y-6">
                  {endpoint.requestBody && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Request Body</h4>
                      <div className="space-y-2 mb-4">
                        {endpoint.requestBody.fields.map((field) => (
                          <div key={field.name} className="flex items-start gap-2 text-sm">
                            <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">{field.name}</code>
                            <span className="text-muted-foreground">{field.type}</span>
                            {field.required ? (
                              <span className="text-xs text-destructive">required</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">optional</span>
                            )}
                            <span className="text-muted-foreground">— {field.description}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-2">Example:</p>
                        <pre className="text-xs font-mono overflow-x-auto">
                          {JSON.stringify(endpoint.requestBody.example, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-semibold mb-3">Response</h4>
                    <div className="space-y-2 mb-4">
                      {endpoint.responseBody.fields.map((field) => (
                        <div key={field.name} className="flex items-start gap-2 text-sm">
                          <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">{field.name}</code>
                          <span className="text-muted-foreground">{field.type}</span>
                          <span className="text-muted-foreground">— {field.description}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-2">Example (200 OK):</p>
                      <pre className="text-xs font-mono overflow-x-auto">
                        {JSON.stringify(endpoint.responseBody.example, null, 2)}
                      </pre>
                    </div>
                  </div>

                  {endpoint.errors && endpoint.errors.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Error Responses</h4>
                      <div className="space-y-1">
                        {endpoint.errors.map((error) => (
                          <div key={error.status} className="flex items-center gap-2 text-sm">
                            <span className="px-1.5 py-0.5 rounded text-xs font-mono bg-destructive/10 text-destructive">
                              {error.status}
                            </span>
                            <span className="text-muted-foreground">{error.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 p-6 rounded-lg border border-border bg-card">
          <h2 className="text-lg font-semibold mb-4">Data Types</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Battle</h3>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p><code className="bg-muted px-1 rounded">battleId</code> — Unique battle identifier</p>
                <p><code className="bg-muted px-1 rounded">player1DeviceId</code> — Device ID of player 1 (creator)</p>
                <p><code className="bg-muted px-1 rounded">player2DeviceId</code> — Device ID of player 2 (null if pending)</p>
                <p><code className="bg-muted px-1 rounded">status</code> — "pending" | "active" | "completed" | "abandoned"</p>
                <p><code className="bg-muted px-1 rounded">currentTurn</code> — Current turn number (0-indexed)</p>
                <p><code className="bg-muted px-1 rounded">currentPlayerIndex</code> — 0 for player1, 1 for player2</p>
                <p><code className="bg-muted px-1 rounded">isPrivate</code> — Whether battle is hidden from public listing</p>
                <p><code className="bg-muted px-1 rounded">mapData</code> — Custom map configuration object</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Action</h3>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p><code className="bg-muted px-1 rounded">type</code> — "move" | "attack" | "build" | "capture" | "wait" | "end_turn"</p>
                <p><code className="bg-muted px-1 rounded">unitId</code> — Identifier of the unit performing action</p>
                <p><code className="bg-muted px-1 rounded">from</code> — Starting position {"{ x, y }"}</p>
                <p><code className="bg-muted px-1 rounded">to</code> — Target position {"{ x, y }"}</p>
                <p><code className="bg-muted px-1 rounded">targetId</code> — ID of target unit (for attacks)</p>
                <p><code className="bg-muted px-1 rounded">data</code> — Additional action-specific data</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Turn</h3>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p><code className="bg-muted px-1 rounded">turnId</code> — Unique turn identifier</p>
                <p><code className="bg-muted px-1 rounded">battleId</code> — Associated battle</p>
                <p><code className="bg-muted px-1 rounded">deviceId</code> — Device that submitted the turn</p>
                <p><code className="bg-muted px-1 rounded">turnNumber</code> — Sequential turn number</p>
                <p><code className="bg-muted px-1 rounded">actions</code> — Array of actions in this turn</p>
                <p><code className="bg-muted px-1 rounded">isValid</code> — Whether the turn passed validation</p>
                <p><code className="bg-muted px-1 rounded">gameState</code> — Snapshot of game state after turn</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>Bird Wars Async Battle Server</p>
        </div>
      </footer>
    </div>
  );
}
