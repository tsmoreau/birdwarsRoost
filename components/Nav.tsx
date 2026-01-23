'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const pathname = usePathname();
  
  const getLinkClass = (href: string) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    return isActive 
      ? "px-4 py-2 rounded-md text-sm font-medium bg-secondary text-foreground"
      : "px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors";
  };

  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 no-underline">
            <img src="/birb001.png" alt="Bird Wars" className="w-10 h-10 rounded-lg object-cover -mt-2" />
            <span className="text-xl font-bold">Bird Wars Roost</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className={getLinkClass('/dashboard')}
              data-testid="link-dashboard"
            >
              Dashboard
            </Link>
            <Link 
              href="/battles" 
              className={getLinkClass('/battles')}
              data-testid="link-battles"
            >
              Battles
            </Link>
            <Link 
              href="/devices" 
              className={getLinkClass('/devices')}
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
