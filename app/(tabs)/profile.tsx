import { LineChart } from "@/constants/LineChart";
import { colors } from "@/constants/theme";
import { food, foodItem, nutritionGoal } from "@/db/schema";
import { and, eq, gte, lt, sql } from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, ScrollView, Image } from "react-native";
import { Context } from "../_layout";
import { calculateCalories } from "@/constants/NutritionInfo";

export default function Profile() {
  const db = useSQLiteContext();
  const drizzleDb = drizzle(db);
  const context = useContext(Context)
  const [startWeight, setStartWeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [calorieGoal, setCalorieGoal] = useState('');
  const [proteinGoal, setproteinGoal] = useState('');
  const [fatGoal, setFatGoal] = useState('');
  const [carbsGoal, setCarbsGoal] = useState('');
  
  const { data: LiveFood } = useLiveQuery(
      drizzleDb.select({
        fat: sql<number>`sum(${food.fat} * ${foodItem.servings})`,
        carbs: sql<number>`sum(${food.carbs} * ${foodItem.servings})`,
        protein: sql<number>`sum(${food.protein} * ${foodItem.servings})`,
        date: sql<Date>`strftime('%s', ${foodItem.timestamp}, 'unixepoch')`
      })
      .from(foodItem).innerJoin(food, eq(foodItem.food_id, food.id))
      .groupBy(sql<string>`strftime('%F', ${foodItem.timestamp}, 'unixepoch')`)
      .orderBy(foodItem.timestamp)
  , [context.date])
  const handleAddGoal = async () => {
    await drizzleDb.insert(nutritionGoal).values({calories: Number(calorieGoal), 
      carbs: Number(carbsGoal), 
      fat: Number(fatGoal),
      protein: Number(proteinGoal),})
  }
  useEffect(() => {
      console.log('LiveFood.length')
     // console.log('HIII ')
    }, [LiveFood])
  if (!LiveFood[0])
    return <View></View>
  return (
    <ScrollView style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.h1}>Weight Goals</Text>
        <View style={[styles.rowContainer, {justifyContent: 'center', alignItems: 'center'}]}>
          <Text style={[styles.h4]}>Start Weight</Text>
          <TextInput 
            style={[styles.h2, styles.input]}
            onChangeText={setStartWeight}
            value={startWeight}
            placeholder="Lbs"
            textAlign="center"
            keyboardType="numeric"
          />
        </View>
        <View style={[styles.rowContainer, {justifyContent: 'center', alignItems: 'center'}]}>
          <Text style={[styles.h4]}>Start Weight</Text>
          <TextInput 
            style={[styles.h2, styles.input]}
            onChangeText={setCurrentWeight}
            value={currentWeight}
            placeholder="Lbs"
            textAlign="center"
            keyboardType="numeric"
          />
        </View>
        <View style={[styles.rowContainer, {justifyContent: 'center', alignItems: 'center'}]}>
          <Text style={[styles.h4]}>Start Weight</Text>
          <TextInput 
            style={[styles.h2, styles.input]}
            onChangeText={setGoalWeight}
            value={goalWeight}
            placeholder="Lbs"
            textAlign="center"
            keyboardType="numeric"
          />
        </View>
      </View>
      <View style={[styles.box, styles.barChartContainer]}>
        <LineChart
          target={LiveFood.map((item) => {
            return (
              {x: Number(item.date), y: calculateCalories({carbs: item.carbs, fat: item.fat, protein: item.protein})}
            )
          })}
          startDate={LiveFood[0].date}
          endDate={LiveFood[LiveFood.length - 1].date}
        />
      </View>
      <View style={styles.box}>
        <Text style={styles.h1}>Weight Goals</Text>
        <View style={[styles.rowContainer, {justifyContent: 'center', alignItems: 'center'}]}>
          <Text style={[styles.h4]}>Calories</Text>
          <TextInput 
            style={[styles.h2, styles.input]}
            onChangeText={setCalorieGoal}
            value={calorieGoal}
            placeholder="cals"
            textAlign="center"
            keyboardType="numeric"
          />
        </View>
        <View style={[styles.rowContainer, {justifyContent: 'center', alignItems: 'center'}]}>
          <Text style={[styles.h4]}>Fat</Text>
          <TextInput 
            style={[styles.h2, styles.input]}
            onChangeText={setFatGoal}
            value={fatGoal}
            placeholder="g"
            textAlign="center"
            keyboardType="numeric"
          />
        </View>
        <View style={[styles.rowContainer, {justifyContent: 'center', alignItems: 'center'}]}>
          <Text style={[styles.h4]}>Protein</Text>
          <TextInput 
            style={[styles.h2, styles.input]}
            onChangeText={setproteinGoal}
            value={proteinGoal}
            placeholder="g"
            textAlign="center"
            keyboardType="numeric"
          />
        </View>
        <View style={[styles.rowContainer, {justifyContent: 'center', alignItems: 'center'}]}>
          <Text style={[styles.h4]}>Carbs</Text>
          <TextInput 
            style={[styles.h2, styles.input]}
            onChangeText={setCarbsGoal}
            value={carbsGoal}
            placeholder="g"
            textAlign="center"
            keyboardType="numeric"
          />
        </View>
        <TouchableOpacity style={[styles.button, styles.centerContainter]} onPress={handleAddGoal}>
          <Text style={styles.buttonText}>Update Goal</Text>
        </TouchableOpacity>
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
      width: 380,
      height: 300,
  },
  input: {
      flex: 1,
      backgroundColor: colors.box,
      borderRadius: 10,
      padding: 10,
      marginLeft: 50,
      marginVertical: 10,
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
      fontWeight: '600',
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
})