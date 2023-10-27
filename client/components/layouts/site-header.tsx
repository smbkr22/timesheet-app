"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { siteConfig } from "@/config/site";
import useAuth from "@/hooks/useAuth";
import { Button, buttonVariants } from "@/components/ui/button";
import { MainNav } from "@/components/layouts/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";

import DashboardToggle from "../dashboard-toggle";

export function SiteHeader() {
  const { auth, setAuth } = useAuth();
  const router = useRouter();
  console.log(auth);

  return (
    <header className="sticky top-0 z-40 flex items-center w-full gap-4 px-8 border-b bg-background">
      <DashboardToggle />
      <div className="flex items-center w-full h-16 space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={siteConfig.mainNav} />
        <div className="flex items-center justify-end flex-1 space-x-4">
          <nav className="flex items-center space-x-1">
            {auth ? (
              <>
                <Button
                  onClick={() => {
                    setAuth(null);
                    router.push("/");
                  }}
                  className={buttonVariants({
                    variant: "secondary",
                  })}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                {/* <Link
                  className={buttonVariants({
                    variant: "default",
                  })}
                  href={"/signup"}
                >
                  Sign Up
                </Link> */}
                <Link
                  className={buttonVariants({
                    variant: "secondary",
                  })}
                  href={"/signin"}
                >
                  Sign In
                </Link>
              </>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </div>
      {auth && (
        <div className="font-semibold tracking-widest capitalize min-w-max">
          Hi,&nbsp;
          {auth.user.firstName}&nbsp;{auth.user.lastName}
        </div>
      )}
    </header>
  );
}
