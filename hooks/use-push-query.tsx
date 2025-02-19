import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useCallback } from "react";

const usePushQuery = () => {
  const params = qs.parse(useSearchParams().toString());
  const pathname = usePathname();
  const router = useRouter();

  const pushQuery = useCallback(
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

  return pushQuery;
};

export default usePushQuery;
