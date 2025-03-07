import prisma from "@/lib/db";
import ClientComp from "./components/client-comp";
import { Suspense } from "react";
import BreadcrumbNav from "@/components/breadcrumb-nav";

const PrasaranaPage = async () => {
  const kategoris = await prisma.prasaranaKategori.findMany({});

  return (
    <div className="container-dashboard">
      <header className="mb-6">
        <BreadcrumbNav />
      </header>

      <Suspense>
        <ClientComp kategoris={kategoris} />
      </Suspense>
    </div>
  );
};

export default PrasaranaPage;
