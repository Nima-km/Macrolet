import {
    Canvas,
    Path,
    SkFont,
    Skia,
    Text,
    useFont,
  } from "@shopify/react-native-skia";
import { PixelRatio, StyleSheet, View } from "react-native";
import { Easing, useDerivedValue, SharedValue, useSharedValue, withTiming } from "react-native-reanimated";
import { colors, spacing, typography } from "./theme";
import { useFocusEffect } from "expo-router";
import { useEffect } from "react";
  
interface CircularProgressProps {
  font: SkFont;
  backgroundColor: string;
  radius: number;
  smallerFont: SkFont;
  targetPercentage: number;
  dailyProgress: number;
}




export const DonutChart: React.FC<CircularProgressProps> = ({
  font,
  targetPercentage,
  radius,
  dailyProgress,
  smallerFont,
}) => {
  if (!targetPercentage)
    targetPercentage = 1
  const percentageComplete = useSharedValue(0);
  const opacity = useSharedValue(0);
  const animateChart = () => {
    //percentageComplete.value = 0;
    console.log(dailyProgress)
   // if (dailyProgress)
      percentageComplete.value = withTiming(dailyProgress, {
        duration: 1250,
        easing: Easing.inOut(Easing.cubic),
      });
    //opacity.value = 0;
    opacity.value = withTiming(1, {
      duration: 1250,
      easing: Easing.inOut(Easing.cubic),
    });
  };
  const font_size = font.getSize()
  const STROKE_WIDTH = Math.min(font_size * 1, 16);
  const innerRadius = radius - STROKE_WIDTH / 2;
  const targetText = useDerivedValue(() => Math.floor(percentageComplete.value).toString());
  
  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);

  if (!font || !smallerFont) {
    return <View />;
  }

  const matrix = Skia.Matrix();
  matrix.translate(radius, radius);
  matrix.rotate(-Math.PI / 2);
  matrix.translate(-radius, -radius);
  path.transform(matrix);

  // Using Reanimated's derived values directly
  const end = useDerivedValue(() => percentageComplete.value / targetPercentage);
  const width = useDerivedValue(() => innerRadius - (font.measureText(Math.floor(percentageComplete.value).toString()).width - 10) / 2);

  useEffect(() => {
    
    animateChart()
    console.log(end.value)
  }, [dailyProgress])

  return (
    <View style={styles.container}>
      <Canvas style={styles.container}>
        <Path
          path={path}
          color={colors.background}
          style="stroke"
          strokeJoin="round"
          strokeWidth={STROKE_WIDTH}
          strokeCap="round"
          
        />
        <Path
          path={path}
          color="#1A8199"
          style="stroke"
          strokeJoin="round"
          strokeWidth={STROKE_WIDTH}
          strokeCap="round"
          start={0}
          end={end}
        />
        
        <Text
          x={width}
          y={60}
          text={targetText}
          font={font}
          opacity={opacity}
          color="black"
        />
        <Text
          x={innerRadius / 2 + 12}
          y={innerRadius + 15}
          text={"Calories"}
          font={smallerFont}
          opacity={opacity}
          color="black"
        />
        <Text
          x={innerRadius / 2 + 6}
          y={innerRadius + 30}
          text={"Remaining"}
          font={smallerFont}
          opacity={opacity}
          color="black"
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