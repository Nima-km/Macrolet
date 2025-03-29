import { PixelRatio, Pressable, StyleSheet, Text, View, FlatList, ScrollView} from "react-native";
import { colors, spacing, typography } from "@/constants/theme";
import { TouchableOpacity } from "react-native";
import { Link } from 'expo-router';
import { NutritionInfo, LongDataTST, shortDataTST, Item} from "@/constants/NutritionInfo";
import { BarChart } from "../../../constants/BarChart";
import React, { useContext, useEffect, useState } from 'react';
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
import { sql, eq, sum, and, gte, lt} from 'drizzle-orm';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Context } from "@/app/_layout";

const strokeWidth = PixelRatio.roundToNearestPixel(30);

export default function Logs() {
  
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const calorieTarget = 5000;
  const context = useContext(Context)
  const [show, setShow] = useState(false);
  const { data: breakFast } = useLiveQuery(
    drizzleDb.select().from(foodItem).innerJoin(food, eq(foodItem.food_id, food.id))
    .where(and(sql`${foodItem.meal} = 1`, 
      gte(foodItem.timestamp, new Date(context.date.getFullYear(), context.date.getMonth(), context.date.getDate())), 
      lt(foodItem.timestamp, new Date(context.date.getFullYear(), context.date.getMonth(), context.date.getDate(), 24))))
    .orderBy(food.id)
  , [context.date])
  const { data: LiveFood } = useLiveQuery(
    drizzleDb.select({
      fat: sql<number>`sum(${food.fat} * ${foodItem.servings})`,
      carbs: sql<number>`sum(${food.carbs} * ${foodItem.servings})`,
      protein: sql<number>`sum(${food.protein} * ${foodItem.servings})`,
    })
    .from(foodItem).innerJoin(food, eq(foodItem.food_id, food.id))
    .where(and(sql`${foodItem.meal} = 1`, 
      gte(foodItem.timestamp, new Date(context.date.getFullYear(), context.date.getMonth(), context.date.getDate())), 
      lt(foodItem.timestamp, new Date(context.date.getFullYear(), context.date.getMonth(), context.date.getDate(), 24))))
    .orderBy(food.id)
  , [context.date])
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
   // console.log(date.toDateString())
   // console.log(Number(new Date(date.getFullYear(), date.getMonth(), date.getDay() + 1)))
   // console.log(breakFast[1]?.foodItem.timestamp)
    
  }, [breakFast, context.date])
  const font = useFont(require("../../../Roboto-Light.ttf"), 25);
  const smallerFont = useFont(require("../../../Roboto-Light.ttf"), 25);
  const displayText = useDerivedValue(() => {
    return `Calories: ${Math.floor(dailyProgress.value.carbs)}`;
  });
  if (!font || !smallerFont) {
    return <Text>LOADING</Text>;
  }
  const onChange = (event: any, selectedDate? : Date) => {
    const currentDate = selectedDate;
    setShow(false);
     
    if (currentDate)
      context.setDate(currentDate);
    console.log(context.date);
  };

  const showTimepicker = () => {
    setShow(true);
  };

  return (
    <ScrollView style={styles.container}>
      {show && 
          <DateTimePicker
              testID="dateTimePicker"
              value={context.date}
              mode='date'
              is24Hour={true}
              onChange={onChange}
          />
      }
      <TouchableOpacity style={[styles.button]} onPress={showTimepicker}>
          <Text style={styles.smallText}>DATE</Text>
      </TouchableOpacity>
      <View style={styles.box}>
        <View style={styles.barChartContainer}>
          <BarChart
            backgroundColor="#F0E6DE"
            calorieTarget={calorieTarget}
            colorProtein="#FBB466"
            colorfat="#E08766"
            colorCarbs="#FFF186"
            dailyEnd={LiveFood[0]}
            strokeWidth={strokeWidth}
            font={smallerFont}
          />
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.box}>
          <Link href="/logFood" asChild>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>+ Add food</Text>
            </TouchableOpacity>
          </Link>
        </View>
        <Text style={styles.titleText}>Breakfast</Text>
        <View style={[styles.boxColorless]}>
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
      </View>

      <View style={styles.container}>
        <Text style={styles.titleText}>Lunch</Text>
        <View style={[styles.boxColorless]}>
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
      </View>

      <View style={styles.container}>
        <Text style={styles.titleText}>Dinner</Text>
        <View style={[styles.boxColorless]}>
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
});
