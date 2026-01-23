'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image 
                src="/birb001.png" 
                alt="Bird Wars" 
                width={40} 
                height={40} 
                className="rounded-lg"
              />
              <span className="text-xl font-bold">Bird Wars</span>
            </div>
            <nav className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-dashboard"
              >
                Dashboard
              </Link>
              <Link 
                href="/battles" 
                className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-battles"
              >
                Battles
              </Link>
              <Link 
                href="/devices" 
                className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-devices"
              >
                Devices
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <section className="relative flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
          <Image 
            src="/bg2.png" 
            alt="Bird Wars Background" 
            width={800}
            height={600}
            className="max-w-full h-auto"
            priority
          />
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">API Endpoints</h2>
            <div className="space-y-4">
              <Link href="/schema#post-register" className="block p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer no-underline" data-testid="endpoint-link-register">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded text-xs font-mono font-bold bg-primary/10 text-primary">POST</span>
                  <code className="text-sm font-mono">/api/register</code>
                </div>
                <p className="text-sm text-muted-foreground">Register a new Playdate device and receive a secret token</p>
              </Link>
              <Link href="/schema#get-battles" className="block p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer no-underline" data-testid="endpoint-link-get-battles">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded text-xs font-mono font-bold bg-chart-2/10 text-chart-2">GET</span>
                  <code className="text-sm font-mono">/api/battles</code>
                </div>
                <p className="text-sm text-muted-foreground">List all public battles (excludes private battles)</p>
              </Link>
              <Link href="/schema#post-battles" className="block p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer no-underline" data-testid="endpoint-link-post-battles">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded text-xs font-mono font-bold bg-primary/10 text-primary">POST</span>
                  <code className="text-sm font-mono">/api/battles</code>
                </div>
                <p className="text-sm text-muted-foreground">Create a new battle session (supports isPrivate option)</p>
              </Link>
              <Link href="/schema#get-battles-id" className="block p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer no-underline" data-testid="endpoint-link-get-battle">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded text-xs font-mono font-bold bg-chart-2/10 text-chart-2">GET</span>
                  <code className="text-sm font-mono">/api/battles/:id</code>
                </div>
                <p className="text-sm text-muted-foreground">Get battle details and current state</p>
              </Link>
              <Link href="/schema#patch-battles-id" className="block p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer no-underline" data-testid="endpoint-link-patch-battle">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded text-xs font-mono font-bold bg-chart-4/10 text-chart-4">PATCH</span>
                  <code className="text-sm font-mono">/api/battles/:id</code>
                </div>
                <p className="text-sm text-muted-foreground">Join a pending battle as player 2 (authenticated)</p>
              </Link>
              <Link href="/schema#get-mybattles" className="block p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer no-underline" data-testid="endpoint-link-mybattles">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded text-xs font-mono font-bold bg-chart-2/10 text-chart-2">GET</span>
                  <code className="text-sm font-mono">/api/mybattles</code>
                </div>
                <p className="text-sm text-muted-foreground">List all battles for the authenticated device (includes private)</p>
              </Link>
              <Link href="/schema#post-turns" className="block p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer no-underline" data-testid="endpoint-link-post-turns">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded text-xs font-mono font-bold bg-primary/10 text-primary">POST</span>
                  <code className="text-sm font-mono">/api/turns</code>
                </div>
                <p className="text-sm text-muted-foreground">Submit a turn with actions (authenticated, validated)</p>
              </Link>
              <Link href="/schema#get-turns" className="block p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer no-underline" data-testid="endpoint-link-get-turns">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded text-xs font-mono font-bold bg-chart-2/10 text-chart-2">GET</span>
                  <code className="text-sm font-mono">/api/turns?battleId=:id</code>
                </div>
                <p className="text-sm text-muted-foreground">Get turn history for a battle</p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>Bird Wars Async Battle Server</p>
        </div>
      </footer>
    </div>
  );
}
