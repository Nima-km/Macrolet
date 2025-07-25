
import { Share, StyleSheet, View, Text } from "react-native";

import { Svg, Circle, Text as SVGText, Rect, Path } from 'react-native-svg'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  useDerivedValue
} from 'react-native-reanimated';
import React, { useEffect } from "react";
import { colors } from "./theme";

const width = 45
  const height = 53

interface BarProgressProps {
  strokeWidth: number;
  backgroundColor?: string;
  mainText: string;
  target: number;
  barColor?: string;
  progress: number;
  textColor: string;
  enabled: boolean;
}

export const ProgressBox: React.FC<BarProgressProps> = ({
    backgroundColor,
    strokeWidth,
    target,
    mainText,
    barColor,
    textColor, 
    progress,
    enabled
}) => {
    if (!target)
        target = 0;
  
  
  const end = (Math.min((progress / target), 1));
  const goalText = (mainText.slice(8));
  useEffect(() => {
    console.log("progress", progress / target)
  }, [target, progress])
  return (
      <View style={[styles.container]}>
        <Svg width={width} height={height}>
          
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            
            strokeWidth={strokeWidth}
            fill={backgroundColor}
            rx={10}
            ry={10}
          />
          <Rect
            x={0}
            y={0}
            height={width - strokeWidth * 2}
            width={height - strokeWidth * 2}
            
            strokeWidth={strokeWidth}
            rx={7}
            ry={7}
            stroke={barColor}
            fill="none"
            strokeDasharray={`${144} ${144}`}
            strokeDashoffset={144 * Math.max(1 - progress / target, 0)}
            strokeLinecap="round"
            transform={`rotate(-270, ${height/2 - 9.1}, ${width/2 - 0.1})`}
          />
          {enabled == false && 
            <Path
                d={`M5 5 L${width - 5} ${height - 5} M5 ${height - 5} L${width - 5} 5`}
                strokeWidth={4}
                stroke="red"
            />
            }
        </Svg>
        <Text
            style={[styles.h5, { position: 'absolute', color: textColor }]}
          >
            {goalText}
          </Text>
      </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
  // maxWidth: 40,
    height: height,
    width: width,
    //padding: 20,
    borderRadius: 10,
    marginHorizontal: 1,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  h5: {
    fontFamily: 'Metro-SemiBold',
    fontSize: 17,
  },
});