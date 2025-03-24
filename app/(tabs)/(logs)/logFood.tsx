import { Container } from "@shopify/react-native-skia/lib/typescript/src/renderer/Container";
import { StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity } from "react-native";
import { colors, spacing, typography } from "@/constants/theme";
import { NutritionInfo, LongDataTST, shortDataTST, Item} from "@/constants/NutritionInfo";
import { useEffect, useState } from "react";
import { Link } from 'expo-router';
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSQLiteContext } from "expo-sqlite";
import { food, foodItem } from "@/db/schema";
import { like, sql, eq, sum} from 'drizzle-orm';
export default function LogFood() {
    const [search, setSearch] = useState('');
    
    const db = useSQLiteContext();
    const drizzleDb = drizzle(db);
    // THIS IS A PLACEHOLDER FOR HISTORY PLEASE CHANGE IT
    const { data: history } = useLiveQuery(
        drizzleDb.select().from(foodItem).innerJoin(food, eq(foodItem.food_id, food.id))
        .orderBy(foodItem.created_at).limit(4)
    )
    const [filteredData, setFilteredData] = useState(history);
    useEffect(() => {
        setFilteredData(history.filter((item) => item.food.name.toLowerCase().includes(`${search}`.toLowerCase())))
    }, [search, history])
    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.text}>History</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setSearch}
                    value={search}
                />
                <View style={styles.box}>
                    <FlatList
                        data={filteredData}
                        renderItem={({item}) => 
                        <Item name={item.food.name} 
                        description={item.food.description} 
                        servings={item.foodItem.servings} 
                        nutritionInfo={{carbs: item.food.carbs, fat: item.food.fat, protein: item.food.protein}}
                        foodItem_id={item.foodItem.id}/>
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
                <Text style={styles.text}>My Recipes</Text>
            <View style= {styles.box}>

            </View>
        </View>
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
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 0,
        borderRadius: 10,
        backgroundColor: colors.secondary,
    },
})