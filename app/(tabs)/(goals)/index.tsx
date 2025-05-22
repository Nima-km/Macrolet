import { PixelRatio, Pressable, StyleSheet, Text, View, Image, TextInput } from "react-native";
import { colors, spacing, typography } from "@/constants/theme";
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
import { and, desc, eq, gte, lt, sql } from "drizzle-orm";
import { food, foodItem, nutritionGoal, WeightItem } from "@/db/schema";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Context } from "../../_layout";
import { useRouter } from "expo-router";
import { autoCalorie, MaintenanceCalories } from "@/constants/AutoCalorieCalculator";
import { NutritionInfoFull } from "@/constants/NutritionInfo";


const FONT_SIZE = 22
const radius = 82;


export default function Index() {
  const router = useRouter();
  const context = useContext(Context)
  const [show, setShow] = useState(false);
  const [showLogWeight, setShowLogWeight] = useState(false);
  const [curWeight, setCurWeight] = useState(0);
  const [weightMult, setweightMult] = useState(2.20);
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  useDrizzleStudio(db);

  const WeightOptions = [
      { label: 'Kg', value: 2.2 },
      { label: 'Lbs', value: 1 },
  ];

  const { data: LiveFood } = useLiveQuery(
    drizzleDb.select({
      fat: sql<number>`sum(${food.fat} * ${foodItem.servings} * ${foodItem.serving_mult})`,
      carbs: sql<number>`sum(${food.carbs} * ${foodItem.servings} * ${foodItem.serving_mult})`,
      protein: sql<number>`sum(${food.protein} * ${foodItem.servings} * ${foodItem.serving_mult})`,
      calories: sql<number>`sum((${food.protein} * 4 + ${food.carbs} * 4 + ${food.fat} * 9) * ${foodItem.servings} * ${foodItem.serving_mult})`,
    })
    .from(foodItem).innerJoin(food, eq(foodItem.food_id, food.id))
    .where(and( 
          gte(foodItem.timestamp, new Date(context.date.getFullYear(), context.date.getMonth(), context.date.getDate())), 
          lt(foodItem.timestamp, new Date(context.date.getFullYear(), context.date.getMonth(), context.date.getDate(), 24))))
    .orderBy(food.id)
  , [context.date])
  const { data: nutriGoals } = useLiveQuery(
    drizzleDb.select().from(nutritionGoal).orderBy(desc(nutritionGoal.timestamp))
  )

  const {data: currentWeight } = useLiveQuery(
    drizzleDb.select()
    .from(WeightItem)
    .orderBy(desc(WeightItem.timestamp))
  )

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
    
      console.log("showLog", showLogWeight)
    }, [showLogWeight])
  const font = useFont(require("@/assets/fonts/Geist-VariableFont_wght.ttf"), FONT_SIZE);
  const smallerFont = useFont(require("@/assets/fonts/Metropolis-Regular.ttf"), 16);

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
  const logWeight = async () => {
    if (showLogWeight == true){
      const tmp = await drizzleDb.insert(WeightItem)
        .values({weight: curWeight * weightMult}).returning()
      
      console.log('inserted', tmp)
    }
    setShowLogWeight(!showLogWeight)
  }
  const showTimepicker = () => {
    setShow(true);
  };
  const logWeightCancel = () => {
    setShowLogWeight(!showLogWeight)
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
      <View style={[styles.flexRowContainer, {justifyContent: 'center'}]}>
        <Text style={[styles.h2, {paddingLeft: 90, paddingTop: 40}]}> {context.date.toDateString()} </Text>
        <TouchableOpacity style={[{paddingLeft: 40, paddingTop: 40}]} onPress={showTimepicker}>
          <Image source={require('@/assets/images/Calendar.png')} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.box, styles.flexRowContainer]} onPress={() => router.navigate('/nutritionGoal')}>
          <View style={[styles.ringChartContainer]}>
            <DonutChart
              backgroundColor="white"
              radius={radius}
              dailyProgress={LiveFood[0].calories ? LiveFood[0].calories : 0}
              targetPercentage={nutriGoals[0]?.calories}
              font={font}
              smallerFont={smallerFont}
            />
          </View>
          <View style={styles.barChartContainer}>
            <SimpleChart
              strokeWidth={18}
              backgroundColor="#F3F0EE"
              target={Math.round(nutriGoals[0]?.protein)}
              barColor={colors.protein}
              progress={LiveFood[0].protein}
              smallerFont={smallerFont}
              mainText="Protein"
            />
            <SimpleChart
              strokeWidth={18}
              backgroundColor="#F3F0EE"
              target={Math.round(nutriGoals[0]?.carbs)}
              barColor={colors.carbs}
              progress={LiveFood[0].carbs}
              smallerFont={smallerFont}
              mainText="Carbs"
            />
            <SimpleChart
              strokeWidth={18}
              backgroundColor="#F3F0EE"
              target={Math.round(nutriGoals[0]?.fat)}
              barColor={colors.fat}
              progress={LiveFood[0].fat}
              smallerFont={smallerFont}
              mainText="Fat"
            />
          </View>
      </TouchableOpacity>
      <View style={styles.flexRowContainer}>
        <TouchableOpacity onLongPress={() => logWeight()}>
          <View style={[styles.smallBox, styles.box]}>
            { showLogWeight ?
                <View style={[styles.flexRowContainer, { justifyContent: 'space-between'}]}>
                  <TouchableOpacity onPress={() => setweightMult(weightMult == 1 ? 2.2 : 1)} >
                    <View style={{minHeight: 25, width: 45}}>
                      <Text style={styles.h7}>{weightMult == 2.2 ? 'Kg' : 'lbs'}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={{}} onPress={logWeightCancel} >
                    <View style={{padding: 5}}>
                      <Text style={styles.h8}>Cancel</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                :
                <>
                  <Text style={styles.h5}>Weight</Text>
                </>
              }
            <View style={[styles.centerContainter, {marginTop: 20}]}>

              
              { showLogWeight ?
                <>
                  <Text style={styles.h5}>Log Weight</Text>
                  <TextInput 
                    style={[styles.h1, {fontWeight: 800, backgroundColor: colors.background, paddingHorizontal: 10}]}
                    onChangeText={(inp) => setCurWeight(Number(inp))}
                    value={curWeight.toString()}
                    placeholder="Search all foods"
                    
                  />
                </>
                :
                <>
                  <Text style={styles.h5}>Current</Text>
                  <Text style={[styles.h1, {fontWeight: 800}]}>{currentWeight[0].weight} lbs</Text>
                </>
              }
            </View>
            {
              currentWeight[1] &&
              <View style={[styles.centerContainter, {marginTop: 10}]}>
                <Text style={[styles.h5, 
                  {color: currentWeight[0].weight - currentWeight[1].weight <= 0? 'red' : 'green'}]}>
                    {currentWeight[0].weight - currentWeight[1].weight} lbs
                </Text>
              </View>
            }
          </View>
        </TouchableOpacity>
        <View style={[styles.box, styles.smallBox]}>
          <Text style={styles.h5}>bo o o wo a</Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  testContainer: {
    backgroundColor: 'red'
  },
  centerContainter: {
    alignItems: "center",
    justifyContent: "center"
  },
  flexRowContainer: {
    flexDirection: 'row',
   // justifyContent: 'space-between'
  },
  ringChartContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 0,
    width: radius * 2,
    height: radius * 2.5,
  },
  barChartContainer: {
    flex: 1,
    minHeight: 220,
  },
  button: {
    marginTop: 20,
    marginLeft: 15,
    backgroundColor: colors.secondary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
  },
  box: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginVertical: 20,
    marginHorizontal: 20,
    backgroundColor:colors.primary,
    borderRadius: 10,
    
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
    fontWeight: 'semibold',
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