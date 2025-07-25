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
    const { food_id, foodItem_id } = useLocalSearchParams();
    const { data: foodItemObject } = useLiveQuery(
        drizzleDb.select().from(foodItem).innerJoin(food, eq(foodItem.food_id, food.id)).where(sql`${foodItem.id} = ${Number(foodItem_id)}`)
        .orderBy(food.id)
    )
    const { data: foodObject } = useLiveQuery(
        drizzleDb.select().from(food).where(sql`${food.id} = ${Number(food_id)}`)
        .orderBy(food.id)
    )
    const { data: recipeObject } = useLiveQuery(
        drizzleDb.select().from(recipeItem).innerJoin(food, eq(recipeItem.ingredient_id, food.id)).where(sql`${recipeItem.recipe_id} = ${foodObject[0]?.id}`)
    , [foodObject])
    const [refresh, setRefresh] = useState<boolean>(false);
    const [date, setDate] = React.useState(new Date());
    const [isRecipe, setIsRecipe] = React.useState(false);
    const context = useContext(Context)
    const [serving, onChangeServing] = React.useState('1');
    const [foodName, onChangeFoodName] = React.useState('');
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);
    const [ingredientList, setIngredientList] = useState<FoodInfo[]>([]);
    const [sumNutrition, setSumNutrition] = useState<NutritionInfo>({carbs: 0, fat: 0, protein: 0, fiber: 0});
    const [mode, setMode] = useState<AndroidMode>('date');
    const [servingType, setServingType] = useState('servings')
    const [servingMult, setServingMult] = useState(1)
    const targetPercentage = 60 / 100;
    const font = useFont(require("../../../Roboto-Light.ttf"), 14);
    const smallerFont = useFont(require("../../../Roboto-Light.ttf"), 8);
    
    useEffect(() => {
        if (foodItem_id){
            setDate(foodItemObject[0]?.foodItem.timestamp)
            setIsRecipe(foodItemObject[0]?.food.is_recipe ? foodItemObject[0]?.food.is_recipe : false)
            onChangeServing(`${foodItemObject[0]?.foodItem.servings}`) 
            setServingMult(foodItemObject[0]?.foodItem.serving_mult)
            setServingType(foodItemObject[0]?.foodItem.serving_type)
        }
        else if (food_id) {
            setIsRecipe(foodObject[0]?.is_recipe ? foodObject[0]?.is_recipe : false)
            console.log("is ", foodObject[0]?.is_recipe)
        }
    }, [foodItemObject, recipeItem])
    useEffect(() => {
        console.log('foodObject', foodObject[0])
        if (food_id && foodObject[0])
            setSumNutrition({carbs: foodObject[0]?.carbs, fat: foodObject[0]?.fat, protein: foodObject[0]?.protein, fiber: foodObject[0]?.fiber})

    }, [foodObject[0]])
    useEffect(() => {
        console.log(sumNutrition)
    }, [sumNutrition])
    useEffect(() => {
        let total: NutritionInfo = {carbs: 0, fat: 0, protein: 0, fiber: 0}
        if (ingredientList?.length && isRecipe == true && food_id){
            for (let i = 0; i < ingredientList.length; i++) {
                total.carbs += ingredientList[i].nutritionInfo.carbs * ingredientList[i].servings * ingredientList[i].serving_mult
                total.fat += ingredientList[i].nutritionInfo.fat * ingredientList[i].servings * ingredientList[i].serving_mult
                total.protein += ingredientList[i].nutritionInfo.protein * ingredientList[i].servings * ingredientList[i].serving_mult
               
            }
            total.carbs = Math.round(total.carbs)
            total.fat = Math.round(total.fat)
            total.protein = Math.round(total.protein)
            
            setSumNutrition(total)
            console.log('B')
        }
    }, [refresh, recipeObject])

    useEffect(() => {
        setIngredientList(recipeObject.map((item) => {
            return ({name: item.food.name, 
                description: item.food.description, 
                servings: item.recipeItem.servings,
                nutritionInfo: {carbs: (item.food.carbs), 
                    fat: (item.food.fat),
                    protein: (item.food.protein),
                    fiber: (item.food.fiber),
                },
                foodItem_id: 0,
                food_id: item.food.id,
                serving_mult: item.recipeItem.serving_mult,
                serving_type: item.recipeItem.serving_type,
                serving_100g: item.food.serving_100g,
                volume_100g: item.food.volume_100g,
            })
        }))
        console.log('we r setting', recipeObject)
      }, [recipeObject])
    if (!font || !smallerFont) {
        return <View />;
    }
    const handleUpdateFood = async () => {
        
        const foodCheck = await drizzleDb.update(foodItem).set({servings: Number(serving), timestamp: date}).where(eq(foodItem.id, Number(foodItem_id))).returning()
        
    }
    const handleDeleteFood = async () => {
        
        const foodCheck = await drizzleDb.delete(foodItem).where(eq(foodItem.id, Number(foodItem_id))).returning()
        
    }
    const handleAddFoodItem = async () => {
        console.log("FOOD INSERT ADDED")
        await drizzleDb.insert(foodItem).values({
            food_id: foodItemObject[0].food.id, 
            servings: Number(serving), 
            serving_type: 'servings',
            serving_mult: 1,
            timestamp: date,})
        console.log("FOODItem INSERT ADDED")
    }

    const handleAddFood = async () => {
        console.log("FOOD INSERT ADDED")
        if (foodItemObject[0]?.food.is_recipe){
            console.log('wtf')
            const recipe = await drizzleDb.insert(food).values({
                name: foodItemObject[0].food.name,
                description: foodItemObject[0].food.name,
                protein: Number(sumNutrition.protein),
                fat: Number(sumNutrition.fat),
                carbs: Number(sumNutrition.carbs),
                is_recipe: true}).returning()
            if (ingredientList){
                const plist = ingredientList.map((item) => {
                    return( {recipe_id: recipe[0].id, 
                        ingredient_id: item.food_id, 
                        servings: item.servings, 
                        serving_mult: item.serving_mult,
                        serving_type: item.serving_type})})
                await drizzleDb.insert(recipeItem).values(plist)
            }
            await drizzleDb.insert(foodItem).values({
                food_id: recipe[0].id, 
                servings: Number(serving), 
                timestamp: date, serving_mult: 1, 
                serving_type: 'servings'})
        }
        else if (food_id){
            console.log('its not quick add', foodObject[0].id)
            const tmp = await drizzleDb.insert(foodItem).values({food_id: foodObject[0].id, 
                servings: Number(serving), 
                timestamp: date, 
                serving_mult: servingMult,
                serving_type: servingType}).returning()
            console.log('added', tmp)
        }

        else if (food_id == undefined) {
            console.log('its quick add')
            const tmpFoodObject = await drizzleDb.insert(food).values({name: foodName, 
                description: " ", 
                protein: Number(sumNutrition.protein),
                fat: Number(sumNutrition.fat),
                carbs: Number(sumNutrition.carbs),
                is_recipe: false}).returning()
                
            await drizzleDb.insert(foodItem).values({food_id: tmpFoodObject[0].id, 
            servings: Number(serving), 
            timestamp: date, 
            serving_mult: 1,
            serving_type: servingType})
        }
        else {
            console.log('NON')
        }
        console.log('NON')
        console.log(!foodItem_id)
        console.log("FOODItem INSERT ADDED")
        console.log("FOOD INSERT ADDED")
        
    }
    
    const onChange = (event: any, selectedDate? : Date) => {
        const currentDate = selectedDate;
        setShowDate(false);
        setShowTime(false);
        if (currentDate)
            setDate(currentDate);
        
    };
    const onChangeServingMult = () => {
        if (foodObject[0]){
            setServingMult(servingType == 'servings' ? 1 / foodObject[0]?.serving_100g : 1)
            setServingType(servingType == 'servings' ? 'g' : 'servings')
        }
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
            
            setRefresh(!refresh)
        }
    }
    const handleServingMultList = (mult: number, type: string, index: number) => {
        if (ingredientList) {
            var newList = ingredientList
            newList[index].serving_mult = mult
            newList[index].serving_type = type
            setIngredientList(newList)
            
            setRefresh(!refresh)
        }
    }
    const handleChangeServing = (index: number, text: string) => {
        
        if (ingredientList) {
            var newList = ingredientList
            newList[index].servings = Number(text)
            setIngredientList(newList)
            console.log('changed')
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
                {
                    food_id 
                    ?   <Text style={styles.titleText}>{foodObject[0]?.name}</Text>
                    :   <TextInput
                            style={[styles.input, styles.smallInput]}
                            onChangeText={(inp) => (onChangeFoodName(inp))}
                            value={foodName}
                        /> 
                }
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
                            <TouchableOpacity onPress={onChangeServingMult}>
                                <Text style={[styles.input, styles.smallInput]}> {servingType} </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.ringChartContainer]}>
                        <DonutChart
                            backgroundColor="white"
                            dailyProgress={targetPercentage}
                            targetPercentage={5000}
                            font={font}
                            smallerFont={smallerFont} 
                            radius={50}/>
                        
                    </View>
                </View>
                <View style={[styles.flexRowContainer]}>
                    <View style={[styles.container, {alignItems: "center"}]}>
                        <Text style={styles.smallText}>Calories</Text>
                        <Text style={styles.smallText}>{ calculateCalories(sumNutrition , Number(serving) * servingMult)}</Text>
                    </View>
                    <View style={[styles.container, {alignItems: "center"}]}>
                        <Text style={styles.smallText}>Carbs</Text>
                        {
                            food_id 
                            ?   <Text style={styles.smallText}>{Math.round(sumNutrition.carbs * Number(serving) * servingMult)}</Text> 
                            :   <TextInput
                                style={[styles.input, styles.smallInput]}
                                onChangeText={(inp) => setSumNutrition({
                                    carbs: Number(inp), 
                                    protein: sumNutrition.protein, 
                                    fat: sumNutrition.fat, 
                                    })}
                                keyboardType = 'numeric'
                                value={sumNutrition.carbs.toString()}
                                /> 
                        }
                    </View>
                    <View style={[styles.container, {alignItems: "center"}]}>
                        <Text style={styles.smallText}>Fat</Text>
                        {
                            food_id 
                            ?   <Text style={styles.smallText}>{Math.round(sumNutrition.fat * Number(serving) * servingMult)}</Text> 
                            :   <TextInput
                                style={[styles.input, styles.smallInput]}
                                onChangeText={(inp) => setSumNutrition({
                                    fat: Number(inp), 
                                    protein: sumNutrition.protein, 
                                    carbs: sumNutrition.carbs, 
                                    })}
                                keyboardType = 'numeric'
                                value={sumNutrition.fat.toString()}
                                /> 
                        }
                    </View>
                    <View style={[styles.container, {alignItems: "center"}]}>
                        <Text style={styles.smallText}>Protein</Text>
                        {
                            food_id 
                            ?   <Text style={styles.smallText}>{Math.round(sumNutrition.protein * Number(serving) * servingMult)}</Text> 
                            :   <TextInput
                                style={[styles.input, styles.smallInput]}
                                onChangeText={(inp) => setSumNutrition({
                                    fat: sumNutrition.fat, 
                                    protein: Number(inp), 
                                    carbs: sumNutrition.carbs, 
                                    })}
                                keyboardType = 'numeric'
                                value={sumNutrition.protein.toString()}
                                /> 
                        }
                    </View>

                </View>
                {isRecipe &&
                    <View style={[{backgroundColor: colors.secondary}]}>
                        <Text style={styles.text}>{ingredientList?.length}</Text>
                        <FlatList
                            data={ingredientList}
                            renderItem={({item, index}) => <RecipeItem 
                                    name={item.name} 
                                    description={item.description} 
                                    servings={item.servings} 
                                    nutritionInfo={{carbs: item.nutritionInfo.carbs, fat: item.nutritionInfo.fat, protein: item.nutritionInfo.protein, fiber: item.nutritionInfo.fiber}}
                                    food_id={item.food_id}
                                    serving_mult={item.serving_mult}
                                    setServing={(text) => handleChangeServing(index, text)}
                                    handleDelete={() => handleDeleteIngredient(index)}
                                    handleServingMult={(mult, type) => handleServingMultList(mult, type, index)} 
                                    setServingType={() => handleServingMultList} 
                                    serving_type={item.serving_type}
                                    volume_100g={item.volume_100g}
                                    serving_100g={item.serving_100g}
                                    backgroundColor={colors.primary}
                                />}
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
