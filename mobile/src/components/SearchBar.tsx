import { Box, HStack } from "native-base";
import { MagnifyingGlass, Sliders } from "phosphor-react-native";
import { Input } from "./Input";
import { TouchableOpacity } from "react-native";
import { useState } from "react";

interface IUpdateFilters {
  is_new?: boolean;
  accept_trade?: boolean;
  payment_methods: string[];
  query?: string;
}


interface Props {
  onRequestModal: () => void;
  onSearch: (query?: string) => void;
}

export function SearchBar({ onRequestModal, onSearch }: Props) {
  const [search, setSearch] = useState("");

  return (
      <Input
        type="text"
        placeholder="Buscar anúncio"
        bg="base.gray-7"
        onChangeText={setSearch}
        value={search}
        InputRightElement={(
          <HStack space={3} mr={4}>
            <TouchableOpacity onPress={() => onSearch(search)}>
              <MagnifyingGlass size={20} weight="bold" />
            </TouchableOpacity>

            <Box w={'1px'} bg="base.gray-4" />

            <TouchableOpacity onPress={onRequestModal}>
              <Sliders size={20} weight="bold" />
            </TouchableOpacity>
          </HStack>
        )}
      />

  )
}
