import { lists, tasks, food } from './schema';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';

import AsyncStorage from 'expo-sqlite/kv-store';

export const addDummyData = async (db: ExpoSQLiteDatabase) => {
    const value = AsyncStorage.getItemAsync('dbInitialized');
    if (!value) return;

    console.log('Inserting lists');

    await db.insert(food).values([
        { name: 'Test 1', description: 'test 1', protein: 1, carbs: 2, fat: 3, calories: 4},
        { name: 'Test 2', description: 'test 1', protein: 1, carbs: 2, fat: 3, calories: 4},
        { name: 'Test 3', description: 'test 1', protein: 1, carbs: 2, fat: 3, calories: 4},
        { name: 'Test 4', description: 'test 1', protein: 1, carbs: 2, fat: 3, calories: 4},
        { name: 'Test 5', description: 'test 1', protein: 1, carbs: 2, fat: 3, calories: 4},
    ])
}