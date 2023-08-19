import { Box, HStack, Pressable, Text, IPressableProps } from "native-base";
import { Check } from "phosphor-react-native";
import { PressableProps } from "react-native";

type Props = IPressableProps & {
  title: string;
  value: string;
  isMarked: boolean;
}

export function CheckboxStyled({ title, value, isMarked, ...rest }: Props) {

  return (
    <Pressable mb={2} {...rest}>
      <HStack space={2}>
        <Box
          w={5}
          h={5}
          rounded="sm"
          bg={isMarked ? "product.blue-light" : "white" }
          borderColor={isMarked ? "product.blue-light" : "base.gray-4"}
          borderWidth={2}
          alignItems="center"
          justifyContent="center"
        >
          <Check size={16} color="white" weight="bold" />
        </Box>

        <Text fontFamily="body" fontSize="xs">{title}</Text>
      </HStack>
    </Pressable>
  )
}
