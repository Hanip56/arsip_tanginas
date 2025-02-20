import prisma from "@/lib/db";
import ClientComp from "./components/client-comp";

const PrasaranaPage = async () => {
  const kategoris = await prisma.prasaranaKategori.findMany({});

  return (
    <div className="container-dashboard">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold my-1">Prasarana</h1>
      </header>

      <ClientComp kategoris={kategoris} />
    </div>
  );
};

export default PrasaranaPage;
