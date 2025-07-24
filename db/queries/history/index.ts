import { db } from "../../client";
import { food, foodItem, nutritionGoal } from "../../schema";
import { sql, eq, sum, and, gte, lt, desc} from 'drizzle-orm';


export const getHistory = async (from: Date, to: Date) => {
  return db.select().from(foodItem).innerJoin(food, eq(foodItem.food_id, food.id))
      .where(and(
        gte(foodItem.timestamp, from), 
        lt(foodItem.timestamp, to)))
      .orderBy(foodItem.timestamp)
};
export const getSumHistory = async (from: Date, to: Date) => {
//  console.log('getDailyHistory')
  return db.select({
        fat: sql<number>`sum(${food.fat} * ${foodItem.servings} * ${foodItem.serving_mult})`,
        carbs: sql<number>`sum(${food.carbs} * ${foodItem.servings} * ${foodItem.serving_mult})`,
        protein: sql<number>`sum(${food.protein} * ${foodItem.servings} * ${foodItem.serving_mult})`,
        calories: sql<number>`sum((${food.protein} * 4 + ${food.carbs} * 4 + ${food.fat} * 9) * ${foodItem.servings} * ${foodItem.serving_mult})`,
      })
      .from(foodItem).innerJoin(food, eq(foodItem.food_id, food.id))
      .where(and( 
        gte(foodItem.timestamp, from), 
        lt(foodItem.timestamp, to)))
      .get()
};

export const getDailySumHistory = async (from: Date, to: Date) => {
 // console.log('getDailySumHistory THISSS', from, to)
  const res = db
    .select({
        fat: sql<number>`sum(${food.fat} * ${foodItem.servings} * ${foodItem.serving_mult})`,
        carbs: sql<number>`sum(${food.carbs} * ${foodItem.servings}* ${foodItem.serving_mult})`,
        protein: sql<number>`sum(${food.protein} * ${foodItem.servings}* ${foodItem.serving_mult})`,
        timestamp: sql<string>`strftime('%F', ${foodItem.timestamp}, 'unixepoch', 'localtime')`,
        enabled: sql<boolean>`${true}` 
    })
    .from(foodItem).innerJoin(food, eq(foodItem.food_id, food.id))
    .where(and(
      gte(foodItem.timestamp, from),
      lt(foodItem.timestamp, to)
    ))
    .groupBy(sql<string>`strftime('%F', ${foodItem.timestamp}, 'unixepoch', 'localtime')`)
    .orderBy(foodItem.timestamp)
  return res
  
}