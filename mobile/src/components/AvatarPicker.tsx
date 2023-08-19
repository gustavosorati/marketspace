import { Box, Image, Text, useTheme } from "native-base";
import { PencilSimpleLine, User } from 'phosphor-react-native';
import { TouchableOpacityProps } from "react-native";
import { TouchableOpacity } from "react-native";

type Props = TouchableOpacityProps & {
  image?: string;
  error?: string;
}

export function AvatarPicker({ image, error, ...rest }: Props) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity style={{ alignItems: "center" }}
    {...rest}>
      <Box
        position="relative"
        bg="base.gray-5"
        w={88}
        h={88}
        rounded="full"
        borderWidth={3}
        borderColor={error ? "product.red-light" : "product.blue"}
        alignItems="center"
        justifyContent="center"
      >
        {image
          ? <Image source={{ uri: image }} w="full" h="full"         rounded="full" alt="user_avatar"/>
          : <User weight="bold" size={48} color={colors.base["gray-4"]} />
        }

        <Box position="absolute" bg={error ? "product.red-light" : "product.blue"} w={10} h={10} rounded="full" alignItems="center" justifyContent="center" bottom="0" right="-10px">
          <PencilSimpleLine size={18} color="white" />
        </Box>
      </Box>

      {error &&
        <Text
          fontSize="mini"
          fontFamily={"Karla_700Bold"}
          color="product.red-light"
          mt={1}
        >
          {error}
        </Text>
      }
    </TouchableOpacity>
  )
}
