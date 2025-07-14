import { db } from "./drizzle";
import { food } from "./schema";
import { eq } from "drizzle-orm";


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
  await db.insert(food).values(foodObject);
};

export const updateFood = async (foodID: number, foodObject: FoodType) => {
  await db.update(food).set(foodObject).where(eq(food.id, foodID));
};

export const deleteFood = async (foodID: number) => {
  await db.delete(food).where(eq(food.id, foodID));
};