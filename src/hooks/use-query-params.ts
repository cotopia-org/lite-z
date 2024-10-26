"use client";

import { useSearchParams } from "react-router-dom";

const useQueryParams = () => {
  const [searchParams] = useSearchParams();
  let query: any = {};
  for (let [key, value] of searchParams.entries() as any) {
    query[key] = value;
  }

  return {
    query,
  };
};
export default useQueryParams;
