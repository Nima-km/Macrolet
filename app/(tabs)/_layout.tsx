import { colors } from '@/constants/theme';
import { Tabs } from 'expo-router';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.text,
        headerStyle: {
          backgroundColor: colors.secondary,
        },
        headerShadowVisible: false,
        headerTintColor: 'black',
        tabBarStyle: {
        backgroundColor: colors.secondary,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="recipes" options={{ title: 'Recipes' }} />
      <Tabs.Screen name="(logs)" options={{ title: 'Logs' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />

    </Tabs>
  );
}
