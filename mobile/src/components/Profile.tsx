import { HStack, Image, Text, VStack } from 'native-base';
import React from 'react';

interface Props {
  avatar: string;
  name: string;
}

export function Profile({ name, avatar }: Props) {
  return (
    <HStack space={4} alignItems="center" bg="red" >
      {avatar &&
        <Image
          source={{ uri: `http://192.168.100.62:3333/images/${avatar}` }}
          alt="Gustavo"
          w={12}
          h={12}
          rounded="full"
          borderWidth="2"
          borderColor="product.blue"
        />
      }

      <VStack>
        <Text>Boas vindas,</Text>
        <Text fontFamily="heading">{name}!</Text>
      </VStack>
    </HStack>
  );
}
