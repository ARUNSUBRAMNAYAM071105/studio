
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
  BarChart,
  CircleDollarSign,
  X,
  Home
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
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import useLocalStorage from "@/hooks/use-local-storage";
import { Chatbot } from "../chatbot";

const menuItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/detect", label: "Scan Crop", icon: ScanLine },
  { href: "/harvest-predictor", label: "Harvest Predictor", icon: BarChart },
  { href: "/knowledge-hub", label: "Knowledge Hub", icon: BookOpen },
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
    <div className="flex min-h-screen w-full flex-col">
      {isLoggedIn && <TopNav />}
      <div className="flex flex-col flex-1">
        <div className="flex-1 bg-background">{children}</div>
      </div>
      {isLoggedIn && <Chatbot />}
    </div>
  );
}

function TopNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-40">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <AppLogo />
          <span className="sr-only">CropSafe AI</span>
        </Link>
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`transition-colors hover:text-foreground ${pathname === item.href ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <MobileNav />
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          {/* Search can go here */}
        </div>
        <UserDropdown />
      </div>
    </header>
  );
}


function MobileNav() {
    const pathname = usePathname();
    return (
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
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <AppLogo />
                   <span className="sr-only">CropSafe AI</span>
                </Link>
                {menuItems.map((item) => (
                    <SheetClose asChild key={item.href}>
                        <Link
                            href={item.href}
                            className={`flex items-center gap-4 rounded-xl px-3 py-2 ${pathname === item.href ? 'bg-muted text-foreground hover:text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    </SheetClose>
                ))}
              </nav>
            </SheetContent>
        </Sheet>
    )
}


function UserDropdown() {
  const [profile, setProfile] = useLocalStorage<{ name: string } | null>("farmer-profile", null);
  const router = useRouter();

  const handleLogout = () => {
    setProfile(null);
    router.push('/login');
  };

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="https://picsum.photos/seed/farmer/100/100" data-ai-hint="farmer" />
                    <AvatarFallback>{profile?.name?.charAt(0)?.toUpperCase() || 'F'}</AvatarFallback>
                </Avatar>
                 <span className="sr-only">Toggle user menu</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile?.name}</p>
                 <p className="text-xs leading-none text-muted-foreground">
                  Farmer
                </p>
              </div>
            </DropdownMenuLabel>
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
  );
}
