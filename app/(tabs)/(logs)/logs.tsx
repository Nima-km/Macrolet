import { PixelRatio, Pressable, StyleSheet, Text, View, FlatList, ScrollView, SectionList} from "react-native";
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
    .orderBy(foodItem.timestamp)
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
  const timeSections = (start : number, stop: number, step: number) =>
    Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
    );
  const [slData, setSlData] = useState(timeSections(breakFast[0]?.foodItem.timestamp.getHours(), breakFast[breakFast.length - 1]?.foodItem.timestamp.getHours(), 5)
    .map((tmp) => {
      return {title: tmp, data: breakFast
        .filter((item) => (item.foodItem.timestamp.getHours() >= tmp && item.foodItem.timestamp.getHours() < tmp + 5))}
  }).filter((item) => item.data.length > 0))
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
    let tmp: (number)[] = []
    tmp.push(breakFast[0]?.foodItem.timestamp.getHours())
    for (let i = 1; i < 9; i++) {
      const tst1 = breakFast?.find((item) => item.foodItem.timestamp.getHours() > tmp[i - 1] + 3)?.foodItem.timestamp.getHours()
      if (tst1)
        tmp.push(tst1)

    }
    console.log(tmp)
    const timesec = tmp
    setSlData(timesec
    .map((tmp) => {
      const filtered = breakFast
        .filter((item) => (item.foodItem.timestamp.getHours() >= tmp && item.foodItem.timestamp.getHours() < tmp + 3))
      return {title: tmp, data: filtered}
  
  }).filter((item) => item.data.length > 0))
  //console.log(slData)
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
      </View>

      <View style={[styles.container, {marginRight: 30}]}>
        <SectionList
        sections={slData}
          renderItem={({item}) => <Item name={item.food.name} 
          description={item.food.description} 
          servings={item.foodItem.servings} 
          nutritionInfo={{carbs: item.food.carbs, fat: item.food.fat, protein: item.food.protein}}
          foodItem_id={item.foodItem.id}
          timestamp={item.foodItem.timestamp}/>}
        keyExtractor={item => item.foodItem.id.toString()}
        scrollEnabled={false}
        renderSectionHeader={({section: {title}}) => (
          <View style={[styles.rowContainer, {alignItems: 'center'}]}>
            <Text style={styles.titleText}>{title < 10 ? 0: ''}{title}:00</Text>
            <View
              style={{
                backgroundColor: '#DFDFDF',
                height: 1,
                flex: 1,
                
              }}
            />
          </View>
        )}
        />
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
