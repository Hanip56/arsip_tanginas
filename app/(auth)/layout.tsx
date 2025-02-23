import Image from "next/image";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-[100%] h-screen flex gap-8 p-8">
      <div className="w-full h-full flex items-center justify-center bg-emerald-500/10 rounded-xl flex-1">
        <Image
          src={"/auth-image.png"}
          alt="Sending illustration"
          width={5000}
          height={5000}
          priority
          className="w-[80%] h-[80%] object-contain"
        />
      </div>
      <div className="flex items-center basis-[50%] px-24">{children}</div>
    </div>
  );
};

export default AuthLayout;
