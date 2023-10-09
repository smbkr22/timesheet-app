"use client";

import { signOut, useSession } from "next-auth/react";

import { siteConfig } from "@/config/site";
import { Button, buttonVariants } from "@/components/ui/button";
import { MainNav } from "@/components/layouts/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";

import DashboardToggle from "../dashboard-toggle";

export function SiteHeader() {
  const { data: session, status } = useSession();

  console.log(session);

  return (
    <header className="sticky top-0 z-40 flex items-center w-full gap-4 px-8 border-b bg-background">
      <DashboardToggle />
      <div className="flex items-center w-full h-16 space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex items-center justify-end flex-1 space-x-4">
          <nav className="flex items-center space-x-1">
            {status === "authenticated" && (
              <Button
                className={buttonVariants({
                  variant: "secondary",
                })}
                onClick={() => signOut()}
              >
                Logout
              </Button>
            )}

            <ThemeToggle />
          </nav>
        </div>
      </div>
      {/* {session && (
        <div className="capitalize min-w-max font-semibold tracking-widest">
          Hi,&nbsp;
          {session?.user?.user?.firstName}&nbsp;
          <span className="uppercase">{session?.user?.user?.lastName}</span>
        </div>
      )} */}
    </header>
  );
}
