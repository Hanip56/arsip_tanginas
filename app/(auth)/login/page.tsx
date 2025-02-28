import Link from "next/link";
import LoginForm from "./components/login-form";
import { Card } from "@/components/ui/card";

const LoginPage = () => {
  return (
    <Card className="w-full flex flex-col gap-5 p-6 sm:p-10 shadow-none">
      <header>
        <div className="text-3xl text-main-2 font-bold mb-3">
          Tanginas Arsip
        </div>
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
    </Card>
  );
};

export default LoginPage;
