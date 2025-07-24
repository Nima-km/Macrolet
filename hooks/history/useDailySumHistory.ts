import { useEffect, useState } from "react";
import { getDailySumHistory, getSumHistory } from "@/db/queries/history";
import { useQuery } from "@tanstack/react-query";



export const useDailySumHistory = (from: Date, to: Date) => {
  
  return useQuery({
    queryKey: ["daily-sum-history", from.toISOString(), to.toISOString()],
    queryFn: () => getDailySumHistory(from, to),
  });
};
