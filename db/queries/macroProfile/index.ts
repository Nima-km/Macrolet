import { NutritionInfo } from "@/components/NutritionInfo";
import { db } from "../../client";
import { food, foodItem, macroGoal, macroProfile, nutritionGoal } from "../../schema";
import { sql, eq, sum, and, gte, lt, desc} from 'drizzle-orm';


export const getMacroProfileAll = async () => {
  console.log('getMacroProfileAll')
  return db.select()
        .from(macroProfile)
};
export const getMacroProfile = async (profile_id : number) => {
  console.log('getMacroProfile')
  return db.select({
            fat: macroGoal.fat,
            carbs: macroGoal.carbs,
            protein: macroGoal.protein,
            calories: macroGoal.calories,
        }).from(macroProfile).innerJoin(macroGoal, eq(macroGoal.macro_profile, macroProfile.id)).where(eq(macroProfile.id, profile_id))
};

export const insertNutritionGoal = async (sumNutrition : NutritionInfo) => {
  console.log('insertNutritionGoal')
  return db.insert(nutritionGoal).values(sumNutrition)
};