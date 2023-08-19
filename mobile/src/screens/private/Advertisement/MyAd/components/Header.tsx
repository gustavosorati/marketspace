import { Text, VStack } from "native-base";

export function Header() {
  return (
    <VStack bg="product.blue-light" alignItems="center" justifyContent="center" py={4} px={6}>
      <Text fontFamily="heading" fontSize="xs" color="base.gray-7">
        Pré visualização do anúncio
      </Text>

      <Text fontSize="xxs" color="base.gray-7">
        É assim que seu produto vai aparecer!
      </Text>
    </VStack>
  )
}