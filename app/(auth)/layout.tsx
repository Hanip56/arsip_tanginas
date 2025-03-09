import { ArchiveIcon } from "lucide-react";
import Image from "next/image";
import { RiInboxArchiveFill } from "react-icons/ri";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-[100%] h-screen flex gap-8">
      <div className="w-full h-full hidden sm:flex items-center justify-center  basis-1/2 lg:basis-[65%] overflow-hidden bg-main-2 relative">
        <Image
          src={"/auth-bg.jpg"}
          alt="Sending illustration"
          width={5000}
          height={5000}
          priority
          className="w-full h-full object-cover opacity-25 absolute top-0 left-0"
        />

        <div className="z-10 text-center flex flex-col items-center gap-4">
          <RiInboxArchiveFill className="size-12 text-white" />
          <h1 className="text-4xl font-bold text-white">Tanginas Arsip</h1>
          <p className="text-white">Aplikasi penyimpanan file</p>
        </div>
      </div>
      <div className="flex items-center flex-1 px-4 pr-8 bg-main-2 sm:bg-transparent relative">
        <Image
          src={"/auth-bg.jpg"}
          alt="Sending illustration"
          width={5000}
          height={5000}
          priority
          className="block sm:hidden w-full h-full object-cover opacity-25 absolute top-0 left-0"
        />

        <div className="flex text-center sm:hidden items-center justify-center mb-6 absolute top-5 left-1/2 -translate-x-1/2 z-10">
          <div className="py-2 rounded-full flex gap-2">
            <RiInboxArchiveFill className="size-6 text-white" />
            <h1 className="font-bold text-white">Tanginas Arsip</h1>
          </div>
        </div>

        <div className="relative z-10 flex-1">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
