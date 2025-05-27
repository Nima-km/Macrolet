import { autoCalorie, MaintenanceCalories, WeighIn } from "@/constants/AutoCalorieCalculator";
import { BarMacroChart } from "@/constants/BarMacroChart";
import { assignNutrition, calculateCalories, NutritionInfo, NutritionInfoFull } from "@/constants/NutritionInfo";
import RadioButton from "@/constants/selector";
import { colors } from "@/constants/theme";
import { food, foodItem, macroGoal, macroProfile, nutritionGoal, WeightItem } from "@/db/schema";
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { and, desc, eq, gte, inArray, lt, notInArray, sql } from "drizzle-orm";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { timestamp } from "drizzle-orm/gel-core";
import { Link } from "expo-router";



type nutriDate = {
    enabled: boolean
    protein: number
    carbs: number
    fat: number
    timestamp: string
}
export default function nutritionGoals() {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [weightChange, setWeightChange] = useState('')
    const [sumNutrition, setSumNutrition] = useState<NutritionInfo>({carbs: 200, fat: 80, protein: 190});
    const [calories, setCalories] = useState(2000)
    const [proteinMult, setProteinMult] = useState(.4)
    const [dietOption, setDietOption] = useState(1)
    const [macro_profile_id, setMacro_profile_id] = useState(0)
    const [autoIntake, setAutoIntake] = useState(false)
    const [calorieIntake, setCalorieIntake] = useState<nutriDate[]>([])
    const [dates, setDates] = useState<Date[]>([])
    const { data: macroProfileList } = useLiveQuery(
        drizzleDb.select()
        .from(macroProfile)
        )

    const bw = 165
    const height = 180
    const WeightOptions = [
        { label: 'Gain', value: 1 },
        { label: 'Lose', value: -1 },
    ];
    const AutoCalorie = [
        { label: 'Manual', value: 0 },
        { label: 'Auto', value: 1 },
    ];
    const ProteinOptions = [
        { label: 'Min', value: .4 },
        { label: 'Moderate', value: .7 },
        { label: 'Max', value: 1 },
    ];
    const formatDate = (item: Date) => {
        return `${item.getFullYear()}-${(item.getMonth() + 1).toString().padStart(2, "0")}-${(item.getDate()).toString().padStart(2, "0")}`
    }
    const handleSelectProtein = (selectedValue: number) => {
        console.log('SelectedProtein:', selectedValue);
        setMacro_profile_id(0)
        setProteinMult(selectedValue)
        const goal = assignNutrition(calories + Number(weightChange) * 500 * dietOption, bw, height, selectedValue)
        setSumNutrition(goal)
        console.log(sumNutrition)
    // Handle the selection here
    };
    const handleAddGoal = async () => {
        await drizzleDb.insert(nutritionGoal).values(
            {calories: sumNutrition.calories, 
            carbs: sumNutrition.carbs, 
            fat: sumNutrition.fat,
            protein: sumNutrition.protein
            })
        console.log('new macros Set', sumNutrition)
    }
    const FetchMacroProfile = async (profile_id : number) => {
        setMacro_profile_id(profile_id)
        const macro_profile : NutritionInfoFull[]= await drizzleDb.select({
            fat: macroGoal.fat,
            carbs: macroGoal.carbs,
            protein: macroGoal.protein,
            calories: macroGoal.calories,
        }).from(macroProfile).innerJoin(macroGoal, eq(macroGoal.macro_profile, macroProfile.id)).where(eq(macroProfile.id, profile_id))
        console.log('macro profile', macro_profile)
        const macro_goal = autoCalorie({
            macro_profile: macro_profile, 
            calories: calculateCalories(sumNutrition, 1), 
            })
        if (macro_goal != "OUT OF BOUNDS"){
            setSumNutrition(macro_goal)
        }
        else
            console.log(macro_goal)
    }
    const FetchIntake = async () => {
        const tmpDate = new Date()
        tmpDate.setDate(tmpDate.getDate() - 14)
        const intake : nutriDate[] = await drizzleDb.select({
            fat: sql<number>`sum(${food.fat} * ${foodItem.servings} * ${foodItem.serving_mult})`,
            carbs: sql<number>`sum(${food.carbs} * ${foodItem.servings}* ${foodItem.serving_mult})`,
            protein: sql<number>`sum(${food.protein} * ${foodItem.servings}* ${foodItem.serving_mult})`,
            timestamp: sql<string>`strftime('%F', ${foodItem.timestamp}, 'unixepoch', 'localtime')`,
            enabled: sql<boolean>`${true}`
        })
        .from(foodItem).innerJoin(food, eq(foodItem.food_id, food.id))
        .where(gte(foodItem.timestamp, tmpDate))
        .groupBy(sql<string>`strftime('%F', ${foodItem.timestamp}, 'unixepoch', 'localtime')`)
        .orderBy(foodItem.timestamp)
        const tstIntake : nutriDate[] = await drizzleDb.select({
            fat: sql<number>`sum(${food.fat} * ${foodItem.servings} * ${foodItem.serving_mult})`,
          // name: sql<string>`(${food.name})`,
            carbs: sql<number>`sum(${food.carbs} * ${foodItem.servings}* ${foodItem.serving_mult})`,
            protein: sql<number>`sum(${food.protein} * ${foodItem.servings}* ${foodItem.serving_mult})`,
            timestamp: sql<string>`strftime('%s', ${foodItem.timestamp}, 'unixepoch')`,
            enabled: sql<boolean>`${true}`
        })
        .from(foodItem).innerJoin(food, eq(foodItem.food_id, food.id))
        .where(eq(sql<string>`strftime('%Y-%m-%d', ${foodItem.timestamp}, 'unixepoch', 'localtime')`, "2025-05-26"))
        .orderBy(foodItem.timestamp)
        console.log('i like boobs', tstIntake)
        //setCalorieIntake(intake)
        return intake
    }
    const FetchWeight = async () => {
        const tmpDate = new Date()
        tmpDate.setDate(tmpDate.getDate() - 14)
        const weight : WeighIn[] = await drizzleDb.select()
            .from(WeightItem)
            .where(gte(WeightItem.timestamp, tmpDate))
        return weight
    }
    const handleSelectIntake = (selectedValue: number) => {
        console.log('SelectedIntake:', selectedValue);
        
        setDietOption(selectedValue)
    };
    const handleAutoIntake = async (selectedValue: number) => {
        console.log('AutoIntake:', selectedValue);
        if (selectedValue == 1){
            const tmpin = calorieIntake.filter((item) => item.enabled == true)
            const tmpw = await FetchWeight()
            console.log('weigh_in', tmpw)
            console.log('Intake', tmpin)
            const maintenance = MaintenanceCalories({calorie_intake: tmpin, weigh_in: tmpw})
            if (maintenance != "WEIGHT NOT LOGGED")
                setCalories(maintenance)
            else
                console.log(maintenance)
            console.log(calories)
        }
        setAutoIntake(selectedValue == 1)
    };
    const setupIntakeDate = async () => {
        const calint = await FetchIntake()
        let cnt = 0
        const tday = new Date()
        const tmpDate = new Date()
        tmpDate.setDate(tday.getDate() - 14)
        console.log('dateFormat', formatDate(tmpDate))
        let res : nutriDate[] = []
        for (let i = tmpDate; i < tday; i.setDate(i.getDate() + 1)) {
            if (calint[cnt].timestamp === formatDate(i)){
                res.push(calint[cnt])
                if (cnt < calint.length - 1)
                    cnt++
            }
            else
               // console.log("did not find it", `${formatDate(i)} ${calint[cnt].timestamp}`)
                res.push({carbs: 0, fat: 0, protein: 0, timestamp: formatDate(i), enabled: true})
        }
        //console.log('res', res)
        setCalorieIntake(res)
    }

    const modifyDateList = (index: number) => {
        let newList = calorieIntake
        newList[index].enabled = !newList[index].enabled
        setCalorieIntake(newList)
        setRefresh(!refresh)
    }
    useEffect(() => {
        const goal = assignNutrition(calories + Number(weightChange) * 500 * dietOption, bw, height, proteinMult)
        setSumNutrition(goal)
        setupIntakeDate()
    }, [])
    useEffect(() => {
        const goal = assignNutrition(calories + Number(weightChange) * 500 * dietOption, bw, height, proteinMult)
        setSumNutrition(goal)
    }, [dietOption, weightChange])
    useEffect(() => {
        if (macro_profile_id == 0){
            const goal = assignNutrition(calories + Number(weightChange) * 500 * dietOption, bw, height, proteinMult)
            setSumNutrition(goal)
        }
    }, [calories])
    useEffect(() => {
        handleAutoIntake(Number(autoIntake))
    }, [refresh])

    return (
        <ScrollView style={styles.container}>
            <Text style={[styles.h1, styles.text]}>Nutrition Calculator</Text>
            <View style={styles.box}>
                <Text style={[styles.h3, {marginBottom: 20}]}>Basic Settings</Text>
                <Text style={[styles.h3]}>Weekly Weight Change</Text>
                <View style={[styles.rowContainer]}>
                    <RadioButton options={WeightOptions} onSelect={handleSelectIntake}/>
                    <TextInput
                        style={[styles.input, {marginLeft:10, flex: .5,}]}
                        onChangeText={setWeightChange}
                        value={weightChange}
                        keyboardType="numeric"
                        placeholder="0.2 lbs"
                        
                    />
                </View>
                <Text style={[styles.h3, {marginTop: 20}]}>Set protein intake</Text>
                <View style={[styles.rowContainer]}>
                    <RadioButton options={ProteinOptions} onSelect={handleSelectProtein}/>
                </View>
                
                <Text style={[styles.h1, {marginTop: 20}]}>Nutrition Goals</Text>
                <Text style={[styles.h3, {marginTop: 20}]}>{sumNutrition.calories} Cal</Text>
                <View style={[{flex: 1, marginVertical: 10, height: 20}]}>
                    <BarMacroChart strokeWidth={20} 
                        dailyTarget={sumNutrition}
                        colorProtein={colors.protein}
                        colorfat={colors.fat}
                        colorCarbs={colors.carbs}
                        radius={10}
                    />
                </View>
                <View style={[styles.rowContainer, {justifyContent: 'space-around', marginRight: 20}]}>
                    <View style={[styles.rowContainer, {marginHorizontal: 0}]}>
                        <View style={{backgroundColor: colors.protein, height: 20, width: 10, borderRadius: 10, marginTop: 3, marginHorizontal: 5}}/>
                        <View>
                            <Text style={[styles.h3]}>Protein </Text>
                            <Text style={[styles.h4]}>{Math.round(sumNutrition.protein)} g </Text>
                        </View>
                    </View>
                    <View style={[styles.rowContainer, {marginHorizontal: 0}]}>
                        <View style={{backgroundColor: colors.carbs, height: 20, width: 10, borderRadius: 10, marginTop: 3, marginHorizontal: 5}}/>
                        <View>
                            <Text style={[styles.h3]}>Carbs </Text>
                            <Text style={[styles.h4]}>{Math.round(sumNutrition.carbs)} g </Text>
                        </View>
                    </View>
                    <View style={[styles.rowContainer, {marginHorizontal: 0}]}>
                        <View style={{backgroundColor: colors.fat, height: 20, width: 10, borderRadius: 10, marginTop: 3, marginHorizontal: 5}}/>
                        <View>
                            <Text style={[styles.h3]}>Fat </Text>
                            <Text style={[styles.h4]}>{Math.round(sumNutrition.fat)} g </Text>
                        </View>
                    </View>
                </View>
                <Text style={[styles.h3, {marginTop: 30}]}>Maintenance calories </Text>
                <View style={[styles.rowContainer, {marginTop: 0}]}>
                    <RadioButton options={AutoCalorie} onSelect={handleAutoIntake}/>
                    <TextInput
                        style={[styles.input, {marginLeft:10, flex: .5,}]}
                        onChangeText={(inp) => setCalories(Number(inp) ? Number(inp) : 0)}
                        value={calories.toString()}
                        keyboardType="numeric"
                        placeholder="2000"
                        editable={!autoIntake} 
                        selectTextOnFocus={!autoIntake }
                        
                    />
                </View>
            </View> 
            <View style={styles.box}>
                <View>
                    {calorieIntake.map((item, index) => {
                        return (
                            <TouchableOpacity onPress={() => modifyDateList(index)} key={index}>
                                <View style={[styles.box, {backgroundColor: item.enabled == true ? 'green' : 'red', marginHorizontal: 5}]}>
                                    <Text style={[styles.h5]}>{calculateCalories(item, 1)}</Text>
                                    <Text style={[styles.h5]}>{item.timestamp}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })

                    }
                </View>

            </View>
            <View style={styles.box}>
                <FlatList
                    data={macroProfileList}
                    renderItem={({index, item}) => 
                        <TouchableOpacity onPress={() => FetchMacroProfile(item.id)}>
                            <View style={[styles.box, {backgroundColor: item.id == macro_profile_id ? 'green' : 'red'}]}>
                                <Text style={[styles.h3]}>{item.name}</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    scrollEnabled={false}
                    
                    extraData={refresh}
                />

            </View>
            <TouchableOpacity style={styles.button} onPress={handleAddGoal}>
                <Text style={styles.h5}>Set Goals</Text>
            </TouchableOpacity>
            <Link style={[styles.button, styles.centerContainer]} href='/(tabs)/(goals)/macroProfile' asChild>
                <TouchableOpacity>
                    <Text style={styles.h5}>create MacroProfile</Text>
                </TouchableOpacity>
            </Link>
            <Link style={[styles.button, styles.centerContainer]} href={{pathname: '/(tabs)/(goals)/macroProfile',
                params: {pfId: macro_profile_id}
                }} asChild>
                <TouchableOpacity>
                    <Text style={styles.h5}>modify MacroProfile</Text>
                </TouchableOpacity>
            </Link>
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
        width: 320,
        height: 300,
    },
    input: {
        backgroundColor: colors.box,
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
