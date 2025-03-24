import { PixelRatio, Pressable, StyleSheet, Text, View, FlatList, ScrollView, TextInput, TouchableOpacity} from "react-native";
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
import React from 'react';
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { foodItem, food } from "@/db/schema";
import { SelectList } from 'react-native-dropdown-select-list'
import { Link } from "expo-router";

const FONT_SIZE = 18
const radius = PixelRatio.roundToNearestPixel(FONT_SIZE * 3);
const STROKE_WIDTH = 8;

export default function QuickAddFood() {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db);
    const [foodName, onChangeFoodName] = React.useState('');
    const [servings, onChangeServings] = React.useState('');
    const [meal, onChangeMeal] = React.useState('');
    const [protein, onChangeProtien] = React.useState('');
    const [carbs, onChangeCarbs] = React.useState('');
    const [fat, onChangeFat] = React.useState('');
    const [servingSize, onChangeServingSize] = React.useState('');
    const [time, onChangeTime] = React.useState('');

    const targetPercentage = 60 / 100;
    const font = useFont(require("../../../Roboto-Light.ttf"), FONT_SIZE);
    const smallerFont = useFont(require("../../../Roboto-Light.ttf"), FONT_SIZE / 2);
    
      if (!font || !smallerFont) {
        return <View />;
      }

    const handleAddFood = async () => {
        const foodObject = await drizzleDb.insert(food).values({name: foodName, 
            description: "TESTTT", 
            protein: Number(protein),
            fat: Number(fat),
            carbs: Number(carbs),}).returning()
        console.log("FOOD INSERT ADDED")
        await drizzleDb.insert(foodItem).values({food_id: foodObject[0].id, servings: Number(servings), meal: 1})
        console.log("FOODItem INSERT ADDED")
    }
    return (
        <View style={styles.container}>
            <View style={[styles.box]}>
                <Text style={styles.titleText}>Quick add</Text>
                
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeFoodName}
                    value={foodName}
                    
                />
                <View style={styles.flexRowContainer}>
                    <View style={styles.spaceInbetween}>
                        <View style={[styles.flexRowContainer, styles.spaceInbetween]}>
                            <Text style={styles.smallText}>Time</Text>
                            <TextInput
                            style={[styles.input, styles.smallInput]}
                            onChangeText={onChangeTime}
                            value={time}
                            />
                        </View>
                        <View style={[styles.flexRowContainer, styles.spaceInbetween]}>
                            <Text style={styles.smallText}>servings</Text>
                            <TextInput
                            style={[styles.input, styles.smallInput]}
                            onChangeText={onChangeServings}
                            value={servings}
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
                        font={font}
                        backgroundColor="white"
                        targetPercentage={targetPercentage}
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
                    <TouchableOpacity onPress={handleAddFood}>
                        <Text style={styles.buttonText}>+ Add food</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}

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
        padding: 10
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
