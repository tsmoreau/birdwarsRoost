import { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authOptions, setAuditContext, logFailedSignIn } from "@/lib/auth-options";
import { getClientIp, getUserAgent } from "@/lib/auditLogger";

const handler = NextAuth(authOptions);

async function wrappedGET(req: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) {
  const ip = getClientIp(req.headers);
  const userAgent = getUserAgent(req.headers);
  
  try {
    await setAuditContext(ip, userAgent);
  } catch {
  }
  
  const url = new URL(req.url);
  const error = url.searchParams.get('error');
  
  if (error) {
    const errorEmail = url.searchParams.get('email') || undefined;
    await logFailedSignIn(errorEmail, ip, userAgent, `OAuth error: ${error}`);
  }
  
  return handler(req as any, context as any);
}

async function wrappedPOST(req: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) {
  const ip = getClientIp(req.headers);
  const userAgent = getUserAgent(req.headers);
  
  try {
    await setAuditContext(ip, userAgent);
  } catch {
  }
  
  return handler(req as any, context as any);
}

export { wrappedGET as GET, wrappedPOST as POST };
