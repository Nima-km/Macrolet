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
	calorieTarget: number;
  colorProtein: string;
  colorfat: string;
  colorCarbs: string;
  dailyEnd: NutritionInfo;
  smallerFont?: SkFont;
}

export const BarChart: React.FC<BarProgressProps> = ({
    backgroundColor,
    strokeWidth,
		calorieTarget,
    colorProtein,
    colorfat,
    colorCarbs,
    dailyEnd,
   // font,
    smallerFont ,
}) => {
	if (calorieTarget == 0)
		calorieTarget = 1;
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
  const endCarb = useDerivedValue(() => ((progressDaily.value.carbs / calorieTarget) * 320 * 4));
  const endFat = useDerivedValue(() => ((progressDaily.value.fat / calorieTarget) * 320 * 9 + endCarb.value));
  const endProtein = useDerivedValue(() => ((progressDaily.value.protein / calorieTarget) * 320 * 4 + endFat.value));
  const calorieDay = useDerivedValue(() => (Math.floor((progressDaily.value.protein + progressDaily.value.carbs) * 4 + progressDaily.value.fat * 9)));
  const calorieDayText = useDerivedValue(() => (calorieDay.value.toString() + ' / ' + calorieTarget.toString() + ' cal'));
  const caloriesRemaining = useDerivedValue(() => (calorieTarget - calorieDay.value).toString())
  const carbsDayText = useDerivedValue(() => (Math.floor(progressDaily.value.carbs).toString() + 'g'));
  const fatDayText = useDerivedValue(() => (Math.floor(progressDaily.value.fat).toString() + 'g'));
  const proteinDayText = useDerivedValue(() => (Math.floor(progressDaily.value.protein).toString() + 'g'));
  const fontMgr = useFonts({
    Geist: [
      require("@/assets/fonts/Geist-VariableFont_wght.ttf"),
    ]
  });
  const titleFont = useFont(require("@/assets/fonts/Metropolis-Medium.ttf"), 20);
  const remainFont = useFont(require("@/assets/fonts/Metropolis-Regular.ttf"), 20);
  useEffect(() => {
    console.log(dailyEnd)
    animateChart()
  }, [dailyEnd])
  if (!fontMgr) {
    return <View></View>;
  }
  const fontStyle = {
    fontFamily: "Geist",
    fontWeight: 'bold',
    fontSize: 30
  } as const;
  const calorieFont = matchFont(fontStyle, fontMgr);
  const chartHeight = 80;
  
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
                width={endProtein}
                height={strokeWidth}
                r={10}
                color={colorProtein}
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
                y={192}
                width={10}
                height={25}
                r={10}
                color={colorCarbs}
            />
            <RoundedRect
                x={0}
                y={230}
                width={10}
                height={25}
                r={10}
                color={colorfat}
            />
            <RoundedRect
                x={0}
                y={270}
                width={10}
                height={25}
                r={10}
                color={colorProtein}
            />
            <Text
              x={260}
              y={chartHeight + 25}
              font={remainFont}
              text={caloriesRemaining}
            />
            <Text
              x={20}
              y={210}
              font={titleFont}
              text="Carbs"
            />
            <Text
              x={180}
              y={210}
              font={titleFont}
              text={carbsDayText}
            />
            <Text
              x={280}
              y={210}
              font={titleFont}
              text={carbsDayText}
            />

            <Text
              x={20}
              y={250}
              font={titleFont}
              text="Fat"
            />
            <Text
              x={180}
              y={250}
              font={titleFont}
              text={fatDayText}
            />
            <Text
              x={280}
              y={250}
              font={titleFont}
              text={fatDayText}
            />
            <Text
              x={20}
              y={290}
              font={titleFont}
              text="Protein"
            />
            <Text
              x={180}
              y={290}
              font={titleFont}
              text={proteinDayText}
            />
            <Text
              x={280}
              y={290}
              font={titleFont}
              text={proteinDayText}
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