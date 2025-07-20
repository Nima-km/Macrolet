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
  const [ingredientList, setIngredientList] = useState<FoodInfo[]>([])
  return (
    <IngredientObject.Provider value={{ingredientList, setIngredientList}}>
      <Stack screenOptions={{
         contentStyle: {
            backgroundColor: colors.background,
         },
      }}>
        <Stack.Screen name="logs" options={{ headerShown: false }} />
        <Stack.Screen name="barcodeScanner" options={{ headerShown: false }} />
        <Stack.Screen name="quickAddFood" options={{ headerShown: false }} />
        <Stack.Screen name="addFood" options={{ headerShown: false }} />
        <Stack.Screen name="addIngredient" options={{ headerShown: false }} />
        <Stack.Screen name="createRecipe" options={{ headerShown: false }} />
        <Stack.Screen name="logFood" options={{ headerShown: false }} />
      </Stack>
    </IngredientObject.Provider>
  );
}

