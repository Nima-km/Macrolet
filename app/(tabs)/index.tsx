import { PixelRatio, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../../constants/theme";
import { TouchableOpacity } from "react-native";
import { DonutChart } from "../../constants/DonutChart";
import React from 'react';
import {
  Canvas,
  Path,
  SkFont,
  Skia,
  useFont,
} from "@shopify/react-native-skia";

import { useSharedValue, withTiming, Easing } from "react-native-reanimated";
import { useFocusEffect } from '@react-navigation/native';

const FONT_SIZE = 27
const radius = PixelRatio.roundToNearestPixel(FONT_SIZE * 3);
const STROKE_WIDTH = 16;

export default function Index() {
  const targetPercentage = 85 / 100;
  const progress = useSharedValue(0);

  useFocusEffect(
    React.useCallback(() => {
      // This code runs when the screen is focused
      console.log('Tab is now focused');
      animateChart();

      // Optionally return a cleanup function if needed
      return () => {
        console.log('Tab is unfocused');
      };
    }, [])
  );



  const animateChart = () => {
    progress.value = 0;
    progress.value = withTiming(targetPercentage, {
      duration: 1250,
      easing: Easing.inOut(Easing.cubic),
    });
  };
  


  const font = useFont(require("../../Roboto-Light.ttf"), FONT_SIZE);
  const smallerFont = useFont(require("../../Roboto-Light.ttf"), FONT_SIZE / 2);

  if (!font || !smallerFont) {
    return <View />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text>Today, Nov 30th</Text>
        <View style={styles.ringChartContainer}>
          <DonutChart
            backgroundColor="white"
            radius={radius}
            strokeWidth={STROKE_WIDTH}
            percentageComplete={progress}  // Changed from animationState to progress
            targetPercentage={targetPercentage}
            font={font}
            smallerFont={smallerFont}
          />
          
        </View>
      </View>
      <View style={styles.rowContainer}>
        <View style={[styles.smallBox, styles.box]}>
          <Text>WAIT!</Text>
        </View>
        <View style={[styles.box, styles.smallBox]}>
          <Text>bo o o wo a</Text>
        </View>
      </View>
      <Text style={styles.titleText}>MY NIGGAS</Text>
      <View style={styles.box}>
        <View style={styles.centerContainter}>
          <Text style={styles.smallText}>No Bitches?</Text>
        </View>
        <View style={styles.rowContainer}>
          <TouchableOpacity onPress={animateChart} style={styles.button}>
            <Text style={styles.buttonText}>cut me cock</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={animateChart} style={styles.button}>
            <Text style={styles.buttonText}>cut me balls</Text>
          </TouchableOpacity>
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
  rowContainer: {
    flexDirection: 'row',
  },
  ringChartContainer: {
    width: radius * 2,
    height: radius * 2,
  },
  button: {
    marginTop: 20,
    marginLeft: 15,
    backgroundColor: colors.secondary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
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
    marginHorizontal: 60,
    fontSize: 12,
  },
  box: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginVertical: 20,
    marginHorizontal: 15,
    backgroundColor:colors.primary,
    borderRadius: 4,
    
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