"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import siteConfig from "@/config/site";
import ConnectWallet from "./connect-wallet";
//import ConnectWallet from "./connect-wallet";

export default function SiteHeader() {
<<<<<<< HEAD
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/games", label: "Games" },
    //{ href: "/lobby", label: "Lobby" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];
=======
	const navLinks = [
		{ href: "/", label: "Home" },
		{ href: "/games", label: "Games" },
		{ href: "/lobby", label: "Lobby" },
		{ href: "/leaderboard", label: "Leaderboard" },
	];
>>>>>>> 602b1e973000c724cd34c32caed139fd7ca6e3c1

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href={"/"}>
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png?height=32&width=32"
              alt="Stacks Wars Logo"
              width={32}
              height={32}
              className="rounded-md"
            />
            <span className="text-xl font-bold hidden md:inline-block">
              {siteConfig.name}
            </span>
            <span className="text-xl font-bold md:hidden">SW</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center md:hidden gap-4">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Stacks Wars</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                {/*<ConnectWallet />*/}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden md:flex">
          <ConnectWallet />
        </div>
      </div>
    </header>
  );
}
