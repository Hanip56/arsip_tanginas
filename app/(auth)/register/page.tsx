import Link from "next/link";
import RegisterForm from "./components/register-form";

const LoginPage = () => {
  return (
    <div className="w-full flex flex-col gap-5">
      <header>
        <div className="text-2xl text-main-2 font-bold mb-5">Absensi</div>

        <div>
          <h1 className="font-bold text-lg text-zinc-900">
            Register to Absensi.
          </h1>{" "}
          <p className="text-[0.8rem]">Lorem, ipsum dolor sit amet</p>
        </div>
      </header>
      <main>
        <RegisterForm />
      </main>
      <div>
        <p className="text-[0.8rem]">
          Already have an account?{" "}
          <Link href="/login" className="text-main-1">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
