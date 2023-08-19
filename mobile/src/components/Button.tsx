import React from 'react';
import { Button as NativeBaseButton, HStack, IButtonProps, Text, Spinner } from 'native-base';

type Props = IButtonProps & {
  variant?: 'primary' | 'secondary' | 'terciary';
  text: string;
  leftIcon?: React.ReactElement;
  loading?: boolean;
}

export function Button({
  text,
  variant = "primary",
  leftIcon,
  loading = false,
  ...rest
}: Props) {
  return (
    <NativeBaseButton
      w="full"
      h={12}
      bg={variant === 'primary' ? "product.blue-light"
        : variant === 'secondary' ? "base.gray-5"
        : 'black'}
      _pressed={{
        bg: variant === 'primary' ? "product.blue"
        : variant === 'secondary' ? "base.gray-7"
        : 'base.gray-3',
      }}
      borderRadius={6}
      {...rest}
    >
      <HStack space={1} alignItems="center" justifyContent="center">
        {leftIcon && leftIcon}
        <Text color={variant === "secondary" ? "black" : "white"} fontFamily={"heading"} fontSize={14}>{text}</Text>
        {loading && <Spinner color={"base.gray-5"} />}
      </HStack>
    </NativeBaseButton>
  );
}
