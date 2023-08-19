import React from 'react';
import { Heading, HStack, Image, Stack, Text, VStack } from 'native-base';
import productImg  from '../assets/product.png'
import { Dimensions, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { IProduct } from '../dtos/ProductsDTO';
import { useNavigation } from '@react-navigation/native';
import { PrivateParamsTypes } from '../routes/private.routes';
import { IMAGE_API } from '../services/http/api';

type Props = TouchableOpacityProps & {
  product: IProduct & {
    is_active: boolean;
  };
  index: number;
}

const GAP = 12;
const PADDING = 24;
const SCREEN_SIZE = Dimensions.get("window").width;
const CARD_SIZE = (SCREEN_SIZE -  GAP - (PADDING * 2)) / 2;

export function ProductCard({
  index,
  product,
  ...rest
}: Props) {
  const navigation = useNavigation<PrivateParamsTypes>();

  const imagePath = product?.product_images[0]?.path

  const navigateToDetails = () => navigation.navigate("AdDetails", { id: product.id });

  return (
    <TouchableOpacity onPress={navigateToDetails} {...rest}>
      <VStack
        width={CARD_SIZE}
        ml={index % 2 !== 0 ? 3 : 0}
        // mr={index % 2 === 0 ? 3 : 0}
        mb={1}
        position="relative"
      >
        {!product.is_active &&
          <VStack
            position="absolute"
            top={0}
            w="full"
            h="full"
            bg="base.black/60"
            rounded="md"
            zIndex={10}
            px={2}
            py={1}
            alignItems="flex-start"
            justifyContent="flex-end"
          >
            <Text color="white">Anuncio desativado</Text>
          </VStack>
        }

        {imagePath &&
          <Image
            source={{ uri: `${IMAGE_API}${imagePath}` }}
            w={165}
            h={100}
            alt={product.name}
            rounded="md"
          />
        }

        {product.user &&
          <HStack position="absolute"
          alignItems="center" justifyContent="space-between" w="full" p={2}>
            <Image
              source={{ uri: `${IMAGE_API}${product.user.avatar}` }}
              w={6}
              h={6}
              alt={product.name}
              rounded="full"
              borderColor="white"
            />

            <Stack bg={product.is_new ? "product.blue" : "base.gray-2"} rounded="full" >
              <Text py={1} px={2} color="white" fontSize="10px" fontFamily="heading" >{product.is_new ? "Novo" : "Usado"}</Text>
            </Stack>
          </HStack>
        }
      </VStack>

      <VStack
        space={2}
        width={CARD_SIZE}
        ml={index % 2 !== 0 ? 3 : 0}
      >
        <Text
          fontSize="xs"
          fontFamily="body"
          color="base.gray-2"
        >
          {product.name}
        </Text>

        <HStack>
          <Text fontFamily="heading" fontSize="md">R$</Text>
          <Heading fontSize="lg" fontFamily="heading">{product.price}</Heading>
        </HStack>

      </VStack>


    </TouchableOpacity>
  );
}
