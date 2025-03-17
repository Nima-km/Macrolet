import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="logs" options={{ headerShown: false }} />
      <Stack.Screen name="addFood" options={{ headerShown: false }} />
      <Stack.Screen name="logFood" options={{ headerShown: false }} />
    </Stack>
  );
}

