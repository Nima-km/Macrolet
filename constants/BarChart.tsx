import {
    Canvas,
    Path,
    SkFont,
    Skia,
    Text,
    RoundedRect,
    useFont,
    FontWeight,
    FontWidth,
    matchFont,
    useFonts,
  } from "@shopify/react-native-skia";
import { Share, StyleSheet, View } from "react-native";
import {NutritionInfo, SharedNutritionInfo} from "./NutritionInfo";
import { SharedValue } from "react-native-reanimated";
import { } from "react-native-reanimated";
import { colors, spacing, typography } from "./theme";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  useDerivedValue
} from 'react-native-reanimated';
import { useEffect } from "react";

interface BarProgressProps {
  strokeWidth: number;
  backgroundColor: string;
	dailyTarget: NutritionInfo;
  colorProtein: string;
  colorfat: string;
  colorCarbs: string;
  dailyEnd: NutritionInfo;
  smallerFont?: SkFont;
}

export const BarChart: React.FC<BarProgressProps> = ({
    backgroundColor,
    strokeWidth,
		dailyTarget,
    colorProtein,
    colorfat,
    colorCarbs,
    dailyEnd,
   // font,
    smallerFont ,
}) => {
  const titleFont = useFont(require("@/assets/fonts/Metropolis-Medium.ttf"), 20);
  const remainFont = useFont(require("@/assets/fonts/Metropolis-Regular.ttf"), 16);
  const fontStyle = {
    fontFamily: "Geist",
    fontWeight: 'bold',
    fontSize: 30
  } as const;
  const fontMgr = useFonts({
    Geist: [
      require("@/assets/fonts/Geist-VariableFont_wght.ttf"),
    ]
  });
  
  if (!dailyTarget)
    dailyTarget = {protein: 0, fat: 0, carbs: 0, calories: 0}
  const calorieTarget = dailyTarget.calories ? dailyTarget.calories : 0
	
  const progressDaily = useSharedValue<NutritionInfo>({
    protein: 0,
    fat: 0,
    carbs: 0,
  });
  const animateChart = () => {
    // Reset daily progress
    progressDaily.value = { protein: 0, fat: 0, carbs: 0 };
    // Update carbs immutably
    progressDaily.value = withTiming(dailyEnd,  {
      duration: 1250,
      easing: Easing.inOut(Easing.cubic),
    });
  };
  const endProtein = useDerivedValue(() => Math.min(((progressDaily.value.protein / calorieTarget) * 320 * 4 ), 320));
  const endCarb = useDerivedValue(() => Math.min(calorieTarget ? (progressDaily.value.carbs / calorieTarget) * 320 * 4 + endProtein.value: 0, 320));
  const endFat = useDerivedValue(() => Math.min(calorieTarget ? (progressDaily.value.fat / calorieTarget) * 320 * 9 + endCarb.value : 0, 320));
  
  const calorieDay = useDerivedValue(() => (Math.round(((progressDaily.value.protein) + Math.round(progressDaily.value.carbs)) * 4 + Math.round(progressDaily.value.fat) * 9)));
  const calorieDayText = useDerivedValue(() => (calorieDay.value.toString() + ' / ' + calorieTarget.toString() + ' cal'));
  const caloriesRemaining = useDerivedValue(() => (calorieTarget ? calorieTarget - calorieDay.value : 0).toString() + ' remaining')
  const carbsDayText = useDerivedValue(() => (Math.round(progressDaily.value.carbs).toString() + 'g'));
  const fatDayText = useDerivedValue(() => (Math.round(progressDaily.value.fat).toString() + 'g'));
  const proteinDayText = useDerivedValue(() => (Math.round(progressDaily.value.protein).toString() + 'g'));
  
  
  
  useEffect(() => {
    console.log(dailyEnd)
    animateChart()
  }, [dailyEnd])
  
  
  const remainWidth = useDerivedValue(() => 250 - ((remainFont?.measureText(caloriesRemaining.value) ? remainFont?.measureText(caloriesRemaining.value).width : 0) - 10) / 2);
  const calorieFont = matchFont(fontStyle, fontMgr ? fontMgr : undefined);
  const chartHeight = 80;

  if (!remainFont || !titleFont || !fontMgr) {
    return <View></View>;
  }
  return (
    <View style={styles.container}>
        <Canvas style={{ flex: 1 }}>
            <Text
              x={10}
              y={20}
              font={titleFont}
              text="Calorie Intake"
            />
            <Text
              x={10}
              y={50}
              font={calorieFont}
              text={calorieDayText}
            />
            <RoundedRect
                x={0}
                y={chartHeight}
                width={320}
                height={strokeWidth}
                r={10}
                color={backgroundColor}
            />
            
            <RoundedRect
                x={0}
                y={chartHeight}
                width={endFat}
                height={strokeWidth}
                r={10}
                color={colorfat}
            />
            <RoundedRect
                x={0}
                y={chartHeight}
                width={endCarb}
                height={strokeWidth}
                r={10}
                color={colorCarbs}
            />
            <RoundedRect
                x={0}
                y={chartHeight}
                width={endProtein}
                height={strokeWidth}
                r={10}
                color={colorProtein}
            />
            <RoundedRect
                x={0}
                y={192}
                width={10}
                height={25}
                r={10}
                color={colorProtein}
            />
            <RoundedRect
                x={0}
                y={230}
                width={10}
                height={25}
                r={10}
                color={colorCarbs}
            />
            <RoundedRect
                x={0}
                y={270}
                width={10}
                height={25}
                r={10}
                color={colorfat}
            />
            <Text
              x={remainWidth}
              y={chartHeight + 25}
              font={remainFont}
              text={caloriesRemaining}
            />
            <Text
              x={20}
              y={210}
              font={titleFont}
              text="Protein"
            />
            <Text
              x={150}
              y={210}
              font={titleFont}
              text={proteinDayText}
            />
            <Text
              x={250}
              y={210}
              font={titleFont}
              text={Math.round(dailyTarget.protein).toString() + 'g'}
            />
            <Text
              x={20}
              y={250}
              font={titleFont}
              text="Carbs"
            />
            <Text
              x={150}
              y={250}
              font={titleFont}
              text={carbsDayText}
            />
            <Text
              x={250}
              y={250}
              font={titleFont}
              text={Math.round(dailyTarget.carbs).toString() + 'g'}
            />

            <Text
              x={20}
              y={290}
              font={titleFont}
              text="Fat"
            />
            <Text
              x={150}
              y={290}
              font={titleFont}
              text={fatDayText}
            />
            <Text
              x={250}
              y={290}
              font={titleFont}
              text={Math.round(dailyTarget.fat).toString() + 'g'}
            />
            
        </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
});