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

export const ProgressBox: React.FC<BarProgressProps> = ({
    backgroundColor,
    strokeWidth,
    target,
    mainText,
    barColor,
    font,
    progress,
    smallerFont,
}) => {
    if (!target)
        target = 0;

  const progressDaily = useSharedValue(0)
  const animateChart = () => {

    progressDaily.value = withTiming(progress,  {
      duration: 1250,
      easing: Easing.inOut(Easing.cubic),
    });
  };
  const end = useDerivedValue(() => (target ? Math.min(((progressDaily.value / target) * 120), 120) : 0));
  const goalText = useDerivedValue(() => (Math.round(progressDaily.value).toString() + 'g'  + '/' + target.toString() + 'g'));
  useEffect(() => {
    console.log(target)
      animateChart()
  }, [target, progress])
  if (!smallerFont) {
    return <View />;
  }
  return (
    <Canvas style={{ flex: 1 }}>
        <Text
          x={0}
          y={smallerFont.getSize()}
          font={smallerFont}
          text={`${mainText}`}
        />
    </Canvas>
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