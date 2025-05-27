import { colors } from "@/constants/theme";
import { WeightItem } from "@/db/schema";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { View, FlatList, StyleSheet} from "react-native";





export default function WeightLogs() {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db);
    const {data : weightData} = useLiveQuery(
        drizzleDb.select().from(WeightItem).orderBy(WeightItem.timestamp)
    )
    return (
        <View>
            <FlatList
                data={weightData}
                renderItem={({item, index}) => 
                <View style={styles.box}>
                    
                </View>
                }
            />
        </View>
    )
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
    barChartContainer: {
        width: 320,
        height: 300,
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
