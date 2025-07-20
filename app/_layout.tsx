import { SplashScreen, Stack } from 'expo-router';
import { createContext, Dispatch, SetStateAction, Suspense, useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import { useFonts } from 'expo-font';
interface DateContextType {
  date: Date;

  // this is the type for state setters
  setDate: Dispatch<SetStateAction<Date>>; 
}




export const Context = createContext<DateContextType>({
  date: new Date(),
  setDate: () => {},
});
export const DATABASE_NAME = 'tasks';
export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);

  const { success, error } = useMigrations(db, migrations);
  const [date, setDate] = useState(new Date())
  useEffect(() => {
    if (success) {
      console.log(success)
    }
    else
      console.log(error)
  }, [success, error]);
  const [loaded, fontError] = useFonts({
    'Geist': require('@/assets/fonts/Geist-VariableFont_wght.ttf'),
    'Metro-Medium': require('@/assets/fonts/Metropolis-Medium.ttf'),
    'Metro-SemiBold': require('@/assets/fonts/Metropolis-SemiBold.ttf'),
    'Metro-Regular': require('@/assets/fonts/Metropolis-Regular.ttf'),
    'Metro-Bold': require('@/assets/fonts/Metropolis-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <Context.Provider value={{date, setDate}}>
      <Suspense fallback={<ActivityIndicator size="large" />}>
        <SQLiteProvider
          databaseName={DATABASE_NAME}
          options={{ enableChangeListener: true }}
          useSuspense>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </SQLiteProvider>
      </Suspense>
    </Context.Provider>
  );
}
