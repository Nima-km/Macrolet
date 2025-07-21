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
  radius: number;
	dailyTarget: NutritionInfo;
  colorProtein: string;
  colorfat: string;
  colorCarbs: string;
  smallerFont?: SkFont;
}

export const BarMacroChart: React.FC<BarProgressProps> = ({
    strokeWidth,
		dailyTarget,
    radius,
    colorProtein,
    colorfat,
    colorCarbs,

   // font,
    smallerFont ,
}) => {
  if (!dailyTarget)
    dailyTarget = {protein: 0, fat: 0, carbs: 0, calories: 0}
  const total = dailyTarget.carbs + dailyTarget.fat + dailyTarget.protein
	
  const size = useSharedValue({ width: 0, height: 0 });
  const endProtein = useDerivedValue(() => ((dailyTarget.protein / total) * size.value.width ));
  const endCarb = useDerivedValue(() => ((dailyTarget.carbs / total) * size.value.width) + endProtein.value);
  const endFat = useDerivedValue(() => ((dailyTarget.fat / total) * size.value.width + endCarb.value));
  const chartHeight = 1;
  

  return (
  
    <Canvas style={[{flex: 1, }]} onSize={size}>
      <RoundedRect
          x={0}
          y={chartHeight}
          width={endFat}
          height={strokeWidth}
          r={radius}
          color={colorfat}
      />
      <RoundedRect
          x={0}
          y={chartHeight}
          width={endCarb}
          height={strokeWidth}
          r={radius}
          color={colorCarbs}
      />
      <RoundedRect
          x={0}
          y={chartHeight}
          width={endProtein}
          height={strokeWidth}
          r={radius}
          color={colorProtein}
      />
    </Canvas>
  );
};

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
});