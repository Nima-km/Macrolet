import { BarMacroChart } from "@/constants/BarMacroChart";
import { assignNutrition, calculateCalories, NutritionInfo } from "@/constants/NutritionInfo";
import RadioButton from "@/constants/selector";
import { colors } from "@/constants/theme";
import { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet, Text, TextInput } from "react-native";


export default function nutritionGoals() {
    const [weightChange, setWeightChange] = useState('')
    const [sumNutrition, setSumNutrition] = useState<NutritionInfo>({carbs: 200, fat: 80, protein: 190});
    const [calories, setCalories] = useState(2000)
    const [proteinMult, setProteinMult] = useState(.4)
    const [dietOption, setDietOption] = useState(1)
    const [autoIntake, setAutoIntake] = useState(true)
    
    
    const bw = 165
    const height = 180
    const WeightOptions = [
        { label: 'Gain', value: 1 },
        { label: 'Lose', value: -1 },
    ];
    const AutoCalorie = [
        { label: 'Auto', value: 1 },
        { label: 'Manual', value: 0 },
    ];
    const ProteinOptions = [
        { label: 'Min', value: .4 },
        { label: 'Moderate', value: .7 },
        { label: 'Max', value: 1 },
    ];
    const handleSelectProtein = (selectedValue: number) => {
        console.log('SelectedProtein:', selectedValue);
        setProteinMult(selectedValue)
        const goal = assignNutrition(calories + Number(weightChange) * 500 * dietOption, bw, height, selectedValue)
        setSumNutrition(goal)
        console.log(sumNutrition)
    // Handle the selection here
    };
    const handleSelectIntake = (selectedValue: number) => {
        console.log('SelectedIntake:', selectedValue);
        setDietOption(selectedValue)
    };
    const handleAutoIntake = (selectedValue: number) => {
        console.log('AutoIntake:', selectedValue);
        setAutoIntake(selectedValue == 1)
    };
    useEffect(() => {
        const goal = assignNutrition(calories + Number(weightChange) * 500 * dietOption, bw, height, proteinMult)
        setSumNutrition(goal)
    }, [])
    useEffect(() => {
        const goal = assignNutrition(calories + Number(weightChange) * 500 * dietOption, bw, height, proteinMult)
        setSumNutrition(goal)
    }, [dietOption, weightChange])
    useEffect(() => {
        const goal = assignNutrition(calories + Number(weightChange) * 500 * dietOption, bw, height, proteinMult)
        setSumNutrition(goal)
    }, [calories])
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
                <Text style={[styles.h3, {marginTop: 20}]}>{calculateCalories(sumNutrition, 1)} Cal</Text>
                <View style={[{flex: 1, marginVertical: 10, height: 20}]}>
                    <BarMacroChart strokeWidth={20} 
                        dailyTarget={sumNutrition}
                        colorProtein={colors.protein}
                        colorfat={colors.fat}
                        colorCarbs={colors.carbs}
                        radius={10}
                        width={337}
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
                        onChangeText={(inp) => setCalories(Number(inp))}
                        value={calories.toString()}
                        keyboardType="numeric"
                        placeholder="2000"
                        
                    />
                </View>
            </View>
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
