"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "./use-debounce";
import { DEFAULT_LIMIT_REQUEST } from "@/lib/settings";

export const useNavigate = (): {
  page: number; // page
  handleNext: () => void; // handle next
  handlePrevious: () => void; // handle previous
  search: string; // search
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void; // handle search
  updatedAt: string; // updatedAt
  toggleSortDate: () => void; // handle sort date
  limit: number; // limit
  handleLimit: (limit?: number) => void; // handle limit
} => {
  const params = qs.parse(useSearchParams().toString());
  const router = useRouter();
  const pathname = usePathname();
  const page = params?.page ? Number(params.page) : 1;
  const limit = params?.limit ? Number(params.limit) : DEFAULT_LIMIT_REQUEST;
  const updatedAt = params?.updatedAt ? params.updatedAt.toString() : "";
  const [search, setSearch] = useState(params?.search?.toString() ?? "");
  const debouncedSearch = useDebounce(search);
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    setFirstRender(false);
  }, []);

  const handleNavigate = useCallback(
    (q: Record<string, string | number | undefined>) => {
      const query = {
        ...params,
        ...q,
      };

      const url = qs.stringifyUrl(
        {
          url: pathname,
          query,
        },
        { skipEmptyString: true, skipNull: true }
      );

      router.push(url, { scroll: false });
    },
    [params, router, pathname]
  );

  const handleLimit = (limit?: number) => {
    handleNavigate({
      limit: limit ?? "",
    });
  };

  const handleNext = () => {
    handleNavigate({
      page: page + 1,
    });
  };

  const handlePrevious = () => {
    handleNavigate({
      page: page - 1,
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const toggleSortDate = () => {
    handleNavigate({
      updatedAt:
        !updatedAt || updatedAt === "desc"
          ? "asc"
          : updatedAt === "asc"
          ? "desc"
          : "",
    });
  };

  // handle Search
  useEffect(() => {
    if (firstRender) return;

    handleNavigate({
      search: debouncedSearch,
      page: undefined,
    });
  }, [debouncedSearch]);

  return {
    page,
    handleNext,
    handlePrevious,
    search,
    handleSearch,
    updatedAt,
    toggleSortDate,
    limit,
    handleLimit,
  };
};
