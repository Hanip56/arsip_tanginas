"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import NavMenu from "./nav-menu";
import { usePathname } from "next/navigation";

const MobileSidebar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={(o) => setOpen(o)}>
      <SheetTrigger>
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side={"left"} className="px-4 pt-8">
        <NavMenu />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
