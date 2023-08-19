import { Heading, HStack, Text, VStack } from "native-base";
import { Bank, Barcode, CreditCard, Money, QrCode } from "phosphor-react-native";
import { ProfilePhoto } from "./Profile/ProfilePhoto";
import { Tag } from "./Tag";
import { useAuthentication } from "../contexts/AuthContext";
import { IProductDetails } from "../dtos/ProductsDTO";

interface Props {
  product: IProductDetails;
};

// {"key": "pix", "name": "Pix"}

export function AdDetailsContent({ product }: Props) {
  const { user } = useAuthentication();

  return (
    <VStack flex={1} p={6} space={6}>

      {/* Author */}
      <HStack space={3} alignItems="center">
        <ProfilePhoto
          user={{
            name: user.name,
            avatar: user.avatar
          }} w={8} h={8} />
        <Text fontSize={"md"}>{user.name}</Text>
      </HStack>

      {/* Informations */}
      <VStack space={2}>
        <Tag tagMessage={product.is_new ? "Novo" : "Usado"} mb={2} />

        <HStack alignItems="center" justifyContent="space-between">
          {/* Type */}
          <Heading
            flex={1}
            fontFamily="heading"
            fontSize="lg"
          >{product.name}</Heading>

          {/* Title */}
          <Text fontFamily="heading" fontSize="md" color="product.blue-light">
            R$ &nbsp;
            <Text fontSize="lg">{product.price}</Text>
          </Text>
        </HStack>

        {/* Description */}
        <Text fontSize="md" textAlign="justify">
          {product.description}
        </Text>

        {/* Accept Devolution */}
        <HStack mt={4} space={2}>
          <Text fontFamily="heading">Aceita troca?</Text>
          <Text>{product.accept_trade ? "Sim" : "Não"}</Text>
        </HStack>

        {/* Payments Accepteds */}
        <VStack mt={4} space={2}>
          <Text fontFamily="heading">Meios de pagamento:</Text>

          {product.payment_methods.map((method, index) => (
            <HStack key={method.key} alignItems="center" space={2}>
              {method.name === "Pix"
                ? <QrCode size={18} />
                : method.name === "Boleto"
                  ? <Barcode size={18} />
                  : method.name === "Dinheiro"
                    ? <Money size={18} />
                    : method.name === "Cartão de Crédito"
                      ? <CreditCard size={18} />
                      : <Bank size={18} />
              }
              <Text>{method.name}</Text>
            </HStack>

          ))}
        </VStack>
      </VStack>
    </VStack>
  )
}
