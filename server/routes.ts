import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPingSchema } from "@shared/schema";
import { timingSafeEqual, createHmac } from "crypto";

function getApiSecret(): string {
  const secret = process.env.PING_API_SECRET || process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("PING_API_SECRET or SESSION_SECRET must be set with at least 16 characters");
  }
  return secret;
}

function authenticateBearer(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false, 
      error: "Missing or invalid Authorization header" 
    });
  }
  
  const token = authHeader.substring(7);
  const expectedSecret = getApiSecret();
  
  try {
    const tokenBuffer = Buffer.from(token, "utf8");
    const secretBuffer = Buffer.from(expectedSecret, "utf8");
    
    if (tokenBuffer.length !== secretBuffer.length || 
        !timingSafeEqual(tokenBuffer, secretBuffer)) {
      return res.status(401).json({ 
        success: false, 
        error: "Invalid token" 
      });
    }
  } catch {
    return res.status(401).json({ 
      success: false, 
      error: "Invalid token" 
    });
  }
  
  next();
}

function getClientIp(req: Request): string | null {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || null;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/ping", authenticateBearer, async (req: Request, res: Response) => {
    try {
      const { displayName, deviceId, message } = req.body;
      
      if (!displayName || typeof displayName !== "string") {
        return res.status(400).json({
          success: false,
          error: "displayName is required"
        });
      }
      
      if (!deviceId || typeof deviceId !== "string") {
        return res.status(400).json({
          success: false,
          error: "deviceId is required"
        });
      }
      
      const pingData = {
        deviceId,
        displayName,
        ipAddress: getClientIp(req),
        userAgent: req.headers["user-agent"] || null,
        message: message || null,
      };
      
      const ping = await storage.createPing(pingData);
      
      return res.status(200).json({
        success: true,
        message: "Ping received",
        pingId: ping.id,
        timestamp: ping.createdAt.toISOString()
      });
    } catch (error) {
      console.error("Ping error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to record ping"
      });
    }
  });
  
  app.get("/api/pings", authenticateBearer, async (req: Request, res: Response) => {
    try {
      const { deviceId } = req.query;
      
      let pings;
      if (deviceId && typeof deviceId === "string") {
        pings = await storage.getPingsByDeviceId(deviceId);
      } else {
        pings = await storage.getPings();
      }
      
      return res.status(200).json({
        success: true,
        pings
      });
    } catch (error) {
      console.error("Get pings error:", error);
      return res.status(500).json({
        success: false,
        error: "Failed to fetch pings"
      });
    }
  });

  return httpServer;
}
