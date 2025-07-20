import { DATABASE_NAME } from "@/app/_layout";
import { food, foodItem, macroProfile } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite"
import { timestamp } from "drizzle-orm/gel-core";
import { openDatabaseSync } from "expo-sqlite";
import { calculateCalories, NutritionInfo, NutritionInfoFull } from "./NutritionInfo";


type CalorieIntake = {
    IntakeInfo: NutritionInfoFull
    timestamp: Date
}
export type WeighIn = {
    weight: number
    timestamp: Date
}
export type MaintenanceInf = {
    calorie_intake: NutritionInfo[];
    weigh_in: WeighIn[];
}

export type autoCalInf = {
  calories: number
  macro_profile: NutritionInfoFull[]
  manual_calories?: number
}

function median(values: WeighIn[]): number {

    if (values.length === 0) {
        console.log("empty")
      return 0;
    }
    values = [...values].sort((a, b) => a.weight - b.weight);
  
    const half = Math.floor(values.length / 2);
  
    return (values.length % 2
      ? values[half].weight
      : (values[half - 1].weight + values[half].weight) / 2
    );
  
  }
function average(values: NutritionInfo[]): number {

    if (values.length === 0) {
        console.log("empty")
      return 0;
    }
    let sum = {carbs: 0, protein: 0, fat: 0, fiber: 0}
    for (let i = 0; i < values.length; i++) {
        sum.protein += values[i].protein
        sum.fat += values[i].fat
        sum.carbs += values[i].carbs
        const fib = values[i].fiber
        if (fib)
          sum.fiber += fib
    }
    if (values.length == 0)
      return calculateCalories(sum, 1);
    sum.protein = sum.protein / values.length
    sum.fat = sum.fat / values.length
    sum.carbs = sum.carbs / values.length
    sum.fiber = sum.fiber / values.length
    return (calculateCalories(sum, 1));
}

export const findMiddleMacro = (x: NutritionInfoFull, y: NutritionInfoFull, mid: number) => {
  const par = (mid - x.calories) / (y.calories - x.calories)
  const result : NutritionInfoFull = {
    protein: (y.protein - x.protein) * par + x.protein,
    fat: (y.fat - x.fat) * par + x.fat,
    carbs: (y.carbs - x.carbs) * par + x.carbs,
    calories: mid,
  }
  return result
}

export const autoCalorie = ({macro_profile, calories } : autoCalInf) => {
  
  console.log('maintenanceCalories', calories)
  macro_profile.sort((a, b) => a.calories - b.calories)
  const isLargeNumber = (element: NutritionInfo) => (element.calories ? element.calories : 0) >= calories;
  const index = macro_profile.findIndex(isLargeNumber)
  console.log(index)
  if (macro_profile[index].calories == calories)
    return macro_profile[index]
  
  if (index == 0 || index == -1)
    return "OUT OF BOUNDS"

  const goal : NutritionInfoFull = findMiddleMacro(macro_profile[index - 1], macro_profile[index], calories)
  return goal
}

export const MaintenanceCalories = ({calorie_intake, weigh_in} : MaintenanceInf) => {
    
    const date = new Date(weigh_in[weigh_in.length - 1].timestamp.getFullYear()
        , weigh_in[weigh_in.length - 1].timestamp.getMonth()
        , weigh_in[weigh_in.length - 1].timestamp.getDate())
    const lastDate = new Date(date)
    lastDate.setDate(date.getDate() - 7)
    const firstDate = new Date(lastDate)
    firstDate.setDate(lastDate.getDate() - 7)
    const lastWeightList = weigh_in.filter((item) => item.timestamp > lastDate)
    const firstWeightList = weigh_in.filter((item) => item.timestamp <= lastDate)
    const weightChange = median(lastWeightList) - median(firstWeightList)
    console.log('weightFirst',median(firstWeightList))
    console.log('weightLast', median(lastWeightList))
    if (lastWeightList.length == 0 || firstWeightList.length == 0){
      return "WEIGHT NOT LOGGED"
    }
    const CalorieAverage = average(calorie_intake)
    console.log('CalorieAverage', CalorieAverage)
    console.log('weightChange', weightChange)
    return Math.round((CalorieAverage - (weightChange * 250)) / 10) * 10
}