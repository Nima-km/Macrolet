import { Canvas, Circle, Fill, RoundedRect, SkFont, Text } from "@shopify/react-native-skia";
import { useWindowDimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { clamp, runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue } from "react-native-reanimated";
import { colors } from "./theme";
import { useEffect } from "react";

interface LineProgressProps {
  strokeWidth: number;
  width: number;
  calories: number;
  font: SkFont;
  setProtein: (inp: number) => void;
  setScrollEnabled: (inp: boolean) => void;
  setFat: (inp: number) => void;
  setCarbs: (inp: number) => void;
}


export const MacroSetter : React.FC<LineProgressProps> = ({
    strokeWidth,
    calories,
    width,
    font,
    setProtein,
    setFat,
    setCarbs,
    setScrollEnabled,
}) => {
    const translationKnob1 = useSharedValue(20);
    const prevTranslationKnob1 = useSharedValue(20);
    const translationKnob2 = useSharedValue(50);
    const prevTranslationKnob2 = useSharedValue(50);
    const percent1 = useSharedValue(0);
    const percent2 = useSharedValue(0);
   // console.log('height', height)
    const endProtein = useDerivedValue(() => translationKnob1.value + 15)
    const endCarb = useDerivedValue(() => translationKnob2.value + 15)

    const proteinPercent = useDerivedValue(() => percent1.value)
    const carbPercent = useDerivedValue(() => percent2.value - percent1.value)
    const fatPercent = useDerivedValue(() => 1 - percent2.value)

    const proteinGram = useDerivedValue(() => ((proteinPercent.value * calories) / 4))
    const carbGram = useDerivedValue(() => ((carbPercent.value * calories) / 4))
    const fatGram = useDerivedValue(() => ((fatPercent.value * calories) / 9))

    const proteinText = useDerivedValue(() => Math.round(proteinGram.value).toString())
    const carbText = useDerivedValue(() => Math.round(carbGram.value).toString())
    const fatText = useDerivedValue(() => Math.round(fatGram.value).toString())
    const pan1 = Gesture.Pan()
    .onStart((e) => {
        runOnJS(setScrollEnabled)(false)
        prevTranslationKnob1.value = translationKnob1.value;
    })
    .onUpdate((event) => {
        const maxTranslateX = translationKnob2.value - 10;
        translationKnob1.value = clamp(
            prevTranslationKnob1.value + event.translationX,
            0,
            maxTranslateX
        );
        percent1.value = (translationKnob1.value / width)
    })
    .onEnd(() => {
        prevTranslationKnob1.value = translationKnob1.value;
        runOnJS(setScrollEnabled)(true)
        runOnJS(setCarbs)((carbGram.value))
        runOnJS(setFat)((fatGram.value))
        runOnJS(setProtein)((proteinGram.value))
        //console.log('total', proteinPercent.value + carbPercent.value + fatPercent.value)
    })
    const pan2 = Gesture.Pan()
    .onStart((e) => {
        runOnJS(setScrollEnabled)(false)
        prevTranslationKnob2.value = translationKnob2.value;
    })
    .onUpdate((event) => {
        const maxTranslateX = width;
        translationKnob2.value = clamp(
            prevTranslationKnob2.value + event.translationX,
            translationKnob1.value + 10,
            maxTranslateX
        );
        percent2.value = (translationKnob2.value / width)
       
    })
    .onEnd(() => {
        prevTranslationKnob2.value = translationKnob2.value;
        runOnJS(setScrollEnabled)(true)
        runOnJS(setCarbs)((carbGram.value))
        runOnJS(setFat)((fatGram.value))
        runOnJS(setProtein)((proteinGram.value))
        //console.log('total', proteinPercent.value + carbPercent.value + fatPercent.value)
    })
    useEffect(() => {
        percent1.value = (translationKnob1.value / width)
        percent2.value = (translationKnob2.value / width)
    }, [])
    
    
    const animatedKnob1 = useAnimatedStyle(() => ({
        transform: [
        { translateX: translationKnob1.value },
        ],
    }));
    const animatedKnob2 = useAnimatedStyle(() => ({
        transform: [
        { translateX: translationKnob2.value },
        ],
    }));
    return (
        <GestureHandlerRootView style={styles.container}>
            <Canvas style={{ flex: 1 }}>
                <RoundedRect x={0} y={0} width={width+10} height={strokeWidth} r={10} color={colors.fat}/>
                <RoundedRect x={0} y={0} width={endCarb} height={strokeWidth} r={10} color={colors.carbs}/>
                <RoundedRect x={0} y={0} width={endProtein} height={strokeWidth} r={10} color={colors.protein}/>

                <RoundedRect x={15} y={45} width={12} height={22} r={10} color={colors.protein}/>
                <RoundedRect x={width - 80} y={45} width={12} height={22} r={10} color={colors.fat}/>
                <RoundedRect x={width / 2 - 27} y={45} width={12} height={22} r={10} color={colors.carbs}/>
                <Text
                    text={proteinText}
                    font={font}
                    x={50}
                    y={90}
                />
                <Text
                    text={carbText}
                    font={font}
                    x={width / 2}
                    y={90}
                />
                <Text
                    text={fatText}
                    font={font}
                    x={width - 60}
                    y={90}
                />
                <Text
                    text='Protein'
                    font={font}
                    x={34}
                    y={60}
                />
                <Text
                    text='Carbs'
                    font={font}
                    x={width / 2 - 10}
                    y={60}
                />
                <Text
                    text='Fat'
                    font={font}
                    x={width - 60}
                    y={60}
                />
            </Canvas>
            <GestureDetector gesture={pan1}>
                <Animated.View style={[animatedKnob1, styles.knob, {backgroundColor: 'blue', height: strokeWidth}]}></Animated.View>
            </GestureDetector>
            <GestureDetector gesture={pan2}>
                <Animated.View style={[animatedKnob2, styles.knob, {backgroundColor: 'blue', height: strokeWidth}]}></Animated.View>
            </GestureDetector>

        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    // alignItems: 'center',
        //justifyContent: 'center',
    },
    rowContainer: {
        flexDirection: 'row',
    },
    knob: {
        position: "absolute",
        width: 16,
        backgroundColor: '#b58df1',
        borderRadius: 20,
    },
    bar: {
        height: 20,
        width: 50,
        backgroundColor: 'blue',
        borderRadius: 20,
    },
});