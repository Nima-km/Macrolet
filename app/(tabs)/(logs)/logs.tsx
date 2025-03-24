import { PixelRatio, Pressable, StyleSheet, Text, View, FlatList, ScrollView} from "react-native";
import { colors, spacing, typography } from "@/constants/theme";
import { TouchableOpacity } from "react-native";
import { Link } from 'expo-router';
import { NutritionInfo, LongDataTST, shortDataTST, Item} from "@/constants/NutritionInfo";
import { BarChart } from "../../../constants/BarChart";
import React, { useEffect, useState } from 'react';
import {
  Canvas,
  Path,
  SkFont,
  Skia,
  useFont,
} from "@shopify/react-native-skia";
import Animated, {useSharedValue, withTiming, Easing, useDerivedValue} from "react-native-reanimated";
import { useFocusEffect } from '@react-navigation/native';
import { SQLiteProvider, openDatabaseSync, useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { lists, tasks, food, foodItem, Task} from '@/db/schema';
import { sql, eq, sum} from 'drizzle-orm';
const strokeWidth = PixelRatio.roundToNearestPixel(30);

export default function Logs() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const calorieTarget = 5000;
  const { data: breakFast } = useLiveQuery(
    drizzleDb.select().from(foodItem).innerJoin(food, eq(foodItem.food_id, food.id)).where(sql`${foodItem.meal} = 1`)
    .orderBy(food.id)
  )
  const { data: LiveFood } = useLiveQuery(
    drizzleDb.select({
      fat: sql<number>`sum(${food.fat} * ${foodItem.servings})`,
      carbs: sql<number>`sum(${food.carbs} * ${foodItem.servings})`,
      protein: sql<number>`sum(${food.protein} * ${foodItem.servings})`,
    }).from(foodItem).innerJoin(food, eq(foodItem.food_id, food.id))
    .orderBy(food.id)
  )
  const { data: lunch } = useLiveQuery(
    drizzleDb.select().from(foodItem).innerJoin(food, eq(foodItem.food_id, food.id)).where(sql`${foodItem.meal} = 2`)
    .orderBy(food.id)
  )
  const { data: dinner } = useLiveQuery(
    drizzleDb.select().from(foodItem).innerJoin(food, eq(foodItem.food_id, food.id)).where(sql`${foodItem.meal} = 0`)
    .orderBy(food.id)
  )
  const [isLoaded, setIsLoaded] = useState(false)
  const carbProgress = useSharedValue(0);
  const dailyProgress = useSharedValue<NutritionInfo>({
    protein: 0,
    fat: 0,
    carbs: 0,
  });
  useFocusEffect(
    React.useCallback(() => {
      console.log('Tab is now focused');
      return () => {
        console.log('Tab is unfocused');
      };
      
    }, [])
  );
  useEffect(() => {

  }, [])
  const font = useFont(require("../../../Roboto-Light.ttf"), 25);
  const smallerFont = useFont(require("../../../Roboto-Light.ttf"), 25);
  const displayText = useDerivedValue(() => {
    return `Calories: ${Math.floor(dailyProgress.value.carbs)}`;
  });
  if (!font || !smallerFont) {
    return <Text>LOADING</Text>;
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.box}>
        <View style={styles.barChartContainer}>
          <BarChart
            backgroundColor="sdfas"
            calorieTarget={calorieTarget}
            colorProtein="CUNT"
            colorfat="CUNT"
            colorCarbs="CUNT"
            progressCarbs={carbProgress}
            progressFat={carbProgress}
            dailyEnd={LiveFood[0]}
            strokeWidth={strokeWidth}
            font={smallerFont}
            targetPercentage = {2}
          
          />
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.titleText}>Breakfast</Text>
        <View style={[styles.box]}>
            <FlatList
            data={breakFast}
            renderItem={({item}) => <Item name={item.food.name} 
            description={item.food.description} 
            servings={item.foodItem.servings} 
            nutritionInfo={{carbs: item.food.carbs, fat: item.food.fat, protein: item.food.protein}}
            foodItem_id={item.foodItem.id}/>}
            keyExtractor={item => item.foodItem.id.toString()}
            scrollEnabled={false}
          />
        </View>
        <View style={styles.box}>
        <Link href="/logFood" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>+ Add food</Text>
          </TouchableOpacity>
        </Link>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.titleText}>Lunch</Text>
        <View style={[styles.box]}>
            <FlatList
            data={lunch}
            renderItem={({item}) => <Item name={item.food.name} 
            description={item.food.description} 
            servings={item.foodItem.servings} 
            nutritionInfo={{carbs: item.food.carbs, fat: item.food.fat, protein: item.food.protein}}
            foodItem_id={item.foodItem.id}/>}
            keyExtractor={item => item.foodItem.id.toString()}
            scrollEnabled={false}
            />
        </View>
        <View style={styles.box}>
        <Link href="/logFood" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>+ Add food</Text>
          </TouchableOpacity>
        </Link>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.titleText}>Dinner</Text>
        <View style={[styles.box]}>
            <FlatList
            data={dinner}
            renderItem={({item}) => <Item name={item.food.name} 
            description={item.food.description} 
            servings={item.foodItem.servings} 
            nutritionInfo={{carbs: item.food.carbs, fat: item.food.fat, protein: item.food.protein}}
            foodItem_id={item.foodItem.id}/>}
            keyExtractor={item => item.foodItem.id.toString()}
            scrollEnabled={false}
          />
        </View>
        <View style={styles.box}>
        <Link href="/logFood" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>+ Add food</Text>
          </TouchableOpacity>
        </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainter: {
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
    marginHorizontal: 60,
    fontSize: 12,
  },
  box: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginTop: 10,
    marginHorizontal: 15,
    backgroundColor: colors.primary,
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
});
