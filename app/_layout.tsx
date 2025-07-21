import { SplashScreen, Stack, Tabs } from 'expo-router';
import React, { createContext, Dispatch, SetStateAction, Suspense, useContext, useEffect, useState } from 'react';

import { SQLiteProvider, openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations';
import { useFonts } from 'expo-font';
import { colors } from '@/components/theme';
import { ActivityIndicator, StyleSheet, View, Text, Image } from 'react-native';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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


const queryClient = new QueryClient();
function LogoTitle() {
  return (
    <View style={styles.header}>
      <Image source={require('@/assets/images/User-Profile.png')} />
      <Text style={styles.h1}>MACROLET</Text>
      <Image source={require('@/assets/images/Bell-Notif.png')} />
    </View>
  );
}

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
    <QueryClientProvider client={queryClient}>
      <Context.Provider value={{date, setDate}}>
        <Suspense fallback={<ActivityIndicator size="large" />}>
          <SQLiteProvider
            databaseName={DATABASE_NAME}
            options={{ enableChangeListener: true }}
            useSuspense>
            <Tabs
                  screenOptions={{
                    tabBarActiveTintColor: colors.text,
                    sceneStyle: {
                      backgroundColor: colors.background,
                  },
                    headerStyle: {
                      backgroundColor: colors.secondary,
                    },
                    headerShadowVisible: true,
                    headerTintColor: 'black',
                    tabBarStyle: {
                    backgroundColor: colors.secondary,
                    },
                    header: ({ navigation, route, options }) => {
                      return (<LogoTitle />)
                    },
                  }}
                >
                  <Tabs.Screen name="(goals)" options={{ title: 'Home' }} />
                  <Tabs.Screen name="recipes" options={{ title: 'Recipes' }} />
                  <Tabs.Screen name="(logs)" options={{ title: 'Logs' }} />
                  <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
            
                </Tabs>
          </SQLiteProvider>
        </Suspense>
      </Context.Provider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    //flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 90,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  h1: {
    fontFamily: 'Geist',
    fontWeight: 'medium',
    fontSize: 28,
  },
});