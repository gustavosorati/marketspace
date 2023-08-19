import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Home } from '../screens/private/Home';
import { MyAds } from '../screens/private/Advertisement/MyAds';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { THEME } from '../styles/theme';
import { House, Tag, SignOut, IconProps } from "phosphor-react-native";
import { useAuthentication } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { Loading } from '../components/Loading';

type TabParams = {
  Home: undefined;
  Advertisements: undefined;
  SignOut: undefined;
}

export type TabParamsList = BottomTabNavigationProp<TabParams>

const Stack = createBottomTabNavigator<TabParams>();

export function TabRoutes() {
  const { signOut } = useAuthentication();

  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor:  THEME.colors.black,
        tabBarInactiveTintColor: THEME.colors.base['gray-4'],
        tabBarStyle: styles.tabBarStyle,
        tabBarIcon: ({color, size, focused}) => {
          let Icon: React.FC<IconProps>;

          if (route.name === "Home")
            Icon = House;
          else if (route.name === "Advertisements")
            Icon = Tag;
          else
            Icon = SignOut;

          return (
            <Icon
              size={22}
              color={color}
              weight={focused ? "bold" : "regular"}
            />
          );
        },
      })}
    >

      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Advertisements" component={MyAds} />
        <Stack.Screen
          name="SignOut"
          component={() => {
            const getOut = async () => {
              await signOut();
            };

            useEffect(() => {
              getOut();
            }, []);

            return <Loading />;
          }}
          options={{
            tabBarIcon: ({ color, size }) => {
              const getOut = async () => {
                await signOut();
              };

              return (
                <TouchableOpacity onPress={getOut}>
                  <SignOut color={THEME.colors.product['red-light']} size={size} />
                </TouchableOpacity>
              )
            },
          }}
      />
      </Stack.Group>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    height: Platform.OS === "android" ? 70 : 96,
    backgroundColor: THEME.colors.base["gray-7"],
  }
});
