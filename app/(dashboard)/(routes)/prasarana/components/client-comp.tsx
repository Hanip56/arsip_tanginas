"use client";

import { Input } from "@/components/ui/input";
import { Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAll } from "@/lib/fetcher/prasarana";
import { useNavigate } from "@/hooks/use-navigate";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import DataTableSkeleton from "@/components/skeletons/data-table-skeleton";
import { Label } from "@/components/ui/label";
import { PrasaranaKategori } from "@prisma/client";
import qs from "query-string";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import UpsertPrasaranaDialog from "./upsert-prasarana-dialog";
import SelectWithLabel from "@/components/ui/select-with-label";
import usePushQuery from "@/hooks/use-push-query";
import { daftarTahunAnggaran, kecamatans } from "@/constants";
import { toRupiah } from "@/lib/utils";
import BulkAction from "./bulk-action";
import { useSession } from "next-auth/react";
import ExportButtons from "@/components/export-buttons";
import { ISADMIN } from "@/constants/role";
import { BsFileEarmarkPlusFill } from "react-icons/bs";
import ImportDialog from "./import-dialog";

type Props = {
  kategoris: PrasaranaKategori[];
};

const filterParams = [
  "search",
  "jenisLahan",
  "kecamatan",
  "status",
  "tahunAnggaran",
  "kategoriId",
];

const ClientComp = ({ kategoris }: Props) => {
  const { data: session } = useSession();
  const [upsertOpenId, setUpsertOpenId] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const pushQuery = usePushQuery();

  const params = qs.parse(useSearchParams().toString());
  const kategoriId = (params?.kategoriId as string) ?? "";
  const kecamatanParam = (params?.kecamatan as string) ?? "";
  const jenisLahanParam = (params?.jenisLahan as string) ?? "";
  const statusParam = (params?.status as string) ?? "";
  const tahunParam = (params?.tahunAnggaran as string) ?? "";
  const updatedAtParam = (params?.updatedAt as string) ?? "desc";

  const isAdmin = ISADMIN(session?.user.role);

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
    queryKey: [
      "prasaranas",
      {
        page,
        search,
        limit,
        kategoriId,
        updatedAt,
        kecamatan: kecamatanParam,
        jenisLahan: jenisLahanParam,
        status: statusParam,
        tahun: tahunParam,
      },
    ],
    queryFn: () =>
      getAll({
        limit,
        page,
        search,
        updatedAt,
        kategoriId,
        kecamatan: kecamatanParam,
        jenisLahan: jenisLahanParam,
        status: statusParam,
        tahun: tahunParam,
      }),
    placeholderData: (prev) => prev,
  });

  if (query.isLoading || query.isPending) return <DataTableSkeleton />;
  if (query.isError) return <h1>Error...</h1>;

  const prasaranas = query.data?.data;

  const initialData = upsertOpenId
    ? prasaranas.find((prasarana) => prasarana.id === upsertOpenId)
    : undefined;

  const dataTable = prasaranas.map((prasarana) => ({
    id: prasarana.id,
    nama: prasarana.nama,
    kategori: prasarana.kategori.nama,
    poktan: prasarana.poktan,
    alamat: prasarana.alamat,
    desa: prasarana.desa,
    tahunAnggaran: prasarana.tahunAnggaran,
    volume: prasarana.volume,
    satuan: prasarana.satuan,
    longitude: prasarana.longitude,
    latitude: prasarana.latitude,
    sumberAnggaran: prasarana.sumberAnggaran,
    jenisLahan: prasarana.jenisLahan,
    status: prasarana.status,
    kecamatan: prasarana.kecamatan,
    bpp: prasarana.bpp,
    nilaiAnggaran: toRupiah(prasarana.nilaiAnggaran),
  }));

  const dataExport = prasaranas.map((prasarana) => ({
    ["Nama"]: prasarana.nama,
    ["Kategori"]: prasarana.kategori.nama,
    ["Poktan"]: prasarana.poktan,
    ["Alamat"]: prasarana.alamat,
    ["Desa"]: prasarana.desa,
    ["Tahun Anggaran"]: prasarana.tahunAnggaran,
    ["Volume"]: prasarana.volume,
    ["Satuan"]: prasarana.satuan,
    ["Longitude"]: prasarana.longitude,
    ["Latitude"]: prasarana.latitude,
    ["Sumber Anggaran"]: prasarana.sumberAnggaran,
    ["Jenis Lahan"]: prasarana.jenisLahan,
    ["Kondisi"]: prasarana.status,
    ["Kecamatan"]: prasarana.kecamatan,
    ["BPP"]: prasarana.bpp,
    ["Nilai Anggaran"]: prasarana.nilaiAnggaran,
  }));

  const isFiltering = Object.keys(params).some((v) => filterParams.includes(v));

  return (
    <div className="bg-white rounded-md p-6 shadow-sm">
      <UpsertPrasaranaDialog
        open={!!upsertOpenId}
        handleClose={() => setUpsertOpenId("")}
        initialData={initialData}
        kategoris={kategoris}
      />
      <main>
        <h1 className="text-2xl font-semibold mb-4">Prasarana</h1>
        <div className="w-full flex flex-wrap gap-x-4 gap-y-4 items-center justify-between">
          <div className="w-full md:max-w-[20rem] space-y-1">
            <div className="flex items-end gap-4">
              <Label
                className="text-zinc-500 text-xs sr-only"
                htmlFor="cari-prasarana"
              >
                Cari prasarana
              </Label>
              <Input
                id="cari-prasarana"
                value={search}
                onChange={handleSearch}
                className="w-full bg-white text-xs rounded-full"
                placeholder="Cari nama prasarana"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <ExportButtons data={dataExport} />
            <ImportDialog />
            {isAdmin && (
              <Button
                className="w-full flex items-center sm:w-fit text-xs"
                // size="sm"
                onClick={() => setUpsertOpenId("new")}
              >
                <BsFileEarmarkPlusFill className="size-6 pr-2 border-r" />{" "}
                <span className="line-clamp-1 pl-2">Tambah prasarana</span>
              </Button>
            )}
          </div>
        </div>

        {/* data-table */}
        <div className="my-4">
          <div>
            <div className="py-4 border-t flex flex-col sm:flex-row gap-2 items-center">
              <div className="flex items-center gap-2 flex-wrap">
                <SelectWithLabel
                  withLabel={false}
                  label="jenis Prasarana"
                  value={kategoriId ?? undefined}
                  items={[
                    { label: "Semua", value: "_" },
                    ...kategoris.map((kategori) => ({
                      label: kategori.nama,
                      value: kategori.id,
                    })),
                  ]}
                  onValueChange={(e) =>
                    pushQuery({ kategoriId: e !== "_" ? e : undefined })
                  }
                  placeholder="Semua jenis"
                />
                <SelectWithLabel
                  withLabel={false}
                  label="Kecamatan"
                  value={kecamatanParam ?? undefined}
                  items={[
                    { label: "Semua", value: "_" },
                    ...kecamatans.map((kecamatan) => ({
                      label: kecamatan,
                      value: kecamatan,
                    })),
                  ]}
                  onValueChange={(e) =>
                    pushQuery({ kecamatan: e !== "_" ? e : undefined })
                  }
                  placeholder="Semua kecamatan"
                />
                <SelectWithLabel
                  withLabel={false}
                  label="Jenis Lahan"
                  value={jenisLahanParam ?? undefined}
                  items={[
                    { label: "Semua", value: "_" },
                    { label: "LSD", value: "LSD" },
                    { label: "BUKAN LSD", value: "BUKAN LSD" },
                  ]}
                  onValueChange={(e) =>
                    pushQuery({ jenisLahan: e !== "_" ? e : undefined })
                  }
                  placeholder="Semua jenis"
                />
                <SelectWithLabel
                  withLabel={false}
                  label="Kondisi"
                  value={statusParam ?? undefined}
                  items={[
                    { label: "Semua", value: "_" },
                    { label: "Terbangun", value: "Terbangun" },
                    { label: "Tidak Terbangun", value: "Tidak Terbangun" },
                  ]}
                  onValueChange={(e) =>
                    pushQuery({ status: e !== "_" ? e : undefined })
                  }
                  placeholder="Semua kondisi"
                />
                <SelectWithLabel
                  withLabel={false}
                  label="Tahun"
                  value={tahunParam ?? undefined}
                  items={[
                    { label: "Semua", value: "_" },
                    ...daftarTahunAnggaran.map((tahunAnggaran) => ({
                      label: tahunAnggaran,
                      value: tahunAnggaran,
                    })),
                  ]}
                  onValueChange={(e) =>
                    pushQuery({ tahunAnggaran: e !== "_" ? e : undefined })
                  }
                  placeholder="Semua tahun"
                />
                <SelectWithLabel
                  withLabel={false}
                  label="Urutkan"
                  value={updatedAtParam ?? undefined}
                  items={[
                    { label: "Terbaru", value: "desc" },
                    { label: "Terlama", value: "asc" },
                  ]}
                  onValueChange={(e) => pushQuery({ updatedAt: e })}
                  placeholder="Urutkan"
                />
                {isFiltering && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      const obj = Object.fromEntries(
                        filterParams.map((v) => [v, undefined])
                      );
                      pushQuery(obj);
                    }}
                  >
                    <XIcon className="size-4 mr-2" /> Hapus Filter
                  </Button>
                )}
              </div>
            </div>
            {selectedIds.length > 0 && (
              <div className="py-4 border-t">
                <BulkAction
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                />
              </div>
            )}
            <DataTable
              columns={columns({
                setUpsertOpenId,
                selectedIds,
                setSelectedIds,
                isAdmin,
              })}
              data={dataTable}
              limit={limit}
              page={page}
              totalItems={query.data.total_items}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientComp;
