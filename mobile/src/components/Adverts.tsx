import { useNavigation } from "@react-navigation/native";
import { Box, HStack, Text, useTheme, VStack } from "native-base";
import { ArrowRight, Tag } from "phosphor-react-native";
import { TabParamsList } from "../routes/tab.routes";
import { Alert, TouchableOpacity } from "react-native";

interface Props {
  productsAmount: number;
}

export function Adverts({ productsAmount }: Props) {
  const { colors } = useTheme();
  const navigation = useNavigation<TabParamsList>();

  const handleNavigate = () => {
    if(productsAmount === 0) {
      return Alert.alert("Nenhum produto encontrado", "Você não publicou nenhum produto.")
    }

    navigation.navigate("Advertisements");
  }

  return (
    <VStack w="full" space={4}>
      <Text fontSize="xs" fontFamily="body" color="base.gray-3">
        Seus produtos anunciados para venda
      </Text>

      <TouchableOpacity onPress={handleNavigate}>
        <HStack w="full" py={"3"} px={4} justifyContent="space-between" alignItems="center" bg="product.blue/10" rounded="md">

          <HStack space={4} alignItems="center">
            <Tag size={26}  color={colors.product.blue} />
            <Box>
              <Text fontSize="lg" fontFamily="heading">{productsAmount}</Text>
              <Text fontSize="xs" fontFamily="body">anúncios ativos</Text>
            </Box>
          </HStack>

            <Box flexDirection="row" alignItems="center">
              <Text fontSize="xs" fontFamily="heading" color="product.blue" mr={4}>
                Meus anúncios
              </Text>
              <ArrowRight size={16} weight="bold" color={colors.product.blue} />
            </Box>
        </HStack>
      </TouchableOpacity>
    </VStack>
  )
}
