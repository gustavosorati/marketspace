import { Center, Spinner } from 'native-base';
import React from 'react';

interface Props {
  size?: "lg" | "sm";
}

export function Loading({ size }: Props) {
  return (
    <Center flex={1}>
      <Spinner size={size} />
    </Center>
  );
}
