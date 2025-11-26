
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookText,
  Bot,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { UserNav } from '@/components/user-nav';
import { cn } from '@/lib/utils';
import { Menu, Loader2 } from 'lucide-react';
import { FirebaseClientProvider, useAuth, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useEffect } from 'react';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if user is not loaded and not logged in.
    // This runs after the initial render, preventing the state update error.
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/study-plan', icon: BookText, label: 'Study Plan' },
    { href: '/tutor', icon: Bot, label: 'AI Professor' },
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/billing', icon: CreditCard, label: 'Billing' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  const NavLinks = () => (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            pathname === item.href && 'bg-muted text-primary'
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );

  // While loading or if no user, show a loading screen or nothing to prevent content flash
  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo />
            </Link>
          </div>
          <div className="flex-1">
            <NavLinks />
          </div>
          <div className="mt-auto p-4">
             <Button size="sm" className="w-full" variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
             </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <SheetHeader>
                  <SheetTitle>
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                      <Logo />
                    </Link>
                  </SheetTitle>
                  <SheetDescription>
                    Navigate through your ProAi dashboard.
                  </SheetDescription>
                </SheetHeader>
                <NavLinks />
                 <div className="mt-auto">
                    <Button size="sm" className="w-full" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
             {/* Can add breadcrumbs here */}
          </div>
          <UserNav />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <FirebaseClientProvider>
            <AppLayoutContent>{children}</AppLayoutContent>
        </FirebaseClientProvider>
    )
}
