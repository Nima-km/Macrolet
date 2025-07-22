import { db } from "../../client";
import { food, foodItem, nutritionGoal } from "../../schema";
import { sql, eq, sum, and, gte, lt, desc} from 'drizzle-orm';


export type FoodType = {
  name: string;
  description: string;
  servings: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber?: number;
  calories?: number;
  timestamp?: Date;
  foodItem_id?: number;
  food_id: number;
  barcode?: number;
  serving_mult: number;
  serving_100g: number;
  volume_100g: number;
  serving_type: string;
  
}

export const insertFood = async (foodObject: FoodType) => {
  return db.insert(food).values(foodObject).returning();
};

export const updateFood = async (foodID: number, foodObject: FoodType) => {
  return db.update(food).set(foodObject).where(eq(food.id, foodID)).returning();
};

export const deleteFood = async (foodID: number) => {
  return db.delete(food).where(eq(food.id, foodID)).returning();
};

export const getNutriGoals = async () => {
  return db.select().from(nutritionGoal).orderBy(desc(nutritionGoal.timestamp)).get()
};

