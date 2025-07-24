import { StyleSheet, Text, View, ScrollView, SectionList, Image, TouchableOpacity} from "react-native";
import React, { useContext, useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Context } from "../_layout";
import { useFont } from "@shopify/react-native-skia";
import { BarChart } from "@/components/BarChart";
import { Link } from "expo-router";
import { Item } from "@/components/NutritionInfo";
import { colors } from "@/components/theme";
import { useNutriGoals } from "@/hooks/macroProfile/useGoal";
import { useHistorySum } from "@/hooks/history/useHistorySum";
import { useFoodMacroSectionList } from "@/hooks/history/useHistorySectionList";
const strokeWidth = 40;
export default function Logs() {
  const [show, setShow] = useState(false);
  const context = useContext(Context)
  const font = useFont(require("@/Roboto-Light.ttf"), 25);
  const smallerFont = useFont(require("@/Roboto-Light.ttf"), 25);
  const { data: nutriGoals, isLoading: loadingGoal, error: errorGoal } = useNutriGoals();
  const { data: slData, isLoading: loadingSectionList, error: errorSectionList } = useFoodMacroSectionList(
    new Date(context.date.getFullYear(), context.date.getMonth(), context.date.getDate()),
    new Date(context.date.getFullYear(), context.date.getMonth(), context.date.getDate(), 24)
  );
  const { data: LiveFood, isLoading: loadingHistorySum, error: errorHistorySum } = useHistorySum(
    new Date(context.date.getFullYear(), context.date.getMonth(), context.date.getDate()),
    new Date(context.date.getFullYear(), context.date.getMonth(), context.date.getDate(), 24)
  );
  useEffect(() => {
    console.log('this is test for hook', errorGoal)
  }, [nutriGoals])
  const isLoading = loadingGoal || loadingHistorySum || loadingSectionList;
  if (!font || !smallerFont || isLoading) {
    return <Text>HIIII {loadingGoal}  {loadingHistorySum}  {loadingSectionList}</Text>;
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
            dailyTarget={nutriGoals}
            colorProtein={colors.protein}
            colorfat={colors.fat}
            colorCarbs={colors.carbs}
            dailyEnd={LiveFood}
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
        nutritionInfo={{ carbs: item.food.carbs, fat: item.food.fat, protein: item.food.protein, fiber: item.food.fiber}}
        foodItem_id={item.foodItem.id}
        food_id={item.food.id}
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
