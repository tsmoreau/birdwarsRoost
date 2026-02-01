"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Nav() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  return (
    <header className="border-b border-border bg-card  top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 ">
          <Link href="/" className="ml-4 flex items-center gap-3 no-underline">
            <img
              src="/birb001.png"
              alt="Bird Wars"
              className="w-10 h-10 rounded-md object-cover"
            />
            <span className="font-mono text-xl font-bold  -ml-2 -mb-3 leading-tight uppercase tracking-tight">
              Bird Wars Roost
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wide text-muted-foreground transition-colors"
                  data-testid="link-dashboard"
                >
                  Dashboard
                </Link>
                <Link
                  href="/battles"
                  className="hidden px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-wide text-muted-foreground transition-colors"
                  data-testid="link-battles"
                >
                  Battles
                </Link>
                <Link
                  href="/devices"
                  className="hidden px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-wide text-muted-foreground transition-colors"
                  data-testid="link-devices"
                >
                  Devices
                </Link>
              </>
            )}
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="ml-2"
                    data-testid="button-logout"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                ) : (
                  <Link href="/login" data-testid="link-login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-card hover:text-foreground transition-all duration-300 no-default-hover-elevate no-default-active-elevate"
                    >
                      Login
                    </Button>
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
