import { PixelRatio, Pressable, StyleSheet, Text, View, FlatList, ScrollView, SectionList, Image} from "react-native";
import { colors, spacing, typography } from "@/constants/theme";
import { TouchableOpacity } from "react-native";
import { Link } from 'expo-router';
import { NutritionInfo, Item} from "@/constants/NutritionInfo";
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
import { food, foodItem, nutritionGoal} from '@/db/schema';
import { sql, eq, sum, and, gte, lt, desc} from 'drizzle-orm';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Context } from "@/app/_layout";

const strokeWidth = 40;

export default function Logs() {
  
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const calorieTarget = 5000;
  const context = useContext(Context)
  const [show, setShow] = useState(false);
  const { data: nutriGoals } = useLiveQuery(
      drizzleDb.select().from(nutritionGoal).orderBy(desc(nutritionGoal.timestamp))
    )
  const { data: breakFast } = useLiveQuery(
    drizzleDb.select().from(foodItem).innerJoin(food, eq(foodItem.food_id, food.id))
    .where(and(
      gte(foodItem.timestamp, new Date(context.date.getFullYear(), context.date.getMonth(), context.date.getDate())), 
      lt(foodItem.timestamp, new Date(context.date.getFullYear(), context.date.getMonth(), context.date.getDate(), 24))))
    .orderBy(foodItem.timestamp)
  , [context.date])
  const { data: LiveFood } = useLiveQuery(
    drizzleDb.select({
      fat: sql<number>`sum(${food.fat} * ${foodItem.servings} * ${foodItem.serving_mult})`,
      carbs: sql<number>`sum(${food.carbs} * ${foodItem.servings} * ${foodItem.serving_mult})`,
      protein: sql<number>`sum(${food.protein} * ${foodItem.servings} * ${foodItem.serving_mult})`,
    })
    .from(foodItem).innerJoin(food, eq(foodItem.food_id, food.id))
    .where(and( 
      gte(foodItem.timestamp, new Date(context.date.getFullYear(), context.date.getMonth(), context.date.getDate())), 
      lt(foodItem.timestamp, new Date(context.date.getFullYear(), context.date.getMonth(), context.date.getDate(), 24))))
    .orderBy(food.id)
  , [context.date])
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
      console.log(LiveFood[0])
      return () => {
        console.log('Tab is unfocused');
      };
      
    }, [])
  );
  useEffect(() => {
    //console.log(breakFast[0])
    //console.log(LiveFood)
    console.log("HAIISISI")
    let tmp: (number)[] = []
    tmp.push(breakFast[0]?.foodItem.timestamp.getHours())
    for (let i = 1; i < 9; i++) {
      const tst1 = breakFast?.find((item) => item.foodItem.timestamp.getHours() >= tmp[i - 1] + 3)?.foodItem.timestamp.getHours()
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
      <View style={[styles.rowContainer, {justifyContent: 'center'}]}>
        <Text style={[styles.h2, {paddingLeft: 90, paddingTop: 40}]}> {context.date.toDateString()} </Text>
        <TouchableOpacity style={[{paddingLeft: 40, paddingTop: 40}]} onPress={showTimepicker}>
          <Image source={require('@/assets/images/Calendar.png')} />
        </TouchableOpacity>
      </View>
      <View style={styles.box}>
        <View style={styles.barChartContainer}>
          <BarChart
            backgroundColor="#F0E6DE"
            dailyTarget={nutriGoals[0]}
            colorProtein="#E98A67"
            colorfat="#FAAE5B"
            colorCarbs="#F8E559"
            dailyEnd={LiveFood[0]}
            strokeWidth={strokeWidth}
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
        <SectionList
        sections={slData}
          renderItem={({item}) => <Item name={item.food.name}
          description={item.food.description}
          servings={item.foodItem.servings}
          nutritionInfo={{ carbs: item.food.carbs, fat: item.food.fat, protein: item.food.protein }}
          foodItem_id={item.foodItem.id}
          timestamp={item.foodItem.timestamp}
          is_link={true}
          backgroundColor={'#FFFFFF'}
          serving_mult={item.foodItem.serving_mult} 
          serving_100g={item.food.serving_100g} 
          volume_100g={item.food.volume_100g} 
          serving_type={item.foodItem.serving_type}/>
          }
        style={[{margin: 20}]}
        keyExtractor={item => item.foodItem.id.toString()}
        scrollEnabled={false}
        renderSectionHeader={({section: {title}}) => (
          <View style={[styles.rowContainer, {alignItems: 'center'}]}>
            <Text style={styles.h3}>{title < 10 ? 0: ''}{title}:00</Text>
            <View
              style={{
                backgroundColor: '#DFDFDF',
                height: 2,
                flex: 1,
                marginLeft: 20,
                
              }}
            />
          </View>
        )}
        />
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
    marginHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 10,
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
