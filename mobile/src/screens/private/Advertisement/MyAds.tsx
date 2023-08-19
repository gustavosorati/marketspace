import { useCallback, useState } from "react";
import { Platform, TouchableOpacity } from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { CaretDown, CaretUp, Plus } from "phosphor-react-native";

import { Loading } from "../../../components/Loading";
import { ProductCard } from "../../../components/ProductCard";

import { USER_SERVICES } from "../../../services/users/users.services";

import { IProduct } from "../../../dtos/ProductsDTO";

import { PrivateParamsTypes } from "../../../routes/private.routes";

import { Heading, HStack, Text, VStack, Box, FlatList, Menu, Pressable, Select } from "native-base";

type Product = IProduct & {
  is_active: boolean;
}

const isAndroid = Platform.OS === "android";

export function MyAds() {
  const navigation = useNavigation<PrivateParamsTypes>();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState<string>("all");

  const navigateCreateAdvertisement = () => navigation.navigate("CreateAd");

  const fetchProductDetails = async () => {
    setIsLoading(true);
    const result = await USER_SERVICES.products();

    if(result) {
      setProducts(result);

      if(isActive !== "all") {
        const filteredProducts = result.filter((product) => product.is_active === JSON.parse(isActive));

        setProducts(filteredProducts);
      }
    }
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      fetchProductDetails();
    }, [isActive])
  );

  return (
    <VStack
      flex={1}
      bg="base.gray-6"
      px={6}
      pt={isAndroid ? 10 : 16}
    >
      {/* Header */}
      <HStack alignItems="center" justifyContent="center" mb={8}>
        <Box flex={1} alignItems="center" justifyContent="center">
          <Heading>Meus anúncios</Heading>
        </Box>

        <TouchableOpacity onPress={navigateCreateAdvertisement}>
          <Plus size={24} />
        </TouchableOpacity>
      </HStack>

      {isLoading &&
        <VStack flex={1} alignItems="center" justifyContent="center">
          <Loading size="lg" />
        </VStack>
      }

      {!isLoading &&
        <>
          <HStack alignItems="center" justifyContent="space-between" mb={6}>
            <Text color="base.gray-2" fontSize="xxs">{products.length} anúncios</Text>

            <Box maxW="111">
              <Select
                w={120}
                defaultValue="all"
                onValueChange={nextValue => setIsActive(nextValue)}
              >
                <Select.Item label="Todos" value="all">Todos</Select.Item>
                <Select.Item label="Ativos" value="true">Ativos</Select.Item>
                <Select.Item label="Inativos" value="false">Inativos</Select.Item>
              </Select>
            </Box>
          </HStack>

          <VStack flex={1} w="full" pb={8}>
            <FlatList
              data={products}
              keyExtractor={(item) => item.id}
              numColumns={2}
              renderItem={({item, index}) => (
                <ProductCard product={item} index={index} />
              )}
              ItemSeparatorComponent={() => <Box h={6} />}
              _contentContainerStyle={{ alignItems: 'flex-start' }}
              showsVerticalScrollIndicator={false}
            />
          </VStack>
        </>
      }
    </VStack>
  )
}
