import { SharedValue } from "react-native-reanimated";
import {View, FlatList, StyleSheet, Text, StatusBar, TouchableOpacity, TextInput} from 'react-native';
import { Link } from "expo-router";
import { colors } from "./theme";
import { is } from "drizzle-orm";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
export type NutritionInfo = {
  protein: number;
  fat: number;
  carbs: number;
  calories?: number;
}

export type FoodInfo = {
  name: string;
  description: string;
  servings: number;
  nutritionInfo: NutritionInfo;
  timestamp?: Date;
  foodItem_id: number;
  serving_mult: number,
  serving_type: string,
  
}
export type Chart = {
  y: number;
  x: number;
}

interface inpProp {
  
  setServing: ((text: string) => void);
  setServingType: ((text: string) => void);
  handleDelete?: (() => void);
  handleServingMult: (mult: number) => void
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
  return (Math.round((nutrition.protein * 4) + (nutrition.fat * 9) + (nutrition.carbs * 4)));
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
export const RecipeItem = ({ name, 
    timestamp,
    serving_type,
    nutritionInfo, 
    serving_mult, 
    servings, 
    foodItem_id, 
    setServing,
    handleServingMult,
    setServingType,
    handleDelete}: RecipeProps) => {
  const onChange = (text: string) => {
    console.log('YAYYY')
      setServing(text)
  }
  const onMult = (mult: number) => {
    handleServingMult(mult)
  }
  useEffect (() => {
    console.log('NAYYYy')
  }, [servings])
  return (
      <View style={styles.item}>
        <View>
          <View style={styles.flexRowContainer}>
            <View style={[{margin: 8}]}>
              <Text style={[styles.h4]}>{name}</Text>
              <Text style={[styles.h6]}>{Math.round(servings * serving_mult * 100)} {serving_type}, {Math.round(calculateCalories(nutritionInfo) * servings * serving_mult)  } cal</Text>
            </View>
            { handleDelete &&
              <TouchableOpacity style={styles.deletebutton} onPress={handleDelete}>
                  
              </TouchableOpacity>
            }
          </View>
          <View style={[styles.rowContainer]}>
            <View style={[styles.rowContainer]}>
              <Text style={[styles.title, styles.constrainedText, styles.bold]}> Serving Amount </Text>
              <TextInput 
                style={[styles.input, styles.smallInput, styles.center]}
                onChangeText={text => onChange(text)}
                value={servings.toString()}
                keyboardType="numeric"/>
            </View>
            <View style={[styles.rowContainer, styles.center]}>
              <Text style={[styles.title, styles.constrainedText, styles.bold]}> Serving Type </Text>
              <TouchableOpacity style={[styles.input, styles.smallInput, styles.center]} onPress={() => onMult(1 / serving_mult)}>
                <Text 
                  style={[styles.center]}>
                  {serving_type}
                </Text>
              </TouchableOpacity>
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

