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
	dailyTarget: NutritionInfo;
  colorProtein: string;
  colorfat: string;
  colorCarbs: string;
  smallerFont?: SkFont;
}

export const BarMacroChart: React.FC<BarProgressProps> = ({
    strokeWidth,
		dailyTarget,
    colorProtein,
    colorfat,
    colorCarbs,
   // font,
    smallerFont ,
}) => {
  if (!dailyTarget)
    dailyTarget = {protein: 0, fat: 0, carbs: 0, calories: 0}
  const total = dailyTarget.carbs + dailyTarget.fat + dailyTarget.protein
	
  
  const endProtein = useDerivedValue(() => ((dailyTarget.protein / total) * 337 ));
  const endCarb = useDerivedValue(() => ((dailyTarget.carbs / total) * 337) + endProtein.value);
  const endFat = useDerivedValue(() => ((dailyTarget.fat / total) * 337 + endCarb.value));
  const chartHeight = 1;

  return (
    <View style={styles.container}>
        <Canvas style={{ flex: 1}}>
          
          <RoundedRect
              x={0}
              y={chartHeight}
              width={endFat}
              height={strokeWidth}
              r={4}
              color={colorfat}
          />
          <RoundedRect
              x={0}
              y={chartHeight}
              width={endCarb}
              height={strokeWidth}
              r={4}
              color={colorCarbs}
          />
          <RoundedRect
              x={0}
              y={chartHeight}
              width={endProtein}
              height={strokeWidth}
              r={4}
              color={colorProtein}
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