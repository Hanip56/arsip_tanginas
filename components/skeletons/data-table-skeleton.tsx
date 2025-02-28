import { Skeleton } from "@/components/ui/skeleton";

const DataTableSkeleton = () => {
  return (
    <div className="mt-10">
      <main className="pb-10">
        <div className="flex flex-col md:flex-row gap-2 sm:gap-6 items-center md:items-end justify-between">
          <Skeleton className="w-full md:w-60 h-10" />
          <div className="flex w-full sm:w-fit items-center gap-2">
            <Skeleton className="w-full md:w-36 h-10" />
          </div>
        </div>
        <Skeleton className="w-full h-[1px] my-2 sm:my-5" />
        <Skeleton className="w-full md:w-full h-96" />
      </main>
    </div>
  );
};

export default DataTableSkeleton;
