import * as React from 'react';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SignIn } from '../screens/public/SignIn';
import { SignUp } from '../screens/public/SingUp';

type PublicParams = {
  SignIn: undefined;
  SignUp: undefined;
}

export type PublicParamsTypes = NativeStackNavigationProp<PublicParams>;

const Stack = createNativeStackNavigator<PublicParams>();

export function PublicRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
