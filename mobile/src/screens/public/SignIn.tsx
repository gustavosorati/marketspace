import { Box, Center, Heading, ScrollView, Text, VStack } from 'native-base';
import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import LogoSvg from '../../assets/logo.svg';
import { useNavigation } from '@react-navigation/native';
import { ToastNotification } from '../../helpers/ToastNotification';
import { loginService } from '../../services/sessions/login.service';
import { PublicParamsTypes } from '../../routes/public.routes';

import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthentication } from '../../contexts/AuthContext';
import { SafeAreaView } from 'react-native';

const signInSchema = z.object({
  email: z
    .string({ required_error: "O email é obrigatório" })
    .email({ message: "Informe um email válido" }),
  password: z
    .string({ required_error: "A senha é obrigatória" })
    .nonempty({ message: "Informe sua senha" })
});

type SignInSchemaType = z.infer<typeof signInSchema>;

export function SignIn() {
  const { saveUserToken } = useAuthentication();
  const navigation = useNavigation<PublicParamsTypes>();

  const { control, handleSubmit } = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (data: SignInSchemaType) => {
    setIsLoading(true);

    if(!data){
      ToastNotification({
        type: "alert",
        message: "Por favor informe todos os campos."
      });
    }

    try {
      const result = await loginService({
        email: data.email,
        password: data.password
      })

      if(result?.refresh_token) {
        await saveUserToken(
          result.user,
          result.token,
          result.refresh_token
        );

        ToastNotification({
          type: "success",
          message: "Logado com sucesso!",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleNavigate = () => navigation.navigate("SignUp");

  return (
    <SafeAreaView style={{ flex: 1}}>
      <ScrollView contentContainerStyle={{ flex: 1 }} bg={"base.gray-7"}>
      <Center
        flex={3}
        px={12}
        bg="base.gray-6"
        borderBottomLeftRadius="24"
        borderBottomRightRadius="24"
      >
        <VStack mb="16" alignItems="center">
          <LogoSvg width={140} height={80}/>

          <Heading fontSize="3xl" color="base.gray-1" mt="4" fontFamily="Karla_700Bold">marketspace</Heading>

          <Text fontSize={'xxs'} fontFamily={"body"} color="base.gray-3">
            Seu espaço de compra e venda
          </Text>
        </VStack>

        <VStack w="full" space={4} alignItems="center">
            <Text color="base.gray-2">Acesse sua conta</Text>

            <Controller
              control={control}
              name="email"
              render={({
                field: { value, onChange },
                fieldState: { error }
              }) => (
                <Input
                  type="text"
                  placeholder="E-mail"
                  onChangeText={onChange}
                  value={value}
                  error={error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({
                field: { value, onChange },
                fieldState: { error }
              }) => (
                <Input
                  type="password"
                  placeholder="Senha"
                  onChangeText={onChange}
                  value={value}
                  error={error?.message}
                />
              )}
            />

            <Button
              text="Entrar"
              mt={4}
              loading={isLoading}
              onPress={handleSubmit(handleSignIn)}
            />

          </VStack>
        </Center>

        <VStack flexGrow={1} w="full" alignItems="center" justifyContent="center" px={12} space={4}>
          <Text color="base.gray-2">Ainda não tem acesso?</Text>
          <Button text='Criar uma conta' variant="secondary" onPress={handleNavigate} />
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
