import { HStack, Text, VStack, useTheme } from 'native-base';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Adverts } from '../../components/Adverts';
import { Button } from '../../components/Button';
import { ProductList } from '../../components/ProductList';
import { Profile } from '../../components/Profile';
import { UserInformationService } from '../../services/users/information.service';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { IUserInformation } from '../../dtos/UserDTO';
import { PrivateParamsTypes } from '../../routes/private.routes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter } from '../../components/Filter';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { PRODUCTS_SERVICES } from '../../services/products.services';
import { IProduct } from '../../dtos/ProductsDTO';
import { USER_SERVICES } from '../../services/users/users.services';
import { Plus } from 'phosphor-react-native';

export function Home() {
  const theme = useTheme();
  const navigation = useNavigation<PrivateParamsTypes>();

  // variables
  const [user, setUser] = useState<IUserInformation>({} as IUserInformation);
  const [userAdverts, setUserAdverts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getProfile = async () => {
    setIsLoading(true);

    const information = await UserInformationService();

    if(information?.id) {
      setUser(information);
      await getUserProducts();
    }

    setIsLoading(false);
  }

  const getUserProducts = async () => {
    const result = await USER_SERVICES.products();
    if(result) {
      setUserAdverts(result);
    }
  }

  // const searchProductsByFilter = async () => {

  // }

  useFocusEffect(
    useCallback(() => {
      getProfile();
    }, [])
  )

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.base['gray-6']  }}>
        <VStack
          flex={1}
          position="relative"
          bg="base.gray-6"
          p={4}
        >
          <VStack flex={1}>
            {/* Cabeçalho */}
            <HStack w="full" mb={8} space={12} justifyContent="space-between">
              <Profile
                name={user.name}
                avatar={user.avatar}
              />

              <Button
                text="Criar anúncio"
                variant="terciary"
                w={139}
                leftIcon={<Plus color='white' size={20} />}
                onPress={() => navigation.navigate("CreateAd")}
              />
            </HStack>

            {/* Anúncios */}
            <Adverts productsAmount={userAdverts.length} />

            {/* Lista de produtos */}
            <ProductList />
          </VStack>
        </VStack>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
