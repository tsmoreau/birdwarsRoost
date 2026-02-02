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
    serialNumber: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    tokenHash: {
        type: String,
        required: true,
        index: true
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
    isSimulator: {
        type: Boolean,
        default: false
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
        default: true,
        index: true
    },
    registrationIp: {
        type: String,
        default: null
    }
});
DeviceSchema.index({
    tokenHash: 1,
    isActive: 1
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
    "generateDeterministicToken",
    ()=>generateDeterministicToken,
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
function generateDeterministicToken(serialNumber) {
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["createHmac"])('sha256', getSecretKey()).update(serialNumber).digest('base64url');
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
"[project]/app/api/register/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Device$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/models/Device.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zod/lib/index.mjs [app-route] (ecmascript)");
;
;
;
;
;
const MIN_CLIENT_VERSION = process.env.MIN_CLIENT_VERSION || '0.0.1';
const registerSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].object({
    serialNumber: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].string().min(1).max(100),
    displayName: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].string().min(1).max(100).optional(),
    avatar: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].enum(__TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Device$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VALID_AVATARS"]).optional(),
    isSimulator: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$lib$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["z"].boolean().optional()
});
async function getRateLimitData(ip) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const recentDevices = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Device$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Device"].countDocuments({
        registeredAt: {
            $gte: oneMinuteAgo
        }
    });
    return {
        count: recentDevices,
        canProceed: recentDevices < 10
    };
}
function getClientIp(request) {
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        const firstIp = forwardedFor.split(',')[0].trim();
        if (/^[\d.:a-fA-F]+$/.test(firstIp)) {
            return firstIp;
        }
    }
    return 'unknown';
}
async function findDeviceByToken(request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.substring(7);
    if (!token) {
        return null;
    }
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
    try {
        const tokenHash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hashToken"])(token);
        const device = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Device$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Device"].findOne({
            tokenHash: tokenHash,
            isActive: true
        });
        return device;
    } catch  {
        return null;
    }
}
async function POST(request) {
    try {
        const body = await request.json().catch(()=>({}));
        const parsed = registerSchema.safeParse(body);
        if (!parsed.success) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Invalid request body',
                details: parsed.error.issues
            }, {
                status: 400
            });
        }
        const { serialNumber, displayName, avatar, isSimulator } = parsed.data;
        const existingDeviceByToken = await findDeviceByToken(request);
        if (existingDeviceByToken) {
            let updated = false;
            if (displayName && displayName !== existingDeviceByToken.displayName) {
                existingDeviceByToken.displayName = displayName;
                updated = true;
            }
            if (avatar && avatar !== existingDeviceByToken.avatar) {
                existingDeviceByToken.avatar = avatar;
                updated = true;
            }
            if (isSimulator !== undefined && isSimulator !== existingDeviceByToken.isSimulator) {
                existingDeviceByToken.isSimulator = isSimulator;
                updated = true;
            }
            existingDeviceByToken.lastSeen = new Date();
            await existingDeviceByToken.save();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                registered: true,
                deviceId: existingDeviceByToken.deviceId,
                displayName: existingDeviceByToken.displayName,
                avatar: existingDeviceByToken.avatar,
                isSimulator: existingDeviceByToken.isSimulator,
                registeredAt: existingDeviceByToken.registeredAt,
                minClientVersion: MIN_CLIENT_VERSION,
                message: updated ? 'Device verified and profile updated.' : 'Device already registered.'
            }, {
                status: 200
            });
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        const existingDevice = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Device$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Device"].findOne({
            serialNumber: serialNumber,
            isActive: true
        });
        let secretToken;
        try {
            secretToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateDeterministicToken"])(serialNumber);
        } catch (error) {
            console.error('Token generation failed - SESSION_SECRET not configured:', error);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Server configuration error'
            }, {
                status: 500
            });
        }
        if (existingDevice) {
            let updated = false;
            if (displayName && displayName !== existingDevice.displayName) {
                existingDevice.displayName = displayName;
                updated = true;
            }
            if (avatar && avatar !== existingDevice.avatar) {
                existingDevice.avatar = avatar;
                updated = true;
            }
            if (isSimulator !== undefined && isSimulator !== existingDevice.isSimulator) {
                existingDevice.isSimulator = isSimulator;
                updated = true;
            }
            existingDevice.lastSeen = new Date();
            await existingDevice.save();
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                registered: true,
                deviceId: existingDevice.deviceId,
                secretToken,
                displayName: existingDevice.displayName,
                avatar: existingDevice.avatar,
                isSimulator: existingDevice.isSimulator,
                registeredAt: existingDevice.registeredAt,
                minClientVersion: MIN_CLIENT_VERSION,
                message: updated ? 'Device recovered and profile updated.' : 'Device recovered successfully.'
            }, {
                status: 200
            });
        }
        const ip = getClientIp(request);
        const rateLimitData = await getRateLimitData(ip);
        if (!rateLimitData.canProceed) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Rate limit exceeded. Try again later.'
            }, {
                status: 429
            });
        }
        const deviceId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateSecureToken"])();
        const tokenHash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hashToken"])(secretToken);
        const effectiveDisplayName = displayName || 'Playdate Device';
        const effectiveAvatar = avatar || 'BIRD1';
        const effectiveIsSimulator = isSimulator || false;
        const device = new __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Device$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Device"]({
            deviceId,
            serialNumber,
            tokenHash,
            displayName: effectiveDisplayName,
            avatar: effectiveAvatar,
            isSimulator: effectiveIsSimulator,
            registeredAt: new Date(),
            lastSeen: new Date(),
            isActive: true,
            registrationIp: ip
        });
        await device.save();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            registered: false,
            deviceId,
            secretToken,
            displayName: effectiveDisplayName,
            avatar: effectiveAvatar,
            isSimulator: effectiveIsSimulator,
            minClientVersion: MIN_CLIENT_VERSION,
            message: 'Device registered successfully.'
        }, {
            status: 201
        });
    } catch (error) {
        console.error('Registration error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to register device'
        }, {
            status: 500
        });
    }
}
async function GET() {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["connectToDatabase"])();
        const devices = await __TURBOPACK__imported__module__$5b$project$5d2f$models$2f$Device$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Device"].find({
            isActive: true
        }).select('deviceId displayName registeredAt lastSeen').sort({
            registeredAt: -1
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            devices
        });
    } catch (error) {
        console.error('Fetch devices error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to fetch devices'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e4082afe._.js.map