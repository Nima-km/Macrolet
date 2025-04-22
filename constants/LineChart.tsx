import React, { useEffect, useState } from "react";

import {
  Circle,
  DashPathEffect,
  LinearGradient,
  useFont,
  vec,
} from "@shopify/react-native-skia";
import { useColorScheme, View } from "react-native";
import { useDerivedValue, type SharedValue } from "react-native-reanimated";
import { Area, CartesianChart, Line, useChartPressState } from "victory-native";

import { Text as SKText } from "@shopify/react-native-skia";
import { Chart } from "./NutritionInfo";
import { colors } from "./theme";



interface LineProgressProps {
  strokeWidth?: number;
  backgroundColor?: string;
  target: Chart[];
  startDate: Date;
  endDate: Date;
  barColor?: string;
}

const formatDate = (label: number) => {
  const date = new Date(label * 1000)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}-${day}`;
}


export const LineChart: React.FC<LineProgressProps> = ({
  backgroundColor,
  strokeWidth,
  target,
  barColor,
}) => {
  const font = useFont(require("@/assets/fonts/Metropolis-Medium.ttf"), 12);
  const chartFont = useFont(require("@/assets/fonts/Metropolis-Medium.ttf"), 20);
  const { state, isActive } = useChartPressState({ x: 0, y: { y: 0 } });
  //const colorMode = useColorScheme() as COLORMODES;
  const [chartData, setChartData] = useState(target);
  const [days, setDays] = useState(0);

  const value = useDerivedValue(() => {
    return "$" + state.y.y.value.value.toFixed(2);
  }, [state]);
  const buildChart = () => {
    let max: Chart = {y: target?.reduce((prev, current) => (prev && prev.y > current.y) ? prev : current).y,
      x: target?.reduce((prev, current) => (prev && prev.x > current.x) ? prev : current).x
    }
    let min: Chart = {y: target?.reduce((prev, current) => (prev && prev.y < current.y) ? prev : current).y,
      x: target?.reduce((prev, current) => (prev && prev.x < current.x) ? prev : current).x
    }
    const maxDate = (new Date(max.x * 1000)).setHours(0, 0, 0, 1)
    const minDate = (new Date(min.x * 1000)).setHours(0, 0, 0, 1)
    max.x = Number(new Date(maxDate)) / 1000
    min.x = Number(new Date(minDate)) / 1000
    console.log(min.x)
    
    let tmp: Chart[] = []
    let cnt = 0
    for (let i = min.x; i <= max.x; i+= 86400) {
      if (Math.abs(i - target[cnt].x) < 86400) {
        tmp.push({y: (target[cnt].y), x: i})
        cnt++;
      }
      else
        tmp.push({y: 0, x: i})
    }
    setChartData(tmp)
    setDays(tmp.length)
  }
  useEffect(() => {
    buildChart()
    console.log()
    console.log(chartData.map((item) => {return {x: item.x, y: item.y}}))
    console.log(target.map((item) => {return {x: formatDate(item.x), y: item.y}}))
  }, [])
  //console.log(chartData)
  return (
    <View style={{flex: 1}}
    >
      <View style={{flex: 1}}>
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={["y"]}
          domainPadding={{ top: 30}}
          xAxis={{
            font,
            formatXLabel: formatDate,
            tickValues: chartData.map((item) => {return item.x}),
            lineWidth: 0,
          }}
          yAxis={[{
            font,
            tickCount: 5,
            lineWidth: 1,
            linePathEffect: <DashPathEffect intervals={[2, 2] } />
          }]}
          chartPressState={state}
          frame={{
            lineColor: 'black',
            lineWidth: {bottom: 2, left: 2, top: 0, right: 0}
          }}
        >
          {({ points, chartBounds }) => (
            <>
              <Line
                points={points.y}
                color="#7F4DBC"
                strokeWidth={5}
                animate={{ type: "timing", duration: 500 }}
              />
              <Area
                points={points.y}
                y0={chartBounds.bottom}
                animate={{ type: "timing", duration: 500 }}
              >
                <LinearGradient
                  start={vec(chartBounds.bottom, 0)}
                  end={vec(chartBounds.bottom, chartBounds.bottom)}
                  colors={["#9A76C6", "white"]}
                />
              </Area>

              {isActive ? (
                <ToolTip x={state.x.position} y={state.y.y.position} />
              ) : null}
            </>
          )}
        </CartesianChart>
      </View>
    </View>
  );
};

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color={"grey"} opacity={0.8} />;
}