import { Checkbox, Circle, HStack, Icon, Image, Pressable, Radio, ScrollView, Stack, Switch, Text, VStack, useTheme } from "native-base";
import { useCallback, useEffect, useState } from "react";
import { Alert, SafeAreaView } from "react-native";
import { Button } from "../../../../components/Button";
import { Header } from "../../../../components/Header";
import { Input } from "../../../../components/Input";
import { UploadImage } from "../../../../components/UploadImage";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { PrivateParamsTypes } from "../../../../routes/private.routes";
import { X } from "phosphor-react-native";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PRODUCTS_SERVICES } from "../../../../services/products.services";
import { IProductImage } from "../../../../dtos/ProductsDTO";
import { IMAGE_API } from "../../../../services/http/api";

interface ImageType {
  path: string,
  type: string | undefined
}

type RouteParams = {
  productId: string;
}

const updateAdSchema = z.object({
  name: z.string(),
  description: z.string().max(280, "Limite de 140 caracteres"),
  price: z.string(),
})

type UpdadeAdSchemaType = z.infer<typeof updateAdSchema>;


export function UpdateAd() {
  const theme = useTheme();
  const routes = useRoute();
  const navigation = useNavigation<PrivateParamsTypes>();

  const params = routes.params as RouteParams;

  const { control, handleSubmit, setValue } = useForm<UpdadeAdSchemaType>({
    resolver: zodResolver(updateAdSchema),
  });

  const [isLoading, setIsLoading] = useState(true);

  const [condition, setCondition] = useState(true);
  const [acceptTrade, setAcceptTrade] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);

  const [images, setImages] = useState<ImageType[]>([]);
  const [imagesToExclude, setImagesToExclude] = useState<{ path: string, id: string }[]>([]);

  const pickImages = async () => {
    let photoSelected = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if(photoSelected.canceled) return;

    if(photoSelected.assets[0].uri) {
      const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets
        [0].uri, { size: true });

      if(photoInfo.exists && photoInfo.size && (photoInfo.size / 1024 / 1024) > 5){
        Alert.alert(
          "A imagem é muito grande",
          "A imagem deve ter no máximo 5mb"
        );
        return;
      }
    }

    if(images.length < 3) {
      setImages([...images, {
        path: photoSelected.assets[0].uri,
        type: photoSelected.assets[0].type
      }]);
    } else {
      Alert.alert(
        "Limite de imagens excedido.",
        "Só é possível adicionar 3 imagens"
      );
      return;
    }
  };

  const removeImageByIndex = (index: number) => {

    const copyImages = [...images];

    const filteredImage = copyImages.find((image, i) => {
      if(index === i) return image;
    });

    if(filteredImage){
      const isExternal = !filteredImage.path.startsWith("file://");

      if(isExternal)
        setImagesToExclude([...imagesToExclude, {
          id: filteredImage.type!,
          path: filteredImage.path
        }]);
    }

    copyImages.splice(index, 1);
    setImages(copyImages);
  }

  const handleSeePreview = async (data: UpdadeAdSchemaType) => {
    if(images.length === 0) {
      Alert.alert(
        "Nenhuma imagem encontrada",
        "Você deve enviar ao menos 1 imagem"
      );
      return;
    }

    if(paymentMethods.length === 0) {
      Alert.alert(
        "Nenhuma opção de pagamento selecionada",
        "Selecione pelo menos uma forma de recebimento"
      );
      return;
    }

    navigation.navigate("AdPreviewUpdate", {
      productId: params.productId,
      name: data.name,
      description: data.description,
      price: data.price,
      is_new: condition,
      accept_trade: acceptTrade,
      payment_methods: paymentMethods,
      images: images,
      imagesExclude: imagesToExclude
    })
  }

  const fetchProductDetails = async () => {
    setIsLoading(true);
    const result = await PRODUCTS_SERVICES.listById(params.productId);

    if(result) {
      setValue("name", result.name);
      setValue("description", result.description);
      setValue("price", String(result.price));
      setCondition(result.is_new);
      setAcceptTrade(result.accept_trade);
      setPaymentMethods(result.payment_methods.map(method => method.key))
      setImages(result.product_images.map((product) => {
        return {
          type: product.id,
          path: product.path
        }
      }));
    }

    setIsLoading(false);
  }

  useEffect(() => {
    fetchProductDetails();
  }, []);

  return (
    <VStack flex={1}>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.base["gray-6"] }}>
        <VStack flex={1} bg="base.gray-6">
          <Header
            title="Editar anúncio"
            previousPage={() => navigation.navigate("TabNavigation")}
          />

          {!isLoading &&
            <ScrollView
              flex={1}
              showsVerticalScrollIndicator={false}
            >
              <VStack px={6}>
                {/* Upload Image */}
                <VStack mb={6}>
                  <Text fontFamily="heading" fontSize="md">Imagens</Text>
                  <Text color="base.gray-3" fontSize="xs" mb={4}>
                    Escolha até 3 imagens para mostrar o quando o seu produto é incrível!
                  </Text>

                  <HStack space={2}>
                    {/* Pick Image */}
                    <UploadImage onPress={pickImages} />

                    {/* Images Preview */}
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                        gap: 8
                      }}
                    >
                      {images.map((image, index) => {
                        const isInternal = image.path.startsWith("file://");

                        return (
                          <Stack
                            key={index}
                            position="relative"
                            w={100}
                            h={100}
                          >
                            <Pressable
                              w={5}
                              h={5}
                              bg="base.gray-2"
                              alignItems="center"
                              justifyContent="center"
                              rounded="full"
                              position="absolute"
                              zIndex={10}
                              top={1}
                              right={1}
                              onPress={() => removeImageByIndex(index)}
                            >
                              <X size={12} weight="bold" color="white"/>
                            </Pressable>

                            <Image
                              w={100}
                              h={100}
                              rounded="md"
                              source={{ uri: isInternal ? image.path : `${IMAGE_API}/${image.path}` }}
                              alt={String(index)}
                            />
                          </Stack>
                        )
                      })}
                    </ScrollView>
                  </HStack>
                </VStack>

                  {/* About prodruct */}
                  <VStack space={4}>
                    <Text fontFamily="heading" fontSize="md">Sobre o produto</Text>

                    <Controller
                      control={control}
                      name="name"
                      render={({
                        field: { onChange, value },
                        fieldState: { error }
                      }) => (
                        <Input
                          type="text"
                          placeholder="Título do anúncio"
                          onChangeText={onChange}
                          value={value}
                          error={error?.message}
                        />
                      )}
                    />

                    <Controller
                      control={control}
                      name="description"
                      render={({
                        field: { onChange, value },
                        fieldState: { error }
                      }) => (
                        <Input
                          type="text"
                          placeholder="Descrição do produto"
                          multiline={true} numberOfLines={5} textAlignVertical="top" h={40}
                          onChangeText={onChange}
                          value={value}
                          error={error?.message}
                        />
                      )}
                    />

                    <Radio.Group
                      name="condition"
                      accessibilityLabel="state of use"
                      value={condition ? "new" : "used"}
                      onChange={(nextValue) => {
                        setCondition(nextValue === "new" ? true : false);
                      }}
                    >
                      <HStack space={4}>
                        <Radio
                          value="new"
                          _checked={{
                            borderColor: "product.blue-light",
                          }}
                          icon={<Icon as={<Circle w={10} h={10} bg="product.blue-light" />} />}
                        >
                          Produto novo
                        </Radio>

                        <Radio
                          value="used"
                          _checked={{
                            borderColor: "product.blue-light",
                          }}
                          icon={<Icon as={<Circle w={10} h={10} bg="product.blue-light" />} />}
                        >
                          Produto usado
                        </Radio>
                      </HStack>
                    </Radio.Group>
                  </VStack>

                  <VStack space={4} mt={6} alignItems="flex-start">
                    <Text fontFamily="heading" fontSize="md">Venda</Text>

                    {/* Price */}
                    <Controller
                      control={control}
                      name="price"
                      render={({
                        field: { onChange, value },
                        fieldState: { error }
                      }) => (
                        <Input
                          type="text"
                          keyboardType="numeric"
                          placeholder="Valor do produto"
                          InputLeftElement={<Text ml={2}>R$</Text>}
                          onChangeText={onChange}
                          value={value}
                          error={error?.message}
                        />
                      )}
                    />

                    {/* Switch - Devolution */}
                    <VStack alignItems="flex-start">
                      <Text fontFamily="heading" fontSize="xs">Aceita troca?</Text>
                        <Switch
                          size="md"
                          m={0}
                          mt={2}
                          p={0}
                          offTrackColor={theme.colors.base["gray-5"]} onTrackColor={theme.colors.product["blue-light"]} onThumbColor="white" offThumbColor="white"
                          onToggle={value => setAcceptTrade(value)}
                          value={acceptTrade}

                        />
                    </VStack>

                    <VStack alignItems="flex-start" space={4}>
                      <Text fontFamily="heading" fontSize="xs">Meios de pagamento aceitos</Text>

                      <Checkbox.Group
                        onChange={(value) => setPaymentMethods(value || [])}
                        value={paymentMethods}
                        accessibilityLabel="Escolha o método de pagamento."
                      >
                        <VStack space={2}>
                          <Checkbox
                            value="boleto"
                            accessibilityLabel="Boleto"
                            _checked={{
                              bg: "product.blue-light",
                              borderColor: "product.blue-light",
                            }}
                          >Boleto</Checkbox>

                          <Checkbox
                            value="pix"
                            accessibilityLabel="Pix"
                            _checked={{
                              bg: "product.blue-light",
                              borderColor: "product.blue-light",
                            }}
                          >Pix</Checkbox>

                          <Checkbox
                            value="cash"
                            accessibilityLabel="Dinheiro"
                            _checked={{
                              bg: "product.blue-light",
                              borderColor: "product.blue-light",
                            }}
                          >Dinheiro</Checkbox>

                          <Checkbox
                            value="card"
                            accessibilityLabel="Cartão de crédito"
                            _checked={{
                              bg: "product.blue-light",
                              borderColor: "product.blue-light",
                            }}
                          >Cartão de crédito</Checkbox>

                          <Checkbox
                            value="deposit"
                            accessibilityLabel="Depósito Bancário"
                            _checked={{
                              bg: "product.blue-light",
                              borderColor: "product.blue-light",
                            }}
                          >Depósito Bancário</Checkbox>
                        </VStack>
                      </Checkbox.Group>
                    </VStack>
                </VStack>
              </VStack>

              <HStack flex={1} mt={6} space={4} p={4} bg="white">
                <Button
                  text="Cancelar"
                  variant="secondary"
                  flex={1}
                  onPress={() => navigation.goBack()}
                />

                <Button
                  text="Avançar"
                  variant="terciary"
                  flex={1}
                  onPress={handleSubmit(handleSeePreview)}
                />
              </HStack>
            </ScrollView>
          }
        </VStack>
      </SafeAreaView>
      <SafeAreaView style={{backgroundColor: "white"}} />
    </VStack>
  )
}
