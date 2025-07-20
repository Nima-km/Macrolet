import { Container } from "@shopify/react-native-skia/lib/typescript/src/renderer/Container";
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, ScrollView, Image } from "react-native";
import { colors, spacing, typography } from "@/constants/theme";
import { NutritionInfo, Item, SearchItem, FoodInfo} from "@/constants/NutritionInfo";
import { useEffect, useState } from "react";
import { Link } from 'expo-router';
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { food, foodItem } from "@/db/schema";
import { like, sql, eq, sum, or} from 'drizzle-orm';
import { RoundedRect } from "@shopify/react-native-skia";
import { FetchSearch } from "@/constants/FetchData";
export default function LogFood() {
    const [searchHistory, setSearchHistory] = useState('');
    const [search, setSearch] = useState('');
    
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db);
    // THIS IS A PLACEHOLDER FOR HISTORY PLEASE CHANGE IT
    const { data: history } = useLiveQuery(
        drizzleDb.select().from(food)
        .where(or(eq(food.is_recipe, false), eq(food.is_template, true)))
        .orderBy()
    )
    const [filteredData, setFilteredData] = useState(history);
    const [searchData, setSearchData] = useState<FoodInfo[]>();

    const handleSearch = async () => {
        const res = await FetchSearch(search)
        if (res)
            setSearchData(res)
    }
    useEffect(() => {
        setFilteredData(history.filter((item) => item.name.toLowerCase().includes(`${searchHistory}`.toLowerCase())).slice(0, 4))
    }, [searchHistory, history])
    return (
        <ScrollView style={styles.container}>
            <Text style={[styles.h1, {margin: 20}]}>Log Food</Text>
            <TextInput
                style={[styles.h6, styles.input, {backgroundColor: colors.primary, margin: 20}]}
                onChangeText={setSearch}
                value={search}
                placeholder="Search all foods"
                onSubmitEditing={handleSearch}
            />
            { searchData && 
            <View style={styles.box}>
                <FlatList
                    data={searchData}
                    renderItem={({item}) => 
                    <Item name={item.name}
                        description={item.description}
                        servings={item.servings}
                        nutritionInfo={{ carbs: item.nutritionInfo.carbs, fat: item.nutritionInfo.fat, protein: item.nutritionInfo.protein, fiber: item.nutritionInfo.fiber}}
                        food_id={item.food_id}
                        is_link={true}
                        barcode={item.barcode}
                        backgroundColor={colors.box} 
                        serving_mult={item.serving_mult}
                        serving_100g={item.serving_100g} 
                        volume_100g={item.volume_100g} 
                        serving_type={item.serving_type}/>
                    }
                    //keyExtractor={item => item.foodItem_id.toString()}
                    scrollEnabled={false}
                />
            </View>
            }
            <View style={styles.box}>
                <Text style={styles.h1}>History</Text>
                <TextInput
                    style={[styles.h6, styles.input]}
                    onChangeText={setSearchHistory}
                    value={searchHistory}
                    placeholder="Search"
                />
                <FlatList
                    data={filteredData}
                    renderItem={({item}) => 
                    <Item name={item.name}
                        description={item.description}
                        servings={1}
                        nutritionInfo={{ carbs: item.carbs, fat: item.fat, protein: item.protein, fiber: item.fiber }}
                        food_id={item.id}
                        is_link={true}
                        backgroundColor={colors.box} 
                        serving_mult={1}
                        serving_100g={item.serving_100g} 
                        volume_100g={item.volume_100g} 
                        serving_type={"serving"}/>
                    }
                    keyExtractor={item => item.id.toString()}
                    scrollEnabled={false}
                />
            </View>
            <View style={[styles.rowContainer, {justifyContent: 'space-between'}]}>
                <Link style={[styles.box, styles.centerContainter, {flex: 1, marginLeft: 20}]} href="/barcodeScanner" asChild>
                    <TouchableOpacity>
                        <Text style={[styles.h4, {paddingBottom: 20}]}>Scan Barcode</Text>
                        <Image source={require('@/assets/images/Barcode.png')} />
                    </TouchableOpacity>
                </Link>
                <Link style={[styles.box, styles.centerContainter, {flex: 1, marginLeft: 0}]} href="/addFood" asChild>
                    <TouchableOpacity>
                        <Text style={[styles.h4, {paddingBottom: 20}]}>Quick Add</Text>
                        <Image style={{paddingBottom: 50}} source={require('@/assets/images/plus-circle.png')} />
                    </TouchableOpacity>
                </Link>
                
            </View>
            <Link style={[styles.box, styles.centerContainter]} href="/createRecipe" asChild>
                <TouchableOpacity>
                    <Text style={styles.h4}>create Recipe</Text>
                </TouchableOpacity>
            </Link>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centerContainter: {
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
        marginHorizontal: 60,
        fontSize: 12,
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
