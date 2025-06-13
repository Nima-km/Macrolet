import { useWindowDimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { clamp, useAnimatedStyle, useSharedValue } from "react-native-reanimated";

interface LineProgressProps {
  strokeWidth: number;
  setProtein: () => number;
  setFat: () => number;
  setCarbs: () => number;
}


export const MacroSetter : React.FC<LineProgressProps> = ({
    strokeWidth,
  setProtein,
  setFat,
  setCarbs,
}) => {
    const {height, width} = useWindowDimensions();
    const translationX = useSharedValue(0);
    const translationY = useSharedValue(0);
    const prevTranslationX = useSharedValue(0);
    const prevTranslationY = useSharedValue(0);
    const pan = Gesture.Pan()
    .minDistance(1)
    .onStart((e) => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      const maxTranslateX = width / 2 - 50;
      const maxTranslateY = height / 2 - 50;

      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        -maxTranslateX,
        maxTranslateX
      );
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY
      );
    })
    .runOnJS(true);
    const animatedStyles = useAnimatedStyle(() => ({
        transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
        ],
    }));
    return (
        <View style={styles.container}>
            <GestureDetector gesture={pan}>
                <Animated.View style={[animatedStyles, styles.box]}></Animated.View>
            </GestureDetector>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: '#b58df1',
    borderRadius: 20,
  },
});