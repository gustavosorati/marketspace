import * as React from 'react';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabRoutes } from './tab.routes';

import { NewAd } from '../screens/private/Advertisement/Create/NewAd';
import { AdPreview } from '../screens/private/Advertisement/Create/AdPreview';
import { UpdateAd } from '../screens/private/Advertisement/Update/UpdateAd';
import { AdPreviewUpdate } from '../screens/private/Advertisement/Update/AdPreviewUpdate';
import { AdDetails } from '../screens/private/Advertisement/AdDetails';

type PrivateParams = {
  TabNavigation: undefined;
  CreateAd: undefined;
  AdPreview: {
    name: string;
    description: string;
    is_new: boolean;
    price: string;
    accept_trade: boolean;
    payment_methods: string[];
    images: {
      path: string,
      type: string | undefined
    }[];
  }
  UpdateAd: {
    productId: string;
  };
  AdPreviewUpdate: {
    productId: string;
    name: string;
    description: string;
    is_new: boolean;
    price: string;
    accept_trade: boolean;
    payment_methods: string[];
    images: { path: string, type: string | undefined }[];
    imagesExclude?: { path: string, id: string }[];
  }
  AdDetails: {
    id: string;
  }
}

export type PrivateParamsTypes = NativeStackNavigationProp<PrivateParams>;

const Stack = createNativeStackNavigator<PrivateParams>();

export function PrivateRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TabNavigation" component={TabRoutes} />

        <Stack.Group>
          <Stack.Screen name="CreateAd" component={NewAd} />
          <Stack.Screen name="UpdateAd" component={UpdateAd} />
          <Stack.Screen name="AdDetails" component={AdDetails} />
          <Stack.Screen name="AdPreview" component={AdPreview} />
          <Stack.Screen name="AdPreviewUpdate" component={AdPreviewUpdate} />
        </Stack.Group>
      </Stack.Group>
    </Stack.Navigator>
  );
}
