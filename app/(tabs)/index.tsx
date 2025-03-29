import { PixelRatio, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../../constants/theme";
import { TouchableOpacity } from "react-native";
import { DonutChart } from "@/constants/DonutChart";
import { SimpleChart } from "@/constants/SimpleChart";
import React, { useContext, useEffect, useState } from 'react';
import {
  Canvas,
  Path,
  SkFont,
  Skia,
  useFont,
} from "@shopify/react-native-skia";

import { useSharedValue, withTiming, Easing } from "react-native-reanimated";
import { useFocusEffect } from '@react-navigation/native';
import { useDrizzleStudio} from 'expo-drizzle-studio-plugin'
import { SQLiteProvider, openDatabaseSync, useSQLiteContext } from 'expo-sqlite';
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { food, foodItem } from "@/db/schema";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Context } from "../_layout";

const FONT_SIZE = 27
const radius = PixelRatio.roundToNearestPixel(FONT_SIZE * 3);
const STROKE_WIDTH = 16;
const DATABASE_NAME = 'tasks';

export default function Index() {

  
  const progress = useSharedValue(0);
  const context = useContext(Context)
  const [show, setShow] = useState(false);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  useDrizzleStudio(db);
  const { data: LiveFood } = useLiveQuery(
    drizzleDb.select({
      fat: sql<number>`sum(${food.fat} * ${foodItem.servings})`,
      carbs: sql<number>`sum(${food.carbs} * ${foodItem.servings})`,
      protein: sql<number>`sum(${food.protein} * ${foodItem.servings})`,
      calories: sql<number>`sum((${food.protein} * 4 + ${food.carbs} * 4 + ${food.fat} * 9) * ${foodItem.servings})`,
    })
    .from(foodItem).innerJoin(food, eq(foodItem.food_id, food.id))
    .where(and(sql`${foodItem.meal} = 1`, 
          gte(foodItem.timestamp, new Date(context.date.getFullYear(), context.date.getMonth(), context.date.getDate())), 
          lt(foodItem.timestamp, new Date(context.date.getFullYear(), context.date.getMonth(), context.date.getDate(), 24))))
    .orderBy(food.id)
  , [context.date])
  const [targetCalorie, setTargetCalorie] = useState(5000)
  const dailyCalorie = 2500;

  useFocusEffect(
    React.useCallback(() => {
      // This code runs when the screen is focused
      console.log('Tab is now focused');

      // Optionally return a cleanup function if needed
      return () => {
        console.log('Tab is unfocused');
      };
    }, [])
  );
  useEffect(() => {
    console.log(Math.floor(LiveFood[0]?.calories))
    }, [])
  const font = useFont(require("../../Roboto-Light.ttf"), FONT_SIZE);
  const smallerFont = useFont(require("../../Roboto-Light.ttf"), FONT_SIZE / 2);

  if (!font || !smallerFont) {
    return <View />;
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
    <View style={styles.container}>
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
        <Text>Today, Nov 30th</Text>
        <View style={styles.flexRowContainer}>
          <View style={styles.ringChartContainer}>
            <DonutChart
              backgroundColor="white"
              dailyProgress={LiveFood[0].calories}
              targetPercentage={targetCalorie}
              font={font}
              smallerFont={smallerFont}
            />
          </View>
          <View style={styles.container}>
            <View style={styles.barChartContainer}>
              <SimpleChart
                strokeWidth={14}
                backgroundColor="#F3F0EE"
                target={400}
                barColor="yellow"
                progress={LiveFood[0].carbs}
                smallerFont={smallerFont}
                mainText="Carbs"
              />
              <SimpleChart
                strokeWidth={14}
                backgroundColor="#F3F0EE"
                target={400}
                barColor="orange"
                progress={LiveFood[0].protein}
                smallerFont={smallerFont}
                mainText="Protein"
              />
              <SimpleChart
                strokeWidth={14}
                backgroundColor="#F3F0EE"
                target={400}
                barColor="brown"
                progress={LiveFood[0].fat}
                smallerFont={smallerFont}
                mainText="Fat"
              />
            </View>
          </View>
        </View>
      </View> 
      
      <View style={styles.flexRowContainer}>
        <View style={[styles.smallBox, styles.box]}>
          <Text>WAIT!</Text>
        </View>
        <View style={[styles.box, styles.smallBox]}>
          <Text>bo o o wo a</Text>
        </View>
      </View>
      <Text style={styles.titleText}>MY NIBBLERS</Text>
      <View style={styles.box}>
        <View style={styles.centerContainter}>
          <Text style={styles.smallText}>No Bitches?</Text>
        </View>
        <View style={styles.flexRowContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>cut me cock</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>cut me balls</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  flexRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  ringChartContainer: {
    width: radius * 2,
    height: radius * 2.5,
  },
  barChartContainer: {
    flex: 1,
    paddingLeft: 35,
  },
  button: {
    marginTop: 20,
    marginLeft: 15,
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
    marginVertical: 20,
    marginHorizontal: 15,
    backgroundColor:colors.primary,
    borderRadius: 4,
    
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