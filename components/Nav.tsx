"use client";

import Link from "next/link";

export default function Nav() {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <img
              src="/birb001.png"
              alt="Bird Wars"
              className="w-10 h-10 rounded-md border border-border object-cover"
            />
            <span className="font-mono text-lg font-bold leading-tight uppercase tracking-wide">Bird Wars</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wide text-muted-foreground transition-colors"
              data-testid="link-dashboard"
            >
              Dashboard
            </Link>
            <Link
              href="/battles"
              className="px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-wide text-muted-foreground transition-colors"
              data-testid="link-battles"
            >
              Battles
            </Link>
            <Link
              href="/devices"
              className="px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-wide text-muted-foreground transition-colors"
              data-testid="link-devices"
            >
              Devices
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
