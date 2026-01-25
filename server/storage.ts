import { type User, type InsertUser, type Ping, type InsertPing } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPing(ping: InsertPing): Promise<Ping>;
  getPings(): Promise<Ping[]>;
  getPingsByDeviceId(deviceId: string): Promise<Ping[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private pings: Map<string, Ping>;

  constructor() {
    this.users = new Map();
    this.pings = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPing(insertPing: InsertPing): Promise<Ping> {
    const id = randomUUID();
    const ping: Ping = { 
      ...insertPing, 
      id, 
      createdAt: new Date() 
    };
    this.pings.set(id, ping);
    return ping;
  }

  async getPings(): Promise<Ping[]> {
    return Array.from(this.pings.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getPingsByDeviceId(deviceId: string): Promise<Ping[]> {
    return Array.from(this.pings.values())
      .filter((ping) => ping.deviceId === deviceId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemStorage();
