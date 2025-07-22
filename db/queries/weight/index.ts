import { EnforcedWeightType, WeightType } from "@/types/weight";
import { db } from "../../client";
import { food, foodItem, nutritionGoal, WeightItem } from "../../schema";
import { sql, eq, sum, and, gte, lt, desc} from 'drizzle-orm';




export const getLatestWeight = async () => {
  return db.select().from(WeightItem).orderBy(desc(WeightItem.timestamp)).limit(3);
};
export const insertWeight = async (weightObject: WeightType) => {
  return db.insert(WeightItem).values(weightObject).returning();
};

export const updateWeight = async (weightObject: EnforcedWeightType) => {
  return db.update(WeightItem).set(weightObject).where(eq(WeightItem.id, weightObject.id)).returning();
};

export const deleteWeight = async (weightObject: EnforcedWeightType) => {
  return db.delete(WeightItem).where(eq(WeightItem.id, weightObject.id)).returning();
};