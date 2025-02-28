"use client";

import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@/hooks/use-navigate";
import { DataTable } from "@/components/ui/data-table-files";
import { columns } from "./columns";
import { GetLatestFiles } from "@/lib/fetcher/drive";
import { formatBytes } from "@/lib/utils";
import { format } from "date-fns";
import usePushQuery from "@/hooks/use-push-query";
import { useEffect, useState } from "react";
import SelectWithLabel from "@/components/ui/select-with-label";
import { useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { id } from "date-fns/locale";

type Props = {
  totalFiles: number;
};

const ClientComp = ({ totalFiles }: Props) => {
  const pushQuery = usePushQuery();
  const searchParams = useSearchParams();

  const { search, handleSearch } = useNavigate();

  const [limit, setLimit] = useState(5);
  const [pageTokenHistory, setPageTokenHistory] = useState<string[]>([]);
  const [pageToken, setPageToken] = useState("");
  const queryClient = useQueryClient();

  const createdTimeParam =
    (searchParams.get("createdTime") as "asc" | "desc") || undefined;

  const resetPageToken = () => {
    setPageToken("");
    setPageTokenHistory([]);
  };

  useEffect(() => {
    resetPageToken();
  }, []);

  useEffect(() => {
    resetPageToken();
  }, [search]);

  const query = useQuery({
    queryKey: [
      "files",
      { pageToken, nama: search, createdTime: createdTimeParam },
    ],
    queryFn: () =>
      GetLatestFiles({
        pageToken,
        nama: search,
        createdTime: createdTimeParam,
      }),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    // placeholderData: (prev) => prev,
  });

  if (query.isError) return <h1>Error...</h1>;

  const files = query.data?.files || [];

  const dataTable = files.map((file) => ({
    id: file.id,
    name: file.name,
    size: formatBytes(+file.size),
    createdTime: format(file.createdTime, "d MMMM yyyy", { locale: id }),
    thumbnailLink: file.thumbnailLink,
    arsipKategori: file.arsipKategori,
    prasarana: file.prasarana,
    arsipKategoriId: file.arsipKategoriId,
    prasaranaId: file.prasaranaId,
  }));

  return (
    <>
      <main>
        <div className="w-full py-3 border-b flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:max-w-md">
            <Label className="text-zinc-500 text-[.7rem]">Cari file</Label>
            <Input
              value={search}
              onChange={handleSearch}
              className="w-full text-xs"
              placeholder="Cari berdasarkan nama"
            />
          </div>
          <div className="w-full justify-end md:justify-start md:w-fit flex gap-2 items-center">
            <SelectWithLabel
              label="Urutkan"
              value={createdTimeParam}
              items={[
                { label: "Terbaru", value: "desc" },
                { label: "Terlama", value: "asc" },
              ]}
              onValueChange={(e) => pushQuery({ createdTime: e })}
              placeholder="Terbaru"
            />
          </div>
        </div>

        {/* data-table */}
        <div className="my-4">
          <DataTable
            columns={columns()}
            data={dataTable}
            limit={limit}
            page={pageTokenHistory.length + 1}
            totalItems={totalFiles}
            handleNext={() => {
              const nextPageToken = query.data?.nextPageToken;
              if (nextPageToken) {
                setPageToken(nextPageToken);
                setPageTokenHistory((prev) => [...prev, nextPageToken]);
              }
              queryClient.invalidateQueries({ queryKey: ["files"] });
            }}
            handlePrevious={() => {
              const pageToken = pageTokenHistory[pageTokenHistory.length - 2];
              console.log({ pageTokenFromHandlePrevious: pageToken });

              setPageToken(pageToken ?? "");
              setPageTokenHistory((prev) => prev.slice(0, prev.length - 1));

              queryClient.invalidateQueries({ queryKey: ["files"] });
            }}
            hasNext={!!query.data?.nextPageToken}
            hasPrev={pageTokenHistory.length > 0}
            isLoading={query.isPending || query.isLoading}
            search={search}
          />
        </div>
      </main>
    </>
  );
};

export default ClientComp;
