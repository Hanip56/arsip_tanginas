import Link from "next/link";
import LoginForm from "./components/login-form";
import { Card } from "@/components/ui/card";
import { RiInboxArchiveFill } from "react-icons/ri";

const LoginPage = () => {
  return (
    <div className="bg-white sm:bg-transparent p-8 sm:p-4 w-full flex flex-col gap-5 shadow-none rounded-md">
      <header>
        <div className="text-3xl text-main-2 font-bold mb-3">Masuk</div>
      </header>
      <main>
        <LoginForm />
      </main>
      {/* <div>
        <p className="text-[0.8rem]">
          Baru disini?{" "}
          <Link href="/register" className="text-main-1">
            Buat akun
          </Link>
        </p>
      </div> */}
    </div>
  );
};

export default LoginPage;
