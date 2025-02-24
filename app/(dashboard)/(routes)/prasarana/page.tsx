import prisma from "@/lib/db";
import ClientComp from "./components/client-comp";
import { Suspense } from "react";

const PrasaranaPage = async () => {
  const kategoris = await prisma.prasaranaKategori.findMany({});

  return (
    <div className="container-dashboard">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold my-1">Prasarana</h1>
      </header>

      <Suspense>
        <ClientComp kategoris={kategoris} />
      </Suspense>
    </div>
  );
};

export default PrasaranaPage;
