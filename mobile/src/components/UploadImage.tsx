import { Box, useTheme } from "native-base";
import { Plus } from "phosphor-react-native";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps;

export function UploadImage({ ...rest }: Props) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity {...rest}>
      <Box
        w={100}
        h={100}
        bg="base.gray-5"
        alignItems="center"
        justifyContent="center"
        rounded="md"
      >
          <Plus size={24} color={colors.base["gray-4"]} />
      </Box>
    </TouchableOpacity>
  )
}
