import { Box, Text, useTheme, Pressable, Stack, IPressableProps } from "native-base";
import { X } from "phosphor-react-native";

type Props = IPressableProps & {
  title: "new" | "used";
  onCancel: () => void;
  isMarked: boolean;
}


export function ConditionItem({ title = "new", isMarked, onCancel, ...rest }: Props) {
  const {colors} = useTheme();

  return (
    <Pressable {...rest}>
      <Stack
        px={3}
        py={1}
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        bg={isMarked ? "product.blue-light" : "base.gray-5"}
        borderRadius={999}
      >
        <Text color={isMarked ? "white" : "base.gray-3"} fontFamily="heading">
          {title === "new" ? "NOVO" : "USADO"}
        </Text>

        {isMarked &&
          <Pressable
            onPress={onCancel}
            bg="base.gray-6"
            p={1}
            rounded="full"
            ml={2}
          >
            <X
              size="10"
              color={colors.product["blue-light"]}
              weight="bold"
            />
          </Pressable>
        }
      </Stack>
    </Pressable>
  )
}
