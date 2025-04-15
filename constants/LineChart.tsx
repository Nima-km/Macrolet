import {
  Canvas,
  Path,
  SkFont,
  Skia,
  Text,
  RoundedRect,
} from "@shopify/react-native-skia";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  useDerivedValue
} from 'react-native-reanimated';
import { Chart } from "./NutritionInfo";



interface LineProgressProps {
  strokeWidth: number;
  backgroundColor?: string;
  mainText?: string;
  target: Chart[];
  barColor?: string;
  progress: number;
  font?: SkFont;
  smallerFont: SkFont;
}