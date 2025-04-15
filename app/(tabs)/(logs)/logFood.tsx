import { Container } from "@shopify/react-native-skia/lib/typescript/src/renderer/Container";
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, ScrollView, Image } from "react-native";
import { colors, spacing, typography } from "@/constants/theme";
import { NutritionInfo, Item, SearchItem} from "@/constants/NutritionInfo";
import { useEffect, useState } from "react";
import { Link } from 'expo-router';
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { food, foodItem } from "@/db/schema";
import { like, sql, eq, sum} from 'drizzle-orm';
import { RoundedRect } from "@shopify/react-native-skia";
export default function LogFood() {
    const [search, setSearch] = useState('');
    
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
    return (
        <ScrollView style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.h1}>History</Text>
                <TextInput
                    style={[styles.h6, styles.input]}
                    onChangeText={setSearch}
                    value={search}
                    placeholder="Search"
                />
                <FlatList
                    data={filteredData}
                    renderItem={({item}) => 
                    <SearchItem name={item.food.name} 
                        description={item.food.description} 
                        servings={item.foodItem.servings} 
                        nutritionInfo={{carbs: item.food.carbs, fat: item.food.fat, protein: item.food.protein}}
                        foodItem_id={item.foodItem.id}
                        is_link={true}
                        backgroundColor={colors.box}/>
                    }
                    keyExtractor={item => item.foodItem.id.toString()}
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
                <Link style={[styles.box, styles.centerContainter, {flex: 1, marginLeft: 0}]} href="/quickAddFood" asChild>
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