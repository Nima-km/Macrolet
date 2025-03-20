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
  smallerFont: SkFont;
  targetPercentage: number;
}




export const DonutChart: React.FC<CircularProgressProps> = ({
  font,
  targetPercentage,
  smallerFont,
}) => {
  const percentageComplete = useSharedValue(0);
  const animateChart = () => {
    percentageComplete.value = 0;
    percentageComplete.value = withTiming(targetPercentage, {
      duration: 1250,
      easing: Easing.inOut(Easing.cubic),
    });
  };
  const font_size = font.getSize()
  const radius = PixelRatio.roundToNearestPixel(font_size * 3);
  const STROKE_WIDTH = Math.min(font_size * 1, 16);
  const innerRadius = radius - STROKE_WIDTH / 2;
  const targetText = `${targetPercentage * 100}`;
  

 // const font = useFont(require("../Roboto-Light.ttf"), FONT_SIZE);
  font.setSize(font.getSize())
  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);

  if (!font || !smallerFont) {
    return <View />;
  }

  smallerFont.setSize(font.getSize() * .6)
  const matrix = Skia.Matrix();
  matrix.translate(radius, radius);
  matrix.rotate(-Math.PI / 2);
  matrix.translate(-radius, -radius);
  path.transform(matrix);

  // Using Reanimated's derived values directly
  const end = useDerivedValue(() => percentageComplete.value);
  const opacity = useDerivedValue(() => percentageComplete.value);
  const width = font.getTextWidth(targetText) - 10;
  const titleWidth = smallerFont.getTextWidth("Power");

  useEffect(() => {
    animateChart()
  }, [])

  return (
    <View style={styles.container}>
      <Canvas style={styles.container}>
        <Path
          path={path}
          color={colors.secondary}
          style="stroke"
          strokeJoin="round"
          strokeWidth={STROKE_WIDTH}
          strokeCap="round"
          start={0}
          end={end}
        />
        <Text
          x={innerRadius - width / 2}
          y={innerRadius }
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