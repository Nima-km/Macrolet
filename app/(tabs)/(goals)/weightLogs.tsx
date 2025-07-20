import { colors } from "@/constants/theme";
import { WeightLogItem, weightType } from "@/constants/WeightLogItem";
import { WeightItem } from "@/db/schema";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { View, StyleSheet, FlatList, Text } from "react-native"




export default function WeightLogs () {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db);

    const {data: weightlogs} = useLiveQuery(
        drizzleDb.select()
        .from(WeightItem)
    )
    const test : weightType = {
        id: 0,
        timestamp: new Date(),
        weight: 0
    }
    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={[styles.h2, {marginBottom: 10}]}>Weight Log</Text>
                {weightlogs &&
                    <FlatList
                        data={weightlogs}
                        renderItem={({index, item}) =>
                            <WeightLogItem id={item.id} timestamp={item.timestamp} weight={item.weight}                                
                            />
                        }
                    />
                }
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
    padding: 10,
    backgroundColor: colors.secondary,
    marginRight: 30,

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