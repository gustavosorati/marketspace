import { Box, Heading, HStack } from "native-base";
import { ArrowLeft, PencilSimpleLine } from "phosphor-react-native";
import {StyleSheet, TouchableOpacity} from 'react-native'

interface Props {
  title?: string;
  previousPage: () => void;
  editable?: boolean;
  editablePage?: () => void;
}

export function Header({
  title,
  editable,
  editablePage,
  previousPage
}: Props) {
  return (
    <HStack
      w="full"
      alignItems="center"
      justifyContent="center"
      position="relative"
      bg="base.gray-6"
      h={60}
    >
      <TouchableOpacity
        onPress={previousPage}
        style={styles.button}
      >
        <ArrowLeft size={24} />
      </TouchableOpacity>

      {title
        ? <Heading fontFamily="Karla_700Bold" fontSize="lg">{title}</Heading>
        : <Box />
      }

      {editable
        ? (
          <TouchableOpacity
            onPress={editablePage}
            style={{ position: "absolute", right: 16 }}
          >
            <PencilSimpleLine size={24} />
          </TouchableOpacity>
        ) : <Box />}

    </HStack>
  )
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    left: 16,
  }
})
