import {
    Canvas,
    Path,
    SkFont,
    Skia,
    Text,
  } from "@shopify/react-native-skia";
import { StyleSheet, View } from "react-native";
import { useDerivedValue, SharedValue } from "react-native-reanimated";
import { } from "react-native-reanimated";
import { colors, spacing, typography } from "./theme";
  
interface CircularProgressProps {
  strokeWidth: number;
  radius: number;
  backgroundColor: string;
  percentageComplete: SharedValue<number>;
  font: SkFont;
  smallerFont: SkFont;
  targetPercentage: number;
}

export const DonutChart: React.FC<CircularProgressProps> = ({
  strokeWidth,
  radius,
  percentageComplete,
  font,
  targetPercentage,
  smallerFont,
}) => {
  const innerRadius = radius - strokeWidth / 2;
  const targetText = `${targetPercentage * 100}`;

  const path = Skia.Path.Make();
  path.addCircle(radius, radius, innerRadius);

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

  return (
    <View style={styles.container}>
      <Canvas style={styles.container}>
        <Path
          path={path}
          color={colors.secondary}
          style="stroke"
          strokeJoin="round"
          strokeWidth={strokeWidth}
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