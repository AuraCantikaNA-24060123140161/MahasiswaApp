import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          animation: "slide_from_left",
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="home"
        options={{
          animation: "fade",
        }}
      />
    </Stack>
  );
}
