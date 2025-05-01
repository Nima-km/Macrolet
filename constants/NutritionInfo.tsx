import { SharedValue } from "react-native-reanimated";
import {View, FlatList, StyleSheet, Text, StatusBar, TouchableOpacity, TextInput} from 'react-native';
import { Link, useRouter } from "expo-router";
import { colors } from "./theme";
import { is } from "drizzle-orm";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { InsertFood } from "./FetchData";
import { useSQLiteContext } from "expo-sqlite";
export type NutritionInfo = {
  protein: number;
  fat: number;
  carbs: number;
  fiber?: number;
  calories?: number;
}

export type FoodInfo = {
  name: string;
  description: string;
  servings: number;
  nutritionInfo: NutritionInfo;
  timestamp?: Date;
  foodItem_id: number;
  barcode?: number;
  serving_mult: number;
  serving_100g: number;
  volume_100g: number;
  serving_type: string;
  
}
export type Chart = {
  y: number;
  x: number;
}

interface inpProp {
  
  setServing: ((text: string) => void);
  setServingType: ((text: string) => void);
  handleDelete?: (() => void);
  handleServingMult: (mult: number, type: string) => void
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


export const calculateCalories = (nutrition: NutritionInfo, mult:number): number => {
  return (Math.round((nutrition.protein * 4 * mult)) 
    + Math.round((nutrition.fat * 9 * mult)) 
    + Math.round(((nutrition.carbs - (nutrition.fiber ? nutrition.fiber : 0)) * 4 * mult)));
};



export const Item = ({ name, timestamp, nutritionInfo, servings, foodItem_id, is_link, backgroundColor, serving_mult, serving_type}: ItemProps) => {
  return (
    <Link href={{pathname: `${is_link ? "/addFood" : './'}`,
      params: {food_id: foodItem_id}
    }} asChild>
      <TouchableOpacity disabled={!is_link}>
        <View style={[styles.item, {backgroundColor: backgroundColor}]}>
          <View style={[styles.flexRowContainer, {paddingBottom:7}]}>
            <Text style={styles.h4}>{name}</Text>
            <Text style={styles.h4}>{nutritionInfo != null ? Math.floor(calculateCalories(nutritionInfo , servings * serving_mult)) : 0} cal</Text>
          </View>
          <View style={styles.flexRowContainer}>
            <Text style={styles.h6}>{servings} {serving_type} </Text>
            {timestamp &&
            <Text style={styles.h6}>{timestamp.getHours() < 10 ? 0: ''}{timestamp.getHours()}:{timestamp?.getMinutes() < 10 ? 0: ''}{timestamp?.getMinutes()}</Text>
            }
          </View>
          
        </View>
      </TouchableOpacity>
    </Link>
  );
};
export const SearchItem = ({ name, timestamp, barcode, nutritionInfo, servings, serving_mult, foodItem_id, is_link, backgroundColor, serving_100g, serving_type}: ItemProps) => {
  const router = useRouter();
  const db = useSQLiteContext();
  const handlePress = async () => {
    if (barcode != 0){
      console.log('sups')
      foodItem_id = await InsertFood(db, {
        name: name,
        description: "",
        servings: servings,
        nutritionInfo: {
          protein: nutritionInfo.protein,
          fat: nutritionInfo.fat,
          carbs: nutritionInfo.carbs,
          fiber: nutritionInfo.fiber,
          calories: 0
        },
        foodItem_id: 0,
        serving_mult: serving_mult,
        serving_100g: serving_100g,
        volume_100g: 0,
        serving_type: serving_type,
        barcode: barcode
      })
      console.log("TESSSSSSSSST" + foodItem_id)
    }
    router.push({pathname: `${is_link ? "/addFood" : './'}`,
      params: {food_id: foodItem_id}
    })
  }
  
  return (
      <TouchableOpacity disabled={!is_link} onPress={handlePress}>
        <View style={[styles.item, {backgroundColor: backgroundColor, paddingBottom: 20, marginBottom: 0}]}>
          <View style={[styles.flexRowContainer, {paddingBottom:1}]}>
            <Text style={styles.h4}>{name}</Text>
          </View>
          <View style={styles.flexRowContainer}>
            <Text style={styles.h6}>{servings} servings, {nutritionInfo != null ? Math.floor(calculateCalories(nutritionInfo , servings * serving_mult)) : 0} cal </Text>
          </View>
        </View>
      </TouchableOpacity>
  );
};
export const RecipeItem = ({ name, 
    timestamp,
    serving_type,
    nutritionInfo, 
    serving_mult,
    serving_100g,
    volume_100g,
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
  const onMult = (mult: number, type: string) => {
    handleServingMult(serving_type == 'servings' ? 1 / serving_100g : 1, serving_type == 'servings' ? 'g' : 'servings')
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
              <Text style={[styles.h6]}>{Math.round(servings)} {serving_type}, {Math.round(calculateCalories(nutritionInfo , servings * serving_mult))  } cal</Text>
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
              <TouchableOpacity style={[styles.input, styles.smallInput, styles.center]} onPress={() => onMult(1 / serving_mult, 'placeHolder')}>
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

