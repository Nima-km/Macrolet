import { Container } from "@shopify/react-native-skia/lib/typescript/src/renderer/Container";
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { colors, spacing, typography } from "@/constants/theme";
import { FoodInfo, Item, RecipeItem} from "@/constants/NutritionInfo";
import { useContext, useEffect, useState } from "react";
import { Link } from 'expo-router';
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { food, foodItem } from "@/db/schema";
import { like, sql, eq, sum} from 'drizzle-orm';
import { IngredientObject } from "./_layout";
export default function AddIngredient() {
    const [search, setSearch] = useState('');
    const [refresh, setRefresh] = useState<boolean>(false);
    const ingredientObject = useContext(IngredientObject);
    const [ingredientList, setIngredientList] = useState<FoodInfo[]>();
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db);
    // THIS IS A PLACEHOLDER FOR HISTORY PLEASE CHANGE IT
    const { data: history } = useLiveQuery(
        drizzleDb.select().from(foodItem).innerJoin(food, eq(foodItem.food_id, food.id))
        .orderBy(foodItem.timestamp).limit(4)
    )
    const [filteredData, setFilteredData] = useState(history);
    useEffect(() => {
        setFilteredData(history.filter((item) => item.food.name.toLowerCase().includes(`${search}`.toLowerCase())))
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

    return (
        <ScrollView style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.text}>Add Ingredient</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setSearch}
                    value={search}
                />
                <View style={styles.box}>
                    <FlatList
                        data={filteredData}
                        renderItem={({item}) => 
                            <TouchableOpacity onPress={() => 
                                handleAddIngredient({
                                    name: item.food.name,
                                    description: item.food.description,
                                    servings: item.foodItem.servings,
                                    nutritionInfo: { protein: item.food.protein, fat: item.food.fat, carbs: item.food.carbs },
                                    foodItem_id: item.food.id,
                                    serving_mult: item.foodItem.serving_mult,
                                    serving_100g: item.food.serving_100g,
                                    volume_100g: item.food.volume_100g,
                                    serving_type: item.foodItem.serving_type
                                })}>
                                <Item name={item.food.name}
                                    description={item.food.description}
                                    servings={item.foodItem.servings}
                                    nutritionInfo={{ carbs: item.food.carbs, fat: item.food.fat, protein: item.food.protein }}
                                    foodItem_id={item.foodItem.id}
                                    is_link={false} 
                                    serving_mult={item.foodItem.serving_mult} 
                                    serving_100g={item.food.serving_100g} 
                                    volume_100g={item.food.volume_100g} 
                                    serving_type={item.foodItem.serving_type} 
                                    backgroundColor={colors.box}                                />
                            </TouchableOpacity>
                        }
                        keyExtractor={item => item.foodItem.id.toString()}
                        scrollEnabled={false}
                    />
                </View>
            </View>
            <View style={[styles.flexRowContainer]}>
                <View style={[styles.box, styles.center]}>
                    <Text style={styles.text}>Scan Barcode</Text>
                </View>
                <Link style={[styles.box, styles.center]} href="/quickAddFood" asChild>
                    <TouchableOpacity>
                        <Text style={styles.text}>Quick Add</Text>
                    </TouchableOpacity>
                </Link>
                
            </View>
            <Text style={styles.text}>Added</Text>
            <FlatList
                data={ingredientList}
                renderItem={({item, index}) => <RecipeItem 
                        name={item.name} 
                        description={item.description} 
                        servings={item.servings} 
                        nutritionInfo={{carbs: item.nutritionInfo.carbs, fat: item.nutritionInfo.fat, protein: item.nutritionInfo.protein}}
                        foodItem_id={item.foodItem_id}
                        serving_mult={item.serving_mult}
                        setServing={(text) => handleChangeServing(index, text)}
                        handleDelete={() => handleDeleteIngredient(index)}
                        handleServingMult={(mult, type) => handleServingMult(mult, type, index)} 
                        setServingType={() => handleServingMult} 
                        serving_type={item.serving_type}
                        volume_100g={item.volume_100g}
                        serving_100g={item.serving_100g}
                    />}
                    scrollEnabled={false}
                    extraData={refresh}
            />
            <View style={[styles.flexRowContainer, styles.center]}>
                <Link style={[styles.smallButton, styles.center]} href="/createRecipe" asChild>
                    <TouchableOpacity style={[styles.smallButton, styles.center]} onPress={handleConfirm}>
                        <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                </Link>
                <Link style={[styles.smallButton, styles.center]} href="/createRecipe" asChild>
                    <TouchableOpacity style={[styles.smallButton, styles.center]} onPress={handleCancel}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },
    text: {
        fontSize: 20,

    },
    box: {
        padding: 10,
        marginVertical: 20,
        backgroundColor: colors.primary,
        borderRadius: 4,
        minHeight: 100,
        minWidth: 190,
    },
    center: {
        justifyContent: "center",
        alignItems: "center",
    },
    flexRowContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    flexRowChild: {
        
    },
    button: {
        backgroundColor: colors.primary,
        paddingHorizontal: 40,
        paddingVertical: 15,
        marginVertical: 10,
        borderRadius: 10,
    },
    smallButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: 60,
        paddingVertical: 15,
        marginVertical: 10,
        marginHorizontal: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: "black",
        fontSize: 12,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 0,
        borderRadius: 10,
        backgroundColor: colors.secondary,
    },
})