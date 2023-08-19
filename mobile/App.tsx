import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider, Text, useTheme } from 'native-base';
import { useFonts } from 'expo-font';
import { Karla_400Regular, Karla_700Bold } from '@expo-google-fonts/karla';

import {THEME} from './src/styles/theme';
import { AuthProvider } from './src/contexts/AuthContext';
import { GestureHandlerRootView, NativeViewGestureHandler } from 'react-native-gesture-handler';

import Routes from './src/routes';
import { Loading } from './src/components/Loading';
import { BottomSheetProvider } from '@gorhom/bottom-sheet/lib/typescript/contexts';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function App() {

  const [fontsLoaded] = useFonts({ Karla_400Regular, Karla_700Bold });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeBaseProvider theme={THEME}>
        <BottomSheetModalProvider>

          <AuthProvider>
            {fontsLoaded ? <Routes /> : <Loading />}

            <StatusBar
              style="auto"
              backgroundColor="#EDECEE"
            />
          </AuthProvider>
         </BottomSheetModalProvider>
      </NativeBaseProvider>
    </GestureHandlerRootView>
  );
}

