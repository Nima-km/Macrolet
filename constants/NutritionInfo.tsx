import { SharedValue } from "react-native-reanimated";
import {View, FlatList, StyleSheet, Text, StatusBar, TouchableOpacity, TextInput} from 'react-native';
import { Link } from "expo-router";
import { colors } from "./theme";
import { is } from "drizzle-orm";
import { Dispatch, SetStateAction, useState } from "react";
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
export type Chart = {
  y: number;
  date: Date;
}

interface inpProp {
  serving: string

  setServing: ((text: string) => void); 
  handleDelete: (() => void);
}
type ItemProps = FoodInfo & {is_link: boolean} & {backgroundColor: string}
type RecipeProps = FoodInfo & inpProp

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



export const Item = ({ name, timestamp, nutritionInfo, servings, foodItem_id, is_link, backgroundColor}: ItemProps) => {
  return (
    <Link href={{pathname: `${is_link ? "/addFood" : './'}`,
      params: {food_id: foodItem_id}
    }} asChild>
      <TouchableOpacity disabled={!is_link}>
        <View style={[styles.item, {backgroundColor: backgroundColor}]}>
          <View style={[styles.flexRowContainer, {paddingBottom:7}]}>
            <Text style={styles.h4}>{name}</Text>
            <Text style={styles.h4}>{nutritionInfo != null ? Math.floor(calculateCalories(nutritionInfo) * servings) : 0} cal</Text>
          </View>
          <View style={styles.flexRowContainer}>
            <Text style={styles.h6}>{servings} servings </Text>
            {timestamp &&
            <Text style={styles.h6}>{timestamp.getHours() < 10 ? 0: ''}{timestamp.getHours()}:{timestamp?.getMinutes() < 10 ? 0: ''}{timestamp?.getMinutes()}</Text>
            }
          </View>
          
        </View>
      </TouchableOpacity>
    </Link>
  );
};
export const SearchItem = ({ name, timestamp, nutritionInfo, servings, foodItem_id, is_link, backgroundColor}: ItemProps) => {
  return (
    <Link href={{pathname: `${is_link ? "/addFood" : './'}`,
      params: {food_id: foodItem_id}
    }} asChild>
      <TouchableOpacity disabled={!is_link}>
        <View style={[styles.item, {backgroundColor: backgroundColor, paddingBottom: 20, marginBottom: 0}]}>
          <View style={[styles.flexRowContainer, {paddingBottom:1}]}>
            <Text style={styles.h4}>{name}</Text>
          </View>
          <View style={styles.flexRowContainer}>
            <Text style={styles.h6}>{servings} servings, {nutritionInfo != null ? Math.floor(calculateCalories(nutritionInfo) * servings) : 0} cal </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};
export const RecipeItem = ({ name, timestamp, nutritionInfo, servings, foodItem_id, setServing, handleDelete}: RecipeProps) => {
  const [servingType, onChangeServingType] = useState('g')
  const [serving, onChangeServing] = useState(servings.toString())
  const onChange = (text: string) => {
    onChangeServing(text)
    if (Number(serving) >= 0)
      setServing(text)
  }
  return (
      <View style={styles.item}>
        <View>
          <View style={styles.flexRowContainer}>
            <View style={[{margin: 8}]}>
              <Text style={[styles.h4]}>{name}</Text>
              <Text style={[styles.h6]}>{serving} {servingType}, {calculateCalories(nutritionInfo) * Number(serving)} cal</Text>
            </View>
            <TouchableOpacity style={styles.deletebutton} onPress={handleDelete}>
                
            </TouchableOpacity>
          </View>
          <View style={[styles.rowContainer]}>
            <View style={[styles.rowContainer]}>
              <Text style={[styles.title, styles.constrainedText, styles.bold]}> Serving Amount </Text>
              <TextInput 
                style={[styles.input, styles.smallInput, styles.center]}
                onChangeText={text => onChange(text)}
                value={serving}
                keyboardType="numeric"/>
            </View>
            <View style={[styles.rowContainer, styles.center]}>
              <Text style={[styles.title, styles.constrainedText, styles.bold]}> Serving Amount </Text>
              <TextInput 
                style={[styles.input, styles.smallInput, styles.center]}
                onChangeText={onChangeServingType}
                value={servingType}
                keyboardType="numeric"/>
            </View>
          </View>
        </View>
      </View>
      
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  testContainer: {
    backgroundColor: 'blue',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
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
    minWidth: 70,
  },
  bold: {
    fontWeight: 'bold'
  },
  item: {
    paddingVertical: 24,
    paddingHorizontal: 17,
    marginVertical: 7.5,
    borderRadius: 8,
  },
  flexRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  title: {
    fontSize: 16,
  },
  constrainedText: {
    maxWidth: 90,
  },
  deletebutton: {
    padding: 20,
    margin: 10,
    backgroundColor: 'red'
  },
  h1: {
    fontFamily: 'Geist',
    fontWeight: 'semibold',
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

