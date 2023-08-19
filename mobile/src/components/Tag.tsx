import { Text, IBoxProps, Box } from "native-base";

type Props = IBoxProps & {
  tagMessage: string;
}

export function Tag({tagMessage, ...rest}: Props) {
  return (
    <Box
      bg="base.gray-5"
      rounded="full"
      py={1}
      w={16}
      alignItems="center"
      justifyContent="center"
      {...rest}
    >
      <Text
        fontSize="xxs"
        fontFamily="heading"
        textTransform="uppercase"
      >
        {tagMessage}
      </Text>
    </Box>
  )
}
