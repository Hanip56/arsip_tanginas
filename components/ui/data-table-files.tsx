"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "./skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalItems: number;
  limit: number;
  page: number;
  handlePrevious: () => void;
  handleNext: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  isLoading: boolean;
  search?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalItems,
  limit,
  page,
  handleNext,
  handlePrevious,
  hasNext,
  hasPrev,
  isLoading,
  search,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div>
      <div className="rounded-md border overflow-hidden">
        {isLoading ? (
          <div className="space-y4">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <div
                  key={i}
                  className="h-40 p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 items-center justify-center gap-4 overflow-x-auto"
                >
                  <Skeleton className="size-16 md:size-24 lg:size-32 flex-shrink-0" />
                  <Skeleton className="max-w-32 h-6" />
                  <Skeleton className="max-w-32 h-6" />
                  <Skeleton className="max-w-32 h-6 hidden sm:block" />
                  <Skeleton className="max-w-32 h-6 hidden md:block" />
                </div>
              ))}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-white">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead className="indent-2" key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="bg-white/80">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="indent-2"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      <div className="flex items-center justify-between gap-1 sm:gap-2 space-x-2 py-4">
        {search ? (
          <div />
        ) : (
          <p className="text-xs sm:text-sm text-slate-500">
            Menampilkan <span className="font-semibold">{data.length}</span>{" "}
            dari <span className="font-semibold">{totalItems}</span>
          </p>
        )}
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={!hasPrev || isLoading}
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
            disabled={!hasNext || isLoading}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
