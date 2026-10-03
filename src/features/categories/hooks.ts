"use client";

import { useQuery } from "@tanstack/react-query";

import { listCategories } from "./services";

export const categoriesKey = ["categories"] as const;

export function useCategories() {
  return useQuery({
    queryKey: categoriesKey,
    queryFn: listCategories,
    staleTime: 5 * 60 * 1000,
  });
}
