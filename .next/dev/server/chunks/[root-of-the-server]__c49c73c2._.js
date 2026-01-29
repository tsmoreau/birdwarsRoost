module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectToDatabase",
    ()=>connectToDatabase
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}
let cached = global.mongoose || {
    conn: null,
    promise: null
};
if (!global.mongoose) {
    global.mongoose = cached;
}
async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false
        };
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connect(MONGODB_URI, opts).then((mongoose)=>{
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}
}),
"[project]/models/Battle.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Battle",
    ()=>Battle
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const UnitSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    unitId: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    },
    hp: {
        type: Number,
        required: true
    },
    owner: {
        type: String,
        required: true
    }
}, {
    _id: false
});
const BlockedTileSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    },
    itemType: {
        type: String,
        required: true
    }
}, {
    _id: false
});
const CurrentStateSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    units: {
        type: [
            UnitSchema
        ],
        default: []
    },
    blockedTiles: {
        type: [
            BlockedTileSchema
        ],
        default: []
    }
}, {
    _id: false
});
const BattleSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    battleId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    displayName: {
        type: String,
        required: false,
        default: ''
    },
    player1DeviceId: {
        type: String,
        required: true,
        index: true
    },
    player2DeviceId: {
        type: String,
        default: null,
        index: true
    },
    status: {
        type: String,
        enum: [
            'pending',
            'active',
            'completed',
            'abandoned'
        ],
        default: 'pending'
    },
    currentTurn: {
        type: Number,
        default: 0
    },
    currentPlayerIndex: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    winnerId: {
        type: String,
        default: null
    },
    endReason: {
        type: String,
        enum: [
            'victory',
            'forfeit',
            'draw',
            null
        ],
        default: null
    },
    lastTurnAt: {
        type: Date,
        default: null
    },
    mapData: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"].Types.Mixed,
        default: {}
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    currentState: {
        type: CurrentStateSchema,
        default: ()=>({
                units: [],
                blockedTiles: []
            })
    }
});
// Delete cached model to ensure schema updates take effect
if (__TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Battle) {
    delete __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Battle;
}
const Battle = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('Battle', BattleSchema);
}),
"[project]/models/Turn.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Turn",
    ()=>Turn
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const TurnActionSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    type: {
        type: String,
        enum: [
            'move',
            'attack',
            'build',
            'capture',
            'wait',
            'end_turn',
            'take_off',
            'land',
            'supply'
        ],
        required: true
    },
    unitId: String,
    from: {
        x: Number,
        y: Number
    },
    to: {
        x: Number,
        y: Number
    },
    targetId: String,
    data: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"].Types.Mixed
}, {
    _id: false
});
const TurnSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    turnId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    battleId: {
        type: String,
        required: true,
        index: true
    },
    deviceId: {
        type: String,
        required: true,
        index: true
    },
    turnNumber: {
        type: Number,
        required: true
    },
    actions: [
        TurnActionSchema
    ],
    timestamp: {
        type: Date,
        default: Date.now
    },
    isValid: {
        type: Boolean,
        default: true
    },
    validationErrors: [
        String
    ],
    gameState: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"].Types.Mixed,
        default: {}
    }
});
TurnSchema.index({
    battleId: 1,
    turnNumber: 1
});
const Turn = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Turn || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('Turn', TurnSchema);
}),
"[project]/models/Device.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Device",
    ()=>Device,
    "VALID_AVATARS",
    ()=>VALID_AVATARS
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const VALID_AVATARS = [
    'BIRD1',
    'BIRD2',
    'BIRD3',
    'BIRD4',
    'BIRD5',
    'BIRD6',
    'BIRD7',
    'BIRD8',
    'BIRD9',
    'BIRD10',
    'BIRD11',
    'BIRD12'
];
const DeviceSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    deviceId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    tokenHash: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        default: 'Unnamed Device'
    },
    avatar: {
        type: String,
        enum: [
            'BIRD1',
            'BIRD2',
            'BIRD3',
            'BIRD4',
            'BIRD5',
            'BIRD6',
            'BIRD7',
            'BIRD8',
            'BIRD9',
            'BIRD10',
            'BIRD11',
            'BIRD12'
        ],
        default: 'BIRD1'
    },
    registeredAt: {
        type: Date,
        default: Date.now
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
});
const Device = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Device || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('Device', DeviceSchema);
}),
"[project]/app/api/turns/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Battle$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Battle.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Turn$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Turn.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Device$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Device.ts [app-route] (ecmascript)");
;
;
;
;
;
async function getPlayerInfo(deviceIds) {
    const validIds = deviceIds.filter((id)=>id !== null);
    if (validIds.length === 0) return new Map();
    const devices = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Device$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Device"].find({
        deviceId: {
            $in: validIds
        }
    });
    const map = new Map();
    for (const device of devices){
        map.set(device.deviceId, {
            displayName: device.displayName || 'Unknown Player',
            avatar: device.avatar || 'BIRD1'
        });
    }
    return map;
}
async function GET(request, { params }) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        const { id: turnId } = await params;
        if (!turnId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Turn ID is required'
            }, {
                status: 400
            });
        }
        const turn = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Turn$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Turn"].findOne({
            turnId
        });
        if (!turn) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Turn not found'
            }, {
                status: 404
            });
        }
        const battle = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Battle$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Battle"].findOne({
            battleId: turn.battleId
        });
        if (!battle) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                turn: {
                    turnId: turn.turnId,
                    battleId: turn.battleId,
                    deviceId: turn.deviceId,
                    turnNumber: turn.turnNumber,
                    actions: turn.actions,
                    timestamp: turn.timestamp,
                    isValid: turn.isValid,
                    validationErrors: turn.validationErrors,
                    gameState: turn.gameState
                },
                battle: null
            });
        }
        const playerInfoMap = await getPlayerInfo([
            battle.player1DeviceId,
            battle.player2DeviceId
        ]);
        const p1Info = playerInfoMap.get(battle.player1DeviceId);
        const p2Info = battle.player2DeviceId ? playerInfoMap.get(battle.player2DeviceId) : null;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            turn: {
                turnId: turn.turnId,
                battleId: turn.battleId,
                deviceId: turn.deviceId,
                turnNumber: turn.turnNumber,
                actions: turn.actions,
                timestamp: turn.timestamp,
                isValid: turn.isValid,
                validationErrors: turn.validationErrors,
                gameState: turn.gameState
            },
            battle: {
                battleId: battle.battleId,
                displayName: battle.displayName || null,
                player1DeviceId: battle.player1DeviceId,
                player1DisplayName: p1Info?.displayName || 'Unknown Player',
                player1Avatar: p1Info?.avatar || 'BIRD1',
                player2DeviceId: battle.player2DeviceId || null,
                player2DisplayName: p2Info?.displayName || null,
                player2Avatar: p2Info?.avatar || null,
                status: battle.status,
                currentTurn: battle.currentTurn
            }
        });
    } catch (error) {
        console.error('Fetch turn error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to fetch turn'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c49c73c2._.js.map