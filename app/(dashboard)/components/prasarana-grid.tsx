import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "@/hooks/use-navigate";
import { getAll } from "@/lib/fetcher/prasarana";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import SelectWithLabel from "@/components/ui/select-with-label";
import { PrasaranaKategori } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CiFileOff } from "react-icons/ci";
import Link from "next/link";
import { useDebounce } from "@/hooks/use-debounce";

type Props = {
  kategoris: PrasaranaKategori[];
};

const PrasaranaGrid = ({ kategoris }: Props) => {
  const [kategoriId, setKategoriId] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const { handleSearch, updatedAt, limit } = useNavigate();

  const query = useQuery({
    queryKey: [
      "prasarana-grid",
      {
        page,
        search: debouncedSearch,
        limit,
        kategoriId,
        updatedAt,
      },
    ],
    queryFn: () =>
      getAll({
        limit,
        page,
        search: debouncedSearch,
        updatedAt,
        kategoriId,
      }),
    placeholderData: (prev) => prev,
  });

  if (query.isLoading || query.isPending) return <PrasaranaGridSkeleton />;
  if (query.isError) return <h1>Error...</h1>;

  const prasaranas = query.data?.data;
  const totalItems = query.data.total_items;
  const totalPages = Math.ceil(totalItems / limit);

  const handleNext = () => {
    if (page !== totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (page !== 1) {
      setPage((prev) => prev - 1);
    }
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="mb-4">
        <CardTitle className="mb-3">Arsip Prasarana</CardTitle>
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-4">
            <div className="w-full md:w-80 space-y-1">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white text-xs"
                placeholder="Cari nama prasarana"
              />
            </div>
            {/* <div className="w-full md:w-60 space-y-1">
              <Input
                value={search}
                onChange={handleSearch}
                className="w-full bg-white text-xs"
                placeholder="Cari poktan"
              />
            </div> */}
          </div>
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
            onValueChange={(e) => setKategoriId(e !== "_" ? e : "")}
            placeholder="Semua kategori"
          />
        </div>
      </CardHeader>
      <CardContent>
        {prasaranas.length === 0 && (
          <div className="w-full flex justify-center items-center text-center h-40">
            <div className="flex flex-col items-center gap-4">
              <CiFileOff className="size-20" />
              <p className="text-muted-foreground font-medium">
                Prasarana tidak ditemukan
              </p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {prasaranas?.map((prasarana) => (
            <Link href={`/prasarana/${prasarana.id}`} key={prasarana.id}>
              <Card className="shadow-none hover:bg-main-2/10 transition-all cursor-pointer">
                <CardContent className="p-4 space-y-2">
                  <div className="relative">
                    <div className="absolute top-3 left-3 rounded-full bg-black/10 text-white font-semibold text-xs py-1 px-3">
                      {prasarana.kategori.nama}
                    </div>
                    <Image
                      src={prasarana.kategori.imageUrl ?? ""}
                      alt={prasarana.nama}
                      width={1000}
                      height={1000}
                      className="rounded-md"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{prasarana.nama}</h3>
                    <p className="text-sm">{prasarana.poktan} - poktan</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full flex items-center justify-between gap-1 sm:gap-2 space-x-2 py-4">
          <p className="text-xs sm:text-sm text-slate-500">
            Menampilkan{" "}
            <span className="font-semibold">{prasaranas.length}</span> dari{" "}
            <span className="font-semibold">{totalItems}</span>
          </p>
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={page <= 1}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <div className="text-sm text-muted-foreground px-3">
              {page}
              {!search && <small>{!totalPages ? "" : `/${totalPages}`}</small>}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={page >= totalPages}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PrasaranaGrid;

const PrasaranaGridSkeleton = () => (
  <Card className="w-full space-y-4">
    <div className="p-6 space-y-6">
      <Skeleton className="w-60 h-8" />
      <Skeleton className="w-full h-96" />
    </div>
  </Card>
);
