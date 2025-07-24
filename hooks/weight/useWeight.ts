import { useEffect, useState } from "react";
import { getSumHistory } from "@/db/queries/history";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteWeight, getLatestWeight, getWeightList, insertWeight, updateWeight } from "@/db/queries/weight";
import { WeightType } from "@/types/weight";


export const useLatestWeight = () => {
  return useQuery({
    queryKey: ["weight", "latest"],
    queryFn: getLatestWeight,
  });
};

export const useGetWeightList = (from: Date, to: Date) => {
  return useQuery({
    queryKey: ["weight", from.toISOString(), to.toISOString()],
    queryFn: () => getWeightList(from, to),
  });
};

export const useInsertWeight = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: insertWeight,
        onSuccess: newWeight => {
            queryClient.setQueryData(["weight", newWeight[0].id], newWeight)
            queryClient.invalidateQueries({ queryKey:["weight", "latest"]})
            console.log('inserted', newWeight[0].weight, newWeight[0].timestamp)
        }
    })
};
export const useUpdateWeight = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: updateWeight,
        onSuccess: newWeight => {
            queryClient.setQueryData(["weight", newWeight[0].id], newWeight)
            console.log('updated', newWeight[0].weight, newWeight[0].timestamp)
        }
    })
};
export const useDeleteWeight = (weightID: number) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteWeight,
        onSuccess: newWeight => {
            queryClient.invalidateQueries({ queryKey:["weight", newWeight[0].id]})
            console.log('deleted', newWeight[0].weight, newWeight[0].timestamp)
        }
    })
};