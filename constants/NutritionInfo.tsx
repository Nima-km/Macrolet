import { SharedValue } from "react-native-reanimated";
import {View, FlatList, StyleSheet, Text, StatusBar, TouchableOpacity} from 'react-native';
import { Link } from "expo-router";
import { colors } from "./theme";
export type NutritionInfo = {
  protein: number;
  fat: number;
  carbs: number;
}

export type FoodInfo = {
  name: string;
  description: string;
  servings: number;
  nutritionInfo: NutritionInfo;
  timestamp?: Date;
  foodItem_id: number;
  
}


export type SharedNutritionInfo = {
  protein: SharedValue<number>;
  fat: SharedValue<number>;
  carbs: SharedValue<number>;
}
export type Section = {
  title: string;
  data: any[];
};


export const calculateCalories = (nutrition: NutritionInfo): number => {
  return (nutrition.protein * 4) + (nutrition.fat * 9) + (nutrition.carbs * 4);
};





////// TEST DATA

export const LongDataTST = [
  {
    id: '1',
    name: 'First food',
    description: 'first description',
    servings: 1,
  },
  {
    id: '2',
    name: 'second food',
    description: 'second description',
    servings: 2,
  },
  {
    id: '3',
    name: 'third food',
    description: 'third description',
    servings: 1.5,
  },
  {
    id: '4',
    name: '4 food',
    description: '4 description',
    servings: 1.5,
  },
  {
    id: '5',
    name: '5 food',
    description: '5 description',
    servings: 1.5,
  },
  {
    id: '6',
    name: '6 food',
    description: '6 description',
    servings: 1.5,
  },
];

export const shortDataTST = [
  {
    id: '1',
    name: 'First food',
    description: 'first description',
    servings: 1,
  },
  {
    id: '2',
    name: 'second food',
    description: 'second description',
    servings: 2,
  },
];

export const Item = ({ name, timestamp, nutritionInfo, servings, foodItem_id}: FoodInfo) => {
  return (
    <Link href={{pathname: "/addFood",
      params: {food_id: foodItem_id}
    }} asChild>
      <TouchableOpacity>
        <View style={styles.item}>
          <View>
            <View style={styles.flexRowContainer}>
              <Text style={styles.title}>{name}</Text>
              <Text style={styles.title}>{nutritionInfo != null ? Math.floor(calculateCalories(nutritionInfo) * servings) : 0} Calories</Text>
            </View>
            <View style={styles.flexRowContainer}>
              <Text style={styles.title}>{servings} servings </Text>
              {timestamp &&
              <Text style={styles.title}>{timestamp.getHours() < 10 ? 0: ''}{timestamp.getHours()}:{timestamp?.getMinutes() < 10 ? 0: ''}{timestamp?.getMinutes()}</Text>
              }
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: colors.primary,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 4,
  },
  flexRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 14,
  },
});

