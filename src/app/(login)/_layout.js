import { Stack } from 'expo-router/stack';

export default function StackRoutesLayout() {
  return (
    <Stack
    screenOptions={{
      headerShown: false}}
    >
      <Stack.Screen
        name="index"
        options={{}}
      />
      <Stack.Screen
        name="entrar"
        options={{}}
      />
      <Stack.Screen
        name="cadastrar"
        options={{}}
      />                 
    </Stack>
  );
}
