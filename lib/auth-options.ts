import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./mongodb-client";
import { logAuditEvent } from "./auditLogger";
import { cookies } from "next/headers";

const AUDIT_COOKIE_NAME = 'auth_audit_context';

export async function setAuditContext(ip: string, userAgent: string) {
  const cookieStore = await cookies();
  const data = JSON.stringify({ ip, userAgent, ts: Date.now() });
  cookieStore.set(AUDIT_COOKIE_NAME, data, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 300,
    sameSite: 'lax',
    path: '/',
  });
}

async function getAuditContext(): Promise<{ ip: string; userAgent: string }> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(AUDIT_COOKIE_NAME);
    if (cookie?.value) {
      const data = JSON.parse(cookie.value);
      if (Date.now() - data.ts < 300000) {
        return { ip: data.ip, userAgent: data.userAgent };
      }
    }
  } catch {
  }
  return { ip: 'unknown', userAgent: 'unknown' };
}

export async function clearAuditContext() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUDIT_COOKIE_NAME);
  } catch {
  }
}

export async function logFailedSignIn(email: string | undefined, ip: string, userAgent: string, reason: string) {
  await logAuditEvent({
    eventType: 'admin_login_failed',
    ip,
    userAgent,
    userEmail: email,
    success: false,
    details: reason,
  });
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async signIn({ user, account }) {
      const { ip, userAgent } = await getAuditContext();
      
      await logAuditEvent({
        eventType: 'admin_login',
        ip,
        userAgent,
        userId: user.id,
        userEmail: user.email || undefined,
        success: true,
        details: `OAuth provider: ${account?.provider || 'unknown'}`,
      });
      
      await clearAuditContext();
      
      return true;
    },
  },
  events: {
    async signIn({ user, account }) {
      console.log(`[AUDIT] Admin sign-in: ${user.email} via ${account?.provider}`);
    },
  },
};
