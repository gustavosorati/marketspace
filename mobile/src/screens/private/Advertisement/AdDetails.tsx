import React, { useCallback, useState } from 'react';
import { Button as NativeBaseButton, HStack, ScrollView, Text, useTheme, VStack } from 'native-base';
import { Header } from '../../../components/Header';
import {Alert, Linking, Platform, SafeAreaView } from 'react-native';
import { ProductImageSlider } from '../../../components/ProductImageSlider';
import { AdDetailsContent } from '../../../components/AdDetailsContent';
import { Power, Trash, WhatsappLogo } from 'phosphor-react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { PRODUCTS_SERVICES } from '../../../services/products.services';
import { IProduct, IProductDetails } from '../../../dtos/ProductsDTO';
import { PrivateParamsTypes } from '../../../routes/private.routes';
import { Loading } from '../../../components/Loading';
import { ToastNotification } from '../../../helpers/ToastNotification';
import { useAuthentication } from '../../../contexts/AuthContext';
import { Button } from '../../../components/Button';

const isAndroid = Platform.OS === "android";

type RouteParams = {
  id: string;
}

export function AdDetails() {
  const { user } = useAuthentication();
  const { colors } = useTheme();
  const route = useRoute();
  const navigation = useNavigation<PrivateParamsTypes>();

  const params = route.params as RouteParams;

  const [product, setProduct] = useState<IProductDetails>({} as IProductDetails);
  const [isLoading, setIsLoading] = useState(true);

  const navigateGoBack = () => navigation.goBack();

  const navigateToEditable = () => navigation.navigate("UpdateAd", {
    productId: product.id
  });

  const fetchProductDetails = async () => {
    setIsLoading(true);
    const result = await PRODUCTS_SERVICES.listById(params.id);

    if(result?.id) setProduct(result);
    setIsLoading(false);
  }

  const disableAd = async () => {
    try {
      setIsLoading(true);
      const is_active = !product.is_active;
      await PRODUCTS_SERVICES.disable(params.id, is_active);

      await fetchProductDetails();
      setIsLoading(false);
    } catch (error) {
      ToastNotification({
        type: "error",
        message: "Error",
        description: "Tente novamente mais tarde"
      })
    }
  }

  const deleteProduct = async () => {
    setIsLoading(true);

    Alert.alert('Exclusão', 'Você tem certeza que deseja continuar', [
      {
        text: 'Cancelar',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'Continuar', onPress: async () => await PRODUCTS_SERVICES.exclude(params.id)},
    ]);

    setIsLoading(false);
  }

  const contactVendor = async () => {
    try {
      let url = `https://wa.me/55${product.user.tel}`;

      await Linking.openURL(url);
    } catch (error) {
      ToastNotification({
        type: "error",
        message: "Error ao enviar mensagem ao vendedor",
        description: "Tente novamente mais tarde"
      });
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchProductDetails();
    }, [params.id])
  );

  const authorIsUser = product.user_id === user.id;

  return (
    <VStack flex={1}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.base['gray-6'] }}>
        {isLoading &&
          <VStack flex={1} bg="base.gray-6" alignItems="center" justifyContent="center">
            <Loading />
          </VStack>
        }

        {!isLoading &&
          <VStack
            flex={1}
            bg="base.gray-6"
            pt={isAndroid ? 10 : 0}
          >
            {/* Header */}
            <Header
              previousPage={navigateGoBack}
              editable={product.user_id === user.id}
              editablePage={navigateToEditable}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Product Image Slider */}
              <ProductImageSlider
                images={product.product_images}
                isActive={product.is_active}
              />

              {/* Section details product */}
              <AdDetailsContent product={product} />

              {/* Footer */}
              {!authorIsUser &&
                <HStack bg="white" p={6} alignItems="center" justifyContent="space-between">
                  <Text fontFamily="heading" fontSize="md" color="product.blue">
                    R$ &nbsp;
                    <Text fontSize="xl">{product.price}</Text>
                  </Text>

                  <NativeBaseButton
                    bg="product.blue-light"
                    _pressed={{
                      bg: "product.blue"
                    }}
                    w={180}
                    h={42}
                    onPress={contactVendor}
                  >
                    <HStack alignItems="center" justifyContent="center" space={2}>
                      <WhatsappLogo
                        size={18}
                        weight="fill"
                        color={colors.base['gray-6']}
                      />

                      <Text
                        color="base.gray-7"
                        fontFamily="heading"
                      >
                        Entrar em contato
                      </Text>
                    </HStack>
                  </NativeBaseButton>
                </HStack>
              }

              {authorIsUser &&
                <VStack space={2} p={6} bg="white">
                  <Button
                    text={product.is_active ? 'Desativar anúncio' : "Ativar anúncio"}
                    variant={product.is_active ? "terciary" : "primary"}
                    leftIcon={<Power color='white' />}
                    onPress={disableAd}
                  />

                  <Button
                    text='Excluir anúncio'
                    variant="secondary"
                    leftIcon={<Trash color='black' />}
                    onPress={deleteProduct}
                  />
                </VStack>
              }


            </ScrollView>
          </VStack>
        }
      </SafeAreaView>
      <SafeAreaView style={{ backgroundColor: colors.white }} />
    </VStack>

  );
}


