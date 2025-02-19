import { Skeleton } from "@/components/ui/skeleton";

const DataTableSkeleton = () => {
  return (
    <div className="mt-10">
      <main className="pb-10">
        <div className="flex flex-col md:flex-row gap-4 items-center md:items-end justify-between">
          <Skeleton className="w-full md:w-96 h-10" />
          <div className="flex items-center gap-2">
            <Skeleton className="w-full md:w-24 h-10" />
            <Skeleton className="w-full md:w-36 h-10" />
          </div>
        </div>
        <Skeleton className="w-full h-[1px] mt-2 mb-3" />
        <Skeleton className="w-full md:w-full h-60" />
      </main>
    </div>
  );
};

export default DataTableSkeleton;
