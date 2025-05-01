import axios from "axios"
import { FoodInfo } from "./NutritionInfo"
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite"
import { drizzle } from "drizzle-orm/expo-sqlite"
import { food, foodItem } from "@/db/schema"
import { sql } from "drizzle-orm"


export const FetchBarcode = async (barcode: any) => {
    try {
        const response = await axios.get(`https://world.openfoodfacts.org/api/v3/product/${barcode}.json`)
        const data: any = response.data.product
        if (data){
            const result: FoodInfo = {
                name: data.product_name,
                nutritionInfo: { carbs: data.nutriments.carbohydrates_serving, fat: data.nutriments.fat_serving, protein: data.nutriments.proteins_serving, fiber: data.nutriments.fiber_serving },
                barcode: barcode,
                serving_mult: 1,
                serving_100g: data.serving_quantity,
                servings: 1,
                serving_type: 'servings',
                description: "",
                foodItem_id: 0,
                volume_100g: 0
            }
            return result
        }
    }
    catch (error: any) {
        console.log("SOMETHING WENT WRONG")
    }
}
export const FetchSearch = async (search: string) => {
    try {
        const response = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${search}&json=1`)
        const data: any = response.data.products
        if (data){
            const result: FoodInfo[] = data.map((item : any) => {
                return {
                    name: item.product_name,
                    nutritionInfo: { carbs: item.nutriments.carbohydrates_serving, fat: item.nutriments.fat_serving, protein: item.nutriments.proteins_serving, fiber: data.nutriments.fiber_serving},
                    barcode: item._id,
                    serving_mult: 1,
                    serving_100g: item.serving_quantity,
                    servings: 1,
                    serving_type: 'servings',
                    description: "",
                    foodItem_id: 0,
                    volume_100g: 0
                }
            }).slice(0, 5)
            return result
        }
    }
    catch (error: any) {
        console.log("SOMETHING WENT WRONG")
    }
}
export const InsertFood = async (db: SQLiteDatabase, foodObj: FoodInfo) => {
    
    const drizzleDb = drizzle(db);  
    console.log("ASSSSSS" + foodObj.name)

    let foodObject = await drizzleDb.select().from(food).where(sql`${food.barcode} = ${foodObj.barcode}`)
    console.log(foodObject)
    console.log('supA')
    
    if (foodObject.length == 0)
        foodObject =  await drizzleDb.insert(food).values({
            name: foodObj.name,
            description: foodObj.name,
            protein: Number(foodObj.nutritionInfo.protein),
            fat:  Number(foodObj.nutritionInfo.fat),
            carbs:  Number(foodObj.nutritionInfo.carbs),
            is_recipe: false,
            barcode: foodObj.barcode,
            serving_100g: foodObj.serving_100g,
            volume_100g: 1}).returning()
    const foodItemObject = await drizzleDb.insert(foodItem).values({
        food_id: foodObject[0].id, 
        servings: Number(1), 
        timestamp: new Date(),
        serving_type: foodObj.serving_type,
        serving_mult: 1,
    }).returning()
    return foodItemObject[0].id
    return 0
}


