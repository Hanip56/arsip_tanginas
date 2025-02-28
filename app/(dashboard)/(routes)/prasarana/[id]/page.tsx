import prisma from "@/lib/db";
import ClientComp from "./components/client-comp";
import BreadcrumbNav from "@/components/breadcrumb-nav";

const PrasaranaArsipPage = async () => {
  const arsipKategoris = await prisma.arsipKategori.findMany();

  return (
    <div className="container-dashboard">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold my-1">Arsip prasarana</h1>
        <BreadcrumbNav />
      </header>

      <ClientComp arsipKategoris={arsipKategoris} />
    </div>
  );
};

export default PrasaranaArsipPage;
