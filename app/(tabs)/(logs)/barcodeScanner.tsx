import { PixelRatio, Pressable, StyleSheet, Text, View, FlatList, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Button} from "react-native";
import { colors, spacing, typography } from "../../../constants/theme";
import React, { useContext, useEffect, useState } from 'react';

import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

import axios from 'axios';
import { NutritionInfo } from "@/constants/NutritionInfo";
import { useSQLiteContext } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import { food, foodItem } from "@/db/schema";

type AndroidMode = 'date' | 'time';



const BarcodeScanner = () => {
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db);
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [isScanned, setIsScanned] = useState(false)
    const [foodName, setFoodName] = useState('')
    const [sumNutrition, setSumNutrition] = useState<NutritionInfo>({carbs: 0, fat: 0, protein: 0});
    const [barcode, setBarcode] = useState(0)
    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }
    const handleAddFood = async (barcode: any) => {
        if (foodName){
            const foodObject = await drizzleDb.insert(food).values({
                        name: foodName,
                        description: foodName,
                        protein: Number(sumNutrition.protein),
                        fat: Number(sumNutrition.fat),
                        carbs: Number(sumNutrition.carbs),
                        is_recipe: false,
                        barcode: barcode}).returning()
            await drizzleDb.insert(foodItem).values({food_id: foodObject[0].id, servings: Number(1), timestamp: new Date()})
            console.log(foodObject)
        }
    }
    const handleScanned = (barcode: any) => {
        if (isScanned == false){
            setIsScanned(true)
            handleFetch(barcode)
        }
    }
    const handleFetch = async (barcode: any) => {
        if (isScanned == false){
            setIsScanned(true)
            try {
                const response = await axios.get(`https://world.openfoodfacts.org/api/v3/product/${barcode}.json`)
                const data: any = response.data.product
                if (data){
                    setFoodName(data.product_name)
                    setSumNutrition({carbs: data.nutriments.carbohydrates, fat: data.nutriments.fat, protein: data.nutriments.proteins})
                    setBarcode(barcode)
                }
            }
            catch (error: any) {
                console.log("SOMETHING WENT WRONG")
            }
            console.log(barcode)
            
            console.log("FOOD INSERT ADDED")
        }
    }
    useEffect(() => {
        console.log(sumNutrition)
        console.log(foodName)
        handleAddFood(barcode)
    }, [sumNutrition])
    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }
    
    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
        <View style={styles.container}>
            <Text style={styles.message}>We need your permission to show the camera</Text>
            <Button onPress={requestPermission} title="grant permission" />
        </View>
        );
    }
    
    return (
        <View style={styles.container}>
            <CameraView style={styles.container} facing={facing} 
                barcodeScannerSettings={{ barcodeTypes: ['upc_a', 'ean13', 'upc_e'] }} 
                onBarcodeScanned={({data}) => {!isScanned ? handleScanned(data) : null}}>
            </CameraView>
        </View>
    );
}
export default BarcodeScanner

const styles = StyleSheet.create({
    centerContainter: {
        alignItems: "center",
        justifyContent: "center"
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    testContainer: {
        backgroundColor: 'red',
    },
    rowContainer: {
        flexDirection: 'row',
    },
    barChartContainer: {
        width: 320,
        height: 300,
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    button: {
        backgroundColor: colors.secondary,
        paddingHorizontal: 40,
        paddingVertical: 15,
        marginVertical: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: "black",
        fontSize: 12,
    },
    titleText: {
        color: "black",
        marginHorizontal: 20,
        fontSize: 20,
    },
    smallText: {
        color: "black",
        marginHorizontal: 0,
        fontSize: 16,
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
    container: {
        flex: 1,
        padding: 10,
    },
    text: {
        fontSize: 20,

    },
    box: {
        padding: 10,
        marginVertical: 20,
        backgroundColor: colors.primary,
        borderRadius: 7,
        minHeight: 100,
        minWidth: 190,
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
    },
    flexRowContainer: {
        flexDirection: "row",
        alignItems: "center"
       // justifyContent: "space-between"
    },
    spaceInbetween: {
        justifyContent: "space-between",
       // backgroundColor: "red"
    },
    input: {
        height: 30,
        margin: 5,
        borderWidth: 1,
        padding: 0,
        borderRadius: 10,
        backgroundColor: colors.secondary,
    },
    smallInput: {
        minWidth: 50,
    }
});
