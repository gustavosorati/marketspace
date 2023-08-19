import React, { useState } from 'react';
import { Input as NativeBaseInput, IInputProps, Pressable, useTheme, Text, FormControl } from 'native-base';
import {Eye, EyeClosed} from 'phosphor-react-native';

type Props = IInputProps & {
  type: 'text' | 'password';
  error?: string;
}

export function Input({type, error, ...rest}: Props) {
  const {colors} = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <FormControl>
      <NativeBaseInput
        type={type === 'text' ? type : isPasswordVisible ? "text" : "password"}
        w="full"
        h={12}
        bg={error ? "red.100" : "base.gray-7"}
        borderRadius={'md'}
        borderWidth={'1'}
        borderColor="transparent"
        _focus={{
          borderColor: "base.gray-3",
          bg: "base.gray-7",
        }}
        px={4}
        InputRightElement={
          type === 'password' ? (
            <Pressable mr={4}
              onPress={() => setIsPasswordVisible(state => !state)}>
              {isPasswordVisible
                ? <EyeClosed color={colors.base['gray-3']} />
                : <Eye color={colors.base['gray-3']} />
              }
            </Pressable>
          ) :
          undefined}
        {...rest}
      />

      {error && <Text
        fontSize="mini"
        fontFamily={"Karla_700Bold"}
        color="product.red-light"
        mt={1}
      >
        {error}
      </Text>
      }
    </FormControl>
  );
}
