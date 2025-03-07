import { Suspense } from "react";
import ClientComp from "./components/client-comp";
import { countTotalFilesInFolder } from "@/lib/google-drive";
import { PARENT_FOLDER_ID } from "@/constants/google-drive";
import BreadcrumbNav from "@/components/breadcrumb-nav";
import { getCurrentUser } from "@/lib/server-utils";
import { redirect } from "next/navigation";

const KategoriPage = async () => {
  const user = await getCurrentUser();

  if (user?.role === "KONSULTAN" || user?.role === "LAPANGAN") {
    redirect("/");
  }

  const totalFiles = await countTotalFilesInFolder(PARENT_FOLDER_ID);

  return (
    <div className="container-dashboard">
      <header className="mb-6">
        <BreadcrumbNav />
      </header>

      <Suspense>
        <ClientComp totalFiles={totalFiles} />
      </Suspense>
    </div>
  );
};

export default KategoriPage;
