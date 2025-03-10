import React, { Suspense } from "react";
import ClientComp from "./components/client-comp";
import prisma from "@/lib/db";

const OverviewPage = async () => {
  const totalUser = await prisma.user.count({
    where: {
      hidden: false,
    },
  });
  const totalPrasarana = await prisma.prasarana.count();

  const prasaranaKategori = await prisma.prasaranaKategori.findMany();

  return (
    <div className="container-dashboard">
      <header>
        <p className="font-medium">✨ Overview</p>
        <h1 className="text-3xl font-semibold my-1">Arsip Dashboard</h1>
      </header>

      <Suspense>
        <ClientComp
          totalUser={totalUser}
          totalPrasarana={totalPrasarana}
          prasaranaKategori={prasaranaKategori}
        />
      </Suspense>
    </div>
  );
};

export default OverviewPage;
