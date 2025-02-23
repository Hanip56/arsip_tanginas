"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAll } from "@/lib/fetcher/prasarana-kategori";
import { useNavigate } from "@/hooks/use-navigate";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import DataTableSkeleton from "@/components/skeletons/data-table-skeleton";
import UpsertKategoriDialog from "./upsert-kategori-dialog";

const ClientComp = () => {
  const [upsertOpenId, setUpsertOpenId] = useState("");
  const {
    page,
    handleNext,
    handlePrevious,
    search,
    handleSearch,
    updatedAt,
    toggleSortDate,
    limit,
    handleLimit,
  } = useNavigate();

  const query = useQuery({
    queryKey: ["kategoris", { page, search, limit, updatedAt }],
    queryFn: () =>
      getAll({
        limit,
        page,
        search,
        updatedAt,
      }),
    placeholderData: (prev) => prev,
  });

  if (query.isLoading || query.isPending) return <DataTableSkeleton />;
  if (query.isError) return <h1>Error...</h1>;

  const kategoris = query.data?.data;

  const initialData = upsertOpenId
    ? kategoris.find((kategori) => kategori.id === upsertOpenId)
    : undefined;

  const dataTable = kategoris.map((kategori) => ({
    id: kategori.id,
    nama: kategori.nama,
    deskripsi: kategori.deskripsi,
  }));

  return (
    <>
      <UpsertKategoriDialog
        open={!!upsertOpenId}
        handleClose={() => setUpsertOpenId("")}
        initialData={initialData}
      />
      <main>
        <div className="w-full py-3 border-b flex flex-col md:flex-row gap-4 items-center justify-between">
          <Input
            value={search}
            onChange={handleSearch}
            className="w-full md:max-w-md"
            placeholder="Cari kategori"
          />
          <div className="w-full justify-end md:justify-start md:w-fit flex gap-2 items-center">
            <Button variant="outline">Filter</Button>
            <Button onClick={() => setUpsertOpenId("new")}>
              <PlusIcon className="size-5 mr-2" />{" "}
              <span className="line-clamp-1">Add kategori</span>
            </Button>
          </div>
        </div>

        {/* data-table */}
        <div className="my-4">
          <DataTable
            columns={columns(setUpsertOpenId)}
            data={dataTable}
            limit={limit}
            page={page}
            totalItems={query.data.total_items}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
          />
        </div>
      </main>
    </>
  );
};

export default ClientComp;
