import { PixelRatio, Pressable, StyleSheet, Text, View, FlatList, ScrollView, TextInput} from "react-native";
import { colors, spacing, typography } from "../../../constants/theme";
import { DonutChart } from "../../../constants/DonutChart";
import { useSharedValue, withTiming, Easing } from "react-native-reanimated";
import { useFocusEffect } from '@react-navigation/native';
import {
    Canvas,
    Path,
    SkFont,
    Skia,
    useFont,
  } from "@shopify/react-native-skia";
import React from 'react';

const FONT_SIZE = 18
const radius = PixelRatio.roundToNearestPixel(FONT_SIZE * 3);
const STROKE_WIDTH = 8;

export default function AddFood() {
    const [food, onChangefood] = React.useState('');
    const [servings, onChangeServings] = React.useState('');
    const [meal, onChangeMeal] = React.useState('');
    const [servingSize, onChangeServingSize] = React.useState('');
    const [time, onChangeTime] = React.useState('');

    const progress = useSharedValue(.6);
    const targetPercentage = 60 / 100;
    const font = useFont(require("../../../Roboto-Light.ttf"), FONT_SIZE);
    const smallerFont = useFont(require("../../../Roboto-Light.ttf"), FONT_SIZE / 2);
    
      if (!font || !smallerFont) {
        return <View />;
      }
    return (
        <View style={styles.box}>
            <Text style={styles.smallText}>Quick add</Text>
            <TextInput
                style={styles.input}
                onChangeText={onChangefood}
                value={food}
            />
            <View style={styles.rowContainer}>
                <View>
                    <View style={[styles.box, styles.rowContainer]}>
                        <Text style={styles.smallText}>Meal</Text>
                        <TextInput
                        style={[styles.input, {width: 56, margin: 0, marginHorizontal: 10}]}
                        onChangeText={onChangeMeal}
                        value={meal}
                        /> 
                    </View>
                    <View style={[styles.box, styles.rowContainer]}>
                        <Text style={styles.smallText}>Time</Text>
                        <TextInput
                        style={[styles.input, {width: 56, margin: 0, marginHorizontal: 10}]}
                        onChangeText={onChangeTime}
                        value={time}
                        />
                    </View>
                    <View style={[styles.box, styles.rowContainer]}>
                        <Text style={styles.smallText}>servings</Text>
                        <TextInput
                        style={[styles.input, {width: 56, margin: 0, marginHorizontal: 10}]}
                        onChangeText={onChangeServings}
                        value={servings}
                        />
                    </View>
                    <View style={[styles.box, styles.rowContainer]}>
                        <Text style={styles.smallText}>Serving size</Text>
                        <TextInput
                        style={[styles.input, {width: 56, margin: 0, marginHorizontal: 10}]}
                        onChangeText={onChangeServingSize}
                        value={servingSize}
                        />
                    </View>
                </View>
                <View style={[styles.ringChartContainer]}>
                    <DonutChart
                    font={font}
                    backgroundColor="white"
                    percentageComplete={progress}  // Changed from animationState to progress
                    targetPercentage={targetPercentage}
                    smallerFont={smallerFont}
                    />
                    
                </View>
            </View>
            <View style={[styles.rowContainer]}>
                <View style={[styles.container]}>
                    <Text style={styles.smallText}>Calories</Text>
                    <Text style={styles.smallText}>1234</Text>
                </View>
                <View style={[styles.container]}>
                    <Text style={styles.smallText}>Carbs</Text>
                    <Text style={styles.smallText}>1234</Text>
                </View>
                <View style={[styles.container]}>
                    <Text style={styles.smallText}>Fat</Text>
                    <Text style={styles.smallText}>1234</Text>
                </View>
                <View style={[styles.container]}>
                    <Text style={styles.smallText}>Protein</Text>
                    <Text style={styles.smallText}>1234</Text>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainter: {
        alignItems: "center",
        justifyContent: "center"
    },
    ringChartContainer: {
        width: radius * 2,
        height: radius * 2,
        marginTop: 30
      },
    testContainer: {
        backgroundColor: 'black',
    },
    rowContainer: {
        flexDirection: 'row',
    },
    barChartContainer: {
        width: 320,
        height: 300,
    },
    button: {
        backgroundColor: colors.secondary,
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 10,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 0,
        borderRadius: 10,
        backgroundColor: colors.secondary,
      },
    buttonText: {
        color: "black",
        fontSize: 12,
    },
    titleText: {
        color: "black",
        marginHorizontal: 20,
        fontSize: 20,
    },
    smallText: {
        color: "black",
        marginHorizontal: 0,
        fontSize: 20,
    },
    box: {
        paddingVertical: 0,
        paddingHorizontal: 10,
        marginTop: 10,
        marginRight: 15,
        backgroundColor: colors.primary,
        borderRadius: 4,
        
    },
    constrainedBox: {
        height: 350
    },
    smallBox: {
        width: 180,
        height: 180,
        marginHorizontal: 5,
    },
    item: {
        padding: 10,
        backgroundColor: colors.secondary,
        marginRight: 30,

    },
});
