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
const Battle = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models.Battle || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model('Battle', BattleSchema);
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
            'end_turn'
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
    ()=>Device
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateDeviceSecret",
    ()=>generateDeviceSecret,
    "generateSecureToken",
    ()=>generateSecureToken,
    "generateSessionToken",
    ()=>generateSessionToken,
    "hashToken",
    ()=>hashToken,
    "verifyHmac",
    ()=>verifyHmac,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
function getSecretKey() {
    const secret = process.env.SESSION_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error('SESSION_SECRET environment variable must be set with at least 32 characters');
    }
    return secret;
}
function generateSecureToken() {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomBytes"])(32).toString('hex');
}
function generateDeviceSecret() {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomBytes"])(48).toString('base64url');
}
function hashToken(token) {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["createHmac"])('sha256', getSecretKey()).update(token).digest('hex');
}
function verifyToken(providedToken, storedHash) {
    const providedHash = hashToken(providedToken);
    try {
        return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["timingSafeEqual"])(Buffer.from(providedHash, 'hex'), Buffer.from(storedHash, 'hex'));
    } catch  {
        return false;
    }
}
function verifyHmac(payload, signature, secret) {
    const expectedSignature = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["createHmac"])('sha256', secret).update(payload).digest('hex');
    try {
        return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["timingSafeEqual"])(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'));
    } catch  {
        return false;
    }
}
function generateSessionToken() {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["randomBytes"])(24).toString('base64url');
}
}),
"[project]/lib/authMiddleware.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authenticateDevice",
    ()=>authenticateDevice,
    "unauthorizedResponse",
    ()=>unauthorizedResponse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Device$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Device.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-route] (ecmascript)");
;
;
;
;
async function authenticateDevice(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.substring(7);
    if (!token) {
        return null;
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
    const tokenHash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hashToken"])(token);
    const device = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Device$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Device"].findOne({
        tokenHash: tokenHash,
        isActive: true
    });
    if (!device) {
        return null;
    }
    device.lastSeen = new Date();
    await device.save();
    return {
        deviceId: device.deviceId
    };
}
function unauthorizedResponse(message = 'Unauthorized') {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        success: false,
        error: message
    }, {
        status: 401
    });
}
}),
"[project]/app/api/stats/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authMiddleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/authMiddleware.ts [app-route] (ecmascript)");
;
;
;
;
;
;
async function GET(request) {
    try {
        const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authMiddleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["authenticateDevice"])(request);
        if (!auth) {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authMiddleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unauthorizedResponse"])('Device authentication required');
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        const deviceId = auth.deviceId;
        const [device, totalBattles, wins, losses, draws, activeBattles, pendingBattles, totalTurns] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Device$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Device"].findOne({
                deviceId
            }).select('displayName registeredAt'),
            __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Battle$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Battle"].countDocuments({
                $or: [
                    {
                        player1DeviceId: deviceId
                    },
                    {
                        player2DeviceId: deviceId
                    }
                ]
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Battle$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Battle"].countDocuments({
                status: 'completed',
                winnerId: deviceId,
                $or: [
                    {
                        player1DeviceId: deviceId
                    },
                    {
                        player2DeviceId: deviceId
                    }
                ]
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Battle$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Battle"].countDocuments({
                status: 'completed',
                winnerId: {
                    $nin: [
                        deviceId,
                        null
                    ]
                },
                $or: [
                    {
                        player1DeviceId: deviceId
                    },
                    {
                        player2DeviceId: deviceId
                    }
                ]
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Battle$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Battle"].countDocuments({
                status: 'completed',
                winnerId: null,
                $or: [
                    {
                        player1DeviceId: deviceId
                    },
                    {
                        player2DeviceId: deviceId
                    }
                ]
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Battle$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Battle"].countDocuments({
                status: 'active',
                $or: [
                    {
                        player1DeviceId: deviceId
                    },
                    {
                        player2DeviceId: deviceId
                    }
                ]
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Battle$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Battle"].countDocuments({
                status: 'pending',
                $or: [
                    {
                        player1DeviceId: deviceId
                    },
                    {
                        player2DeviceId: deviceId
                    }
                ]
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Turn$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Turn"].countDocuments({
                deviceId
            })
        ]);
        const completedBattles = wins + losses + draws;
        const winRate = completedBattles > 0 ? (wins / completedBattles * 100).toFixed(1) : '0.0';
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            stats: {
                deviceId,
                displayName: device?.displayName || 'Unknown Device',
                memberSince: device?.registeredAt?.toISOString() || null,
                totalBattles,
                completedBattles,
                activeBattles,
                pendingBattles,
                wins,
                losses,
                draws,
                winRate: `${winRate}%`,
                totalTurnsSubmitted: totalTurns
            }
        });
    } catch (error) {
        console.error('Fetch stats error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to fetch stats'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f6b82efc._.js.map