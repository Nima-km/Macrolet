import { PixelRatio, Pressable, StyleSheet, Text, View, FlatList, ScrollView} from "react-native";
import { colors, spacing, typography } from "../../../constants/theme";
import { TouchableOpacity } from "react-native";
import { Link } from 'expo-router';
import { NutritionInfo, LongDataTST, shortDataTST, Item} from "../../../constants/NutritionInfo";
import { BarChart } from "../../../constants/BarChart";
import React from 'react';
import {
  Canvas,
  Path,
  SkFont,
  Skia,
  useFont,
} from "@shopify/react-native-skia";


import Animated, {useSharedValue, withTiming, Easing, useDerivedValue} from "react-native-reanimated";
import { useFocusEffect } from '@react-navigation/native';

const strokeWidth = PixelRatio.roundToNearestPixel(30);

export default function Logs() {
  const calorieTarget = 2500;
  const carbTarget = 14;
  const daily: NutritionInfo = {
    protein: 50,
    fat: 100,
    carbs: 200
  };

  const carbProgress = useSharedValue(0);
  const dailyProgress = useSharedValue<NutritionInfo>({
    protein: 0,
    fat: 0,
    carbs: 0,
  });
  
  useFocusEffect(
    React.useCallback(() => {
      // This code runs when the screen is focused
      console.log('Tab is now focused');
      console.log(daily.carbs)
      animateChart();

      // Optionally return a cleanup function if needed
      return () => {
        console.log('Tab is unfocused');
      };
    }, [])
  );

  const animateChart = () => {
    // Reset carb progress
    carbProgress.value = 0;
    carbProgress.value = withTiming(carbTarget, {
      duration: 1250,
      easing: Easing.inOut(Easing.cubic),
    });

    // Reset daily progress
    dailyProgress.value = { protein: 0, fat: 0, carbs: 0 };

    // Update carbs immutably
    dailyProgress.value = withTiming(daily,  {
      duration: 1250,
      easing: Easing.inOut(Easing.cubic),
    });
  };
  const font = useFont(require("../../../Roboto-Light.ttf"), 25);
  const smallerFont = useFont(require("../../../Roboto-Light.ttf"), 25);
  const displayText = useDerivedValue(() => {
    return `Calories: ${Math.floor(dailyProgress.value.carbs)}`;
  });
  if (!font || !smallerFont) {
    return <View />;
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
            progressDaily={dailyProgress}
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
            data={shortDataTST}
            renderItem={({item}) => <Item name={item.name} description={item.description} servings={item.servings} />}
            keyExtractor={item => item.id}
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
            data={shortDataTST}
            renderItem={({item}) => <Item name={item.name} description={item.description} servings={item.servings} />}
            keyExtractor={item => item.id}
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
            data={shortDataTST}
            renderItem={({item}) => <Item name={item.name} description={item.description} servings={item.servings} />}
            keyExtractor={item => item.id}
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
