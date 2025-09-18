
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
  { href: "/detect", label: "Scan Crop", icon: ScanLine },
  { href: "/harvest-predictor", label: "Harvest Predictor", icon: BarChart },
  { href: "/cost-estimator", label: "Cost Estimator", icon: CircleDollarSign },
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
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {isLoggedIn && <Sidebar />}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <MobileSidebar />
          <div className="w-full flex-1">
            {/* You can add a search bar here if needed */}
          </div>
          {isLoggedIn ? <UserDropdown /> : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost">
                  <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                  <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </header>
        <div className="flex-1 bg-background">{children}</div>
      </div>
      {isLoggedIn && <Chatbot />}
    </div>
  );
}

function Sidebar() {
    const pathname = usePathname();
    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link href="/" className="flex items-center gap-2 font-semibold">
                        <AppLogo />
                    </Link>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                         {menuItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${pathname === item.href ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}

function MobileSidebar() {
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
                </Link>
                {menuItems.map((item) => (
                    <SheetClose asChild key={item.href}>
                        <Link
                            href={item.href}
                            className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 ${pathname === item.href ? 'bg-muted text-foreground hover:text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
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
