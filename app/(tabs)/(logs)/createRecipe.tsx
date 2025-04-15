import { PixelRatio, Pressable, StyleSheet, Text, View, FlatList, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Button} from "react-native";
import { colors, spacing, typography } from "../../../constants/theme";
import { DonutChart } from "../../../constants/DonutChart";
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
import { calculateCalories, FoodInfo, Item, NutritionInfo, RecipeItem } from "@/constants/NutritionInfo";
import { Context } from "@/app/_layout";
import { IngredientObject } from "./_layout";
const FONT_SIZE = 18
const radius = PixelRatio.roundToNearestPixel(FONT_SIZE * 3);
const STROKE_WIDTH = 8;

type AndroidMode = 'date' | 'time';


const CreateRecipe = () => {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db);
    const context = useContext(Context)
    const [foodName, onChangeFoodName] = useState('');
    const [serving, onChangeServing] = useState(``);
    const [sumNutrition, setSumNutrition] = useState<NutritionInfo>({carbs: 0, fat: 0, protein: 0});
    const [calories, setCalories] = useState(0);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [fat, setFat] = useState(0);
    const targetPercentage = 60 / 100;
    const font = useFont(require("../../../Roboto-Light.ttf"), FONT_SIZE);
    const smallerFont = useFont(require("../../../Roboto-Light.ttf"), FONT_SIZE / 2);

    const ingredientObject = useContext(IngredientObject);
    
    useEffect(() => {
        var total: NutritionInfo = {carbs: 0, fat: 0, protein: 0}
        for (let i = 0; i < ingredientObject.ingredientList.length; i++) {
            total.carbs += ingredientObject.ingredientList[i].nutritionInfo.carbs * ingredientObject.ingredientList[i].servings
            total.fat += ingredientObject.ingredientList[i].nutritionInfo.fat * ingredientObject.ingredientList[i].servings
            total.protein += ingredientObject.ingredientList[i].nutritionInfo.protein * ingredientObject.ingredientList[i].servings 
        }
        setSumNutrition(total)
        console.log("updating")
      }, [refresh])
    if (!font || !smallerFont) {
        return <View />;
    }
    const handleCreateAndLog = async () => {

    }
    const handleDeleteFood = async () => {
       
    }
    const handleCreateRecipe = async (log: boolean) => {
        const recipe = await drizzleDb.insert(food).values({name:foodName, description: "test", is_recipe: true}).returning()
        const plist = ingredientObject.ingredientList.map((item) => {
            return( {recipe_id: recipe[0].id, ingredient_id: item.foodItem_id, servings: item.servings})})
        await drizzleDb.update(food).set({fat: sumNutrition.fat, protein: sumNutrition.protein, carbs: sumNutrition.carbs}).where(eq(food.id, recipe[0].id))
        await drizzleDb.insert(recipeItem).values(plist)
        if (log == true)
            await drizzleDb.insert(foodItem).values({food_id: recipe[0].id, servings: 1, timestamp: new Date()})
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
    return (
        <ScrollView style={styles.container}>
            <View style={[styles.box]}>
                <Text style={styles.titleText}>Create Recipe</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeFoodName}
                    value={foodName}
                    
                />
                <View style={[styles.flexRowContainer]}>
                    <View style={[styles.container, {alignItems: "center"}]}>
                        <Text style={styles.smallText}>Calories</Text>
                        <Text style={styles.smallText}>{calculateCalories(sumNutrition)}</Text>
                    </View>
                    <View style={[styles.container, {alignItems: "center"}]}>
                        <Text style={styles.smallText}>Carbs</Text>
                        <Text style={styles.smallText}>{sumNutrition.carbs}</Text> 
                    </View>
                    <View style={[styles.container, {alignItems: "center"}]}>
                        <Text style={styles.smallText}>Fat</Text>
                        <Text style={styles.smallText}>{sumNutrition.protein}</Text> 
                    </View>
                    <View style={[styles.container, {alignItems: "center"}]}>
                        <Text style={styles.smallText}>Protein</Text>
                        <Text style={styles.smallText}>{sumNutrition.fat}</Text>
                    </View>

                </View>
                <Link style={[styles.button, styles.centerContainter]} href='/(tabs)/(logs)/addIngredient' asChild>
                    <TouchableOpacity onPress={handleAddIngredient}>
                        <Text style={styles.buttonText}>+ Add ingredient</Text>
                    </TouchableOpacity>
                </Link>
                <View style={[]}>
                    <FlatList
                        data={ingredientObject.ingredientList}
                        renderItem={({item, index}) => <RecipeItem name={item.name} 
                        description={item.description} 
                        servings={item.servings} 
                        nutritionInfo={{carbs: item.nutritionInfo.carbs, fat: item.nutritionInfo.fat, protein: item.nutritionInfo.protein}}
                        foodItem_id={item.foodItem_id}
                        serving={item.servings.toString()}
                        setServing={(text) => handleChangeServing(index, text)}
                        handleDelete={() => handleDeleteIngredient(index)}/>}
                        scrollEnabled={false}
                        extraData={refresh}
                    />
                </View>
                
                <Link style={[styles.button, styles.centerContainter]} href='/(tabs)/(logs)/logs' asChild>
                    <TouchableOpacity onPress={handleDeleteFood}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </Link>
                <Link style={[styles.button, styles.centerContainter]} href='/(tabs)/(logs)/logs' asChild>
                    <TouchableOpacity style={[styles.button, styles.centerContainter]} onPress={() => handleCreateRecipe(true)}>
                        <Text style={styles.buttonText}>Create and Log</Text>
                    </TouchableOpacity>
                </Link>
                <Link style={[styles.button, styles.centerContainter]} href='/(tabs)/(logs)/logs' asChild>
                    <TouchableOpacity style={[styles.button, styles.centerContainter]} onPress={() => handleCreateRecipe(false)}>
                        <Text style={styles.buttonText}>Create Recipe</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </ScrollView>
    );
}
export default CreateRecipe

const styles = StyleSheet.create({
    centerContainter: {
        alignItems: "center",
        justifyContent: "center"
    },
    ringChartContainer: {
        width: radius * 2,
        height: radius * 2,
        marginTop: 30
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
        color: "black",
        marginHorizontal: 20,
        fontSize: 20,
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
