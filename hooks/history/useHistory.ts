// hooks/useFoodHistory.ts
import { useEffect, useState } from "react";
import { getHistory } from "@/db/queries/history";
import { useQuery } from "@tanstack/react-query";

export const useFoodHistory = (from: Date, to: Date) => {
  return useQuery({
    queryKey: ["food-history", from.toISOString(), to.toISOString()],
    queryFn: () => getHistory(from, to),
  });
};
