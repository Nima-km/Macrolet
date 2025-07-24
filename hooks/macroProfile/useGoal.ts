import { getNutriGoals } from "@/db/queries/food";
import { useQuery } from "@tanstack/react-query";


export const useNutriGoals = () => {
  return useQuery({
    queryKey: ["nutrition-goals"],
    queryFn: getNutriGoals,
  });
};
