module.exports = [
"[project]/lib/mongodb.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/models/Device.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/models/Battle.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/models/Turn.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/app/actions/players.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4066bbea8940760a9b415310c91ca54fb697a41e61":"getPlayerByDisplayName","6013f5c5ecc86139fcd4165f1a95b7714ffe594846":"getPlayerBattles"},"",""] */ __turbopack_context__.s([
    "getPlayerBattles",
    ()=>getPlayerBattles,
    "getPlayerByDisplayName",
    ()=>getPlayerByDisplayName
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Device$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Device.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Battle$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Battle.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Turn$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Turn.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function getPlayerByDisplayName(displayName) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["connectToDatabase"])();
    const device = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Device$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Device"].findOne({
        displayName: {
            $regex: new RegExp(`^${displayName}$`, 'i')
        }
    });
    if (!device) {
        return null;
    }
    const deviceId = device.deviceId;
    const [totalBattles, wins, losses, draws, activeBattles, pendingBattles, totalTurns] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Battle$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Battle"].countDocuments({
            $or: [
                {
                    player1DeviceId: deviceId
                },
                {
                    player2DeviceId: deviceId
                }
            ]
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Battle$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Battle"].countDocuments({
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
        __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Battle$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Battle"].countDocuments({
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
        __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Battle$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Battle"].countDocuments({
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
        __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Battle$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Battle"].countDocuments({
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
        __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Battle$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Battle"].countDocuments({
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
        __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Turn$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Turn"].countDocuments({
            deviceId
        })
    ]);
    const completedBattles = wins + losses + draws;
    const winRate = completedBattles > 0 ? (wins / completedBattles * 100).toFixed(1) : '0.0';
    const deviceObj = device.toObject();
    return {
        deviceId: deviceObj.deviceId,
        displayName: deviceObj.displayName || 'Unknown Player',
        avatar: deviceObj.avatar || 'BIRD1',
        registeredAt: deviceObj.registeredAt.toISOString(),
        lastSeen: deviceObj.lastSeen.toISOString(),
        isActive: deviceObj.isActive,
        stats: {
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
    };
}
async function getPlayerBattles(deviceId, limit = 10) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["connectToDatabase"])();
    const battles = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Battle$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Battle"].find({
        $or: [
            {
                player1DeviceId: deviceId
            },
            {
                player2DeviceId: deviceId
            }
        ]
    }).sort({
        updatedAt: -1
    }).limit(limit);
    const opponentDeviceIds = battles.map((b)=>{
        const battleObj = b.toObject();
        return battleObj.player1DeviceId === deviceId ? battleObj.player2DeviceId : battleObj.player1DeviceId;
    }).filter(Boolean);
    const opponents = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Device$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Device"].find({
        deviceId: {
            $in: opponentDeviceIds
        }
    }).select('deviceId displayName');
    const opponentMap = new Map(opponents.map((d)=>[
            d.deviceId,
            d.displayName
        ]));
    return battles.map((battle)=>{
        const battleObj = battle.toObject();
        const isPlayer1 = battleObj.player1DeviceId === deviceId;
        const opponentDeviceId = isPlayer1 ? battleObj.player2DeviceId : battleObj.player1DeviceId;
        return {
            battleId: battleObj.battleId,
            displayName: battleObj.displayName || 'Unnamed Battle',
            status: battleObj.status,
            opponentName: opponentDeviceId ? opponentMap.get(opponentDeviceId) || 'Unknown' : null,
            opponentDeviceId: opponentDeviceId,
            isPlayer1,
            winnerId: battleObj.winnerId,
            endReason: battleObj.endReason,
            currentTurn: battleObj.currentTurn,
            createdAt: battleObj.createdAt.toISOString(),
            updatedAt: battleObj.updatedAt.toISOString()
        };
    });
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getPlayerByDisplayName,
    getPlayerBattles
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPlayerByDisplayName, "4066bbea8940760a9b415310c91ca54fb697a41e61", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getPlayerBattles, "6013f5c5ecc86139fcd4165f1a95b7714ffe594846", null);
}),
"[project]/.next-internal/server/app/player/[text]/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/players.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$players$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/players.ts [app-rsc] (ecmascript)");
;
;
}),
"[project]/.next-internal/server/app/player/[text]/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/players.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "4066bbea8940760a9b415310c91ca54fb697a41e61",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$players$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPlayerByDisplayName"],
    "6013f5c5ecc86139fcd4165f1a95b7714ffe594846",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$players$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPlayerBattles"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$player$2f5b$text$5d2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$players$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/player/[text]/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions/players.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$players$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/players.ts [app-rsc] (ecmascript)");
}),
"[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* eslint-disable import/no-extraneous-dependencies */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "registerServerReference", {
    enumerable: true,
    get: function() {
        return _server.registerServerReference;
    }
});
const _server = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)"); //# sourceMappingURL=server-reference.js.map
}),
"[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongoose-8b99e611e7552af3", () => require("mongoose-8b99e611e7552af3"));

module.exports = mod;
}),
"[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This function ensures that all the exported values are valid server actions,
// during the runtime. By definition all actions are required to be async
// functions, but here we can only check that they are functions.
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ensureServerEntryExports", {
    enumerable: true,
    get: function() {
        return ensureServerEntryExports;
    }
});
function ensureServerEntryExports(actions) {
    for(let i = 0; i < actions.length; i++){
        const action = actions[i];
        if (typeof action !== 'function') {
            throw Object.defineProperty(new Error(`A "use server" file can only export async functions, found ${typeof action}.\nRead more: https://nextjs.org/docs/messages/invalid-use-server-value`), "__NEXT_ERROR_CODE", {
                value: "E352",
                enumerable: false,
                configurable: true
            });
        }
    }
} //# sourceMappingURL=action-validate.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__147c0d5a._.js.map