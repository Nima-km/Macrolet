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
  backgroundColor?: string;
  mainText?: string;
  target: number;
  barColor?: string;
  progress: number;
  font?: SkFont;
  smallerFont: SkFont;
}

export const SimpleChart: React.FC<BarProgressProps> = ({
    backgroundColor,
    strokeWidth,
    target,
    mainText,
    barColor,
    font,
    progress,
    smallerFont,
}) => {
    if (target == 0)
        target = 1;
//	const endCarb = useDerivedValue(() => ((progressCarbs.value / calorieTarget) * 320 * 4));
  //const endFat = useDerivedValue(() => ((progressFat.value / calorieTarget) * 320 * 4 + progressDaily.value.carbs));
  const progressDaily = useSharedValue(0)
  const animateChart = () => {
    // Reset daily progress
    progressDaily.value = 0;
    // Update carbs immutably
    progressDaily.value = withTiming(progress,  {
      duration: 1250,
      easing: Easing.inOut(Easing.cubic),
    });
  };
  const end = useDerivedValue(() => ((progressDaily.value / target) * 120));
  const goalText = useDerivedValue(() => (Math.floor(progressDaily.value).toString() + 'g'  + '/' + target.toString() + 'g'));
  useEffect(() => {
    console.log(target)
    animateChart()
  }, [target, progress])
  if (!smallerFont) {
    return <View />;
  }
  //font.setSize(15)
  return (
    <View style={styles.container}>
        <Canvas style={{ flex: 1 }}>
            <Text
              x={0}
              y={smallerFont.getSize()}
              font={smallerFont}
              text={`${mainText}`}
            />
            <Text
              x={0}
              y={2 * smallerFont.getSize() + strokeWidth + 5}
              font={smallerFont}
              text={goalText}
            />
            <RoundedRect
                x={0}
                y={20}
                width={120}
                height={strokeWidth}
                r={20}
                color={backgroundColor}
            />
            <RoundedRect
                x={0}
                y={20}
                width={end}
                height={strokeWidth}
                r={20}
                color={barColor}
            />
        </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   // flex: 1,
   minHeight: 80,
   paddingLeft: 30,
  },
  centerText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
});