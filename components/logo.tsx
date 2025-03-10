import { cn } from "@/lib/utils";
import React from "react";

const Logo = ({ className }: { className?: string }) => {
  return (
    <div className={cn(`text-2xl text-white font-bold mb-2`, className)}>
      Arsip
    </div>
  );
};

export default Logo;
