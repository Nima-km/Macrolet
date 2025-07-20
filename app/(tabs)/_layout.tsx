import { colors } from '@/constants/theme';
import { Tabs } from 'expo-router';
import { StyleSheet, View, Text, Image } from 'react-native';


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
  return (
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
