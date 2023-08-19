import { useCallback, useState } from "react";
import { Switch, TouchableOpacity } from "react-native";
import { Controller, set, useForm } from "react-hook-form";
import { Box, Checkbox, HStack, Radio, Text, useTheme, VStack } from "native-base";
import { z } from "zod";
import { X } from "phosphor-react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { Button } from "./Button";
import { ConditionItem } from "./ConditionItem";
import CustomModalBackdrop from "./ModalBackdrop";
import CustomModalBackground from "./CustomModalBackground";
import { CheckboxStyled } from "./CkeckboxStyled";

interface IUpdateFilters {
  is_new?: boolean;
  accept_trade?: boolean;
  payment_methods: string[];
  query?: string;
}

type Props = {
  modal: any;
  snapPoints: string[];
  onUpdateFilters: ({ is_new, accept_trade, payment_methods }: IUpdateFilters) => void;
}

const filtersSchema = z.object({
  accept_trade: z.boolean().optional(),
});

type FilterSchemaType = z.infer<typeof filtersSchema>;

export function Filter({
  modal,
  snapPoints,
  onUpdateFilters,
}: Props) {
  const { colors } = useTheme();

  const { control, handleSubmit, setValue, reset, watch } = useForm<FilterSchemaType>({
    resolver: zodResolver(filtersSchema)
  });

  const [condition, setCondition] = useState<boolean | undefined>(undefined);
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<string[]>([]);

  const paymentOptions = [
    { value: "pix", name: "Pix" },
    { value: "boleto", name: "Boleto" },
    { value: "money", name: "Dinheiro" },
    { value: "deposit", name: "Deposito bancário" },
    { value: "credit_card", name: "Cartão de crédito" }
  ];

  const handleCloseModal = useCallback(() => modal.current.dismiss?.(), []);

  const handleUpdatePayments = (option: string) => {
    if(selectedPaymentMethods.includes(option)) {
      const filteredMethods = selectedPaymentMethods.filter(method => method !== option);

      setSelectedPaymentMethods(filteredMethods);
    } else {
      setSelectedPaymentMethods((oldState) => [...oldState, option])
    }
  }

  const handleUpdateCondition = (status: boolean) => {
    if(status !== undefined) {
      setCondition(status)
    } else {
      setCondition(undefined)
    }
  }

  const handleUpdateFilters = async ({accept_trade}: FilterSchemaType) => {
    onUpdateFilters({
      is_new: condition,
      accept_trade: accept_trade,
      payment_methods: selectedPaymentMethods
    });

    handleCloseModal();
  }

  const handleResetFilters = () => {
    setCondition(undefined);
    setValue("accept_trade", undefined);
    setSelectedPaymentMethods([])
  }

  return (
    <BottomSheetModal
      ref={modal}
      snapPoints={snapPoints}
      index={1}
      backdropComponent={CustomModalBackdrop}
      backgroundComponent={CustomModalBackground}
    >
      <BottomSheetScrollView contentContainerStyle={{ flex: 1, paddingBottom: 48 }}>
        <VStack
          px={6}
          pt={4}
          flex={1}
          justifyContent="space-between"
        >
          <VStack flex={1} space={4}>
            {/* Header */}
            <Box flexDirection="row" alignItems="center" justifyContent="space-between">
              <Text fontFamily="heading" fontSize="lg" color="base.gray-1">
                Filtrar anúncios
              </Text>

              <TouchableOpacity onPress={handleCloseModal}>
                <X size={24} color={colors.base["gray-4"]} />
              </TouchableOpacity>
            </Box>

            {/* Condição */}
            <VStack space={3}>
              <Text fontFamily="heading" fontSize="md" color="base.gray-2">
                Condição
              </Text>

              <HStack space={2}>
                <ConditionItem
                  title="new"
                  isMarked={condition === true}
                  onCancel={() => setCondition(undefined)}
                  onPress={() => handleUpdateCondition(true)}
                />

                <ConditionItem
                  title="used"
                  isMarked={condition === false}
                  onCancel={() => setCondition(undefined)}
                  onPress={() => handleUpdateCondition(false)}
                />
              </HStack>
            </VStack>

            {/* Devolução */}
            <VStack space={3}>
              <Text fontFamily="heading" fontSize="md" color="base.gray-2">
                Aceita troca?
              </Text>

              <Text fontSize="md" color="base.gray-2">
                <Controller
                  control={control}
                  name="accept_trade"
                  render={({
                    field: { onChange, value },
                    fieldState: { error }
                  }) => (
                    <Switch
                      trackColor={{false: colors.base["gray-5"], true: colors.product["blue-light"]}}
                      thumbColor={value ? colors.white : colors.white}
                      ios_backgroundColor={colors.base["gray-5"]}
                      onValueChange={onChange}
                      value={value}
                    />
                  )}
                />
              </Text>
            </VStack>

            {/* Meios de pagamento */}
            <VStack space={3}>
              <Text fontFamily="heading" fontSize="md" color="base.gray-2">
                Meios de pagamento aceitos
              </Text>

                <VStack space={1}>
                  {paymentOptions.map((option) => (
                    <CheckboxStyled
                      key={option.name}
                      title={option.name}
                      value={option.value}
                      isMarked={selectedPaymentMethods.includes(option.value)}
                      onPress={() => handleUpdatePayments(option.value)}
                    />
                  ))}
                </VStack>
              {/* </Checkbox.Group> */}
            </VStack>
          </VStack>

          {/* FOOTER */}
          <HStack space={3} w="full">
            <Button
              text="Resetar filtros"
              variant="secondary"
              flex={1}
              onPress={handleResetFilters}
            />

            <Button
              text="Aplicar filtros"
              variant="terciary"
              flex={1}
              onPress={handleSubmit(handleUpdateFilters)}
            />
          </HStack>
        </VStack>
      </BottomSheetScrollView>
    </BottomSheetModal>
  )
}
