"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CodeXml, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { useAuth } from '@/context/auth-context';

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <CodeXml className="h-6 w-6 text-primary" />
            <span>Binary Bakery</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/programs">Explore</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/#about">About</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/#contact">Contact</Link>
            </Button>
            {isAuthenticated && (
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
