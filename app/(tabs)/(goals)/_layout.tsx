import { FoodInfo } from '@/constants/NutritionInfo';
import { colors } from '@/constants/theme';
import { foodItem } from '@/db/schema';
import { Stack } from 'expo-router';
import { createContext, Dispatch, SetStateAction, useState } from 'react';

interface IngredientObjectType {
    ingredientList: FoodInfo[]

  // this is the type for state setters
    setIngredientList: Dispatch<SetStateAction<FoodInfo[]>>; 
}




export const IngredientObject = createContext<IngredientObjectType>({
    ingredientList: [],
    setIngredientList: () => {},
});


export default function RootLayout() {
  //const [ingredientList, setIngredientList] = useState<FoodInfo[]>([])
  return (
    <Stack screenOptions={{
        contentStyle: {
          backgroundColor: colors.background,
        },
    }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="nutritionGoal" options={{ headerShown: false }} />
    </Stack>
  );
}

