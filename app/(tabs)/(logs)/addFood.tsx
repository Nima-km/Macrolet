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
import React, { useEffect, useState } from 'react';
import { useSQLiteContext } from "expo-sqlite";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { foodItem, food } from "@/db/schema";
import { sql, eq, sum} from 'drizzle-orm';
import { Link, router, useLocalSearchParams } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';
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
    const [date, setDate] = React.useState(new Date());
    const [foodName, onChangeFoodName] = React.useState('');
    const [serving, onChangeServing] = React.useState(``);
    const [meal, onChangeMeal] = React.useState('');
    const [protein, onChangeProtien] = React.useState('');
    const [carbs, onChangeCarbs] = React.useState('');
    const [fat, onChangeFat] = React.useState('');
    const [servingSize, onChangeServingSize] = React.useState('');
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState<AndroidMode>('date');
    const targetPercentage = 60 / 100;
    const font = useFont(require("../../../Roboto-Light.ttf"), FONT_SIZE);
    const smallerFont = useFont(require("../../../Roboto-Light.ttf"), FONT_SIZE / 2);
    
    useEffect(() => {
        console.log(food_id)
        console.log(date);
        console.log(foodObject[0])
        setDate(foodObject[0]?.foodItem.timestamp)
        onChangeServing(`${foodObject[0]?.foodItem.servings}`)
      }, [foodObject])
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
    const handleAddFood = async () => {
        console.log("FOOD INSERT ADDED")
        await drizzleDb.insert(foodItem).values({food_id: foodObject[0].food.id, servings: Number(serving), meal: 1, timestamp: date})
        console.log("FOODItem INSERT ADDED")
    }


    
    const onChange = (event: any, selectedDate? : Date) => {
        const currentDate = selectedDate;
        setShow(false);
        if (currentDate)
            setDate(currentDate);
        console.log(date);
      };
    
      const showTimepicker = () => {
        setShow(true);
      };
    return (
        <View style={styles.container}>
            <View style={[styles.box]}>
                <Text style={styles.titleText}>{foodObject[0]?.food.name}</Text>
                <View style={styles.flexRowContainer}>
                    <View style={styles.spaceInbetween}>
                        <View style={[styles.flexRowContainer, styles.spaceInbetween]}>
                            <Text style={styles.smallText}>Time</Text>
                            <TouchableOpacity style={[styles.input, styles.smallInput, styles.center]} onPress={showTimepicker}>
                                <Text style={styles.smallText}>{date?.getHours()}:{date?.getMinutes() < 10 ? 0 : null}{date?.getMinutes()}</Text>
                            </TouchableOpacity>
                            {show && 
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
                        <TextInput
                            style={[styles.input, styles.smallInput]}
                            onChangeText={onChangeMeal}
                            value={meal}
                            /> 
                    </View>
                    <View style={[styles.container, {alignItems: "center"}]}>
                        <Text style={styles.smallText}>Carbs</Text>
                        <TextInput
                            style={[styles.input, styles.smallInput]}
                            onChangeText={onChangeCarbs}
                            keyboardType = 'numeric'
                            value={carbs}
                            /> 
                    </View>
                    <View style={[styles.container, {alignItems: "center"}]}>
                        <Text style={styles.smallText}>Fat</Text>
                        <TextInput
                            style={[styles.input, styles.smallInput]}
                            onChangeText={onChangeFat}
                            keyboardType = 'numeric'
                            value={fat}
                            /> 
                    </View>
                    <View style={[styles.container, {alignItems: "center"}]}>
                        <Text style={styles.smallText}>Protein</Text>
                        <TextInput
                            style={[styles.input, styles.smallInput]}
                            onChangeText={onChangeProtien}
                            keyboardType = 'numeric'
                            value={protein}
                            /> 
                    </View>

                </View>
                
                <Link style={[styles.button, styles.centerContainter]} href='/(tabs)/(logs)/logs' asChild>
                    <TouchableOpacity onPress={handleDeleteFood}>
                        <Text style={styles.buttonText}>Delete food</Text>
                    </TouchableOpacity>
                </Link>
                <Link style={[styles.button, styles.centerContainter]} href='/(tabs)/(logs)/logs' asChild>
                    <TouchableOpacity style={[styles.button, styles.centerContainter]} onPress={handleUpdateFood}>
                        <Text style={styles.buttonText}>Update food</Text>
                    </TouchableOpacity>
                </Link>
                <Link style={[styles.button, styles.centerContainter]} href='/(tabs)/(logs)/logs' asChild>
                    <TouchableOpacity style={[styles.button, styles.centerContainter]} onPress={handleAddFood}>
                        <Text style={styles.buttonText}>Add food</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
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
        backgroundColor: 'black',
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
