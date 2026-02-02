import { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authOptions, setAuditContext, logFailedSignIn } from "@/lib/auth-options";
import { getClientIp, getUserAgent } from "@/lib/auditLogger";

async function handler(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const userAgent = getUserAgent(req.headers);
  
  await setAuditContext(ip, userAgent);
  
  const url = new URL(req.url);
  const error = url.searchParams.get('error');
  
  if (error) {
    const errorEmail = url.searchParams.get('email') || undefined;
    await logFailedSignIn(errorEmail, ip, userAgent, `OAuth error: ${error}`);
  }
  
  const nextAuthHandler = NextAuth(authOptions);
  
  try {
    const response = await nextAuthHandler(req as any);
    return response;
  } catch (authError) {
    await logFailedSignIn(undefined, ip, userAgent, `Auth error: ${authError instanceof Error ? authError.message : 'Unknown'}`);
    throw authError;
  }
}

export { handler as GET, handler as POST };
