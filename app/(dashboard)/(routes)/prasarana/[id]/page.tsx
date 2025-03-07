import prisma from "@/lib/db";
import ClientComp from "./components/client-comp";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import { auth } from "@/auth";
import { ISADMIN } from "@/constants/role";

const PrasaranaArsipPage = async () => {
  const session = await auth();
  const isAdmin = ISADMIN(session?.user.role);

  let where: any = undefined;

  if (!isAdmin) {
    where = {
      access: {
        some: {
          role: session?.user.role,
        },
      },
    };
  }

  const arsipKategoris = await prisma.arsipKategori.findMany({
    where,
    orderBy: {
      nama: "asc",
    },
  });

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
