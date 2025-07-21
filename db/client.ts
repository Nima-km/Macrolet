import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from 'drizzle-orm/expo-sqlite'; // community wrapper
import { DATABASE_NAME } from "@/app/_layout";

const expoDb = openDatabaseSync(DATABASE_NAME);
export const db = drizzle(expoDb);
