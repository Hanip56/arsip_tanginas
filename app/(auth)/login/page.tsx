import Link from "next/link";
import LoginForm from "./components/login-form";

const LoginPage = () => {
  return (
    <div className="w-full flex flex-col gap-5">
      <header>
        <div className="text-2xl text-main-2 font-bold mb-5">Absensi</div>

        <div>
          <h1 className="font-bold text-lg text-zinc-900">Login to Absensi.</h1>
          <p className="text-[0.8rem]">Lorem, ipsum dolor sit amet</p>
        </div>
      </header>
      <main>
        <LoginForm />
      </main>
      <div>
        <p className="text-[0.8rem]">
          New here?{" "}
          <Link href="/register" className="text-main-1">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
