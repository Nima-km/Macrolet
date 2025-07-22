// hooks/useFoodMacroSummary.ts
import { useEffect, useState } from "react";
import { getSumHistory } from "@/db/queries/history";
import { useQuery } from "@tanstack/react-query";



export const useHistorySum = (from: Date, to: Date) => {
  return useQuery({
    queryKey: ["macro-summary-sum", from.toISOString(), to.toISOString()],
    queryFn: () => getSumHistory(from, to),
  });
};
