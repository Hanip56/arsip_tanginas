"use client";

import { navigations } from "@/constants";
import Link from "next/link";
import Logo from "@/components/logo";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "@/actions/logout";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const NavMenu = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const shortPathname = pathname.split("/").slice(0, 2).join("/");

  const handleLogout = async () => {
    const { success } = await logout();

    if (success) {
      window.location.href = "/login";
    }
  };

  return (
    <div className="h-full w-full">
      <div className="flex flex-col items-center justify-center pb-2 border-b">
        <Logo />
      </div>

      {/* nav menu */}
      <div className="py-2 text-zinc-900 flex flex-col justify-between h-[90vh]">
        <div className="flex flex-col py-2  gap-1 overflow-y-auto sm:px-4">
          {navigations(session?.user.role !== "USER").map((nav, i) =>
            nav.href && nav.type === "single" ? (
              <Link
                key={i}
                href={nav.href}
                className={cn(
                  "p-3 flex items-center gap-3 rounded-md",
                  nav.href === shortPathname
                    ? "bg-main-2 text-white"
                    : "hover:bg-main-2/10"
                )}
              >
                {nav.icon && <nav.icon />}
                <span className="text-sm font-medium">{nav.label}</span>
              </Link>
            ) : nav.href && nav.sub && nav.type === "multiple" ? (
              <Collapsible key={nav.href}>
                <CollapsibleTrigger asChild className="relative">
                  <button
                    key={i}
                    className={cn(
                      "w-full px-3 py-2 flex items-center gap-3 rounded-md cursor-pointer",
                      nav.href === shortPathname
                        ? "bg-main-2 text-white"
                        : "hover:bg-main-2/10"
                    )}
                  >
                    {nav.icon && <nav.icon />}
                    <span className="text-sm font-medium">{nav.label}</span>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <ChevronsUpDown className="size-3" />
                    </div>
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="py-1">
                  {nav.sub.map((subNav, i) => (
                    <Link
                      key={i}
                      href={subNav.href}
                      className={cn(
                        "px-3 pl-[0.9rem] py-2 flex items-center gap-3 rounded-md",
                        subNav.href === pathname
                          ? "text-main-2"
                          : "hover:text-main-2"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-full p-px bg-gray-400 text-white hover:bg-main-2 ",
                          subNav.href === pathname && "text-white bg-main-2"
                        )}
                      >
                        {subNav.icon && <subNav.icon size={12} />}
                      </div>
                      <span className="text-[0.8rem] font-medium">
                        {subNav.label}
                      </span>
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <div
                key={nav.subtitle}
                className="text-xs font-medium text-zinc-400 px-3 pt-2"
              >
                {nav.subtitle ?? ""}
              </div>
            )
          )}
        </div>
        <div className="p-4 w-full">
          <Button
            onClick={handleLogout}
            variant="secondary"
            className="w-full bg-main-2/10 text-main-2 text-sm font-semibold"
          >
            <LogOutIcon className="size-4 mr-2" /> Keluar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NavMenu;
