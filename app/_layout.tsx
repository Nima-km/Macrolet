import { Stack } from 'expo-router';
import { createContext, Dispatch, SetStateAction, Suspense, useContext, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import { addDummyData } from '@/db/addDummyData';
import { useDrizzleStudio} from 'expo-drizzle-studio-plugin'
import { and } from 'drizzle-orm';
import { useData } from '@shopify/react-native-skia';
interface DateContextType {
  date: Date;

  // this is the type for state setters
  setDate: Dispatch<SetStateAction<Date>>; 
}



export const DATABASE_NAME = 'tasks';
export const Context = createContext<DateContextType>({
  date: new Date(),
  setDate: () => {},
});

export default function RootLayout() {
  const expoDb = openDatabaseSync(DATABASE_NAME);
  const db = drizzle(expoDb);
  const { success, error } = useMigrations(db, migrations);
  const [date, setDate] = useState(new Date())
  useEffect(() => {
    if (success) {
      addDummyData(db);
    }
  }, [success]);

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
