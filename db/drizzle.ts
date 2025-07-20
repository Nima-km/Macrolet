import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from 'drizzle-orm/expo-sqlite'; // community wrapper
import { food } from "./schema";

const expoDb = openDatabaseSync("app.db");
export const db = drizzle(expoDb);
