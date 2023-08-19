import { Box, FlatList,Text, VStack } from "native-base";
import { useCallback, useMemo, useRef, useState } from "react";
import { SearchBar } from "./SearchBar";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { PRODUCTS_SERVICES } from "../services/products.services";
import { IProduct } from "../dtos/ProductsDTO";
import { Filter } from "./Filter";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";
import { Loading } from "./Loading";
import { ProductCardActive } from "./ProductCardActive";

interface IUpdateFilters {
  is_new?: boolean;
  accept_trade?: boolean;
  payment_methods: string[];
  query?: string;
}

interface IFilters {
  is_new?: boolean;
  accept_trade?: boolean;
  payment_methods: string[];
  query?: string;
}

export function ProductList() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filter, setFilter] = useState<IFilters>({} as IFilters);

  const snapPoints = useMemo(() => ['25%', '65%'], []);

  /* ref */
  const filterModalRef = useRef<BottomSheetModal>(null);

  /* callbacks */
  const handlePresentModalFilter = useCallback(() => filterModalRef.current?.present(), []);

  const handleFetchProducts = async () => {
    setIsLoading(true);

    const results = await PRODUCTS_SERVICES.list({
      is_new: filter.is_new,
      accept_trade: filter.accept_trade,
      payment_methods: filter.payment_methods,
      query: filter.query
    });

    if(results) setProducts(results);

    setIsLoading(false);
  };

  const handleUpdateFilters = async ({
    is_new,
    accept_trade,
    payment_methods,
  }: IUpdateFilters) => {

    setFilter({
      ...filter,
      is_new,
      accept_trade,
      payment_methods,
    });
  }

  const handleUpdateQuery = (query?: string) => {
    setFilter({
      ...filter,
      query
    });
  }

  useFocusEffect(
    useCallback(() => {
      handleFetchProducts();
    }, [filter])
  )

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <VStack flex={1} w="full" space={4} mt={8}>
        <Text
          fontSize="xs"
          fontFamily="body"
          color="base.gray-3"
          mb={2}
        >
          Compre produtos variados
        </Text>

        <SearchBar
          onSearch={handleUpdateQuery}
          onRequestModal={handlePresentModalFilter}
        />

        <VStack flex={1} w="full">
          {isLoading &&
            <VStack flex={1} alignItems="center" justifyContent="center">
              <Loading size="lg" />
            </VStack>
          }

          {!isLoading &&
            <FlatList
              data={products}
              keyExtractor={(item) => item.id}
              numColumns={2}
              renderItem={({item, index}) => (
                <ProductCardActive index={index} product={item} />
              )}
              ItemSeparatorComponent={() => <Box h={6} />}
              _contentContainerStyle={{
                flex: 1,
                alignItems: products?.length === 1 ? 'flex-start' : 'center'
              }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => (
                <VStack flex={1} alignItems="center" justifyContent="center">
                  <Text>Nenhum produto encontrado.</Text>
                </VStack>
              )}
            />
          }
        </VStack>

        {/* Filter Modal */}
        <Filter
          modal={filterModalRef}
          snapPoints={snapPoints}
          onUpdateFilters={handleUpdateFilters}
        />
      </VStack>
    </TouchableWithoutFeedback>
  )
}

