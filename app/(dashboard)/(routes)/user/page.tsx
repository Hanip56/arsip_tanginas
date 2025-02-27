import { Suspense } from "react";
import ClientComp from "./components/client-comp";

const ArsipKategoriPage = async () => {
  return (
    <div className="container-dashboard">
      <header className="mb-6">
        <p className="font-medium">✨ User</p>
        <h1 className="text-3xl font-semibold my-1">Daftar user</h1>
      </header>

      <Suspense>
        <ClientComp />
      </Suspense>
    </div>
  );
};

export default ArsipKategoriPage;
