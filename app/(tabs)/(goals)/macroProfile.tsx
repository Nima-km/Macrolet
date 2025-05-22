import { calculateCalories } from "@/constants/NutritionInfo";
import { colors } from "@/constants/theme";
import { macroGoal, macroProfile } from "@/db/schema";
import { sql, eq} from "drizzle-orm";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { View, FlatList, Text, StyleSheet, TextInput, TouchableOpacity} from "react-native";




export default function MacroProfile() {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db);
    const { pfId } = useLocalSearchParams();
    const [profile_id, setProfile_id] = useState(pfId ? Number(pfId) : undefined);
    const [name, setName] = useState('');
    const [protein, setProtein] = useState(0);
    const [fat, setFat] = useState(0);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [carbs, setCarbs] = useState(0);
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
    return (
        <View style={styles.container}>
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
            <FlatList 
                data={profileObject}
                renderItem={({item, index}) => 
                    <View style={styles.rowContainer}>
                        <Text style={[styles.h5, {margin: 6}]}>calories: {item.macroGoal.calories}</Text>
                        <Text style={[styles.h5, {margin: 6}]}>protein: {item.macroGoal.protein}</Text>
                        <Text style={[styles.h5, {margin: 6}]}>carbs: {item.macroGoal.carbs}</Text>
                        <Text style={[styles.h5, {margin: 6}]}>fat: {item.macroGoal.fat}</Text> 
                    </View>
                }
                scrollEnabled={false}
                style={[{maxHeight: 300}]}
                extraData={refresh}
            />
            <View style={[styles.box, styles.rowContainer ,{margin: 20}]}>
                <View style={{marginHorizontal: 10}}>
                    <Text style={styles.h5}>calories</Text>
                    <Text style={[{marginTop: 20}]}>
                        {calculateCalories({carbs: carbs, fat: fat, protein: protein}, 1)}
                    </Text>
                </View>
                <View style={{marginHorizontal: 10}}>
                    <Text style={styles.h5}>protein</Text>
                    <TextInput
                        style={[styles.input, {marginTop: 20, backgroundColor: colors.background}]}
                        onChangeText={(inp) => setProtein(Number(inp) ? Number(inp) : 0)}
                        value={protein.toString()}
                        placeholder="calories"
                    />
                </View>
                <View style={{marginHorizontal: 10}}>
                    <Text style={styles.h5}>carbs</Text>
                    <TextInput
                        style={[styles.input, {marginTop: 20, backgroundColor: colors.background}]}
                        onChangeText={(inp) => setCarbs(Number(inp) ? Number(inp) : 0)}
                        value={carbs.toString()}
                        placeholder="calories"
                    />
                </View>
                <View style={{marginHorizontal: 10}}>
                    <Text style={styles.h5}>fat</Text>
                    <TextInput
                        style={[styles.input, {marginTop: 20, backgroundColor: colors.background}]}
                        onChangeText={(inp) => setFat(Number(inp) ? Number(inp) : 0)}
                        value={fat.toString()}
                        placeholder="calories"
                    />
                </View>
                
            </View>
            <TouchableOpacity style={[styles.button, styles.centerContainer]} onPress={handleAddGoal}>
                <Text style={styles.h5}>add MacroGoal</Text>
            </TouchableOpacity>
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
