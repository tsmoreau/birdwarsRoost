'use client';

import Link from 'next/link';
import { Swords, Users, Gamepad2, Shield, Zap, Target } from 'lucide-react';
import Nav from '@/components/Nav';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Nav />

      <main>
        <section className="hidden py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Async Multiplayer for Playdate
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Turn-Based Tactics,
              <br />
              <span className="text-primary">Anytime, Anywhere</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Bird Wars brings asynchronous multiplayer battles to your Playdate. 
              Register your device, challenge friends, and submit turns at your own pace.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link 
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                data-testid="button-get-started"
              >
                <Gamepad2 className="w-5 h-5" />
                Get Started
              </Link>
              <Link 
                href="/battles"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-border bg-background font-medium hover:bg-secondary transition-colors"
                data-testid="button-view-battles"
              >
                <Target className="w-5 h-5" />
                View Battles
              </Link>
            </div>
          </div>
        </section>

        <section className="hidden py-16 px-4 sm:px-6 lg:px-8 bg-card/50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-background border border-border">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Shield className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">1. Register Device</h3>
                <p className="text-muted-foreground text-sm">
                  Your Playdate gets a unique server-issued secret token for secure authentication.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-background border border-border">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Swords className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">2. Create Battle</h3>
                <p className="text-muted-foreground text-sm">
                  Start a new battle or join an existing one. Challenge friends to async tactical combat.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-background border border-border">
                <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">3. Submit Turns</h3>
                <p className="text-muted-foreground text-sm">
                  Play at your own pace. Turns are validated server-side to prevent cheating.
                </p>
              </div>
            </div>
          </div>
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
              <Link href="/schema#get-stats" className="block p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors cursor-pointer no-underline" data-testid="endpoint-link-get-stats">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-2 py-1 rounded text-xs font-mono font-bold bg-chart-2/10 text-chart-2">GET</span>
                  <code className="text-sm font-mono">/api/stats</code>
                </div>
                <p className="text-sm text-muted-foreground">Get player statistics (wins, losses, battles, turns)</p>
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
