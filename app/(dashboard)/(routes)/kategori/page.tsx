import { Suspense } from "react";
import ClientComp from "./components/client-comp";
import BreadcrumbNav from "@/components/breadcrumb-nav";

const KategoriPage = async () => {
  return (
    <div className="container-dashboard">
      <header className="mb-6">
        <p className="font-medium">✨ Kategori</p>
        <h1 className="text-3xl font-semibold my-1">
          Daftar Kategori Prasarana
        </h1>
        <BreadcrumbNav />
      </header>

      <Suspense>
        <ClientComp />
      </Suspense>
    </div>
  );
};

export default KategoriPage;
