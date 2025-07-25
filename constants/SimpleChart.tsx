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
  mainText?: string;
  target: number;
  barColor: string;
  progress: number;
  font?: SkFont;
  smallerFont: SkFont;
  width: number;
  unit: string;
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
    width,
    unit,
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
  const end = useDerivedValue(() => (target ? Math.min(((progressDaily.value / target) * width), width) : 0));
  const goalText = useDerivedValue(() => (Math.round(progressDaily.value).toString() + unit  + '/' + target.toString() + unit));
  useEffect(() => {
    console.log(target)
    //if (progress)
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
              text={`${mainText ? mainText : ''}`}
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
                width={width}
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