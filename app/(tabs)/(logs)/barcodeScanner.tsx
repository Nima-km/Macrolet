import { PixelRatio, Pressable, StyleSheet, Text, View, FlatList, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Button} from "react-native";
import { colors, spacing, typography } from "../../../constants/theme";
import React, { useContext, useEffect, useState } from 'react';

import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

import axios from 'axios';
import { FoodInfo, NutritionInfo, RecipeItem } from "@/constants/NutritionInfo";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { food, foodItem, recipeItem } from "@/db/schema";
import { Context } from "@/app/_layout";
import { sql } from "drizzle-orm";
import { Link, useLocalSearchParams } from "expo-router";
import { FetchBarcode } from "@/constants/FetchData";
import { IngredientObject } from "./_layout";

type AndroidMode = 'date' | 'time';

export type barcodeScannerType = {
    ingredientList?: FoodInfo[];
    setIngredientList?: (newList: FoodInfo[]) => void;
    setIsScanner?: (tmp: boolean) => void;
  }

export default function BarcodeScanner({ingredientList, setIngredientList, setIsScanner} : barcodeScannerType) {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db);
    const context = useContext(Context)
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [isScanned, setIsScanned] = useState(false)
    const [foodName, setFoodName] = useState('')
    const [serving, setServing] = useState('100')
    const [servingType, setServingType] = useState('g')
    const [serving100g, setServing100g] = useState(.01)
    const [servingMult, setServingMult] = useState(1)
   // const [servingSize, setServingSize] = useState(.01)
    const [sumNutrition, setSumNutrition] = useState<NutritionInfo>({carbs: 0, fat: 0, protein: 0, fiber: 0});
    const [barcode, setBarcode] = useState(0)
    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }
    const handleAddFood = async () => {
        if (foodName){
            let foodObject = await drizzleDb.select().from(food).where(sql`${food.barcode} = ${barcode}`)

            if (foodObject.length == 0)
                foodObject =  await drizzleDb.insert(food).values({
                    name: foodName,
                    description: foodName,
                    protein: Number(sumNutrition.protein),
                    fat:  Number(sumNutrition.fat),
                    carbs:  Number(sumNutrition.carbs),
                    fiber:  Number(sumNutrition.fiber),
                    is_recipe: false,
                    barcode: barcode,
                    serving_100g: serving100g,
                    volume_100g: 1}).returning()
            console.log('HIII')
            if (setIngredientList && setIsScanner) {
                const newIng: FoodInfo = {
                    name: foodObject[0].name,
                    description: "",
                    servings: Number(serving),
                    nutritionInfo: {
                        protein: foodObject[0].protein,
                        fat: foodObject[0].fat,
                        carbs: foodObject[0].carbs,
                        fiber: foodObject[0].fiber,
                        calories: 0
                    },
                    foodItem_id: foodObject[0].id,
                    serving_mult: servingMult,
                    serving_100g: foodObject[0].serving_100g,
                    volume_100g: 0,
                    serving_type: servingType,
                    food_id: 0
                }
                const newList = ingredientList ? ingredientList.concat(newIng) : [newIng]
                setIngredientList(newList)
                setIsScanner(false)
            }
            else {
                const foodItemObject = await drizzleDb.insert(foodItem).values({
                    food_id: foodObject[0].id, 
                    servings: Number(serving), 
                    timestamp: context.date,
                    serving_type: servingType,
                    serving_mult: servingMult,
                    }).returning()
            }
            console.log('HIII')
           // console.log('THIS ISS IT' + foodItemObject)
        }
    }
    const handleScanned = (barcode: any) => {
        if (isScanned == false){
            setIsScanned(true)
            handleFetch(barcode)
        }
    }
    const handleFetch = async (barcode: any) => {
        if (isScanned == false){
            setIsScanned(true)
            try {
                const res = await FetchBarcode(barcode)
                if (res){
                    setFoodName(res.name)
                    setSumNutrition(res?.nutritionInfo)
                    setBarcode(barcode)
                    setServingMult(1)
                    setServing100g(res.serving_100g)
                    setServing('1')
                    setServingType('servings')
                }
            }
            catch (error: any){
                console.log("SOMETHING WENT WRONG")
            }
            console.log(barcode)
            console.log("FOOD INSERT ADDED")
        }
    }
    const handleServingMult = (mult: number, type: string) => {
      //  setServing((Number(serving) / mult).toString())
        setServingMult(mult)
        setServingType(type)
        setServing(type == 'servings' ? '1' : serving100g.toString())
    }
    const resetBarcode = () => {
        setIsScanned(false)
        console.log('PRESSED')
    }
    useEffect(() => {
        console.log(sumNutrition)
        console.log(foodName)
       // handleAddFood(barcode)
    }, [sumNutrition])
    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }
    
    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
        <View style={styles.container}>
            <Text style={styles.message}>We need your permission to show the camera</Text>
            <Button onPress={requestPermission} title="grant permission" />
        </View>
        );
    }
    console.log(setIngredientList)
    if (setIngredientList && setIsScanner) {
        console.log('its a recipe')
    }
    else {
        console.log('its NOT a recipe')
        console.log(ingredientList && setIngredientList)
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity style={{flex: 1}} onPress={resetBarcode}>
                <CameraView style={styles.container} facing={facing} 
                    barcodeScannerSettings={{ barcodeTypes: ['upc_a', 'ean13', 'upc_e'] }} 
                    onBarcodeScanned={({data}) => {!isScanned ? handleScanned(data) : null}}>
                    <Text style={styles.titleText}>{foodName}</Text>  
                </CameraView>
            </TouchableOpacity>
            <RecipeItem name={foodName} description={""} servings={Number(serving)} nutritionInfo={{
                protein: sumNutrition.protein,
                fat: sumNutrition.fat,
                carbs: sumNutrition.carbs,
                fiber: sumNutrition.fiber,
            }} foodItem_id={0} serving_mult={servingMult}
            setServing={setServing}
            handleServingMult={handleServingMult}
            setServingType={setServingType}
            serving_type={servingType} serving_100g={serving100g} volume_100g={1}
            backgroundColor={colors.primary} food_id={0}            />
            <Link style={[styles.button, styles.centerContainer]} href={setIngredientList && setIsScanner ? '/addIngredient': '/(tabs)/(logs)/logs'} asChild>
                <TouchableOpacity style={[styles.button, styles.centerContainer]} onPress={handleAddFood}>
                    <Text style={styles.buttonText}>Log food</Text>
                </TouchableOpacity>
            </Link>
            
        </View>
    );
}


const styles = StyleSheet.create({
    centerContainer: {
        alignItems: "center",
        justifyContent: "center"
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    testContainer: {
        backgroundColor: 'red',
    },
    rowContainer: {
        flexDirection: 'row',
    },
    barChartContainer: {
        width: 320,
        height: 300,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    button: {
        backgroundColor: colors.secondary,
        paddingHorizontal: 40,
        paddingVertical: 15,
        marginVertical: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: "black",
        fontSize: 12,
    },
    titleText: {
        color: "blue",
        textShadowColor: 'red',
        textShadowRadius: 10,
        marginHorizontal: 20,
        fontSize: 40,
    },
    smallText: {
        color: "black",
        marginHorizontal: 0,
        fontSize: 16,
    },
    constrainedBox: {
        height: 350
    },
    smallBox: {
        width: 180,
        height: 180,
        marginHorizontal: 5,
    },
    item: {
        padding: 10,
        backgroundColor: colors.secondary,
        marginRight: 30,

    },
    container: {
        flex: 1,
        padding: 10,
    },
    text: {
        fontSize: 20,

    },
    box: {
        padding: 10,
        marginVertical: 20,
        backgroundColor: colors.primary,
        borderRadius: 7,
        minHeight: 100,
        minWidth: 190,
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
    },
    flexRowContainer: {
        flexDirection: "row",
        alignItems: "center"
       // justifyContent: "space-between"
    },
    spaceInbetween: {
        justifyContent: "space-between",
       // backgroundColor: "red"
    },
    input: {
        height: 30,
        margin: 5,
        borderWidth: 1,
        padding: 0,
        borderRadius: 10,
        backgroundColor: colors.secondary,
    },
    smallInput: {
        minWidth: 50,
    }
});
