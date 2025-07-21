import { PixelRatio, Pressable, StyleSheet, Text, View, FlatList, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Button} from "react-native";
import { colors, spacing, typography } from "@/components/theme";
import { DonutChart } from "@/components/DonutChart";
import { useSharedValue, withTiming, Easing } from "react-native-reanimated";
import { useFocusEffect } from '@react-navigation/native';
import {
    Canvas,
    Path,
    SkFont,
    Skia,
    useFont,
  } from "@shopify/react-native-skia";
import React, { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { foodItem, food, recipeItem } from "@/db/schema";
import { sql, eq, sum} from 'drizzle-orm';
import { Link, router, useLocalSearchParams } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import { calculateCalories, FoodInfo, Item, NutritionInfo, RecipeItem } from "@/components/NutritionInfo";
import { Context } from "@/app/_layout";
import { IngredientObject } from "./_layout";
import { BarMacroChart } from "@/components/BarMacroChart";
const FONT_SIZE = 18
const radius = PixelRatio.roundToNearestPixel(FONT_SIZE * 3);
const STROKE_WIDTH = 8;

type AndroidMode = 'date' | 'time';


const CreateRecipe = () => {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db);
    const context = useContext(Context)
    const [foodName, onChangeFoodName] = useState('');
    const [serving, onChangeServing] = useState(`1`);
    const [sumNutrition, setSumNutrition] = useState<NutritionInfo>({carbs: 0, fat: 0, protein: 0});
    const [calories, setCalories] = useState(0);
    const [servingType, setServingType] = useState('servings')
    const [refresh, setRefresh] = useState<boolean>(false);
    const [fat, setFat] = useState(0);
    const targetPercentage = 60 / 100;
    const font = useFont(require("@/Roboto-Light.ttf"), FONT_SIZE);
    const smallerFont = useFont(require("@/Roboto-Light.ttf"), FONT_SIZE / 2);

    const ingredientObject = useContext(IngredientObject);
    
    useEffect(() => {
        var total: NutritionInfo = {carbs: 0, fat: 0, protein: 0}
        for (let i = 0; i < ingredientObject.ingredientList.length; i++) {
            total.carbs += ingredientObject.ingredientList[i].nutritionInfo.carbs * ingredientObject.ingredientList[i].servings * ingredientObject.ingredientList[i].serving_mult
            total.fat += ingredientObject.ingredientList[i].nutritionInfo.fat * ingredientObject.ingredientList[i].servings * ingredientObject.ingredientList[i].serving_mult
            total.protein += ingredientObject.ingredientList[i].nutritionInfo.protein * ingredientObject.ingredientList[i].servings * ingredientObject.ingredientList[i].serving_mult
        }
        total.carbs = Math.round(total.carbs)
        total.fat = Math.round(total.fat)
        total.protein = Math.round(total.protein)
        setSumNutrition(total)
      //  console.log(ingredientObject.ingredientList[0].serving_mult)
      }, [refresh])
    if (!font || !smallerFont) {
        return <View />;
    }
    const handleCreateAndLog = async () => {

    }
    const handleDeleteFood = async () => {
       
    }
    const handleCreateRecipe = async (log: boolean) => {
        const recipe = await drizzleDb.insert(food).values({name:foodName, description: "test", is_recipe: true, is_template: true}).returning()
        const plist = ingredientObject.ingredientList.map((item) => {
            return( {recipe_id: recipe[0].id, ingredient_id: item.food_id, servings: item.servings, serving_mult: item.serving_mult, serving_type: item.serving_type})})
        await drizzleDb.update(food).set({fat: sumNutrition.fat, protein: sumNutrition.protein, carbs: sumNutrition.carbs}).where(eq(food.id, recipe[0].id))
        await drizzleDb.insert(recipeItem).values(plist)
        if (log == true)
            await drizzleDb.insert(foodItem).values({
                food_id: recipe[0].id, servings: 1, 
                serving_mult: 1, 
                serving_type: 'serving', 
                timestamp: new Date()})
        console.log("ADDED FOODITEM")
    }
    const handleAddIngredient = async () => {
        
    }

    const handleAddFood = async () => {
        
    }
    const handleDeleteIngredient = async (index: number) => {
        if (ingredientObject.ingredientList) {
            ingredientObject.ingredientList.splice(index, 1)
         //   console.log("DELETED ITEM")
        //   console.log(ingredientObject.ingredientList)
           // setIngredientList(newList)
            console.log("YOBOYO")
            setRefresh(!refresh)
        }
    }
    const handleChangeServing = (index: number, text: string) => {
        if (ingredientObject.ingredientList) {
            var newList = ingredientObject.ingredientList
            newList[index].servings = Number(text)
            ingredientObject.setIngredientList(newList)
            console.log("YOBOYO")
            setRefresh(!refresh)
        }
    }
    const handleServingMult = (mult: number, type: string, index: number) => {
        if (ingredientObject.ingredientList) {
            var newList = ingredientObject.ingredientList
            newList[index].serving_mult = mult
            newList[index].serving_type = type
            ingredientObject.setIngredientList(newList)
            console.log("YOBOYO")
            setRefresh(!refresh)
        }
    }
    return (
        <ScrollView style={styles.container}>
            <Text style={[styles.h1, {margin: 20}]}>Create Recipe</Text>
            <TextInput
                style={[styles.input, {margin: 20}]}
                onChangeText={onChangeFoodName}
                value={foodName}
                placeholder="Enter Recipe Name"
                
            />
            <Text style={[styles.h1, {marginHorizontal: 20, marginTop: 20}]}>{calculateCalories(sumNutrition, 1)} Cal</Text>
            <View style={[{flex: 1, marginVertical: 10, height: 20, marginHorizontal: 20}]}>
                <BarMacroChart strokeWidth={20} 
                    dailyTarget={sumNutrition}
                    colorProtein={colors.protein}
                    colorfat={colors.fat}
                    colorCarbs={colors.carbs}
                    radius={10}
                />
            </View>
            <View style={[styles.rowContainer, {justifyContent: 'space-around', marginRight: 20}]}>
                <View style={[styles.rowContainer, {marginHorizontal: 0}]}>
                    <View style={{backgroundColor: colors.protein, height: 20, width: 10, borderRadius: 10, marginTop: 3, marginHorizontal: 5}}/>
                    <View>
                        <Text style={[styles.h3]}>Protein </Text>
                        <Text style={[styles.h4]}>{Math.round(sumNutrition.protein * Number(serving))} g </Text>
                    </View>
                </View>
                <View style={[styles.rowContainer, {marginHorizontal: 0}]}>
                    <View style={{backgroundColor: colors.carbs, height: 20, width: 10, borderRadius: 10, marginTop: 3, marginHorizontal: 5}}/>
                    <View>
                        <Text style={[styles.h3]}>Carbs </Text>
                        <Text style={[styles.h4]}>{Math.round(sumNutrition.carbs * Number(serving))} g </Text>
                    </View>
                </View>
                <View style={[styles.rowContainer, {marginHorizontal: 0}]}>
                    <View style={{backgroundColor: colors.fat, height: 20, width: 10, borderRadius: 10, marginTop: 3, marginHorizontal: 5}}/>
                    <View>
                        <Text style={[styles.h3]}>Fat </Text>
                        <Text style={[styles.h4]}>{Math.round(sumNutrition.fat * Number(serving))} g </Text>
                    </View>
                </View>
            </View>
            
            <FlatList
                data={ingredientObject.ingredientList}
                renderItem={({item, index}) => <RecipeItem 
                    name={item.name}
                    description={item.description}
                    servings={item.servings}
                    nutritionInfo={{ carbs: item.nutritionInfo.carbs, fat: item.nutritionInfo.fat, protein: item.nutritionInfo.protein }}
                    foodItem_id={item.foodItem_id}
                    serving_mult={item.serving_mult}
                    setServing={(text) => handleChangeServing(index, text)}
                    handleDelete={() => handleDeleteIngredient(index)}
                    handleServingMult={(mult, type) => handleServingMult(mult, type, index)}
                    setServingType={() => handleServingMult}
                    serving_type={item.serving_type}
                    volume_100g={item.volume_100g}
                    serving_100g={item.serving_100g} backgroundColor={colors.primary} 
                    food_id={item.food_id}                            />}
                    scrollEnabled={false}
                    extraData={refresh}
                    style={[{margin: 20}]}
            />
            <Link style={[styles.buttonMain, styles.centerContainer, {marginHorizontal: 20}]} href='/(logs)/addIngredient' asChild>
                <TouchableOpacity onPress={handleAddIngredient}>
                    <Text style={[styles.h7, {color: colors.primary}]}>+ Add ingredient</Text>
                </TouchableOpacity>
            </Link>
            <View style={[styles.rowContainer, {margin: 20, justifyContent: 'space-between'}]}>
                <Link style={[styles.buttonMain, styles.centerContainer]} href='/(logs)/logs' asChild>
                    <TouchableOpacity onPress={() => handleCreateRecipe(true)}>
                        <Text style={[styles.h7, {color: colors.primary}]}>Create and Log</Text>
                    </TouchableOpacity>
                </Link>
                <Link style={[styles.buttonMain, styles.centerContainer]} href='/(logs)/logs' asChild>
                    <TouchableOpacity  onPress={() => handleCreateRecipe(false)}>
                        <Text style={[styles.h7, {color: colors.primary}]}>Create Recipe</Text>
                    </TouchableOpacity>
                </Link>
            </View>
            <Link style={[styles.buttonSub, styles.centerContainer, {margin: 20}]} href='/(logs)/logs' asChild>
                <TouchableOpacity onPress={handleDeleteFood}>
                    <Text style={[styles.h4, {color: colors.button}]}>Cancel</Text>
                </TouchableOpacity>
            </Link>
        </ScrollView>
    );
}
export default CreateRecipe

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainer: {
        alignItems: "center",
        justifyContent: "center"
    },
    rowContainer: {
        flexDirection: 'row',
    },
    barChartContainer: {
        width: 320,
        height: 300,
    },
    input: {
        flex: 1,
        backgroundColor: colors.primary,
        borderRadius: 10,
        padding: 13,

        marginVertical: 10,
    },
    buttonMain: {
        backgroundColor: colors.button,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 10,
    },
    buttonSub: {
        backgroundColor: colors.primary,
        borderColor: colors.button,
        borderWidth:2,
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 10,
    },
    box: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginTop: 10,
        marginHorizontal: 20,
        backgroundColor: colors.primary,
        borderRadius: 10,
    },
    boxColorless: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginTop: 10,
        marginHorizontal: 15,
        borderRadius: 4,
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
    h1: {
        fontFamily: 'Geist',
        fontWeight: '600',
        fontSize: 28,
    },
    h2: {
        fontFamily: 'Geist',
        fontWeight: '800',
        fontSize: 22,
    },
    h3: {
        fontFamily: 'Metro-Medium',
        fontSize: 20,
    },
    h4: {
        fontFamily: 'Metro-Medium',
        fontSize: 18  ,
    },
    h5: {
        fontFamily: 'Metro-SemiBold',
        fontSize: 17,
    },
    h6: {
        fontFamily: 'Metro-Regular',
        fontSize: 16,
    },
    h7: {
        fontFamily: 'Metro-Bold',
        fontSize: 18,
    },
    h8: {
        fontFamily: 'Metro-Regular',
        fontSize: 14,
    },
});
