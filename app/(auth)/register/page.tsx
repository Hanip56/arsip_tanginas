import Link from "next/link";
import RegisterForm from "./components/register-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const session = await auth();

  if (!session || session?.user.role === "USER") {
    return redirect("/login");
  }

  return (
    <div className="w-full flex flex-col gap-5">
      <header>
        <div className="text-2xl text-main-2 font-bold mb-5">Arsip</div>

        <div>
          <h1 className="font-bold text-lg text-zinc-900">Daftar ke Arsip.</h1>{" "}
          <p className="text-[0.8rem]">Lorem, ipsum dolor sit amet</p>
        </div>
      </header>
      <main>
        <RegisterForm />
      </main>
      <div>
        <p className="text-[0.8rem]">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-main-1">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
