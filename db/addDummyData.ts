import { lists, tasks, food, foodItem } from './schema';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';

import AsyncStorage from 'expo-sqlite/kv-store';

function randNut(max: number, min: number, floor: boolean): number {
    const res = Math.random() * (max - min + 1) + min
    return floor ? Math.floor(res) : res
}



export const addDummyData = async (db: ExpoSQLiteDatabase) => {
    const value = AsyncStorage.getItemAsync('dbInitialized');
    if (!value) return;

    
    /*
    await db.insert(food).values([
        { name: 'Test 1', description: 'test 1', protein: 1, carbs: 2, fat: 3, calories: 4},
        { name: 'Test 2', description: 'test 1', protein: 1, carbs: 2, fat: 3, calories: 4},
        { name: 'Test 3', description: 'test 1', protein: 1, carbs: 2, fat: 3, calories: 4},
        { name: 'Test 4', description: 'test 1', protein: 1, carbs: 2, fat: 3, calories: 4},
        { name: 'Test 5', description: 'test 1', protein: 1, carbs: 2, fat: 3, calories: 4},
    ])
    */
   /*
    await db.insert(food).values([
        { name: 'Test 1', description: 'test 1', protein: randNut(30, 1, true), carbs: randNut(30, 1, true), fat: randNut(30, 1, true)},
        { name: 'Test 1', description: 'test 1', protein: randNut(30, 1, true), carbs: randNut(30, 1, true), fat: randNut(30, 1, true)},
        { name: 'Test 1', description: 'test 1', protein: randNut(30, 1, true), carbs: randNut(30, 1, true), fat: randNut(30, 1, true)},
        { name: 'Test 1', description: 'test 1', protein: randNut(30, 1, true), carbs: randNut(30, 1, true), fat: randNut(30, 1, true)},
        { name: 'Test 1', description: 'test 1', protein: randNut(30, 1, true), carbs: randNut(30, 1, true), fat: randNut(30, 1, true)},
        { name: 'Test 1', description: 'test 1', protein: randNut(30, 1, true), carbs: randNut(30, 1, true), fat: randNut(30, 1, true)},
        { name: 'Test 1', description: 'test 1', protein: randNut(30, 1, true), carbs: randNut(30, 1, true), fat: randNut(30, 1, true)},
        
        
    ])*/
    console.log('Inserting lists');
    /*
    await db.insert(foodItem).values([
        {food_id: randNut(10, 1, true), servings: randNut(20, 1, true) / 10, meal: randNut(2, 0, true)},
        {food_id: randNut(10, 1, true), servings: randNut(20, 1, true) / 10, meal: randNut(2, 0, true)},
        {food_id: randNut(10, 1, true), servings: randNut(20, 1, true) / 10, meal: randNut(2, 0, true)},
    ])*/
}