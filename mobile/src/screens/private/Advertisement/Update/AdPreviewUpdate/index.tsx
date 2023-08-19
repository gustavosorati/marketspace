import { HStack, ScrollView, useTheme, VStack } from 'native-base'
import { ArrowLeft, Tag } from 'phosphor-react-native'
import { Platform, SafeAreaView } from 'react-native'
import { AdDetailsContent } from '../../../../../components/AdDetailsContent'
import { Button } from '../../../../../components/Button'
import { ProductImageSlider } from '../../../../../components/ProductImageSlider'
import { Header } from './components/Header'
import { useNavigation, useRoute } from '@react-navigation/native'
import { PrivateParamsTypes } from '../../../../../routes/private.routes'
import { ProductImagePreviewSlider } from '../../../../../components/ProductImagePreviewSlider'
import { useState } from 'react'
import { PRODUCTS_SERVICES } from '../../../../../services/products.services'
import { ToastNotification } from '../../../../../helpers/ToastNotification'
import { PRODUCTIMAGES_SERVICES } from '../../../../../services/productImages.services'
import { AdDetailsPreviewContent } from '../../../../../components/AdDetailsPreviewContent'
import { Loading } from '../../../../../components/Loading'

interface ImageProps {
  name: string;
  uri: string;
  type: string;
}

interface RouteParams {
  productId: string;
  name: string;
  description: string;
  is_new: boolean;
  price: number;
  accept_trade: boolean;
  payment_methods: string[];
  images: { path: string, type: string | undefined }[];
  imagesExclude?: { path: string, id: string }[];
}

export function AdPreviewUpdate() {
  const { colors } = useTheme();
  const navigation = useNavigation<PrivateParamsTypes>();
  const routes = useRoute();
  const params = routes.params as RouteParams;

  const [isLoading, setIsLoading] = useState(false);

  const navigateGoBack = () => {
    navigation.goBack();
  }

  const updateProductPhotos = async (productId: string) => {
    try {
      const imageData = new FormData();
      let isUpdate = false;

      // Preciso verificar se realmente tem alguma imagem para alterar
      params.images.forEach((image, index) => {
        if(image.path.startsWith("file://")) {
          isUpdate = true;
          const fileExtension = image.path.split(".").pop();

          const now = new Date().getTime();

          const photoFile = {
            name: String(now),
            uri: image.path,
            type: `${image.type}/${fileExtension}`
          } as any;

          imageData.append("images", photoFile);
       }
      });

      imageData.append("product_id", productId);

      if(isUpdate)
        await PRODUCTIMAGES_SERVICES.update(imageData);

    } catch (error) {
      ToastNotification({
        type: "error",
        message: "Erro ao cadastrar as imagens",
        description: "Não foi possível cadastrar suas imagens no momento",
      });
    }
  }

  const excludePhotos = async () => {
    try {
      if(params.imagesExclude) {
        let imagesExcludesId: string[] = [];

        params.imagesExclude?.forEach(img => {
          imagesExcludesId.push(img.id!)
        })

        await PRODUCTIMAGES_SERVICES.remove(imagesExcludesId);

        ToastNotification({
          type: "success",
          message: "Imagens excluídas",
        });
      }
    } catch (error) {
      ToastNotification({
        type: "error",
        message: "Imagens excluídas",
      });
    }
  }

  const handleUpdateAd = async () => {
    try {
      setIsLoading(true);

      await PRODUCTS_SERVICES.update({
        productId: params.productId,
        name: params.name,
        description: params.description,
        price: Number(params.price),
        accept_trade: params.accept_trade,
        is_new: params.is_new,
        payment_methods: params.payment_methods
      });

      if(params.imagesExclude && params.imagesExclude?.length > 0)
        await excludePhotos();

      await updateProductPhotos(params.productId);

      ToastNotification({
        type: "success",
        message: "Cadastro atualizado com sucesso",
        description: "Você vai ser redirecionado",
        onClose: () => navigation.navigate("TabNavigation")
      });

    } catch (error) {
      ToastNotification({
        type: "error",
        message: "Um erro aconteceu.",
        description: "Tente novamente mais tarde"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return(
    <VStack flex={1} position="relative">
      {isLoading &&
        <VStack w="full" h="full" position="absolute" bg="base.black/60" zIndex={10} top={0} left={0}>
          <Loading size='lg' />
        </VStack>
      }

      <SafeAreaView style={{ backgroundColor: colors.product['blue-light']}} />
      <SafeAreaView style={{ flex: 1 }}>

        <VStack flex={1} bg="base.gray-6">
          <Header />

          <ScrollView showsVerticalScrollIndicator={false}>

            <ProductImagePreviewSlider images={params.images} />

            <AdDetailsPreviewContent product={params} />
          </ScrollView>
        </VStack>

          <HStack bg="white" p={4} space={4}>
            <Button
              text='Voltar e editar'
              leftIcon={<ArrowLeft size={16} />}
              variant="secondary"
              flex={1}
              onPress={navigateGoBack}
            />

            <Button
              text='Publicar'
              leftIcon={<Tag size={16} weight='bold' color={colors.base['gray-7']} />}
              flex={1}
              onPress={handleUpdateAd}
            />
          </HStack>
      </SafeAreaView>
      <SafeAreaView style={{ backgroundColor: "white" }} />
    </VStack>
  )
}
