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
import React, { useContext, useEffect, useState } from 'react';
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { foodItem, food, recipeItem } from "@/db/schema";
import { sql, eq, sum} from 'drizzle-orm';
import { Link, router, useLocalSearchParams } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
import { calculateCalories, FoodInfo, Item, NutritionInfo, RecipeItem } from "@/constants/NutritionInfo";
import { Context } from "@/app/_layout";
const FONT_SIZE = 18
const radius = PixelRatio.roundToNearestPixel(FONT_SIZE * 3);
const STROKE_WIDTH = 8;

type AndroidMode = 'date' | 'time';



const AddFood = () => {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db);
    const { food_id } = useLocalSearchParams();
    const { data: foodObject } = useLiveQuery(
        drizzleDb.select().from(foodItem).innerJoin(food, eq(foodItem.food_id, food.id)).where(sql`${foodItem.id} = ${Number(food_id)}`)
        .orderBy(food.id)
    )
    const { data: recipeObject } = useLiveQuery(
        drizzleDb.select().from(recipeItem).innerJoin(food, eq(recipeItem.ingredient_id, food.id)).where(sql`${recipeItem.recipe_id} = ${foodObject[0]?.food.id}`)
    , [foodObject])
    const { data: macroObject } = useLiveQuery(
        drizzleDb.select({
              fat: sql<number>`sum(${food.fat} * ${recipeItem.servings})`,
              carbs: sql<number>`sum(${food.carbs} * ${recipeItem.servings})`,
              protein: sql<number>`sum(${food.protein} * ${recipeItem.servings})`,
            }).from(recipeItem).innerJoin(food,  eq(recipeItem.ingredient_id, food.id)).where(sql`${recipeItem.recipe_id} = ${foodObject[0]?.food.id}`)
    , [foodObject])
    const [refresh, setRefresh] = useState<boolean>(false);
    const [date, setDate] = React.useState(new Date());
    const [isRecipe, setIsRecipe] = React.useState(false);
    const context = useContext(Context)
    const [serving, onChangeServing] = React.useState(``);
    const [servingSize, onChangeServingSize] = React.useState('');
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);
    const [ingredientList, setIngredientList] = useState<FoodInfo[]>();
    const [sumNutrition, setSumNutrition] = useState<NutritionInfo>({carbs: 0, fat: 0, protein: 0});
    const [mode, setMode] = useState<AndroidMode>('date');
    const targetPercentage = 60 / 100;
    const font = useFont(require("../../../Roboto-Light.ttf"), FONT_SIZE);
    const smallerFont = useFont(require("../../../Roboto-Light.ttf"), FONT_SIZE / 2);
    
    useEffect(() => {
        setDate(foodObject[0]?.foodItem.timestamp)
        setIsRecipe(foodObject[0]?.food.is_recipe ? foodObject[0]?.food.is_recipe : false)
        onChangeServing(`${foodObject[0]?.foodItem.servings}`) 
    }, [foodObject, recipeItem])
    useEffect(() => {
        if (isRecipe == false){
            setSumNutrition({carbs: foodObject[0]?.food.carbs, fat: foodObject[0]?.food.fat, protein: foodObject[0]?.food.protein})
            console.log(foodObject[0]?.food)
            console.log(sumNutrition)
        }
    }, [foodObject[0]])
    useEffect(() => {
        console.log("TEST")
        console.log(sumNutrition)
    }, [sumNutrition])
    useEffect(() => {
        let total: NutritionInfo = {carbs: 0, fat: 0, protein: 0}
        if (ingredientList && isRecipe == true){
            for (let i = 0; i < ingredientList.length; i++) {
                total.carbs += ingredientList[i].nutritionInfo.carbs * ingredientList[i].servings
                total.fat += ingredientList[i].nutritionInfo.fat * ingredientList[i].servings
                total.protein += ingredientList[i].nutritionInfo.protein * ingredientList[i].servings
                console.log(ingredientList[i].servings)
               // console.log(total.protein)
            }
            console.log(total)
            setSumNutrition(total)
            console.log("updating")
        }
    }, [refresh, recipeObject])

    useEffect(() => {
        setIngredientList(recipeObject.map((item) => {
            return ({name: item.food.name, 
                    description: item.food.description, 
                    servings: item.recipeItem.servings,
                    nutritionInfo: {carbs: (item.food.carbs), 
                        fat: (item.food.fat),
                        protein: (item.food.protein)
                    },
                    foodItem_id: item.food.id
                })
        }))
      //  console.log(ingredientList[2])
      }, [recipeObject])
    useEffect(() => {
        if (isRecipe == true)
            setSumNutrition({carbs: macroObject[0]?.carbs * Number(serving),
                fat: macroObject[0]?.fat * Number(serving),
                protein: macroObject[0]?.protein * Number(serving)
            })
      }, [foodObject[0], serving])
    if (!font || !smallerFont) {
        return <View />;
    }
    const handleUpdateFood = async () => {
        console.log("FOOD updated")
        console.log(serving)
        const foodCheck = await drizzleDb.update(foodItem).set({servings: Number(serving), timestamp: date}).where(eq(foodItem.id, Number(food_id))).returning()
        console.log(foodCheck[0])
    }
    const handleDeleteFood = async () => {
        console.log("FOOD Deleted")
        console.log(serving)
        const foodCheck = await drizzleDb.delete(foodItem).where(eq(foodItem.id, Number(food_id))).returning()
        console.log(foodCheck[0])
    }
    const handleAddFoodItem = async () => {
        console.log("FOOD INSERT ADDED")
        await drizzleDb.insert(foodItem).values({food_id: foodObject[0].food.id, servings: Number(serving), timestamp: date})
        console.log("FOODItem INSERT ADDED")
    }

    const handleAddFood = async () => {
        console.log("FOOD INSERT ADDED")
        if (foodObject[0].food.is_recipe){
            const recipe = await drizzleDb.insert(food).values({
                name: foodObject[0].food.name,
                description: foodObject[0].food.name,
                protein: Number(sumNutrition.protein),
                fat: Number(sumNutrition.fat),
                carbs: Number(sumNutrition.carbs),
                is_recipe: true}).returning()
            if (ingredientList){
                const plist = ingredientList.map((item) => {
                    return( {recipe_id: recipe[0].id, ingredient_id: item.foodItem_id, servings: item.servings})})
                await drizzleDb.insert(recipeItem).values(plist)
            }
            await drizzleDb.insert(foodItem).values({food_id: recipe[0].id, servings: Number(serving), timestamp: date})
        }
        else
            await drizzleDb.insert(foodItem).values({food_id: foodObject[0].food.id, servings: Number(serving), timestamp: date})
        console.log("FOODItem INSERT ADDED")
        console.log("FOOD INSERT ADDED")
        console.log(foodObject[0])
    }
    
    const onChange = (event: any, selectedDate? : Date) => {
        const currentDate = selectedDate;
        setShowDate(false);
        setShowTime(false);
        if (currentDate)
            setDate(currentDate);
        console.log(date);
      };
    
    const showTimepicker = () => {
    setShowTime(true);
    };
    const showDatepicker = () => {
    setShowDate(true);
    };
    const handleDeleteIngredient = async (index: number) => {
        if (ingredientList) {
            ingredientList.splice(index, 1)
            console.log("DELETED ITEM")
            console.log(ingredientList)
           // setIngredientList(newList)
            console.log("YOBOYO")
            setRefresh(!refresh)
        }
    }
    const handleChangeServing = (index: number, text: string) => {
        console.log(text)
        console.log(index)
        console.log("AYYY")
        console.log(index)
        console.log(ingredientList)
        if (ingredientList) {
            var newList = ingredientList
            newList[index].servings = Number(text)
            setIngredientList(newList)
            console.log("YOBOYO")
            setRefresh(!refresh)
        }
    }
    return (
        <ScrollView style={styles.container}>
            {showDate && 
                <DateTimePicker
                    testID="dateTimePicker"
                    value={context.date}
                    mode='date'
                    is24Hour={true}
                    onChange={onChange}
                />
            }
            <TouchableOpacity style={[styles.button]} onPress={showDatepicker}>
                <Text style={styles.smallText}>DATE</Text>
            </TouchableOpacity>
            <View style={[styles.box]}>
                <Text style={styles.titleText}>{foodObject[0]?.food.name}</Text>
                <View style={styles.flexRowContainer}>
                    <View style={styles.spaceInbetween}>
                        <View style={[styles.flexRowContainer, styles.spaceInbetween]}>
                            <Text style={styles.smallText}>Time</Text>
                            <TouchableOpacity style={[styles.input, styles.smallInput, styles.center]} onPress={showTimepicker}>
                                <Text style={styles.smallText}>{date?.getHours()}:{date?.getMinutes() < 10 ? 0 : null}{date?.getMinutes()}</Text>
                            </TouchableOpacity>
                            {showTime && 
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={date}
                                    mode='time'
                                    is24Hour={true}
                                    onChange={onChange}
                                />
                            }
                        </View>
                        <View style={[styles.flexRowContainer, styles.spaceInbetween]}>
                            <Text style={styles.smallText}>servings</Text>
                            <TextInput
                                style={[styles.input, styles.smallInput]}
                                onChangeText={onChangeServing}
                                value={serving}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={[styles.flexRowContainer, styles.spaceInbetween]}>
                            <Text style={styles.smallText}>Serving size</Text>
                            <TextInput
                            style={[styles.input, styles.smallInput]}
                            onChangeText={onChangeServingSize}
                            value={servingSize}
                            />
                        </View>
                    </View>
                    <View style={[styles.ringChartContainer]}>
                        <DonutChart
                        backgroundColor="white"
                        dailyProgress={targetPercentage}
                        targetPercentage={5000}
                        font={font}
                        smallerFont={smallerFont}
                        />
                        
                    </View>
                </View>
                <View style={[styles.flexRowContainer]}>
                    <View style={[styles.container, {alignItems: "center"}]}>
                        <Text style={styles.smallText}>Calories</Text>
                        <Text style={styles.smallText}>{foodObject[0] ? calculateCalories(sumNutrition) * Number(serving) : null}</Text>
                    </View>
                    <View style={[styles.container, {alignItems: "center"}]}>
                        <Text style={styles.smallText}>Carbs</Text>
                        <Text style={styles.smallText}>{sumNutrition.carbs * Number(serving)}</Text> 
                    </View>
                    <View style={[styles.container, {alignItems: "center"}]}>
                        <Text style={styles.smallText}>Fat</Text>
                        <Text style={styles.smallText}>{sumNutrition.protein * Number(serving)}</Text> 
                    </View>
                    <View style={[styles.container, {alignItems: "center"}]}>
                        <Text style={styles.smallText}>Protein</Text>
                        <Text style={styles.smallText}>{sumNutrition.fat * Number(serving)}</Text>
                    </View>

                </View>
                {isRecipe &&
                    <View style={[{backgroundColor: colors.secondary}]}>
                        <Text style={styles.text}>{ingredientList?.length}</Text>
                        <FlatList
                            data={ingredientList}
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
                }
                <Link style={[styles.button, styles.centerContainter]} href='/(tabs)/(logs)/logs' asChild>
                    <TouchableOpacity onPress={handleDeleteFood}>
                        <Text style={styles.buttonText}>Delete food</Text>
                    </TouchableOpacity>
                </Link>
                {!isRecipe &&
                    <Link style={[styles.button, styles.centerContainter]} href='/(tabs)/(logs)/logs' asChild>
                        <TouchableOpacity style={[styles.button, styles.centerContainter]} onPress={handleUpdateFood}>
                            <Text style={styles.buttonText}>Update food</Text>
                        </TouchableOpacity>
                    </Link>
                }
                <Link style={[styles.button, styles.centerContainter]} href='/(tabs)/(logs)/logs' asChild>
                    <TouchableOpacity style={[styles.button, styles.centerContainter]} onPress={handleAddFood}>
                        <Text style={styles.buttonText}>Log food</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </ScrollView>
    );
}
export default AddFood

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
