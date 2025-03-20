import {
    Canvas,
    Path,
    SkFont,
    Skia,
    Text,
    RoundedRect,
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
  progressProtein?: SharedValue<number>;
  progressFat: SharedValue<number>;
  progressCarbs: SharedValue<number>;
  dailyEnd: NutritionInfo;
  font: SkFont;
  smallerFont?: SkFont;
  targetPercentage: number;
}

export const BarChart: React.FC<BarProgressProps> = ({
    backgroundColor,
    strokeWidth,
		calorieTarget,
    colorProtein,
    colorfat,
    colorCarbs,
    dailyEnd,
    font,
    smallerFont,
    targetPercentage,
}) => {
	if (calorieTarget == 0)
		calorieTarget = 1;
//	const endCarb = useDerivedValue(() => ((progressCarbs.value / calorieTarget) * 320 * 4));
  //const endFat = useDerivedValue(() => ((progressFat.value / calorieTarget) * 320 * 4 + progressDaily.value.carbs));
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
  const calorieDayText = useDerivedValue(() => (Math.floor((progressDaily.value.protein + progressDaily.value.carbs) * 4 + progressDaily.value.fat * 9).toString() + '/' + calorieTarget.toString()));
  const carbsDayText = useDerivedValue(() => (Math.floor(progressDaily.value.carbs).toString() + 'g'));
  const fatDayText = useDerivedValue(() => (Math.floor(progressDaily.value.fat).toString() + 'g'));
  const proteinDayText = useDerivedValue(() => (Math.floor(progressDaily.value.protein).toString() + 'g'));


  useEffect(() => {
    console.log(dailyEnd)
    animateChart()
  }, [dailyEnd])
  return (
    <View style={styles.container}>
        <Canvas style={{ flex: 1 }}>
            <Text
              x={10}
              y={20}
              font={font}
              text="Calorie Intake"
            />
            <Text
              x={10}
              y={50}
              font={font}
              text={calorieDayText}
            />
            <RoundedRect
                x={0}
                y={60}
                width={endProtein}
                height={strokeWidth}
                r={25}
                color="gray"
            />
            <RoundedRect
                x={0}
                y={60}
                width={endFat}
                height={strokeWidth}
                r={25}
                color="black"
            />
            <RoundedRect
                x={0}
                y={60}
                width={endCarb}
                height={strokeWidth}
                r={25}
                color="white"
            />
            <Text
              x={10}
              y={150}
              font={font}
              text="carbs"
            />
            <Text
              x={150}
              y={150}
              font={font}
              text={carbsDayText}
            />
            <Text
              x={250}
              y={150}
              font={font}
              text={carbsDayText}
            />

            <Text
              x={10}
              y={200}
              font={font}
              text="fat"
            />
            <Text
              x={150}
              y={200}
              font={font}
              text={fatDayText}
            />
            <Text
              x={250}
              y={200}
              font={font}
              text={fatDayText}
            />
            <Text
              x={10}
              y={250}
              font={font}
              text="protein"
            />
            <Text
              x={150}
              y={250}
              font={font}
              text={proteinDayText}
            />
            <Text
              x={250}
              y={250}
              font={font}
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