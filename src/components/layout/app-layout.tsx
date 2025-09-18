"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { usePathname } from "next/navigation";
import {
  LogOut,
  User,
  ScanLine,
  Bell,
  Menu,
  LineChart,
  BookOpen,
  Users,
} from "lucide-react";

import { AppLogo } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useLocalStorage from "@/hooks/use-local-storage";
import { Chatbot } from "../chatbot";

const menuItems = [
  { href: "/detect", label: "Scan Crop", icon: ScanLine },
  { href: "/community", label: "Community", icon: Users },
  { href: "/warnings", label: "Alerts", icon: Bell },
  { href: "/market", label: "Market", icon: LineChart },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [profile] = useLocalStorage<{ name: string } | null>("farmer-profile", null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isLoggedIn = isClient && profile && profile.name;

  if (pathname === '/login' || pathname === '/signup') {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" passHref>
            <AppLogo />
          </Link>
          <div className="flex flex-1 items-center justify-end gap-4">
            {isLoggedIn && (
               <nav className="hidden md:flex md:items-center md:gap-6 text-sm font-medium ml-10">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`transition-colors hover:text-foreground/80 ${pathname === item.href ? 'text-foreground' : 'text-foreground/60'}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <UserDropdown />
              ) : (
                <>
                  <Button asChild variant="ghost">
                      <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                      <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
            {isLoggedIn && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="grid gap-6 text-lg font-medium mt-8">
                  <AppLogo />
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-4 px-2.5 ${pathname === item.href ? 'text-foreground' : 'text-foreground/70 hover:text-foreground'}`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            )}
          </div>
        </div>
      </header>
      <div className="flex-1">{children}</div>
       {isLoggedIn && <Chatbot />}
    </div>
  );
}

function UserDropdown() {
  const [profile, setProfile] = useLocalStorage<{ name: string } | null>("farmer-profile", null);
  const router = useRouter();

  const handleLogout = () => {
    setProfile(null);
    router.push('/login');
  };

  return (
    <div className="flex items-center gap-4">
       <span className="hidden sm:inline-block text-sm">Welcome, {profile?.name}</span>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="https://picsum.photos/seed/farmer/100/100" data-ai-hint="farmer" />
                        <AvatarFallback>{profile?.name?.charAt(0) || 'F'}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
}
