import { PixelRatio, Pressable, StyleSheet, Text, View, Image, TextInput, ScrollView } from "react-native";
import { colors, spacing, typography } from "@/components/theme";
import { TouchableOpacity } from "react-native";
import { DonutChart } from "@/components/DonutChart";
import { SimpleChart } from "@/components/SimpleChart";
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
import { Context } from "../_layout";
import { useRouter } from "expo-router";
import { autoCalorie, MaintenanceCalories } from "@/components/AutoCalorieCalculator";
import { NutritionInfoFull } from "@/components/NutritionInfo";
import { useHistorySum } from "@/hooks/history/useHistorySum";
import { useNutriGoals } from "@/hooks/macroProfile/useGoal";
import { useInsertWeight, useLatestWeight } from "@/hooks/weight/useWeight";


const FONT_SIZE = 22
const radius = 82;


export default function Index() {
  const router = useRouter();
  const context = useContext(Context)
  const [show, setShow] = useState(false);
  const [showLogWeight, setShowLogWeight] = useState(false);
  const [curWeight, setCurWeight] = useState('');
  const [weightMult, setweightMult] = useState(2.20);
  const { mutate, isPending, error } = useInsertWeight();
  const {data: LiveFood, isLoading: liveFoodLoading, error: liveFoodError} = useHistorySum(
    new Date(context.date.getFullYear(), context.date.getMonth(), context.date.getDate()),
    new Date(context.date.getFullYear(), context.date.getMonth(), context.date.getDate(), 24)
  )
  const { data: nutriGoals, isLoading: goalLoading, error: errorGoal } = useNutriGoals();
  const { data: currentWeight, isLoading: currentWeightLoading, error: errorcurrentWeight } = useLatestWeight();
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
  const logWeight = async () => {
      if (showLogWeight == true){
        mutate({weight: (Number(curWeight) ? Number(curWeight) : 0) * weightMult})
      }
      setShowLogWeight(!showLogWeight)
    }
  const logWeightCancel = () => {
    setShowLogWeight(!showLogWeight)
  };
  const font = useFont(require("@/assets/fonts/Geist-VariableFont_wght.ttf"), FONT_SIZE);
  const smallerFont = useFont(require("@/assets/fonts/Metropolis-Regular.ttf"), 16);
  const isLoading = liveFoodLoading || goalLoading || currentWeightLoading
  if (!font || !smallerFont || isLoading) {
    return <Text>{isLoading ? 'true' : 'false'} {!font}</Text>;
  }
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
              dailyProgress={LiveFood?.calories ? LiveFood.calories : 0}
              targetPercentage={nutriGoals?.calories ? nutriGoals.calories : 3000}
              font={font}
              smallerFont={smallerFont}
            />
          </View>
          <View style={styles.barChartContainer}>
            <SimpleChart
              strokeWidth={18}
              backgroundColor="#F3F0EE"
              target={nutriGoals?.protein}
              barColor={colors.protein}
              progress={LiveFood?.protein}
              smallerFont={smallerFont}
              mainText="Protein"
              width={120}
              unit='g'
            />
            <SimpleChart
              strokeWidth={18}
              backgroundColor="#F3F0EE"
              target={nutriGoals?.carbs}
              barColor={colors.carbs}
              progress={LiveFood?.carbs}
              smallerFont={smallerFont}
              mainText="Carbs"
              width={120}
              unit='g'
            />
            <SimpleChart
              strokeWidth={18}
              backgroundColor="#F3F0EE"
              target={nutriGoals?.fat}
              barColor={colors.fat}
              progress={LiveFood?.fat}
              smallerFont={smallerFont}
              mainText="Fat"
              width={120}
              unit='g'
            />
          </View>
      </TouchableOpacity>
      <View style={styles.flexRowContainer}>
        <TouchableOpacity onLongPress={() => logWeight()} onPress={() => router.navigate('/weightLogs')}>
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
                    onChangeText={setCurWeight}
                    value={curWeight}
                    placeholder={currentWeight ? currentWeight[0]?.weight.toString() : '0'}
                    keyboardType="numeric"
                    
                  />
                </>
                :
                <>
                  <Text style={styles.h5}>Current</Text>
                  <Text style={[styles.h1, {fontWeight: 800}]}>{Math.round(currentWeight ? currentWeight[0]?.weight * 100 : 0) / 100} lbs</Text>
                </>
              }
            </View>
            {
              (currentWeight && currentWeight[1]) &&
              <View style={[styles.centerContainter, {marginTop: 10}]}>
                <Text style={[styles.h5, 
                  {color: (currentWeight && currentWeight[0]?.weight - currentWeight[1]?.weight <= 0) ? 'red' : 'green'}]}>
                    {Math.round((currentWeight ? (currentWeight[0]?.weight - currentWeight[1]?.weight) : 0) * 100) / 100} lbs
                </Text>
              </View>
            }
          </View>
        </TouchableOpacity>
        <View style={[styles.box, styles.smallBox]}>
          <Text style={styles.h5}>bo o o wo a</Text>
        </View>
      </View>
    </ScrollView>
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