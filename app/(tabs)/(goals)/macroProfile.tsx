import { MacroSetter } from "@/constants/MacroSetter";
import { MultiLineChart } from "@/constants/MultiLineChart";
import { calculateCalories, calculateRawCalories } from "@/constants/NutritionInfo";
import { colors } from "@/constants/theme";
import { macroGoal, macroProfile } from "@/db/schema";
import { useFont } from "@shopify/react-native-skia";
import { sql, eq} from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { View, FlatList, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView} from "react-native";



const chartWidth = 360;
export default function MacroProfile() {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db);
    const { pfId } = useLocalSearchParams();
    const [profile_id, setProfile_id] = useState(pfId ? Number(pfId) : undefined);
    const [name, setName] = useState('');
    const [protein, setProtein] = useState(0);
    const [fat, setFat] = useState(0);
    const [calories, setCalories] = useState(2000);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [scrollEnabled, setScrollEnabled] = useState<boolean>(true);
    const [carbs, setCarbs] = useState(0);
    const font = useFont(require("@/assets/fonts/Metropolis-Medium.ttf"), 18);
    console.log(pfId)
    console.log(profile_id)
    const { data: profileObject } = useLiveQuery(
        drizzleDb.select().from(macroProfile).innerJoin(macroGoal, eq(macroGoal.macro_profile, macroProfile.id))
        .where(sql`${macroProfile.id} = ${Number(profile_id)}`)
        .orderBy(macroGoal.calories)
    , [profile_id, refresh])
    const handleAddGoal = async () => {
        console.log('tmp')
        let tmp = profileObject[0]?.macroProfile
        console.log('tmp')
        if (profile_id == undefined) {
            tmp = (await drizzleDb.insert(macroProfile).values({
                name: name != '' ? name : 'test'
            }).returning())[0]

            setProfile_id(tmp.id)
            console.log('added profile')
        }
        await drizzleDb.insert(macroGoal).values({
            protein: protein,
            fat: fat,
            carbs: carbs,
            calories: calculateCalories({carbs: carbs, fat: fat, protein: protein}, 1),
            macro_profile: tmp.id,
        })
        setRefresh(!refresh)  
    }
     if (!font) {
        return <View />;
      }
    return (
        <ScrollView style={[styles.container]} scrollEnabled={scrollEnabled}>
            {
                profile_id != undefined
                ?   <Text style={styles.h5}>{profileObject[0]?.macroProfile.name}</Text>
                :   <TextInput
                        style={[styles.input, {marginHorizontal: 20, marginTop: 20}]}
                        onChangeText={setName}
                        value={name}
                        placeholder="Macro Profile Name"
                        
                    />
            }
            <View style={[styles.box, styles.barChartContainer]}>
                <MultiLineChart 
                    target={profileObject.map((item) => {
                        return ({calories: item.macroGoal.calories, protein: item.macroGoal.protein, carbs: item.macroGoal.carbs, fat: item.macroGoal.fat})
                    })}
                    chartWidth= {chartWidth}
                    setScrollEnabled={setScrollEnabled}
                />
            </View>
            <View style={styles.box}>
                
                <View style={[styles.rowContainer, {alignItems: 'center'}]}>
                    <Text style={[styles.h3]}>Calories: </Text>
                    <TextInput
                        style={[styles.input, {backgroundColor: colors.background, paddingVertical: 15, paddingHorizontal: 60, marginLeft: 20}]}
                        onChangeText={(inp) => setCalories(Number(inp) ? Number(inp) : 0)}
                        value={calories.toString()}
                        placeholder="calories"
                    />
                </View>
                <View style={{flex: 1, height: 100}}>
                    <MacroSetter 
                        strokeWidth={30}
                        calories={calories}
                        font={font}
                        width={320}
                        setScrollEnabled={setScrollEnabled}
                        setProtein={(inp) => setProtein(inp)}
                        setCarbs={(inp) => setCarbs(inp)}
                        setFat={(inp) => setFat(inp)}
                    />
                </View>
            </View>
            <TouchableOpacity style={[styles.button, styles.centerContainer]} onPress={handleAddGoal}>
                <Text style={styles.h5}>add MacroGoal</Text>
            </TouchableOpacity>
        </ScrollView>
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
        width: chartWidth,
        height: 430,
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
