import { Suspense } from "react";
import ClientComp from "./components/client-comp";
import BreadcrumbNav from "@/components/breadcrumb-nav";

const ArsipKategoriPage = async () => {
  return (
    <div className="container-dashboard">
      <header className="mb-6">
        <BreadcrumbNav />
      </header>

      <Suspense>
        <ClientComp />
      </Suspense>
    </div>
  );
};

export default ArsipKategoriPage;
