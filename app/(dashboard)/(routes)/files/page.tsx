import { Suspense } from "react";
import ClientComp from "./components/client-comp";
import { countTotalFilesInFolder } from "@/lib/google-drive";
import { PARENT_FOLDER_ID } from "@/constants/google-drive";
import BreadcrumbNav from "@/components/breadcrumb-nav";

const KategoriPage = async () => {
  const totalFiles = await countTotalFilesInFolder(PARENT_FOLDER_ID);

  return (
    <div className="container-dashboard">
      <header className="mb-2">
        <p className="font-medium">✨ Files</p>
        <h1 className="text-3xl font-semibold my-1">Daftar Files</h1>
        <BreadcrumbNav />
      </header>

      <Suspense>
        <ClientComp totalFiles={totalFiles} />
      </Suspense>
    </div>
  );
};

export default KategoriPage;
