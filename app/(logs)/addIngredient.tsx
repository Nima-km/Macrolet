import { Container } from "@shopify/react-native-skia/lib/typescript/src/renderer/Container";
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, ScrollView, Image } from "react-native";
import { colors, spacing, typography } from "@/components/theme";
import { FoodInfo, Item, RecipeItem} from "@/components/NutritionInfo";
import { useContext, useEffect, useState } from "react";
import { Link } from 'expo-router';
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { food, foodItem } from "@/db/schema";
import { like, sql, eq, sum} from 'drizzle-orm';
import { IngredientObject } from "./_layout";
import { center } from "@shopify/react-native-skia";
import BarcodeScanner from "./barcodeScanner";

export default function AddIngredient() {
    const [search, setSearch] = useState('');
    const [isScanner, setIsScanner] = useState(false)
    const [refresh, setRefresh] = useState<boolean>(false);
    const ingredientObject = useContext(IngredientObject);
    const [ingredientList, setIngredientList] = useState<FoodInfo[]>();
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db);
    // THIS IS A PLACEHOLDER FOR HISTORY PLEASE CHANGE IT
    const { data: history } = useLiveQuery(
        drizzleDb.select().from(food)
        .orderBy()
    )
    const [filteredData, setFilteredData] = useState(history);
    useEffect(() => {
        setFilteredData(history.filter((item) => item.name.toLowerCase().includes(`${search}`.toLowerCase())).slice(0, 4))
    }, [search, history])

    const handleAddIngredient = (newIng: FoodInfo) => {
       // console.log("SUP")
        const newList = ingredientList ? ingredientList.concat(newIng) : [newIng]
        setIngredientList(newList)
        console.log(ingredientList)
    }
    const handleChangeServing = (index: number, text: string) => {
        console.log(text)
        console.log(index)
        console.log("AYYY")
        console.log(index)
        console.log(ingredientList)
        if (ingredientList) {
            var newList = ingredientList
            newList[index].servings = Number(text)
            setIngredientList(newList)
            console.log("YOBOYO")
            setRefresh(!refresh)
        }
    }
    const handleConfirm = async () => {
        const newList = ingredientList ? ingredientObject.ingredientList.concat(ingredientList) : ingredientObject.ingredientList
        ingredientObject.setIngredientList(newList)
        console.log("CONFIRMED")
    }
    const handleCancel = async () => {
        console.log("CANCELED")
    }
    const handleDeleteIngredient = async (index: number) => {
        if (ingredientList) {
            ingredientList.splice(index, 1)
            console.log("DELETED ITEM")
            console.log(ingredientList)
           // setIngredientList(newList)
            console.log("YOBOYO")
            setRefresh(!refresh)
        }
    }
    const handleServingMult = (mult: number, type: string, index: number) => {
        if (ingredientList) {
            var newList = ingredientList
            console.log(mult)
            newList[index].serving_mult = mult
            newList[index].serving_type = type
            setIngredientList(newList)
            console.log("YOBOYO")
            setRefresh(!refresh)
        }
    }
    if (isScanner) {
        console.log('this is')
        console.log(ingredientList)
        return (
            <BarcodeScanner ingredientList={ingredientList} setIngredientList={setIngredientList} setIsScanner={setIsScanner}
            />
        )
    }
    return (
        <ScrollView style={styles.container}> 
            <Text style={[styles.h1, {margin: 20}]}>Add Ingredient</Text>
            <View style={styles.box}>
                
                <TextInput
                    style={[styles.h6, styles.input]}
                    onChangeText={setSearch}
                    placeholder="Search"
                    value={search}
                />
                
                <FlatList
                    data={filteredData}
                    renderItem={({item}) => 
                        <TouchableOpacity onPress={() => 
                            handleAddIngredient({
                                name: item.name,
                                description: item.description,
                                servings: 1,
                                nutritionInfo: { protein: item.protein, fat: item.fat, carbs: item.carbs },
                                foodItem_id: item.id,
                                serving_mult: 1,
                                serving_100g: item.serving_100g,
                                volume_100g: item.volume_100g,
                                serving_type: 'servings',
                                food_id: item.id
                            })}>
                            <Item name={item.name}
                                description={item.description}
                                servings={1}
                                nutritionInfo={{ carbs: item.carbs, fat: item.fat, protein: item.protein }}
                                foodItem_id={0}
                                is_link={false}
                                serving_mult={1}
                                serving_100g={item.serving_100g}
                                volume_100g={item.volume_100g}
                                serving_type={'servings'}
                                backgroundColor={colors.box}
                                food_id={item.id}/>
                        </TouchableOpacity>
                    }
                    keyExtractor={item => item.id.toString()}
                    scrollEnabled={false}
                />
            </View>
            <View style={[styles.rowContainer, {justifyContent: 'space-between'}]}>
                <TouchableOpacity style={[styles.box, styles.centerContainer, {flex: 1, marginLeft: 20}]} onPress={() => setIsScanner(true)}>
                    <Text style={[styles.h4, {paddingBottom: 20}]}>Scan Barcode</Text>
                    <Image source={require('@/assets/images/Barcode.png')} />
                </TouchableOpacity>
                <Link style={[styles.box, styles.centerContainer, {flex: 1, marginLeft: 0}]} href="/quickAddFood" asChild>
                    <TouchableOpacity>
                        <Text style={[styles.h4, {paddingBottom: 20}]}>Quick Add</Text>
                    </TouchableOpacity>
                </Link>
                
            </View>
            <Text style={[styles.h1, {marginHorizontal: 20, marginTop: 40}]}>Added</Text>
            <FlatList
                data={ingredientList}
                renderItem={({item, index}) => 
                    <RecipeItem 
                        name={item.name}
                        description={item.description}
                        servings={item.servings}
                        nutritionInfo={{ carbs: item.nutritionInfo.carbs, fat: item.nutritionInfo.fat, protein: item.nutritionInfo.protein }}
                        foodItem_id={item.foodItem_id}
                        serving_mult={item.serving_mult}
                        setServing={(text) => handleChangeServing(index, text)}
                        handleDelete={() => handleDeleteIngredient(index)}
                        handleServingMult={(mult, type) => handleServingMult(mult, type, index)}
                        setServingType={() => handleServingMult}
                        serving_type={item.serving_type}
                        volume_100g={item.volume_100g}
                        serving_100g={item.serving_100g}
                        backgroundColor={colors.primary} 
                        food_id={0}
                        />
                    }
                    scrollEnabled={false}
                    extraData={refresh}
                    style={[{margin: 20}]}
            />
            <View style={[styles.rowContainer, {justifyContent: 'space-between'}]}>
                <Link style={[styles.box, styles.centerContainer, {flex: 1}]} href="/createRecipe" asChild>
                    <TouchableOpacity onPress={handleConfirm}>
                        <Text style={styles.h7}>Confirm</Text>
                    </TouchableOpacity>
                </Link>
                <Link style={[styles.box, styles.centerContainer, {flex: 1}]} href="/createRecipe" asChild>
                    <TouchableOpacity onPress={handleCancel}>
                        <Text style={styles.h7}>Cancel</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        flex: 1,
        backgroundColor: colors.box,
        borderRadius: 10,
        padding: 13,
        marginVertical: 10,
    },
    button: {
        backgroundColor: colors.secondary,
        paddingHorizontal: 40,
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
})