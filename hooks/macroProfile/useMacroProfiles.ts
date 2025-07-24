import { useEffect, useState } from "react";
import { getSumHistory } from "@/db/queries/history";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteWeight, getLatestWeight, insertWeight, updateWeight } from "@/db/queries/weight";
import { WeightType } from "@/types/weight";
import { getMacroProfile, getMacroProfileAll, insertNutritionGoal } from "@/db/queries/macroProfile";
import { NutritionInfo } from "@/components/NutritionInfo";


export const useGetMacroProfileAll = () => {
  return useQuery({
    queryKey: ["macroprofiles"],
    queryFn: getMacroProfileAll,
  });
};
export const useGetMacroProfile = (profile_id: number, enabled = true) => {
  return useQuery({
    queryKey: ["macroprofile", profile_id],
    queryFn: () => getMacroProfile(profile_id),
    enabled
  });
};

export const useInsertNutritionGoal = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: insertNutritionGoal,
        onSuccess: newNutritionGoal => {
            queryClient.setQueryData(["nutrition-goals"], newNutritionGoal)
            queryClient.invalidateQueries({ queryKey:["nutrition-goals"]})
            console.log('inserted goal')
        }
    })
}