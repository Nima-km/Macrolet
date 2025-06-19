import React, { useEffect, useRef, useState } from "react";

import {
  Circle,
  DashPathEffect,
  LinearGradient,
  useFont,
  Line as SkiaLine,
  vec,
  RoundedRect,
  Canvas,
} from "@shopify/react-native-skia";
import { useColorScheme, View, StyleSheet, Text } from "react-native";
import { runOnJS, useDerivedValue, useSharedValue, type SharedValue } from "react-native-reanimated";
import { Area, CartesianActionsHandle, CartesianChart, Line, useChartPressState } from "victory-native";

import { Text as SKText } from "@shopify/react-native-skia";

import { colors } from "./theme";
import { NutritionInfo, NutritionInfoFull } from "./NutritionInfo";
import { Gesture } from "react-native-gesture-handler";
import { findMiddleMacro } from "./AutoCalorieCalculator";





interface LineProgressProps {
  strokeWidth?: number
  setScrollEnabled: (inp: boolean) => void
  chartWidth: number
  backgroundColor?: string
  target: NutritionInfoFull[]
  barColor?: string
}

const formatCalorie = (label: number) => {
  
  return `${label}cal`;
}
const formatMacro = (label: number) => {
  
  return `${label}g`;
}

type chartCord = {
  value: SharedValue<number>;
  position: SharedValue<number>;
}

export const MultiLineChart: React.FC<LineProgressProps> = ({
  backgroundColor,
  strokeWidth,
  target,
  setScrollEnabled,
  barColor,
  chartWidth,
}) => {
  const font = useFont(require("@/assets/fonts/Metropolis-Medium.ttf"), 12);
  const chartFont = useFont(require("@/assets/fonts/Metropolis-Medium.ttf"), 20);
  const { state, isActive } = useChartPressState({ x: 0, y: { protein: 0, carbs: 0, fat: 0 } });
  const touchX = useSharedValue(0);
  const touchY = useSharedValue(0);
  const isTouching = useSharedValue(false);
  //const colorMode = useColorScheme() as COLORMODES;
  const [chartData, setChartData] = useState(target);
  const [days, setDays] = useState(0);
  const [maxMacro, setMaxMacro] = useState(0);

  const setClosestY = (x: number) => {
    const calories = (x - 33) / 288 * (target[target.length - 1].calories - target[0].calories) + target[0].calories
    
    const isLargeNumber = (element: NutritionInfo) => (element.calories ? element.calories : 0) >= calories;
    const index = target.findIndex(isLargeNumber)
    let goal : NutritionInfoFull = {
      protein: 0,
      fat: 0,
      carbs: 0,
      calories: 0
    }
    if (index == -1) {
      goal = target[target.length - 1] 
    }
    else if (target[index]?.calories == calories || index == 0)
      goal = target[index]
    else
      goal = findMiddleMacro(target[index - 1], target[index], calories)
    console.log(goal)
    state.x.position.value = x;
    state.y.protein.position.value = 240 - (goal.protein / maxMacro) * 240
    state.y.protein.value.value = goal.protein

    state.y.carbs.position.value = 240 - (goal.carbs / maxMacro) * 240
    state.y.carbs.value.value = goal.carbs
    state.y.fat.position.value = 240 - (goal.fat / maxMacro) * 240
    state.y.fat.value.value = goal.fat

   // return goal
  }
  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      runOnJS(setScrollEnabled)(false)
      runOnJS(setClosestY)(event.x)
      touchY.value = event.y;
      touchX.value = event.x;
      isTouching.value = true;
      state.isActive.value = true
    })
    .onUpdate((event) => {
      runOnJS(setClosestY)(event.x)
      touchX.value = event.x;
      touchY.value = event.y;
    })
    .onEnd(() => {
      isTouching.value = false;
      state.isActive.value = false
      runOnJS(setScrollEnabled)(true)
    })
    .onFinalize(() => {
        isTouching.value = false;
        state.isActive.value = false
    });
  const composedGesture = Gesture.Race(panGesture);
  const valueCarbs = useDerivedValue(() => {
    return  "Carbs: " + state.y.carbs.value.value.toFixed(0) + "g";
  }, [state]);
  const valueFat = useDerivedValue(() => {
    return "Fat: " + state.y.fat.value.value.toFixed(0) + 'g';
  }, [state]);
  const valueProtein = useDerivedValue(() => {
    return "Protein: " + state.y.protein.value.value.toFixed(0) + 'g';
  }, [state]);
  const valueCalories = useDerivedValue(() => {
    return ((state.x.position.value - 33) / 288 * (target[target.length - 1]?.calories - target[0]?.calories) + target[0]?.calories).toFixed(0);
  }, [state, target]);
  const buildChart = () => {
    
  }
  useEffect(() => {
      console.log('sup', state.x.position.value)
  }, [touchX, state])
  useEffect(() => {
    let tmp = 0
    for (let i = 0; i < target.length; i++) {
      tmp = Math.max(tmp, target[i].carbs, target[i].fat, target[i].protein)
    }
    console.log('len', Math.ceil(tmp / 20) * 20)
    setMaxMacro(Math.ceil(tmp / 20) * 20)
  }, [target])
  //console.log(chartData)
  return (
    <View style={{flex: 1}}
    >
      <View style={{flex: 1}}>
        <Canvas style={[{flex: .5}]}>
          <RoundedRect x={0} y={0} height={100} width={100} color={colors.background} r={10}/>
          <SKText x={10} y={20} text={valueCalories} font={font}/>
          <SKText x={10} y={20 + (font ? font?.getSize() : 0) + 10} text={valueProtein} font={font}/>
          <SKText x={10} y={20 + 2 * ((font ? font?.getSize() : 0) + 10)} text={valueCarbs} font={font}/>
          <SKText x={10} y={20 + 3 * ((font ? font?.getSize() : 0) + 10)} text={valueFat} font={font}/>
        </Canvas>
        <CartesianChart
          data={target}
          xKey="calories"
          yKeys={["protein", "carbs", "fat"]}
          domainPadding={{ top: 0}}
          xAxis={{
            font,
            formatXLabel: formatCalorie,
            //tickValues: target.map((item) => {return Number(item.calories)}),
           // tickCount: 5,
            lineWidth: 0,
          }}
          yAxis={[{
            font,
            //tickCount: 8,
            formatYLabel: formatMacro,
            lineWidth: 1,
            linePathEffect: <DashPathEffect intervals={[2, 2] } />
          }]}
          customGestures={composedGesture}
         // chartPressState={state}
          
          frame={{
            lineColor: 'black',
            lineWidth: {bottom: 2, left: 2, top: 0, right: 0},

          }}
        >
          {({ points, chartBounds }) => (
            <>
              <Line
                points={points.carbs}
                color={colors.carbs}
                strokeWidth={5}
                animate={{ type: "timing", duration: 500 }}
              />
              <Line
                points={points.fat}
                color={colors.fat}
                strokeWidth={5}
                animate={{ type: "timing", duration: 500 }}
              />
              <Line
                points={points.protein}
                color={colors.protein}
                strokeWidth={5}
                animate={{ type: "timing", duration: 500 }}
              />
              

              {isActive ? (
                <ToolTip x={state.x.position} carbs={state.y.carbs} fat={state.y.fat} protein={state.y.protein}/>
              ) : null}
            </>
          )}
        </CartesianChart>
      </View>
    </View>
  );
};

function ToolTip({ x, carbs, fat, protein }: { x: SharedValue<number>; carbs: chartCord; fat: chartCord; protein: chartCord }) {
  const font = useFont(require("@/assets/fonts/Metropolis-Medium.ttf"), 12);
  const carbsText = useDerivedValue(() => (Math.round(carbs.value.value).toString() + 'g'))
  const fatText = useDerivedValue(() => (Math.round(fat.value.value).toString() + 'g'))
  const proteinText = useDerivedValue(() => (Math.round(protein.value.value).toString() + 'g'))
  const p1 = useDerivedValue(() => ({x: x.value, y: 0}))
  const p2 = useDerivedValue(() => ({x: x.value, y: 350}))
  return (
    <>
      <SkiaLine  
        p1={p1}
        p2={p2}
        color="black"
        style="fill"
        dither={true}
        strokeWidth={1}
      >
        <DashPathEffect intervals={[2, 2]} phase={0} />

      </SkiaLine>
      
      <Circle cx={x} cy={protein.position} r={7} color={colors.protein} style='fill' />
      <Circle cx={x} cy={protein.position} r={3} color={"white"} />
      <Circle cx={x} cy={fat.position} r={7} color={colors.fat} style='fill' />
      <Circle cx={x} cy={fat.position} r={3} color={"white"}/>
      <Circle cx={x} cy={carbs.position} r={7} color={colors.carbs} style='fill' />
      <Circle cx={x} cy={carbs.position} r={3} color={"white"} />

    </>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    text: {
        marginHorizontal: 20,
        marginVertical: 20,
    },
    centerContainer: {
        alignItems: "center",
        justifyContent: "center"
    },
    rowContainer: {
        flexDirection: 'row',
    },
    
    input: {
        backgroundColor: colors.primary,
        borderRadius: 10,
        padding: 5,
        textAlign: 'center'
        //marginVertical: 10,
    },
    buttonMain: {
        backgroundColor: colors.button,
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 10,
    },
    buttonSub: {
        backgroundColor: colors.primary,
        borderColor: colors.button,
        borderWidth:2,
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 10,
    },
    button: {
        backgroundColor: colors.primary,
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 10,
        margin: 20,
    },
    box: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginTop: 10,
        marginHorizontal: 20,
        backgroundColor: colors.primary,
        borderRadius: 10,
    },
    boxColorless: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginTop: 10,
        marginHorizontal: 15,
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
    h1: {
        fontFamily: 'Geist',
        fontWeight: '600',
        fontSize: 28,
    },
    h2: {
        fontFamily: 'Geist',
        fontWeight: '800',
        fontSize: 22,
    },
    h3: {
        fontFamily: 'Metro-Medium',
        fontSize: 20,
    },
    h4: {
        fontFamily: 'Metro-Medium',
        fontSize: 18  ,
    },
    h5: {
        fontFamily: 'Metro-SemiBold',
        fontSize: 17,
    },
    h6: {
        fontFamily: 'Metro-Regular',
        fontSize: 16,
    },
    h7: {
        fontFamily: 'Metro-Bold',
        fontSize: 18,
    },
    h8: {
        fontFamily: 'Metro-Regular',
        fontSize: 14,
    },
});
