import { View, StyleSheet, Text} from "react-native";
import { colors } from "./theme";


export type weightType = {
    id: number;
    timestamp: Date;
    weight: number;
    

}

export const WeightLogItem = (item: weightType) => {
    return (
        <View style={styles.item}>
            <View style={[styles.flexRowContainer, {justifyContent: 'space-between'}]}>
                <View>
                    <Text>
                        {item.timestamp.toDateString().slice(4)}
                    </Text>
                    <Text style={{marginTop: 10}}>
                        {item.timestamp.getHours()}:{item.timestamp.getMinutes().toString().padStart(2, '0')}
                    </Text>
                </View>
                <Text style={[styles.h1, {marginTop: 10}]}>
                    {item.weight}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  testContainer: {
    backgroundColor: 'red'
  },
  centerContainter: {
    alignItems: "center",
    justifyContent: "center"
  },
  flexRowContainer: {
    flexDirection: 'row',
   // justifyContent: 'space-between'
  },
  barChartContainer: {
    flex: 1,
    minHeight: 220,
  },
  button: {
    marginTop: 20,
    marginLeft: 15,
    backgroundColor: colors.secondary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
  },
  box: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginVertical: 20,
    marginHorizontal: 20,
    backgroundColor:colors.primary,
    borderRadius: 10,
    
  },
  smallBox: {
    width: 180,
    height: 180,
    marginHorizontal: 5,
  },
  item: {
    backgroundColor: colors.box,
    paddingVertical: 10,
    paddingHorizontal: 17,
    marginVertical: 7.5,
    borderRadius: 8,
  },
  h1: {
    fontFamily: 'Geist',
    fontWeight: 'semibold',
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