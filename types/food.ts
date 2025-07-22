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

